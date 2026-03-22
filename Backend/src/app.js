'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { logger } = require('./config/logger');
const { connectDB } = require('./config/database');

const app = express();

// Request logging for debugging
app.use((req, res, next) => {
    console.log(`[DEBUG] ${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            connectSrc: ["'self'", "http://localhost:5000", "http://127.0.0.1:5000"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: false,
}));

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: { success: false, message: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', globalLimiter);

const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute for verification
    max: 10, 
    message: { success: false, message: 'Too many login attempts, please try again in a minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'CyberShield API is operational',
        timestamp: new Date().toISOString(),
        version: '2.1.0'
    });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/admin',               require('./routes/admin'));
app.use('/api/admin/tenants',       require('./routes/tenants'));
app.use('/api/admin/platform-health', require('./routes/platformHealth'));
app.use('/api/admin/escalations',   require('./routes/escalations'));
app.use('/api/admin/billing',       require('./routes/billing'));
app.use('/api/admin/content-library', require('./routes/contentLibrary'));
app.use('/api/admin/courses',         require('./routes/courses'));
app.use('/api/admin/industry-packs', require('./routes/industryPacks'));
app.use('/api/admin/ngo',           require('./routes/ngoPrograms'));
app.use('/api/admin/sso-providers', require('./routes/ssoProviders'));
app.use('/api/admin/email-deliverability', require('./routes/emailDeliverability'));
app.use('/api/admin/email',         require('./routes/email'));
app.use('/api/admin/audit-log',     require('./routes/auditLog'));
app.use('/api/admin/accounts',      require('./routes/accounts'));
app.use('/api/admin/notifications', require('./routes/notifications'));
app.use('/api/admin/queue-monitoring', require('./routes/queueMonitoring'));
app.use('/api/admin/storage', require('./routes/storage'));

// ─── CISO Module Routes ───────────────────────────────────────────────────────
app.use('/api/ciso', require('./routes/ciso'));
app.use('/api/ciso/compliance', require('./routes/compliance'));
app.use('/api/ciso/board-report', require('./routes/boardReport'));
app.use('/api/ciso/phishing', require('./routes/phishing'));

// ─── Tenant Admin Module Routes ───────────────────────────────────────────────
app.use('/api/tenant/templates',     require('./routes/tenantTemplates'));
app.use('/api/tenant/phishing',      require('./routes/tenantPhishing'));
app.use('/api/tenant/sso',           require('./routes/tenantSso'));
app.use('/api/tenant/integrations',  require('./routes/tenantIntegrations'));
app.use('/api/tenant/rules',         require('./routes/tenantRules'));
app.use('/api/content/studio',       require('./routes/contentStudio'));
app.use('/api/tenant',              require('./routes/tenantAdmin'));
app.use('/api/tenant/phishing',      require('./routes/tenantPhishing'));

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            logger.info(`🚀 CyberShield Backend running on port ${PORT}`);
            logger.info(`📋 Environment: ${process.env.NODE_ENV}`);
            logger.info(`🌐 CORS origin: ${process.env.FRONTEND_URL}`);
        });
    } catch (error) {
        logger.error(`❌ Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();

module.exports = app;
