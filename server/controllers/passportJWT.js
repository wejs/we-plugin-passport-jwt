var jwt = require('jsonwebtoken');

module.exports = {
  authenticate: function authenticate(req, res) {
    var we = req.we;

    var email = req.body.email;
    var password = req.body.password;

    var ctwCFG = we.config.passport.strategies.jwt;

    we.db.models.user.findOne({
      where: { email: email }
    })
    .then(function afterFind(user) {
      if (!user) {
        return res.status(400).send(null, false, {
          message: 'auth.login.wrong.email.or.password'
        });
      }
      // get the user password
      return user.getPassword()
      .then(function afterGetPassword(passwordObj) {
        if (!passwordObj)
          return res.status(400).send(null, false, {
            message: 'auth.login.user.dont.have.password'
          });

        return passwordObj.validatePassword(password, function (err, isValid) {
          if (err) return res.queryError(err);
          if (!isValid) {
            return res.status(400).send(null, false, {
              message: 'auth.login.user.incorrect.password.or.email'
            });
          } else {

            var token = jwt.sign({
              userId: user.id,
              username: user.username
            }, ctwCFG.secretOrKey, {
              algorithm: ctwCFG.algorithm,
              audience: ctwCFG.audience,
              issuer: ctwCFG.issuer,
              jwtid: ctwCFG.jwtid,
              subject: ctwCFG.subject,
              noTimestamp: ctwCFG.noTimestamp,
              expiresIn: ctwCFG.expiresIn // in seconds
            });

            res.json({
              success: true,
              user: user,
              token: 'JWT ' + token
            });
          }
        });
      })
    })
    .catch(res.queryError);
  }
}
