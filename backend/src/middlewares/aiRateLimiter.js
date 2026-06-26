const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;
const hitsByIp = new Map();

const aiRateLimiter = (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const current = hitsByIp.get(ip);

    if (!current || now > current.resetAt) {
        hitsByIp.set(ip, { count: 1, resetAt: now + WINDOW_MS });
        return next();
    }

    current.count += 1;

    if (current.count > MAX_REQUESTS) {
        return res.status(429).json({
            success: false,
            error: { message: 'Muitas requisições. Tente novamente em instantes.' }
        });
    }

    return next();
};

const resetAiRateLimiter = () => {
    hitsByIp.clear();
};

module.exports = {
    aiRateLimiter,
    resetAiRateLimiter
};
