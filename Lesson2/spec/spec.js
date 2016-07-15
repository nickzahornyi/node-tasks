/* npm modules */
const request = require('supertest');
/* npm modules */

/* app modules */
const app = require('../app.js');
/* app modules */

describe('Index route', () => {
  it('should return a 200 status code', (done) => {
    request(app)
    .get('/')
    .expect(200)
    .end(finishTest(done));
  });

  it('should return a HTML format', (done) => {
    request(app)
    .get('/')
    .expect('Content-Type', /html/)
    .end(finishTest(done));
  });

  it('should return an index file with scrapper form', (done) => {
    request(app)
    .get('/')
    .expect(/my awesome scrapper/i)
    .end(finishTest(done));
  });
});
