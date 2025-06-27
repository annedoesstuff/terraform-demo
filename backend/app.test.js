const request = require('supertest');
const app = require('./app'); 

jest.mock('pg', () => {
  const mockClient = {
    release: jest.fn(),
  };
  const mockPool = {
    connect: jest.fn(() => Promise.resolve(mockClient)),
  };
  return { Pool: jest.fn(() => mockPool) };
});

const { Pool } = require('pg');
const mockPoolInstance = new Pool(); 

// tests -------------------------------------------------------------------------
describe('GET /status', () => {

  it('should return 200 and a success message if DB connection is successful', async () => {
    const response = await request(app).get('/status');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      message: 'Database connection successful!',
    });
    expect(mockPoolInstance.connect).toHaveBeenCalled();
  });

  it('should return 500 and an error message if DB connection fails', async () => {
    const errorMessage = 'Test connection error';
    mockPoolInstance.connect.mockImplementationOnce(() => Promise.reject(new Error(errorMessage)));
    
    const response = await request(app).get('/status');

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Failed to connect to database.',
    });
  });
});