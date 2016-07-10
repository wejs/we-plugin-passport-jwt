var jwt = require('jsonwebtoken')

module.exports = {
  authenticate: function authenticate(req, res) {
    var we = req.we

    var email = req.body.email
    var password = req.body.password

    var ctwCFG = we.config.passport.strategies.jwt

    we.db.models.user.findOne({
      where: { email: email }
    })
    .then(function getPassword(user) {
      if (!user) {
        res.addMessage('error', 'auth.login.wrong.email.or.password')
        return res.badRequest()
      }

      // get the user password
      return user.getPassword()
      .then(function afterGetPassword(passwordObj) {
        if (!passwordObj) {
          res.addMessage('error', 'auth.login.user.dont.have.password')
          res.badRequest()
          return user
        }

        user.password = passwordObj

        return user
      })
    })
    .then(function validatePassword (user) {
      if (!user.password) return null

      return user.password
      .validatePassword(password, function (err, isValid) {
        if (err) {
          res.queryError(err)
          return null
        }

        if (!isValid) {
          res.addMessage('error', 'auth.login.user.incorrect.password.or.email')
          res.badRequest()
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
          })

          res.json({
            success: true,
            user: user,
            token: token
          })
        }

        return null
      })
    })
    .catch(res.queryError)
  }
}
