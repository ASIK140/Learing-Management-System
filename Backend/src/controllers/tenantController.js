const { Tenant, User } = require('../models');
const { Op } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const ExportUtil = require('../utils/exportUtility');

// GET /api/admin/tenants/export
exports.exportTenants = async (req, res) => {
    try {
        const { format = 'csv' } = req.query;
        const tenants = await Tenant.findAll({ order: [['organization_name', 'ASC']] });
        
        const data = tenants.map(t => ({
            org: t.organization_name,
            email: t.admin_email,
            industry: t.industry,
            plan: t.plan_type,
            status: t.status,
            joined: new Date(t.created_at).toLocaleDateString()
        }));

        const columns = [
            { header: 'Organization', key: 'org', width: 140 },
            { header: 'Admin Email', key: 'email', width: 160 },
            { header: 'Industry', key: 'industry', width: 90 },
            { header: 'Plan', key: 'plan', width: 80 },
            { header: 'Status', key: 'status', width: 70 },
            { header: 'Joined Date', key: 'joined', width: 90 }
        ];

        const filename = `platform_tenants_audit_${new Date().toISOString().split('T')[0]}`;

        if (format === 'pdf') {
            return await ExportUtil.generatePDF(res, 'Active Platform Tenants', columns, data, `${filename}.pdf`);
        } else if (format === 'excel') {
            return await ExportUtil.generateExcel(res, 'Active Platform Tenants', columns, data, `${filename}.xlsx`);
        } else {
            return ExportUtil.generateCSV(res, columns, data, `${filename}.csv`);
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/admin/tenants
exports.list = async (req, res) => {
    try {
        const { status, plan_type, industry, search, page = 1, limit = 20 } = req.query;
        const where = {};

        if (status) where.status = status;
        if (plan_type) where.plan_type = plan_type;
        if (industry) where.industry = industry;
        if (search) {
            where[Op.or] = [
                { organization_name: { [Op.like]: `%${search}%` } },
                { admin_email: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Tenant.findAndCountAll({
            where,
            offset: (page - 1) * limit,
            limit: parseInt(limit),
            order: [['created_at', 'DESC']]
        });

        res.json({ 
            success: true, 
            data: rows, 
            meta: { 
                total: count, 
                page: parseInt(page), 
                limit: parseInt(limit), 
                pages: Math.ceil(count / limit) 
            } 
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/admin/tenants/:id
exports.getById = async (req, res) => {
    try {
        const tenant = await Tenant.findByPk(req.params.id);
        if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found.' });
        res.json({ success: true, data: tenant });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/admin/tenants
exports.create = async (req, res) => {
    try {
        const { organization_name, industry, admin_email, plan_type, user_limit, tenant_id } = req.body;
        if (!organization_name || !admin_email || !plan_type) {
            return res.status(400).json({ success: false, message: 'organization_name, admin_email and plan_type are required.' });
        }
        
        const newTenant = await Tenant.create({
            tenant_id: tenant_id || 'tenant_' + uuidv4().slice(0, 6),
            organization_name, 
            industry: industry || 'Other', 
            admin_email,
            plan_type, 
            user_limit: user_limit || 50,
            subscription_status: 'trial', 
            status: 'trial'
        });
        
        res.status(201).json({ success: true, message: 'Tenant created.', data: newTenant });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/admin/tenants/:id
exports.update = async (req, res) => {
    try {
        const tenant = await Tenant.findByPk(req.params.id);
        if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found.' });
        
        await tenant.update(req.body);
        res.json({ success: true, message: 'Tenant updated.', data: tenant });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// PATCH /api/admin/tenants/:id/status
exports.updateStatus = async (req, res) => {
    try {
        const tenant = await Tenant.findByPk(req.params.id);
        if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found.' });
        
        const { status } = req.body;
        if (!['active', 'inactive', 'suspended', 'trial'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value.' });
        }
        
        await tenant.update({ status, subscription_status: status });
        res.json({ success: true, message: `Tenant status updated to ${status}.`, data: tenant });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// DELETE /api/admin/tenants/:id
exports.remove = async (req, res) => {
    try {
        const tenant = await Tenant.findByPk(req.params.id);
        if (!tenant) return res.status(404).json({ success: false, message: 'Tenant not found.' });
        
        await tenant.destroy();
        res.json({ success: true, message: 'Tenant deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
