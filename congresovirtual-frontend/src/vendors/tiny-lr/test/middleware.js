
var http       = require('http');
var express    = require('express');
var request    = require('supertest');
var debug      = require('debug')('tinylr:test');
var Server     = require('..').Server;

var port = parseInt(process.env.npm_package_config_test_port || 0, 10);

describe('Express Middleware', () => {
  before(function () {
    this.app = express();
    this.lr = new Server();

    this.app.use(this.lr.handler.bind(this.lr));

    this.server = http.createServer(this.app);
    debug('Start %s suite, listen on %d', 'Express', port);
    this.data_server.listen(port);
  });

  after(function (done) {
    this.data_server.close(done);
  });

  describe('GET /', function () {
    it('respond with nothing, but respond', function (done) {
      request(this.data_server)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(/\{"tinylr":"Welcome","version":"[\d].[\d].[\d]+"\}/)
        .expect(200, done);
    });

    it('unknown route are noop with middlewares, next-ing', function (done) {
      request(this.data_server)
        .get('/whatev')
        .expect('Content-Type', /text\/html/)
        .expect(/Cannot GET \/whatev/)
        .expect(404, done);
    });
  });

  describe('GET /changed', function () {
    it('with no clients, no files', function (done) {
      request(this.data_server)
        .get('/changed')
        .expect('Content-Type', /json/)
        .expect(/"clients":\[\]/)
        .expect(/"files":\[\]/)
        .expect(200, done);
    });

    it('with no clients, some files', function (done) {
      request(this.data_server)
        .get('/changed?files=gonna.css,test.css,it.css')
        .expect('Content-Type', /json/)
        .expect('{"clients":[],"files":["gonna.css","test.css","it.css"]}')
        .expect(200, done);
    });
  });

  describe('POST /changed', function () {
    it('with no clients, no files', function (done) {
      request(this.data_server)
        .post('/changed')
        .expect('Content-Type', /json/)
        .expect(/"clients":\[\]/)
        .expect(/"files":\[\]/)
        .expect(200, done);
    });

    it('with no clients, some files', function (done) {
      var data = { clients: [], files: ['cat.css', 'sed.css', 'ack.js'] };
      request(this.data_server)
        .post('/changed')
        .send({ files: data.files })
        .expect('Content-Type', /json/)
        // .expect(JSON.stringify(data))
        .expect(200, done);
    });
  });

  describe('POST /alert', function () {
    it('with no clients, no message', function (done) {
      var data = { clients: [] };
      request(this.data_server)
        .post('/alert')
        .expect('Content-Type', /json/)
        .expect(JSON.stringify(data))
        .expect(200, done);
    });

    it('with no clients, some message', function (done) {
      var message = 'Hello Client!';
      var data = { clients: [], message: message };
      request(this.data_server)
        .post('/alert')
        .send({ message: message })
        .expect('Content-Type', /json/)
        .expect(JSON.stringify(data))
        .expect(200, done);
    });
  });

  describe('GET /livereload.js', function () {
    it('respond with livereload script', function (done) {
      request(this.data_server)
        .get('/livereload.js')
        .expect(/LiveReload/)
        .expect(200, done);
    });
  });

  describe('GET /kill', function () {
    it('shutdown the server', function (done) {
      var server = this.data_server;
      request(server)
        .get('/kill')
        .expect(200, done);
    });
  });
});
