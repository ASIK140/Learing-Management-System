import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { apiLimiter } from './middlewares/rateLimiter';

import tenantRoutes from './modules/tenant/tenant.routes';
import userRoutes from './modules/users/user.routes';
import lmsRoutes from './modules/lms/lms.routes';
import phishingRoutes from './modules/phishing/phishing.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Apply global rate limiting
app.use(apiLimiter);

// Healthcheck
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'CyberShield API is running' });
});

// Mounted Routes
app.use('/api/v1/tenants', tenantRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/lms', lmsRoutes);
app.use('/api/v1/phishing', phishingRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
