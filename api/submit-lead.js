// --- Serverless Security Gateway API (/api/submit-lead.js) ---
const crypto = require('crypto');

// In-Memory Token Bucket IP Rate Limiter (Max 10 submissions per minute per IP)
const ipCache = new Map();
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 10;

// Periodic Cache Cleanup (Prevents memory leaks)
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipCache.entries()) {
        if (now - record.startTime > RATE_LIMIT_WINDOW_MS) {
            ipCache.delete(ip);
        }
    }
}, 300000);

module.exports = async (req, res) => {
    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const origin = req.headers['origin'] || req.headers['referer'] || '';

        // Security Guard 1: Anti-CSRF Origin Validation
        const allowedHosts = ['kavishmportfolio.vercel.app', 'localhost'];
        const isOriginValid = allowedHosts.some(host => origin.includes(host));
        if (origin && !isOriginValid) {
            return res.status(403).json({ error: 'Forbidden: Invalid Request Origin' });
        }

        // Security Guard 2: IP Token-Bucket Rate Limiter
        const now = Date.now();
        const userRecord = ipCache.get(clientIp);

        if (!userRecord) {
            ipCache.set(clientIp, { count: 1, startTime: now });
        } else if (now - userRecord.startTime > RATE_LIMIT_WINDOW_MS) {
            ipCache.set(clientIp, { count: 1, startTime: now });
        } else if (userRecord.count >= MAX_REQUESTS_PER_WINDOW) {
            return res.status(429).json({ error: 'Too Many Requests: Rate limit exceeded. Try again in 60s.' });
        } else {
            userRecord.count += 1;
        }

        const { email, message, _gotcha, render_time } = req.body || {};

        // Security Guard 3: Two-Stage Honeypot & Robotic Fast-Fill Trap
        if (_gotcha && _gotcha.trim().length > 0) {
            // Drop bot silently with fake success
            return res.status(200).json({ success: true, message: 'Inquiry processed successfully' });
        }

        if (render_time) {
            const fillDuration = now - parseInt(render_time, 10);
            if (!isNaN(fillDuration) && fillDuration < 1000) {
                // Fills faster than 1 second are automated scripts
                return res.status(400).json({ error: 'Automated submission detected' });
            }
        }

        // Security Guard 4: Input Validation & Sanitization
        if (!email || !message || message.trim().length < 10) {
            return res.status(400).json({ error: 'Invalid input parameters' });
        }

        // Security Guard 5: DPDP Act 2023 Pseudonymized IP Hashing
        const salt = process.env.IP_SALT || 'kavish_portfolio_salt_2026';
        const ip_hash = crypto.createHash('sha256').update(clientIp + salt).digest('hex');

        // Relay request to Formspree backend
        const formspreeEndpoint = 'https://formspree.io/f/xeozngwn';
        const formspreeResponse = await fetch(formspreeEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email,
                message,
                ip_hash,
                submitted_at: new Date().toISOString()
            })
        });

        if (formspreeResponse.ok) {
            return res.status(200).json({ success: true, message: 'Message delivered securely' });
        } else {
            return res.status(500).json({ error: 'Backend delivery failure' });
        }

    } catch (err) {
        console.error('Serverless Gateway Error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
