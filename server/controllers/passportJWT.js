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
        res.addMessage('error', 'auth.login.wrong.email.or.password');
        return res.badRequest();
      }

      // get the user password
      return user.getPassword()
      .then(function afterGetPassword(passwordObj) {
        if (!passwordObj) {
          res.addMessage('error', 'auth.login.user.dont.have.password');
          return res.badRequest();
        }

        return passwordObj
        .validatePassword(password, function (err, isValid) {
          if (err) return res.queryError(err);
          if (!isValid) {
            res.addMessage('error', 'auth.login.user.incorrect.password.or.email');
            return res.badRequest();
          } else {

            var token = jwt.sign({
              userId: user.id,
              user: user.displayName,
              email: user.email
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
              token: token
            });
          }
        });
      })
    })
    .catch(res.queryError);
  }
}
