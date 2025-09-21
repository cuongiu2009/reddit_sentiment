const request = require('supertest');
const app = require('../../src/api/server'); // Import your Express app

describe('Jobs API', () => {
  // T008: Write Contract Test for POST /jobs
  test('POST /api/v1/jobs should create a new analysis job', async () => {
    const res = await request(app)
      .post('/api/v1/jobs')
      .send({
        topic: 'test topic',
        sources: ['reddit'],
        time_range: '7d',
      });

    expect(res.statusCode).toEqual(202);
    expect(res.body).toHaveProperty('job_id');
    expect(typeof res.body.job_id).toBe('number');
  });

  // T009: Write Contract Test for GET /jobs/{job_id}
  test('GET /api/v1/jobs/:job_id should return job status and results for existing job', async () => {
    const existingJobId = 1; // Assuming job_id 1 exists from mock
    const res = await request(app)
      .get(`/api/v1/jobs/${existingJobId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('job_id', existingJobId);
    expect(res.body).toHaveProperty('status', 'completed');
    expect(res.body).toHaveProperty('results');
    expect(res.body.results).toHaveProperty('positive_score');
    expect(res.body.results).toHaveProperty('negative_score');
    expect(res.body.results).toHaveProperty('neutral_score');
    expect(res.body.results).toHaveProperty('net_score');
    expect(res.body.results).toHaveProperty('word_cloud');
    expect(res.body.results).toHaveProperty('timeline_data');
  });

  test('GET /api/v1/jobs/:job_id should return 404 for non-existent job', async () => {
    const nonExistentJobId = 9999;
    const res = await request(app)
      .get(`/api/v1/jobs/${nonExistentJobId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Job not found');
  });
});
