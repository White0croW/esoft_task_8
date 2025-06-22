const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks');
const { validateCreate, validateUpdate } = require('../middlewares/validation');

router.get('/', tasksController.getAllTasks);
router.get('/:id', tasksController.getTask);
router.post('/', validateCreate, tasksController.createTask); // Только валидация создания
router.put('/:id', validateUpdate, tasksController.updateTask); // Только валидация обновления
router.delete('/:id', tasksController.deleteTask);

module.exports = router;