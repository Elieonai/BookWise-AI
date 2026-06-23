const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(express.json());

app.use('/api', bookRoutes);
app.use('/api', reviewRoutes);

module.exports = app;