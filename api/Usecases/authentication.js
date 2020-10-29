const { getUser, addUser } = require("../Gateways/recipesGateway");
const { hash, compare } = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');

module.exports.login = async (email, password) => {
  console.log(`Looking for user ${email}`)
  const user = await getUser(email)
  console.log("user returned", user)
  if (!user) {
    console.log(`User for email ${email} was not found`)
    throw new Error('No such user found')
  }

  console.log("User retrieved", user)
  const valid = await compare(password, user.password)

  if (!valid) {
    throw new Error('Invalid password');
  }
  const token = sign({ user: user.name, editRights: user.adminAccess }, process.env.APP_SECRET)
  return ({
    token,
    user: {
      name: user.name,
      admin: user.adminAccess
    }
  })
}

module.exports.signup = async (username, password) => {
  console.log(`trying to sign up ${username}`)
  const encryptedPassword = await hash(password, 10)
  console.log(`Got encrypted passed`)
  let user;
  try {
    user = await addUser(username, encryptedPassword)
    console.log(`user added`)
  } catch {
    throw new Error(`Issue adding ${username} to the database`)
  }

  const token = sign({ user: username, editRights: false }, process.env.APP_SECRET)
  return ({
    token,
    user: { name: user},
  })
}

module.exports.authenticateUser = async (context, args, action) => {
  console.log("Authentication")
  if (!context.authToken) throw new Error('Not authenticated')

  const token = context.authToken.trim().replace('Bearer ', '')
  const { user, editRights } = verify(token, process.env.APP_SECRET)
  console.log(`authenticated user ${user} with rights? ${editRights}`)

  if (editRights) return action(args).then(data => data)

  throw new Error('Forbidden')
}