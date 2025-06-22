const fs = require('fs').promises;
const path = require('path');
const { generateId } = require('../utils/helpers');

const DB_PATH = path.join(__dirname, '../../tasks.json');

async function readData() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        if (err.code === 'ENOENT') {
            // Файл не существует, создаем пустой массив
            await writeData([]);
            return [];
        }
        throw err;
    }
}

async function writeData(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

async function getTasks(filter = {}, pagination = {}) {
    const { status } = filter;
    const { limit = 10, offset = 0 } = pagination;

    const tasks = await readData();

    let filteredTasks = tasks;

    if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    return {
        total: filteredTasks.length,
        data: filteredTasks.slice(offset, offset + limit)
    };
}

async function getTaskById(id) {
    const tasks = await readData();
    return tasks.find(task => task.id === id);
}

async function createTask(taskData) {
    const tasks = await readData();
    const newTask = {
        id: generateId(),
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    await writeData(tasks);
    return newTask;
}

async function updateTask(id, updateData) {
    const tasks = await readData();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) return null;

    const updatedTask = {
        ...tasks[taskIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
    };

    tasks[taskIndex] = updatedTask;
    await writeData(tasks);
    return updatedTask;
}

async function deleteTask(id) {
    const tasks = await readData();
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) return null;

    const [deletedTask] = tasks.splice(taskIndex, 1);
    await writeData(tasks);
    return deletedTask;
}

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    writeData
};