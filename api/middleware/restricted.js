const JwtSecret = process.env.JWT_SECRET || 'fallback'
const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const token = req.headers.authorization
  if(!token) {
    next({ status: 401, message: "token required" })
  } 
  jwt.verify(token, JwtSecret, (err, decoded) => {
    if(err) {
      next({ status: 401, message: 'token invalid'})
    }
    req.decoded = decoded
  })
  next();
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
