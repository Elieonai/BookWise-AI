const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const aiRoutes = require('./routes/aiRoutes');
const swaggerSpec = require('./config/swagger');
const { aiRateLimiter } = require('./middlewares/aiRateLimiter');

const app = express();
const allowedOrigins = (process.env.FRONTEND_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

const createCorsOrigin = (origins) => (origin, callback) => {
    if (!origin || origins.length === 0 || origins.includes(origin)) {
        return callback(null, true);
    }

    return callback(new Error('Origem não permitida pelo CORS.'));
};

const corsOrigin = createCorsOrigin(allowedOrigins);

app.use(cors({
    origin: corsOrigin
}));
app.use(express.json({ limit: '100kb' }));

/* Expoe a especificacao OpenAPI em JSON. */
app.get('/api-docs.json', (req, res) => {
    res.status(200).json(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', bookRoutes);
app.use('/api', reviewRoutes);
app.use('/api/ai', aiRateLimiter, aiRoutes);

module.exports = app;
module.exports.corsOrigin = corsOrigin;
module.exports.createCorsOrigin = createCorsOrigin;
