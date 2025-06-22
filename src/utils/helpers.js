function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

function validateTaskData(data, isUpdate = false) {
    const errors = [];

    // Для создания задачи все поля обязательны
    if (!isUpdate) {
        if (!data.title) errors.push('Title is required');
        if (!data.description) errors.push('Description is required');
        if (!data.status) errors.push('Status is required');
        if (!data.deadline) errors.push('Deadline is required');
    }

    // Проверка статуса (если поле присутствует)
    if (data.status && !['todo', 'in-progress', 'done'].includes(data.status)) {
        errors.push('Status must be one of: todo, in-progress, done');
    }

    // Проверка дедлайна (если поле присутствует)
    if (data.deadline) {
        const timestamp = Date.parse(data.deadline);
        if (isNaN(timestamp)) {
            errors.push('Deadline must be a valid date');
        }
    }

    return errors.length > 0 ? errors : null;
}

module.exports = {
    generateId,
    validateTaskData
};