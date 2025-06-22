const express = require('express');
const app = express();
const tasksRouter = require('./routes/tasks');
const loggingMiddleware = require('./middlewares/logging');

app.use(express.json());
app.use(loggingMiddleware);
app.use('/tasks', tasksRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = app;