const express = require("express")
const app = express()
const authentication = require("../middlewares/authentication")
const authorization = require("../middlewares/authorization")
const {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentController")

app.use(authentication)
app.get("/", getAllComments)
app.use("/:id", authorization)
app.put("/:id", updateComment)
app.delete("/:id", deleteComment)
app.use(authorization)
app.post("/", createComment)

module.exports = app
