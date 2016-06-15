/**
 * Plugin.js file, set configs, routes, hooks and events here
 *
 * see http://wejs.org/docs/we/plugin
 */
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function loadPlugin(projectPath, Plugin) {
  var plugin = new Plugin(__dirname);
  // set plugin configs
  plugin.setConfigs({
    passport: {
      strategies: {
        // session
        jwt: {
          Strategy: JwtStrategy,

          jwtFromRequest: ExtractJwt.fromAuthHeader(),

          secretOrKey: null, // set it in config/local.js

          algorithm: 'HS256',
          audience: null, // will be set after load all plugins
          issuer: 'wejs.org',
          // jwtid: null,
          // subject: null,
          // noTimestamp: null,
          expiresIn: 10080, // in seconds

          session: false,

          // passReqToCallback: true,

          findUser: function findUserAndValidJWT (jwtPayload, done) {
            // find user in DB
            plugin.we.db.models.user
            .findById(jwtPayload.userId)
            .then (function afterFindUser(user) {
              if (!user) {
                return done(null, false, {
                  message: 'auth.login.wrong.email.or.password'
                })
              }

              done(null, user)
            })
            .catch(done)
          }
        }
      }
    },
  });

  // set plugin routes
  plugin.setRoutes({
    'post /auth/jwt/authenticate': {
      controller: 'passportJWT',
      action: 'authenticate'
    }
  });

  plugin.events.on('we:after:load:plugins', function (we) {
    we.config.passport.strategies.jwt.audience = we.config.hostname;

    if (!we.config.passport.strategies.jwt.secretOrKey) {
      throw new Error('passport-jwt:we.config.passport.strategies.jwt.secretOrKey config is required');
    }
  });

  plugin.events.on('we:after:load:passport', function afterLoadExpress(we) {

    we.express.use(function (req, res, next) {
      we.passport.authenticate('jwt', function afterCheckToken (err, user, info) {
        if (err) return res.serverError(err);

        if (info) {
          if (info == 'Error: No auth token') {
            req.we.log.verbose('JWT:afterCheckToken:', info);
          } else {
            req.we.log.error('JWT:afterCheckToken:', err, info);
            return res.serverError({ errors: err });
          }
        }

        // set is is authenticated
        if (user) req.user = user;

        next();
      })(req, res, next);
    });

    // for dev env ...
    if (we.env == 'test') {
      // Some secure method
      we.express.get('/protected', function (req, res) {
        if (req.isAuthenticated()) {
          res.send({ authenticated: true });
        } else {
          res.send({ authenticated: false });
        }
      });
    }
  });

  return plugin;
};