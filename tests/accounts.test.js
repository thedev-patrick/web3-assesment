const app = require('../app');
const request = require('supertest');
const Account = require('../models/Account');
const { connect, closeDatabase } = require('../utils/db');

describe('Accounts API', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('GET /accounts', () => {
    it('should return an empty array when there are no accounts', async () => {
      const response = await request(app).get('/accounts');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return a list of all Ethereum accounts that have interacted with the application', async () => {
      const account1 = new Account({ address: '0x1234567890abcdef', name: 'Alice' });
      const account2 = new Account({ address: '0xabcdef1234567890', name: 'Bob' });
      await account1.save();
      await account2.save();
      const response = await request(app).get('/accounts');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([
        expect.objectContaining({ address: '0x1234567890abcdef', name: 'Alice' }),
        expect.objectContaining({ address: '0xabcdef1234567890', name: 'Bob' })
      ]));
    });
  });
});
