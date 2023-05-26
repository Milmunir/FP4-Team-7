const router = require("express").Router()
const userRouter = require("./userRouter")
const photoRouter = require("./photoRouter")
const socialMediaRouter = require("./socialMediaRouter")
const commentRouter = require("./commentRouter")

router.get("/", (req, res) => {
  return res.status(200).send("<h1>Hello, Welcome to FP-2 Team-7</h1>")
})
router.use("/users", userRouter)
router.use("/photos", photoRouter)
router.use("/comments", commentRouter)
router.use("/socialmedias", socialMediaRouter)
router.use("*", (req, res) => {
  res.status(404).json({
    code: 404,
    name: "Error",
    msg: "Not found",
  })
})

module.exports = router
