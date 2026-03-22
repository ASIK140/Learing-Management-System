const { Course, Tenant } = require('../models');
const { Op } = require('sequelize');

exports.list = async (req, res) => {
    try {
        const { status, search } = req.query;
        const where = {};
        if (status) where.status = status.toLowerCase();
        if (search) {
            where.title = { [Op.like]: `%${search}%` };
        }

        const courses = await Course.findAll({ where });
        
        // Map to frontend format
        const data = courses.map(c => ({
            course_id: c.course_id,
            course_title: c.title,
            course_code: c.category || 'N/A', // Using category as code fallback for now
            audience: 'All Staff',
            duration_minutes: 45,
            cpd_credits: 1.0,
            status: c.status === 'published' ? 'Published' : 'Draft',
            frameworks: c.framework_tags || [],
            tenants_using: 0,
            created_at: c.created_at
        }));

        res.json({ success: true, count: data.length, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
        res.json({ success: true, data: course });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.create = async (req, res) => {
    try {
        const { course_title, course_code, audience, duration_minutes, cpd_credits, frameworks } = req.body;
        if (!course_title) return res.status(400).json({ success: false, message: 'Title required.' });
        
        const course = await Course.create({
            title: course_title,
            category: course_code,
            framework_tags: frameworks,
            status: 'draft',
            created_by: 'Super Admin'
        });
        
        res.status(201).json({ success: true, message: 'Master course created.', data: course });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.publish = async (req, res) => {
    try {
        const { course_id } = req.body;
        const course = await Course.findByPk(course_id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
        
        await course.update({ status: 'published' });
        res.json({ success: true, message: 'Course published successfully.', data: course });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.preview = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
        
        res.json({
            success: true,
            data: {
                ...course.toJSON(),
                course_title: course.title,
                description: course.description || 'Advanced simulation-based training.',
                modules: [
                    { module_id: 1, title: 'Attack Fundamentals', order: 1 },
                    { module_id: 2, title: 'Defensive Strategy', order: 2 }
                ],
                chapters: [
                    { chapter_id: 101, module_id: 1, title: 'Threat Actor Motivation', type: 'Video', duration: 12 },
                    { chapter_id: 102, module_id: 1, title: 'Visual Recognition Quiz', type: 'Quiz', duration: 5 }
                ]
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.update = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
        await course.update({ ...req.body, course_id: course.course_id });
        res.json({ success: true, message: 'Course updated.', data: course });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });
        await course.destroy();
        res.json({ success: true, message: 'Course deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.exportData = (req, res) => res.json({ success: true, message: 'Exporting...' });
