const { Escalation, Tenant } = require('../models');
const { decrypt } = require('../utils/encryption');
const ExportUtil = require('../utils/exportUtility');

// GET /api/admin/escalations
exports.list = async (req, res) => {
    try {
        const { status, severity, tenant_id, page = 1, limit = 20 } = req.query;
        const where = {};
        if (status) where.status = status;
        if (severity) where.severity = severity;
        if (tenant_id) where.tenant_id = tenant_id;

        const { count, rows } = await Escalation.findAndCountAll({
            where,
            include: [{ model: Tenant, as: 'tenant', attributes: ['organization_name'] }],
            offset: (page - 1) * limit,
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
        });

        const pending = await Escalation.count({ where: { status: 'open' } });

        const data = rows.map(r => {
            const json = r.toJSON();
            let tenant_name = 'Unknown Tenant';
            if (json.tenant && json.tenant.organization_name) {
                tenant_name = decrypt(json.tenant.organization_name);
            }
            return {
                ...json,
                tenant_name
            };
        });

        res.json({ success: true, data, meta: { total: count, pending } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/admin/escalations
exports.create = async (req, res) => {
    try {
        const { tenant_id, severity, issue_type, description, assigned_to } = req.body;
        if (!severity || !issue_type || !description) {
            return res.status(400).json({ success: false, message: 'severity, issue_type and description are required.' });
        }
        
        const esc = await Escalation.create({
            tenant_id: tenant_id || null,
            severity,
            issue_type,
            description,
            assigned_to: assigned_to || null,
            status: 'open'
        });
        
        res.status(201).json({ success: true, message: 'Escalation created.', data: esc });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/admin/escalations/:id/resolve
exports.resolve = async (req, res) => {
    try {
        const escalation = await Escalation.findByPk(req.params.id);
        if (!escalation) return res.status(404).json({ success: false, message: 'Escalation not found.' });
        
        const { resolution_note } = req.body;
        await escalation.update({
            status: 'resolved',
            resolved_at: new Date(),
            resolution_note: resolution_note || 'Resolved by Super Admin.'
        });
        
        res.json({ success: true, message: 'Escalation resolved.', data: escalation });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/admin/escalations/:id/assign
exports.assign = async (req, res) => {
    try {
        const escalation = await Escalation.findByPk(req.params.id);
        if (!escalation) return res.status(404).json({ success: false, message: 'Escalation not found.' });
        
        const { assigned_to } = req.body;
        await escalation.update({
            assigned_to,
            status: 'in_progress'
        });
        
        res.json({ success: true, message: 'Escalation assigned.', data: escalation });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.exportEscalations = async (req, res) => {
    try {
        const { format = 'csv' } = req.query;
        const escalations = await Escalation.findAll({ order: [['created_at', 'DESC']] });
        
        const data = escalations.map(e => ({
            id: e.id,
            severity: e.severity,
            type: e.issue_type,
            desc: e.description,
            status: e.status,
            created: new Date(e.created_at).toLocaleDateString(),
            assigned: e.assigned_to || 'Unassigned'
        }));

        const columns = [
            { header: 'ID', key: 'id', width: 60 },
            { header: 'Severity', key: 'severity', width: 80 },
            { header: 'Type', key: 'type', width: 100 },
            { header: 'Description', key: 'desc', width: 220 },
            { header: 'Status', key: 'status', width: 80 },
            { header: 'Created', key: 'created', width: 90 },
            { header: 'Assigned To', key: 'assigned', width: 100 }
        ];

        const filename = `security_escalations_report_${new Date().toISOString().split('T')[0]}`;

        if (format === 'pdf') {
            return await ExportUtil.generatePDF(res, 'Security Escalations Report', columns, data, `${filename}.pdf`);
        } else if (format === 'excel') {
            return await ExportUtil.generateExcel(res, 'Security Escalations Report', columns, data, `${filename}.xlsx`);
        } else {
            return ExportUtil.generateCSV(res, columns, data, `${filename}.csv`);
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
