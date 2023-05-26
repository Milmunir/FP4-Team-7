require("dotenv").config()

const express = require("express")
const app = express()
const router = require("./routers")
const { sequelize } = require("./models")
const PORT = process.env.PORT
const helmet = require("helmet")

app.use(helmet())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Sync database schema
// sequelize
//   .sync()
//   .then(() => {
//     console.log(`Database schema synced`)
//   })
//   .catch((err) => {
//     console.log("Error syncing database schema :", err)
//     process.exit(1)
//   })

app.use(router)

// app.listen(PORT, () => {
//   console.log(`Server is running on PORT : ${PORT}`)
// })

module.exports = app
