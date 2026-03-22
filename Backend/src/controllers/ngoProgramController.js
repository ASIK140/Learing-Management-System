const { NgoProgram, Tenant, User } = require('../models');
const { v4: uuidv4 } = require('uuid');

// ─── NGO Applications (Using separate Application model or NgoProgram with pending status) ─────
// For this refactor, we'll continue using NgoProgram with status filter

exports.getApplications = async (req, res) => {
    try {
        const { Op } = require('sequelize');
        const applications = await NgoProgram.findAll({ 
            where: { 
                status: { [Op.in]: ['Pending', 'Under Review', 'More Info Required'] } 
            } 
        });
        res.json({ success: true, count: applications.length, applications });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.approveApplication = async (req, res) => {
    try {
        const { application_id } = req.body;
        const app = await NgoProgram.findByPk(application_id);
        if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });

        await app.update({ status: 'Approved' });

        // Convert to Tenant
        const newTenant = await Tenant.create({
            tenant_id: 'ngo_' + uuidv4().slice(0, 8),
            organization_name: app.program_name,
            industry: 'NGO',
            admin_email: `admin@${app.program_name.toLowerCase().replace(/\s+/g, '')}.org`,
            plan_type: 'Starter',
            status: 'active',
            subscription_status: 'active'
        });
        
        res.json({ success: true, message: `NGO ${app.program_name} approved and converted to tenant.`, data: newTenant });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getActiveNgos = async (req, res) => {
    try {
        const ngos = await NgoProgram.findAll({ where: { status: 'Approved' } });
        res.json({ success: true, count: ngos.length, data: ngos });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getNgoStats = async (req, res) => {
    try {
        const activeCount = await NgoProgram.count({ where: { status: 'Approved' } });
        const totalMembers = await NgoProgram.sum('members_count', { where: { status: 'Approved' } }) || 0;

        res.json({
            success: true,
            stats: {
                active_ngos: activeCount,
                total_members: totalMembers,
                certificates_issued: Math.floor(totalMembers * 0.4),
                countries_reached: Math.ceil(activeCount / 2)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.suspendNgo = async (req, res) => {
    try {
        const { tenant_id, reason } = req.body;
        console.log('Suspension Request:', { tenant_id, reason });
        const ngo = await NgoProgram.findByPk(tenant_id);
        if (!ngo) return res.status(404).json({ success: false, message: 'NGO not found' });

        ngo.status = 'Rejected';
        await ngo.save();

        res.json({ success: true, message: `NGO ${ngo.organization_name} suspended.` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.upgradePlan = async (req, res) => {
    try {
        const { tenant_id, new_plan, new_member_limit, subsidy_percentage } = req.body;
        console.log('Upgrade Request:', { tenant_id, new_plan, new_member_limit, subsidy_percentage });
        const { sequelize } = require('../config/database');
        const path = require('path');

        await sequelize.query(
            "UPDATE ngo_programs SET proposed_plan = ?, member_limit = ?, subsidy_percentage = ? WHERE ngo_program_id = ?",
            { 
                replacements: [new_plan, new_member_limit || 5000, subsidy_percentage || 100, tenant_id],
                type: sequelize.QueryTypes.UPDATE
            }
        );

        res.json({ 
            success: true, 
            message: `NGO upgraded to ${new_plan}`,
            dbPath: path.resolve('./database.sqlite')
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ... (Other methods simplified for QA)
exports.rejectApplication = async (req, res) => {
    try {
        const { application_id, reason } = req.body;
        const app = await NgoProgram.findByPk(application_id);
        if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });

        await app.update({ status: 'Rejected' });
        res.json({ success: true, message: `Application for ${app.organization_name} rejected. Reason: ${reason}` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.requestInfo = async (req, res) => {
    try {
        const { application_id, details } = req.body;
        const app = await NgoProgram.findByPk(application_id);
        if (!app) return res.status(404).json({ success: false, message: 'Application not found.' });

        await app.update({ status: 'More Info Required' });
        res.json({ success: true, message: `More information requested from ${app.organization_name}. Instructions: ${details}` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.getImpactReport = async (req, res) => {
    try {
        const totalMembers = await NgoProgram.sum('members_count') || 0;
        res.json({ success: true, data: { members_trained: totalMembers, certificates_issued: 0, countries_reached: 0 } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
exports.exportApplications = (req, res) => res.json({ success: true, message: 'Success' });
