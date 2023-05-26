const { User } = require("../models")
const { comparePassword } = require("../helpers/bcrypt")
const { generateToken } = require("../helpers/jwt")

class UserController {
  static async register(req, res) {
    try {
      const {
        email,
        full_name,
        username,
        password,
        profile_image_url,
        age,
        phone_number,
      } = req.body

      // Check if email duplicate
      const emailDuplicate = await User.findOne({ where: { email } })
      if (emailDuplicate) {
        return res
          .status(401)
          .json({ msg: "Email has been used, try another one" })
      }
      // Check if username duplicate
      const usernameDuplicate = await User.findOne({ where: { username } })
      if (usernameDuplicate) {
        return res
          .status(401)
          .json({ msg: "Username has been used, try another one" })
      }

      // if data pass the validation then insert to db
      const user = await User.create({
        email,
        full_name,
        username,
        password,
        profile_image_url,
        age,
        phone_number,
      })

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          profile_image_url: user.profile_image_url,
          age: user.age,
          phone_number: user.phone_number,
        },
      })

      // show success response
    } catch (err) {
      res.status(401).json(err)
      console.log(err)
    }
  }

  static async login(req, res) {
    const { email, password } = req.body

    try {
      const user = await User.findOne({ where: { email } })

      if (!user) {
        throw {
          name: "User Login Error",
          devMessage: "User not found!",
        }
      }
      const isCorrect = comparePassword(password, user.password)
      if (!isCorrect) {
        throw {
          name: "User login Error",
          devMessage: `User's password with email "${user.email}" does not match`,
        }
      } else {
        let payload = {
          id: user.id,
          email: user.email,
          username: user.username,
          full_name: user.full_name,
        }
        const token = generateToken(payload)
        res.status(200).json({
          token: token,
        })
      }
    } catch (err) {
      res.status(401).json(err)
    }
  }

  static async update(req, res) {
    try {
      const {
        email,
        full_name,
        username,
        profile_image_url,
        age,
        phone_number,
      } = req.body
      const { id } = req.params

      if (id == req.user.id) {
        const user = await User.update(
          {
            email,
            full_name,
            username,
            profile_image_url,
            age,
            phone_number,
          },
          {
            where: {
              id,
            },
            returning: true,
          }
        )
        res.status(200).json({
          user: {
            email: user[1][0].email,
            full_name: user[1][0].full_name,
            username: user[1][0].username,
            profile_image_url: user[1][0].profile_image_url,
            age: user[1][0].age,
            phone_number: user[1][0].phone_number,
          },
        })
      }
    } catch (error) {
      return res.status(401).json({
        error,
      })
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params
      if (req.params.id == req.user.id) {
        const result = await User.destroy({
          where: {
            id,
          },
        })
        res.status(200).json({
          message: "Your account has been sucecessfully deleted",
        })
      } else {
        return res.status(403).json(error)
      }
    } catch (error) {
      return res.status(401).json(error)
    }
  }
}

module.exports = UserController
