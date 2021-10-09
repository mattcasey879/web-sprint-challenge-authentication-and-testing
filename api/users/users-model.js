const db = require("../../data/dbConfig")

async function findBy(filter) {
    return await db('users').where(filter).first()
}

async function findById(id) {
    return await db("users").where('id', id)
}

async function add(user) {
    const [id] = await db('users').insert(user)
    const newUser = findById(id)
    return newUser
}


module.exports = { add, findBy, findById }