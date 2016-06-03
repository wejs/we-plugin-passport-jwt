var assert = require('assert');
var request = require('supertest');
var helpers = require('we-test-tools').helpers;
var stubs = require('we-test-tools').stubs;
var http;
var we;
var agent;

describe('we-plugin-passport-jwtFeature', function() {
  var salvedUser, salvedUserPassword;

  before(function (done) {
    http = helpers.getHttp();
    agent = request.agent(http);

    we = helpers.getWe();

    var userStub = stubs.userStub();
    helpers.createUser(userStub, function(err, user) {
      if (err) throw err;

      salvedUser = user;
      salvedUserPassword = userStub.password;

      done();
    })
  });

  describe('API', function () {
    it ('should get token after authentication', function (done) {

      request(http)
      .post('/auth/jwt/authenticate')
      .set('Accept', 'application/json')
      .send({
        email: salvedUser.email,
        password: salvedUserPassword
      })
      .expect(200)
      .end(function (err, res) {
        if (err) {
          console.log('res.text>', res.text);
          return done(err);
        }

        assert(res.body.token);
        assert(res.body.token.indexOf('JWT') === 0);

        assert.equal(res.body.success, true);
        assert.equal(res.body.user.id, salvedUser.id);

        done(err);
      });

    });

    describe('authenticatedRequest', function() {
      var token;

      before(function (done) {
        request(http)
        .post('/auth/jwt/authenticate')
        .set('Accept', 'application/json')
        .send({
          email: salvedUser.email,
          password: salvedUserPassword
        })
        .expect(200)
        .end(function (err, res) {
          if (err) {
            console.log('res.text>',res.text);
            return done(err);
          }

          token = res.body.token;

          done();
        });
      });

      it ('should get token and access an protected route with this token', function (done) {

        request(http)
        .get('/protected')
        .set('Authorization', token)
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            console.log('res.text>', res.text);
            return done(err);
          }

          assert.equal(res.body.authenticated, true);

          done(err);
        });

      });
    });

  });
});
