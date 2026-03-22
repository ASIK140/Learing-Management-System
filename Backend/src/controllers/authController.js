'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Mock user store (replace with DB lookup in production)
const MOCK_USERS = [
    {
        id: '1',
        name: 'Super Admin',
        email: 'admin@cybershield.io',
        password: bcrypt.hashSync('Admin@1234', 10),
        role: 'super_admin',
        tenant_id: null,
        status: 'active',
    },
    {
        id: '2',
        name: 'CISO User',
        email: 'ciso@acmecorp.com',
        password: bcrypt.hashSync('Ciso@1234', 10),
        role: 'ciso',
        tenant_id: 'tenant_001',
        status: 'active',
    },
    {
        id: '3',
        name: 'Tenant Admin',
        email: 'admin@acmecorp.com',
        password: bcrypt.hashSync('Tenant@1234', 10),
        role: 'tenant_admin',
        tenant_id: 'tenant_001',
        status: 'active',
    },
    {
        id: '4',
        name: 'Sarah Jenkins',
        email: 'creator@acmecorp.com',
        password: bcrypt.hashSync('Creator@1234', 10),
        role: 'content_creator',
        tenant_id: 'tenant_001',
        status: 'active',
    },
    {
        id: '5',
        name: 'Regional Manager',
        email: 'manager@acmecorp.com',
        password: bcrypt.hashSync('Manager@1234', 10),
        role: 'manager',
        tenant_id: 'tenant_001',
        status: 'active',
    },
    {
        id: '6',
        name: 'L1 Employee',
        email: 'employee@acmecorp.com',
        password: bcrypt.hashSync('Employee@1234', 10),
        role: 'employee',
        tenant_id: 'tenant_001',
        status: 'active',
    },
    {
        id: '7',
        name: 'NGO Lead',
        email: 'admin@hopeinbox.org',
        password: bcrypt.hashSync('Ngo@1234', 10),
        role: 'ngo_admin',
        tenant_id: 'ngo_001',
        status: 'active',
    },
];

const generateTokens = (user) => {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id,
        name: user.name,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'cybershield_dev_secret', {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET || 'cybershield_refresh_dev', {
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    });
    return { token, refreshToken };
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required.' });
        }

        const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        if (user.status !== 'active') {
            return res.status(403).json({ success: false, message: 'Account is suspended.' });
        }

        const { token, refreshToken } = generateTokens(user);

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                refreshToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    tenant_id: user.tenant_id,
                },
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/auth/register  (Super Admin only in prod)
exports.register = async (req, res) => {
    try {
        const { name, email, password, role = 'employee', tenant_id } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'name, email and password are required.' });
        }
        if (MOCK_USERS.find(u => u.email === email)) {
            return res.status(409).json({ success: false, message: 'Email already registered.' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUser = { id: uuidv4(), name, email, password: hashed, role, tenant_id: tenant_id || null, status: 'active' };
        MOCK_USERS.push(newUser);
        const { token, refreshToken } = generateTokens(newUser);
        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            data: { token, refreshToken, user: { id: newUser.id, name, email, role } },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/auth/refresh
exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ success: false, message: 'Refresh token required.' });
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'cybershield_refresh_dev');
        const user = MOCK_USERS.find(u => u.id === decoded.id);
        if (!user) return res.status(401).json({ success: false, message: 'User not found.' });
        const tokens = generateTokens(user);
        res.json({ success: true, data: tokens });
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
    }
};

// POST /api/auth/logout
exports.logout = async (req, res) => {
    res.json({ success: true, message: 'Logged out successfully.' });
};

// GET /api/auth/me
exports.me = async (req, res) => {
    const user = MOCK_USERS.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({
        success: true,
        data: { id: user.id, name: user.name, email: user.email, role: user.role, tenant_id: user.tenant_id },
    });
};
