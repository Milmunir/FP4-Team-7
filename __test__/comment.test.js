const app = require("../index")
const request = require("supertest")
const { User, Photo, Comment } = require("../models")
const { generateToken } = require("../helpers/jwt")

const userData = {
  full_name: "admin",
  email: "admin@gmail.com",
  username: "admin",
  password: "123456",
  profile_image_url: "admin.com",
  age: 21,
  phone_number: "82112324",
}

describe("POST /comments", () => {
  let UserId
  let token
  let PhotoId

  beforeAll(async () => {
    try {
      const user = await User.create(userData)
      UserId = user.id
      token = generateToken({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      })
      const photoData = {
        title: "coba",
        caption: "coba",
        poster_image_url: "coba.com",
        UserId: UserId,
      }
      const photo = await Photo.create(photoData)
      PhotoId = photo.id
    } catch (err) {
      console.log(err)
    }
  })
  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
      await Photo.destroy({ where: {} })
      await Comment.destroy({ where: {} })
    } catch (err) {
      console.log(err)
    }
  })

  // Success Testing Create Comment
  it("should send response with 201 status code", (done) => {
    request(app)
      .post("/comments")
      .set("token", token)
      .send({
        UserId: UserId,
        PhotoId: PhotoId,
        comment: "So beautiful..",
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(201)
        expect(res.body).toHaveProperty("comment")
        expect(res.body.comment).toHaveProperty("id")
        expect(res.body.comment).toHaveProperty("UserId")
        expect(res.body.comment).toHaveProperty("PhotoId")
        expect(res.body.comment).toHaveProperty("comment")
        expect(res.body.comment).toHaveProperty("updatedAt")
        expect(res.body.comment).toHaveProperty("createdAt")
        done()
      })
  })

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .post("/comments")
      .send({
        UserId: UserId,
        PhotoId: PhotoId,
        comment: "So beautiful..",
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(401)
        expect(res.statusType).toEqual(4)
        expect(res.type).toEqual("application/json")
        expect(res.unauthorized).toEqual(true)
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("message")
        expect(res.body.name).toEqual("JsonWebTokenError")
        expect(res.body.message).toEqual("jwt must be provided")
        done()
      })
  })

  // Error because PhotoId not found
  it("should send response with 404 status code", (done) => {
    request(app)
      .post("/comments")
      .set("token", token)
      .send({
        UserId: UserId,
        PhotoId: 999,
        comment: "So beautiful..",
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(404)
        expect(res.type).toEqual("application/json")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("devMessage")
        expect(res.body.name).toEqual("Data not found")
        expect(res.body.devMessage).toEqual("Photo with id 999 not found")
        done()
      })
  })
})

describe("GET /comments", () => {
  let token

  beforeAll(async () => {
    try {
      const user = await User.create(userData)
      token = generateToken({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      })
    } catch (err) {
      console.log(err)
    }
  })
  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
    } catch (err) {
      console.log(err)
    }
  })

  // Success Testing Get Comment
  it("should send response with 200 status code", (done) => {
    request(app)
      .get("/comments")
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(200)
        expect(res.statusType).toEqual(2)
        expect(res.type).toEqual("application/json")
        expect(res.ok).toEqual(true)
        expect(res.body).toHaveProperty("comments")
        expect(typeof res.body.comments).toEqual("object")
        done()
      })
  })

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .get("/comments")
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(401)
        expect(res.statusType).toEqual(4)
        expect(res.type).toEqual("application/json")
        expect(res.unauthorized).toEqual(true)
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("message")
        expect(res.body.name).toEqual("JsonWebTokenError")
        expect(res.body.message).toEqual("jwt must be provided")
        done()
      })
  })
})

describe("PUT /comments/:id", () => {
  let UserId
  let token
  let PhotoId
  let commentId

  beforeAll(async () => {
    try {
      const user = await User.create(userData)
      UserId = user.id
      token = generateToken({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      })
      const photoData = {
        title: "coba",
        caption: "coba",
        poster_image_url: "coba.com",
        UserId: UserId,
      }
      const photo = await Photo.create(photoData)
      PhotoId = photo.id

      const commentData = {
        UserId: UserId,
        PhotoId: PhotoId,
        comment: "So beautiful..",
      }
      const comment = await Comment.create(commentData)
      commentId = comment.id
    } catch (err) {
      console.log(err)
    }
  })
  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
      await Photo.destroy({ where: {} })
      await Comment.destroy({ where: {} })
    } catch (err) {
      console.log(err)
    }
  })

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .put("/comments/" + commentId)
      .send({
        UserId: UserId,
        PhotoId: PhotoId,
        comment: "So beautiful..",
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(401)
        expect(res.statusType).toEqual(4)
        expect(res.type).toEqual("application/json")
        expect(res.unauthorized).toEqual(true)
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("message")
        expect(res.body.name).toEqual("JsonWebTokenError")
        expect(res.body.message).toEqual("jwt must be provided")
        done()
      })
  })

  // Error because Comment not found
  it("should send response with 404 status code", (done) => {
    request(app)
      .put("/comments/" + 999)
      .set("token", token)
      .send({
        comment: "So beautiful..",
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(404)
        expect(res.type).toEqual("application/json")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("devMessage")
        expect(res.body.name).toEqual("Data not found")
        expect(res.body.devMessage).toEqual("Comment with id 999 not found")
        done()
      })
  })

  // Error because comment is empty
  it("should send response with 401 status code", (done) => {
    request(app)
      .put("/comments/" + commentId)
      .set("token", token)
      .send({
        comment: "",
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(401)
        expect(res.type).toEqual("application/json")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("errors")
        expect(res.body.name).toEqual("SequelizeValidationError")
        expect(res.body.errors[0].message).toEqual("Comment is required")
        expect(res.body.errors[0].type).toEqual("Validation error")
        done()
      })
  })

  // Success Testing Update Comment
  it("should send response with 201 status code", (done) => {
    request(app)
      .put("/comments/" + commentId)
      .set("token", token)
      .send({
        comment: "So cool..",
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(201)
        expect(res.statusType).toEqual(2)
        expect(res.ok).toEqual(true)
        expect(res.body).toHaveProperty("comment")
        expect(res.type).toEqual("application/json")
        expect(typeof res.body.comment).toEqual("object")
        done()
      })
  })
})

describe("DELETE /comments/:id", () => {
  let UserId
  let token
  let PhotoId
  let commentId

  beforeAll(async () => {
    try {
      const user = await User.create(userData)
      UserId = user.id
      token = generateToken({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      })
      const photoData = {
        title: "coba",
        caption: "coba",
        poster_image_url: "coba.com",
        UserId: UserId,
      }
      const photo = await Photo.create(photoData)
      PhotoId = photo.id

      const commentData = {
        UserId: UserId,
        PhotoId: PhotoId,
        comment: "So beautiful..",
      }
      const comment = await Comment.create(commentData)
      commentId = comment.id
    } catch (err) {
      console.log(err)
    }
  })
  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
      await Photo.destroy({ where: {} })
      await Comment.destroy({ where: {} })
    } catch (err) {
      console.log(err)
    }
  })

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .delete("/comments/" + commentId)
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(401)
        expect(res.statusType).toEqual(4)
        expect(res.type).toEqual("application/json")
        expect(res.unauthorized).toEqual(true)
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("message")
        expect(res.body.name).toEqual("JsonWebTokenError")
        expect(res.body.message).toEqual("jwt must be provided")
        done()
      })
  })

  // Error because Comment not found
  it("should send response with 404 status code", (done) => {
    request(app)
      .delete("/comments/" + 999)
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(404)
        expect(res.type).toEqual("application/json")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("devMessage")
        expect(res.body.name).toEqual("Data not found")
        expect(res.body.devMessage).toEqual("Comment with id 999 not found")
        done()
      })
  })

  // Error because did not input commentId
  it("should send response with 404 status code", (done) => {
    request(app)
      .delete("/comments/")
      .set("token", token)
      .send({
        PhotoId,
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(404)
        expect(res.notFound).toEqual(true)
        expect(res.type).toEqual("application/json")
        expect(res.body).toHaveProperty("code")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("msg")
        expect(res.body.name).toEqual("Error")
        expect(res.body.code).toEqual(404)
        expect(res.body.msg).toEqual("Not found")
        done()
      })
  })

  // Success Testing Delete Comment
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete("/comments/" + commentId)
      .set("token", token)

      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(200)
        expect(res.statusType).toEqual(2)
        expect(res.type).toEqual("application/json")
        expect(res.body).toHaveProperty("message")
        expect(typeof res.body).toEqual("object")
        expect(res.body.message).toEqual(
          "Your comment has been successfully deleted"
        )
        done()
      })
  })
})
