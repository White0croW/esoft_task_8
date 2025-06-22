const db = require('../db/db');

async function getAllTasks(req, res) {
    try {
        const { status } = req.query;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const filter = status ? { status } : {};
        const pagination = { limit, offset };

        const tasks = await db.getTasks(filter, pagination);
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getTask(req, res) {
    try {
        const task = await db.getTaskById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function createTask(req, res) {
    try {
        const newTask = await db.createTask(req.body);
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function updateTask(req, res) {
    try {
        const updatedTask = await db.updateTask(req.params.id, req.body);
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function deleteTask(req, res) {
    try {
        const deletedTask = await db.deleteTask(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    getAllTasks,
    getTask,
    createTask,
    updateTask,
    deleteTask
};