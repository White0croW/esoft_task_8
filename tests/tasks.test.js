const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db/db');

describe('Tasks API', () => {
    beforeEach(async () => {
        // Очищаем данные перед каждым тестом
        await db.writeData([]);
    });

    test('GET /tasks - should return empty array initially', async () => {
        const response = await request(app).get('/tasks');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            total: 0,
            data: []
        });
    });

    test('POST /tasks - should create a new task', async () => {
        const newTask = {
            title: 'Test Task',
            description: 'Test Description',
            status: 'todo',
            deadline: '2025-12-31T23:59:59Z'
        };

        const response = await request(app)
            .post('/tasks')
            .send(newTask);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newTask);
        expect(response.body.id).toBeDefined();
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
    });

    test('POST /tasks - should validate task data', async () => {
        const invalidTask = {
            title: '',
            description: 'Invalid task',
            status: 'invalid-status',
            deadline: 'invalid-date'
        };

        const response = await request(app)
            .post('/tasks')
            .send(invalidTask);

        expect(response.status).toBe(400);
        expect(response.body.errors).toEqual(expect.arrayContaining([
            'Title is required',
            'Status must be one of: todo, in-progress, done',
            'Deadline must be a valid date'
        ]));
    });

    test('GET /tasks/:id - should get a task by id', async () => {
        const newTask = {
            title: 'Test Task',
            description: 'Test Description',
            status: 'todo',
            deadline: '2025-12-31T23:59:59Z'
        };

        const createResponse = await request(app)
            .post('/tasks')
            .send(newTask);

        const taskId = createResponse.body.id;

        const getResponse = await request(app).get(`/tasks/${taskId}`);
        expect(getResponse.status).toBe(200);
        expect(getResponse.body).toEqual(createResponse.body);
    });

    test('GET /tasks/:id - should return 404 for non-existent task', async () => {
        const response = await request(app).get('/tasks/non-existent-id');
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Task not found');
    });

    test('PUT /tasks/:id - should update a task', async () => {
        const newTask = {
            title: 'Original Task',
            description: 'Original Description',
            status: 'todo',
            deadline: '2025-12-31T23:59:59Z'
        };

        const createResponse = await request(app)
            .post('/tasks')
            .send(newTask);

        const taskId = createResponse.body.id;

        const updatedData = {
            title: 'Updated Task',
            description: 'Updated Description',
            status: 'in-progress',
            deadline: '2026-01-01T00:00:00Z'
        };

        const updateResponse = await request(app)
            .put(`/tasks/${taskId}`)
            .send(updatedData);

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body).toMatchObject(updatedData);
        expect(updateResponse.body.id).toBe(taskId);
        expect(updateResponse.body.updatedAt).not.toBe(createResponse.body.updatedAt);
    });

    test('DELETE /tasks/:id - should delete a task', async () => {
        const newTask = {
            title: 'Task to delete',
            description: 'Delete me',
            status: 'todo',
            deadline: '2025-12-31T23:59:59Z'
        };

        const createResponse = await request(app)
            .post('/tasks')
            .send(newTask);

        const taskId = createResponse.body.id;

        const deleteResponse = await request(app).delete(`/tasks/${taskId}`);
        expect(deleteResponse.status).toBe(204);

        const getResponse = await request(app).get(`/tasks/${taskId}`);
        expect(getResponse.status).toBe(404);
    });

    test('GET /tasks - should support pagination and filtering', async () => {
        // Создаем несколько задач
        const tasks = [
            { title: 'Task 1', description: 'Desc 1', status: 'todo', deadline: '2025-01-01' },
            { title: 'Task 2', description: 'Desc 2', status: 'in-progress', deadline: '2025-02-01' },
            { title: 'Task 3', description: 'Desc 3', status: 'done', deadline: '2025-03-01' },
            { title: 'Task 4', description: 'Desc 4', status: 'todo', deadline: '2025-04-01' },
            { title: 'Task 5', description: 'Desc 5', status: 'in-progress', deadline: '2025-05-01' }
        ];

        for (const task of tasks) {
            await request(app).post('/tasks').send(task);
        }

        // Проверяем пагинацию
        const response1 = await request(app).get('/tasks?limit=2&offset=1');
        expect(response1.status).toBe(200);
        expect(response1.body.total).toBe(5);
        expect(response1.body.data.length).toBe(2);
        expect(response1.body.data[0].title).toBe('Task 2');

        // Проверяем фильтрацию по статусу
        const response2 = await request(app).get('/tasks?status=todo');
        expect(response2.status).toBe(200);
        expect(response2.body.total).toBe(2);
        expect(response2.body.data.every(task => task.status === 'todo')).toBe(true);
    });
});