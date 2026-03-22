'use strict';
const router = require('express').Router();
const ctrl = require('../controllers/escalationController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

const SA = requireRole('super_admin');

router.get('/export',        authenticate, SA, ctrl.exportEscalations);
router.get('/',              authenticate, SA, ctrl.list);
router.post('/',             authenticate, SA, ctrl.create);
router.post('/:id/resolve',  authenticate, SA, ctrl.resolve);
router.patch('/:id/assign',  authenticate, SA, ctrl.assign);

module.exports = router;
