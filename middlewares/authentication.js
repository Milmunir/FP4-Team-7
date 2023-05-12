const { User } = require("../models")
const { verifyToken } = require("../helpers/jwt")

const authentication = async (req, res, next) => {
  try {
    const token = req.get("token")
    const userDecoded = verifyToken(token)

    const matchUser = await User.findOne({
      where: {
        id: userDecoded.id,
        email: userDecoded.email,
      },
    })

    if (!matchUser) {
      return res.status(400).json({
        name: "Authentication Error",
        devMessage: `User with email "${userDecoded.email}" not found in database`,
      })
    }
    req.user = matchUser
    res.locals.user = matchUser
    res.locals.method = req.method
    return next()
  } catch (error) {
    return res.status(401).json(error)
  }
}

module.exports = authentication
