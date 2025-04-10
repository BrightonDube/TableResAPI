const request = require('supertest');
const app = require('../../server'); 

describe('Tables API', () => {
    it('should get all tables', async () => {
        const response = await request(app)
            .get('/api/tables'); 
        expect(response.status).toBe(200);
    });

    it('should get a specific table by ID', async () => {
        const response = await request(app)
            .get('/api/tables/65a9b2c3d4e5f6a7b8c9d0e1'); 
        expect(response.status).toBe(200);
    });
});