const { validateTaskData } = require('../utils/helpers');

function validateCreate(req, res, next) {
    const errors = validateTaskData(req.body);
    if (errors) return res.status(400).json({ errors });
    next();
}

function validateUpdate(req, res, next) {
    const errors = validateTaskData(req.body, true); // true - это обновление
    if (errors) return res.status(400).json({ errors });
    next();
}

module.exports = {
    validateCreate,
    validateUpdate
};