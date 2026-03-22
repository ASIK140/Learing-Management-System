'use strict';
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const { requireRole, tenantIsolation } = require('../middleware/rbac');
const c = require('../controllers/tenantAdminController');

// All Tenant Admin routes: JWT + isolation + tenant_admin / manager / super_admin
const ta = [auth.authenticate, tenantIsolation, requireRole('tenant_admin', 'manager', 'super_admin')];
// Strict admin only (no manager)
const adminOnly = [auth.authenticate, tenantIsolation, requireRole('tenant_admin', 'super_admin')];

// ── Dashboard ─────────────────────────────────────────────
router.get('/dashboard',              ta, c.getDashboard);

// ── User Management ───────────────────────────────────────
router.get('/users',                  ta, c.getAllUsers);
router.post('/users/create',          adminOnly, c.createUser);
router.put('/users/update',           adminOnly, c.updateUser);
router.delete('/users',               adminOnly, c.deleteUser);
router.post('/users/import',          adminOnly, c.importUsers);

// ── Departments ───────────────────────────────────────────
router.get('/departments',            ta, c.getDepartments);
router.post('/departments/create',    adminOnly, c.createDepartment);
router.put('/departments/update',     adminOnly, c.updateDepartment);
router.delete('/departments',         adminOnly, c.deleteDepartment);

// ── Teams ─────────────────────────────────────────────────
router.get('/teams',                  ta, c.getAllTeams);
router.post('/teams/create',          adminOnly, c.createTeam);

// ── Course Deployment ─────────────────────────────────────
router.post('/courses/assign',        adminOnly, c.assignCourse);
router.get('/courses/assigned',       ta, c.getAssignedCourses);

// ── Training Status ───────────────────────────────────────
router.get('/training-status',        ta, c.getTrainingStatus);

// ── Compliance Frameworks ─────────────────────────────────
router.get('/frameworks',             ta, c.getFrameworkList);
router.post('/frameworks/enable',     adminOnly, c.enableFramework);

// ── Phishing Campaigns ────────────────────────────────────
router.post('/phishing/create',       adminOnly, c.createPhishingCampaign);
router.get('/phishing',               ta, c.getPhishingCampaigns);

// ── Notifications ─────────────────────────────────────────
router.post('/notifications/send',    adminOnly, c.sendNotification);

// ── Activity Tracking ─────────────────────────────────────
router.get('/activity',               ta, c.getActivityLogs);

// ── Reports ───────────────────────────────────────────────
router.get('/reports/training',       ta, c.getTrainingReport);
router.get('/reports/departments',    ta, c.getDeptReport);

// ── Audit Log ─────────────────────────────────────────────
router.get('/audit-log',              ta, c.getAuditLog);

module.exports = router;
