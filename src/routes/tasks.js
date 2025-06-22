const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks');
const validateTask = require('../middlewares/validation');

router.get('/', tasksController.getAllTasks);
router.get('/:id', tasksController.getTask);
router.post('/', validateTask, tasksController.createTask);
router.put('/:id', validateTask, tasksController.updateTask);
router.delete('/:id', tasksController.deleteTask);

module.exports = router;