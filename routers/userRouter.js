const router = require("express").Router()
const UserController = require("../controllers/userController")
const authentication = require("../middlewares/authentication")
const authorization = require("../middlewares/authorization")

router.post("/register", UserController.register)
router.post("/login", UserController.login)
router.use(authentication)
router.use("/:id", authorization)
router.put("/:id", UserController.update)
router.delete("/:id", UserController.delete)

module.exports = router
