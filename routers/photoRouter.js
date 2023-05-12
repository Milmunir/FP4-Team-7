const express = require("express")
const app = express()
const authentication = require("../middlewares/authentication")
const authorization = require("../middlewares/authorization")
const {
  createPhoto,
  getAllPhotos,
  updatePhoto,
  deletePhoto,
} = require("../controllers/photoController")

app.use(authentication)
app.post("/", createPhoto)
app.get("/", getAllPhotos)
app.use("/:id", authorization)
app.put("/:id", updatePhoto)
app.delete("/:id", deletePhoto)

module.exports = app
