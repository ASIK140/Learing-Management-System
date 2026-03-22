'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/ngoProgramController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const { body } = require('express-validator');
const { validate } = require('../middleware/validator');

const SA = requireRole('super_admin');

// ─── NGO Applications ─────────────────────────────────────────────────────────
router.get('/applications',            authenticate, SA, ctrl.getApplications);
router.post('/applications/approve', [
    authenticate, SA,
    body('application_id').notEmpty().withMessage('Application ID required'),
    validate
], ctrl.approveApplication);

router.post('/applications/reject', [
    authenticate, SA,
    body('application_id').notEmpty().withMessage('Application ID required'),
    body('reason').trim().escape().notEmpty().withMessage('Rejection reason required'),
    validate
], ctrl.rejectApplication);

router.post('/applications/request-info', [
    authenticate, SA,
    body('application_id').notEmpty().withMessage('Application ID required'),
    body('details').trim().escape().notEmpty().withMessage('Instructions for NGO required'),
    validate
], ctrl.requestInfo);

// ─── Active NGOs ──────────────────────────────────────────────────────────────
router.get('/active',                  authenticate, SA, ctrl.getActiveNgos);
router.get('/stats',                   authenticate, SA, ctrl.getNgoStats);
router.post('/suspend', [
    authenticate, SA,
    body('tenant_id').notEmpty().withMessage('Tenant ID required'),
    body('reason').trim().escape().notEmpty().withMessage('Reason for suspension required'),
    validate
], ctrl.suspendNgo);

router.post('/upgrade-plan', [
    authenticate, SA,
    body('tenant_id').notEmpty().withMessage('Tenant ID required'),
    body('new_plan').isIn(['Starter', 'Premium', 'Enterprise']).withMessage('Invalid plan'),
    validate
], ctrl.upgradePlan);

// ─── Reporting & Export ───────────────────────────────────────────────────────
router.get('/impact-report',           authenticate, SA, ctrl.getImpactReport);
router.get('/applications/export/csv', authenticate, SA, ctrl.exportApplications);
router.get('/applications/export/excel', authenticate, SA, ctrl.exportApplications);

module.exports = router;
