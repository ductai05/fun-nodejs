// api/health.js - Health check endpoint
require('dotenv').config();

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }

    try {
        const healthData = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'production',
            service: 'Todo API',
            version: '1.0.0'
        };

        return res.status(200).json(healthData);
    } catch (error) {
        console.error('Health check error:', error);
        return res.status(500).json({ 
            status: 'ERROR',
            message: 'Health check failed',
            error: error.message 
        });
    }
}
