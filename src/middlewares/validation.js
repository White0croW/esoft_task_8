const { validateTaskData } = require('../utils/helpers');

function validateTask(req, res, next) {
    const errors = validateTaskData(req.body);

    if (errors) {
        return res.status(400).json({ errors });
    }

    next();
}

module.exports = validateTask;