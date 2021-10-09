const User = require('../users/users-model')


const checkIfUserValid = async (req, res, next) => {
    const { username, password } = req.body

    if(username === undefined || password === undefined) {
        next({ status: 401, message: 'username and password required'})
    } else {
        const existingUser = await User.findBy({username})
        req.user = existingUser
        next()
    }
}
const checkIfUsernameExists = async (req, res, next) => {
    const { username } = req.body
    const user =  await User.findBy({username})
    if(user) {
        next({status: 401, message: "username taken"})
    } else {
        next()
    }
}


module.exports = { checkIfUserValid, checkIfUsernameExists }