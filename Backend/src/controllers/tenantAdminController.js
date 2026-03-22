'use strict';
const { v4: uuidv4 } = require('uuid');
const {
    getUsers, getDepts, getTeams, getAssignments,
    getFrameworks, getPhishing, getActivity, getAuditLogs,
} = require('../services/tenantData');

const getTenant = (req) => {
    if (req.user && req.user.role === 'super_admin') {
        // Super admins can explicitly set tenant_id in query if needed, or we use a provided one
        return req.query.tenant_id || req.user.tenant_id || 'tenant_001';
    }
    return req.tenantId;
};

/* ── 1. GET /tenant/dashboard ────────────────────────────── */
const getDashboard = (req, res) => {
    try {
        const tid = getTenant(req);
        const users = getUsers(tid);
        const assigns = getAssignments(tid);
        const phishing = getPhishing(tid);
        const depts = getDepts(tid);

        const total_employees  = users.length;
        const avg_training     = Math.round(users.reduce((s, u) => s + u.training_pct, 0) / total_employees);
        const overdue_training = users.filter(u => u.training_pct < 50).length;
        const active_courses   = assigns.filter(a => a.status === 'active').length;
        const certs_issued     = users.filter(u => u.training_pct >= 80).length;
        const phish_active     = phishing.filter(p => p.status === 'running').length;
        const high_risk        = users.filter(u => u.risk_score >= 60).length;

        return res.json({
            success: true,
            data: {
                total_employees,
                active_employees: users.filter(u => u.status === 'active').length,
                training_completion_rate: avg_training,
                active_courses,
                overdue_training,
                phishing_campaigns_active: phish_active,
                certificates_issued: certs_issued,
                high_risk_users: high_risk,
                dept_completion: depts.map(d => ({ dept: d.name, completion: d.avg_training, risk: d.avg_risk })),
                trends: { training_vs_last_month: '+4%', new_users: 2, overdue_change: '-3' },
            },
        });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 2. GET /tenant/users ────────────────────────────────── */
const getAllUsers = (req, res) => {
    try {
        const tid = getTenant(req);
        const { search, department, role, status, page = 1, limit = 20 } = req.query;
        let users = getUsers(tid);
        if (search)     users = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
        if (department) users = users.filter(u => u.dept.toLowerCase() === department.toLowerCase());
        if (role)       users = users.filter(u => u.role === role);
        if (status)     users = users.filter(u => u.status === status);
        const total = users.length;
        const paginated = users.slice((page - 1) * limit, page * limit);
        return res.json({
            success: true, total,
            active: users.filter(u => u.status === 'active').length,
            page: parseInt(page),
            data: paginated.map(u => ({
                user_id: u.id, name: u.name, email: u.email,
                department: u.dept, department_id: u.dept_id, role: u.role,
                status: u.status, joined: u.joined,
                training_completion: u.training_pct, risk_score: u.risk_score, last_login: u.last_login,
            })),
        });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 3. POST /tenant/users/create ───────────────────────── */
const createUser = (req, res) => {
    try {
        const tid = getTenant(req);
        const { name, email, department_id, role = 'employee', send_welcome = true } = req.body;
        if (!name || !email) return res.status(400).json({ success: false, message: 'name and email are required' });
        const user = {
            user_id: `u-${uuidv4().slice(0, 8)}`, tenant_id: tid,
            name, email, department_id: department_id || null, role, status: 'active',
            created_at: new Date().toISOString(), welcome_email_sent: send_welcome,
        };
        return res.status(201).json({ success: true, message: 'User created' + (send_welcome ? ' — welcome email queued' : ''), data: user });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 4. PUT /tenant/users/update ─────────────────────────── */
const updateUser = (req, res) => {
    try {
        const tid = getTenant(req);
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id is required' });
        return res.json({ success: true, message: 'User updated', data: { user_id, tenant_id: tid, ...req.body, updated_at: new Date().toISOString() } });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 5. DELETE /tenant/users ─────────────────────────────── */
const deleteUser = (req, res) => {
    try {
        const tid = getTenant(req);
        const { user_id } = req.query;
        if (!user_id) return res.status(400).json({ success: false, message: 'user_id is required' });
        return res.json({ success: true, message: `User ${user_id} deactivated`, tenant_id: tid });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 6. POST /tenant/users/import ───────────────────────── */
const importUsers = (req, res) => {
    try {
        const tid = getTenant(req);
        const job = {
            job_id: `IMP-${uuidv4().slice(0, 8).toUpperCase()}`,
            tenant_id: tid, status: 'processing',
            total_rows: 25, estimated_completion: '30 seconds',
            pipeline: ['Upload → S3', 'CSV parse + validate', 'Duplicate check', 'DB insert', 'Welcome emails queued'],
        };
        return res.status(202).json({ success: true, message: 'Import job queued', data: job });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 7. GET /tenant/departments ─────────────────────────── */
const getDepartments = (req, res) => {
    try {
        const tid = getTenant(req);
        const depts = getDepts(tid);
        return res.json({ success: true, total: depts.length, data: depts });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 8. POST /tenant/departments/create ─────────────────── */
const createDepartment = (req, res) => {
    try {
        const tid = getTenant(req);
        const { name, manager_id } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Department name required' });
        const dept = { department_id: `d-${uuidv4().slice(0, 6)}`, tenant_id: tid, name, manager_id: manager_id || null, created_at: new Date().toISOString() };
        return res.status(201).json({ success: true, message: 'Department created', data: dept });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 9. PUT /tenant/departments/update ──────────────────── */
const updateDepartment = (req, res) => {
    try {
        const tid = getTenant(req);
        const { dept_id } = req.query;
        if (!dept_id) return res.status(400).json({ success: false, message: 'dept_id required' });
        return res.json({ success: true, message: 'Department updated', data: { dept_id, tenant_id: tid, ...req.body, updated_at: new Date().toISOString() } });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 10. DELETE /tenant/departments ─────────────────────── */
const deleteDepartment = (req, res) => {
    try {
        const tid = getTenant(req);
        const { dept_id } = req.query;
        if (!dept_id) return res.status(400).json({ success: false, message: 'dept_id required' });
        return res.json({ success: true, message: `Department ${dept_id} deleted`, tenant_id: tid });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 11. GET /tenant/teams ───────────────────────────────── */
const getAllTeams = (req, res) => {
    try {
        const tid = getTenant(req);
        const { department_id } = req.query;
        let teams = getTeams(tid);
        if (department_id) teams = teams.filter(t => t.dept_id === department_id);
        return res.json({ success: true, total: teams.length, data: teams });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 12. POST /tenant/teams/create ──────────────────────── */
const createTeam = (req, res) => {
    try {
        const tid = getTenant(req);
        const { team_name, department_id, manager_id } = req.body;
        if (!team_name || !department_id) return res.status(400).json({ success: false, message: 'team_name and department_id required' });
        const team = { team_id: `t-${uuidv4().slice(0, 6)}`, tenant_id: tid, team_name, department_id, manager_id: manager_id || null, member_count: 0, created_at: new Date().toISOString() };
        return res.status(201).json({ success: true, message: 'Team created', data: team });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 13. POST /tenant/courses/assign ────────────────────── */
const assignCourse = (req, res) => {
    try {
        const tid = getTenant(req);
        const { course_id, assigned_to_type = 'all', assigned_to, is_mandatory = true, deadline } = req.body;
        if (!course_id) return res.status(400).json({ success: false, message: 'course_id required' });
        const assignment = {
            assignment_id: `ca-${uuidv4().slice(0, 8)}`, tenant_id: tid,
            course_id, assigned_to_type, assigned_to: assigned_to || 'All Users',
            is_mandatory, deadline: deadline || null,
            assigned_by: req.user ? req.user.id : 'admin',
            assigned_at: new Date().toISOString(), status: 'active',
        };
        return res.status(201).json({ success: true, message: 'Course assigned', data: assignment });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 14. GET /tenant/courses/assigned ───────────────────── */
const getAssignedCourses = (req, res) => {
    try {
        const tid = getTenant(req);
        const { status } = req.query;
        let assignments = getAssignments(tid);
        if (status) assignments = assignments.filter(a => a.status === status);
        return res.json({
            success: true,
            summary: {
                total: assignments.length,
                active: assignments.filter(a => a.status === 'active').length,
                total_enrolled: assignments.reduce((s, a) => s + a.enrolled, 0),
                total_overdue: assignments.reduce((s, a) => s + a.overdue, 0),
            },
            data: assignments,
        });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 15. GET /tenant/training-status ────────────────────── */
const getTrainingStatus = (req, res) => {
    try {
        const tid = getTenant(req);
        const users = getUsers(tid);
        const assignments = getAssignments(tid);
        const avg = Math.round(users.reduce((s, u) => s + u.training_pct, 0) / users.length);
        return res.json({
            success: true,
            data: {
                overall_completion_rate: avg,
                total_users: users.length,
                fully_completed: users.filter(u => u.training_pct === 100).length,
                in_progress: users.filter(u => u.training_pct > 0 && u.training_pct < 100).length,
                not_started: users.filter(u => u.training_pct === 0).length,
                overdue_users: users.filter(u => u.training_pct < 50).length,
                courses: assignments.map(a => ({
                    course_id: a.course_id, course_name: a.course_name,
                    enrolled: a.enrolled, completed: a.completed,
                    in_progress: a.enrolled - a.completed - a.overdue,
                    not_started: a.overdue,
                    completion_rate: Math.round(a.completed / a.enrolled * 100),
                    overdue_count: a.overdue, deadline: a.deadline, status: a.status,
                })),
            },
        });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 16. GET /tenant/frameworks ─────────────────────────── */
const getFrameworkList = (req, res) => {
    try {
        const tid = getTenant(req);
        const frameworks = getFrameworks(tid);
        return res.json({ success: true, enabled: frameworks.filter(f => f.enabled).length, total: frameworks.length, data: frameworks });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 17. POST /tenant/frameworks/enable ─────────────────── */
const enableFramework = (req, res) => {
    try {
        const tid = getTenant(req);
        const { framework_id, framework_name, enabled = true, target_coverage = 100, deadline } = req.body;
        if (!framework_id && !framework_name) return res.status(400).json({ success: false, message: 'framework_id or framework_name required' });
        const result = {
            id: uuidv4(), tenant_id: tid, framework_id: framework_id || uuidv4(),
            framework_name: framework_name || 'Unknown', enabled, target_coverage,
            deadline: deadline || null, enabled_at: new Date().toISOString(),
        };
        return res.json({ success: true, message: `Framework ${enabled ? 'enabled' : 'disabled'}`, data: result });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 18. POST /tenant/phishing/create ───────────────────── */
const createPhishingCampaign = (req, res) => {
    try {
        const tid = getTenant(req);
        const { campaign_name, template = 'it_support', audience = 'all', launch_date, difficulty = 'medium' } = req.body;
        if (!campaign_name) return res.status(400).json({ success: false, message: 'campaign_name required' });
        const campaign = {
            campaign_id: `ph-${uuidv4().slice(0, 8)}`, tenant_id: tid,
            campaign_name, template, audience, difficulty,
            target_count: audience === 'all' ? 12 : 4,
            status: launch_date ? 'scheduled' : 'draft',
            launch_date: launch_date || null, created_at: new Date().toISOString(),
        };
        return res.status(201).json({ success: true, message: 'Phishing campaign created', data: campaign });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 19. GET /tenant/phishing ───────────────────────────── */
const getPhishingCampaigns = (req, res) => {
    try {
        const tid = getTenant(req);
        const { status } = req.query;
        let campaigns = getPhishing(tid);
        if (status) campaigns = campaigns.filter(c => c.status === status);
        return res.json({ success: true, total: campaigns.length, data: campaigns });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 20. POST /tenant/notifications/send ───────────────── */
const sendNotification = (req, res) => {
    try {
        const tid = getTenant(req);
        const { type, recipient_group = 'all', recipient_id, subject, message, scheduled_at } = req.body;
        if (!type || !message) return res.status(400).json({ success: false, message: 'type and message required' });
        const notif = {
            notification_id: `notif-${uuidv4().slice(0, 8)}`, tenant_id: tid,
            type, recipient_group, recipient_id: recipient_id || null,
            subject: subject || `CyberShield: ${type.replace(/_/g, ' ')}`, message,
            status: scheduled_at ? 'scheduled' : 'queued',
            scheduled_at: scheduled_at || null, queued_at: new Date().toISOString(),
        };
        return res.status(202).json({ success: true, message: `Notification ${scheduled_at ? 'scheduled' : 'queued'}`, data: notif });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 21. GET /tenant/activity ───────────────────────────── */
const getActivityLogs = (req, res) => {
    try {
        const tid = getTenant(req);
        const { action, user_id, page = 1, limit = 25 } = req.query;
        let logs = getActivity(tid);
        if (action)  logs = logs.filter(l => l.action === action);
        if (user_id) logs = logs.filter(l => l.user_id === user_id);
        const paginated = logs.slice((page - 1) * limit, page * limit);
        return res.json({ success: true, total: logs.length, page: parseInt(page), data: paginated });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 22. GET /tenant/reports/training ───────────────────── */
const getTrainingReport = (req, res) => {
    try {
        const tid = getTenant(req);
        const users = getUsers(tid);
        const assignments = getAssignments(tid);
        const depts = getDepts(tid);
        return res.json({
            success: true,
            data: {
                report_id: `RPT-TRN-${Date.now()}`,
                generated_at: new Date().toISOString(),
                summary: {
                    total_employees: users.length,
                    avg_completion: Math.round(users.reduce((s, u) => s + u.training_pct, 0) / users.length),
                    fully_completed: users.filter(u => u.training_pct === 100).length,
                    not_started: users.filter(u => u.training_pct === 0).length,
                    overdue: users.filter(u => u.training_pct < 50).length,
                },
                by_department: depts.map(d => ({ department: d.name, completion: d.avg_training, employees: d.employee_count, overdue: Math.floor(d.employee_count * ((100 - d.avg_training) / 100)) })),
                by_course: assignments.map(a => ({ course_name: a.course_name, completion_rate: Math.round(a.completed / a.enrolled * 100), enrolled: a.enrolled, completed: a.completed, overdue: a.overdue })),
            },
        });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 23. GET /tenant/reports/departments ────────────────── */
const getDeptReport = (req, res) => {
    try {
        const tid = getTenant(req);
        const depts = getDepts(tid);
        return res.json({
            success: true,
            data: {
                report_id: `RPT-DEPT-${Date.now()}`,
                generated_at: new Date().toISOString(),
                departments: depts.map(d => ({
                    department: d.name, manager: d.manager_name, employees: d.employee_count,
                    training_completion: d.avg_training, avg_risk_score: d.avg_risk,
                    risk_level: d.avg_risk >= 60 ? 'High' : d.avg_risk >= 40 ? 'Medium' : 'Low',
                    action_needed: d.avg_training < 60 || d.avg_risk >= 60,
                })),
            },
        });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

/* ── 24. GET /tenant/audit-log ──────────────────────────── */
const getAuditLog = (req, res) => {
    try {
        const tid = getTenant(req);
        const { action, actor, result, format, page = 1, limit = 25 } = req.query;
        let logs = getAuditLogs(tid);
        if (action) logs = logs.filter(l => l.action.toLowerCase().includes(action.toLowerCase()));
        if (actor)  logs = logs.filter(l => l.actor.toLowerCase().includes(actor.toLowerCase()));
        if (result) logs = logs.filter(l => l.result === result);

        if (format === 'csv') {
            const csv = ['Timestamp,Actor,Role,Action,Target,IP,Result', ...logs.map(l => `${l.timestamp},${l.actor},${l.role || ''},${l.action},${l.target},${l.ip},${l.result}`)].join('\n');
            res.set('Content-Type', 'text/csv');
            res.set('Content-Disposition', `attachment; filename="tenant-audit-${Date.now()}.csv"`);
            return res.send(csv);
        }
        const paginated = logs.slice((page - 1) * limit, page * limit);
        return res.json({ success: true, total: logs.length, page: parseInt(page), data: paginated });
    } catch (err) { return res.status(500).json({ success: false, message: err.message }); }
};

module.exports = {
    getDashboard,
    getAllUsers, createUser, updateUser, deleteUser, importUsers,
    getDepartments, createDepartment, updateDepartment, deleteDepartment,
    getAllTeams, createTeam,
    assignCourse, getAssignedCourses,
    getTrainingStatus,
    getFrameworkList, enableFramework,
    createPhishingCampaign, getPhishingCampaigns,
    sendNotification,
    getActivityLogs,
    getTrainingReport, getDeptReport,
    getAuditLog,
};
