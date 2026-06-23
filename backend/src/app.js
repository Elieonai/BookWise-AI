const express = require('express');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(express.json());

app.use('/api', reviewRoutes);

module.exports = app;