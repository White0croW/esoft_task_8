function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

function validateTaskData(data) {
    const errors = [];

    // Проверка обязательных полей
    if (!data.title) errors.push('Title is required');
    if (!data.description) errors.push('Description is required');
    if (!data.status) errors.push('Status is required');
    if (!data.deadline) errors.push('Deadline is required');

    // Проверка статуса
    if (data.status && !['todo', 'in-progress', 'done'].includes(data.status)) {
        errors.push('Status must be one of: todo, in-progress, done');
    }

    // Проверка дедлайна
    if (data.deadline) {
        const deadlineDate = new Date(data.deadline);
        if (isNaN(deadlineDate.getTime())) {
            errors.push('Deadline must be a valid date');
        }
    }

    return errors.length > 0 ? errors : null;
}

module.exports = {
    generateId,
    validateTaskData
};