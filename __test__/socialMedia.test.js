const app = require("../index")
const request = require("supertest")
const { User, Photo, Comment, SocialMedia } = require("../models")
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

describe("POST /socialmedias", () => {
  let UserId
  let token

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

  // Success Testing Create Social Media
  it("should send response with 201 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .set("token", token)
      .send({
        name: "test",
        socialMediaUrl: "test.com",
        UserId,
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(201)
        expect(res.type).toEqual("application/json")
        expect(res.body).toHaveProperty("social_media")
        expect(res.body.social_media).toHaveProperty("id")
        expect(res.body.social_media).toHaveProperty("UserId")
        expect(res.body.social_media).toHaveProperty("name")
        expect(res.body.social_media).toHaveProperty("social_media_url")
        expect(res.body.social_media).toHaveProperty("updatedAt")
        expect(res.body.social_media).toHaveProperty("createdAt")
        done()
      })
  })

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .send({
        name: "test",
        socialMediaUrl: "test.com",
        UserId,
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

  // Error because the column is empties
  it("should send response with 500 status code", (done) => {
    request(app)
      .post("/socialmedias")
      .set("token", token)
      .send({
        name: "",
        socialMediaUrl: "",
        UserId,
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(500)
        expect(res.type).toEqual("application/json")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("errors")
        expect(res.body.name).toEqual("SequelizeValidationError")
        expect(res.body.errors[0].message).toEqual("Name is required")
        expect(res.body.errors[0].type).toEqual("Validation error")
        done()
      })
  })
})

describe("GET /socialmedias", () => {
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

  // Success Testing Get Social Media
  it("should send response with 200 status code", (done) => {
    request(app)
      .get("/socialmedias")
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
        expect(res.body).toHaveProperty("social_medias")
        expect(typeof res.body.social_medias).toEqual("object")
        done()
      })
  })

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .get("/socialmedias")
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

describe("PUT /socialmedias/:id", () => {
  let UserId
  let token
  let socmedId

  beforeAll(async () => {
    try {
      const user = await User.create(userData)
      UserId = user.id
      token = generateToken({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      })
      socmedData = {
        name: "tester",
        social_media_url: "tester.com",
        UserId,
      }
      const socmed = await SocialMedia.create(socmedData)
      socmedId = socmed.id
    } catch (err) {
      console.log(err)
    }
  })
  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
      await SocialMedia.destroy({ where: {} })
    } catch (err) {
      console.log(err)
    }
  })

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .put("/socialmedias/" + socmedId)
      .send({
        name: "tester_update",
        social_media_url: "testeredit.com",
        UserId,
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

  // Error because social_media_url field did not pass the validation
  it("should send response with 500 status code", (done) => {
    request(app)
      .put("/socialmedias/" + socmedId)
      .set("token", token)
      .send({
        name: "tester_update",
        social_media_url: "testeredit",
        UserId,
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(500)
        expect(res.type).toEqual("application/json")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("errors")
        expect(res.body).toHaveProperty("name")
        expect(res.body.errors[0]).toHaveProperty("message")
        expect(res.body.errors[0]).toHaveProperty("type")
        expect(res.body.errors[0].message).toEqual(
          "Validation isUrl on social_media_url failed"
        )
        expect(res.body.errors[0].type).toEqual("Validation error")
        done()
      })
  })

  // Error because socmedId not found
  it("should send response with 404 status code", (done) => {
    request(app)
      .put("/socialmedias/" + 999)
      .set("token", token)
      .send({
        name: "tester_update",
        social_media_url: "testeredit.com",
        UserId,
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(404)
        expect(res.type).toEqual("application/json")
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("devMessage")
        expect(res.body.name).toEqual("Data not found")
        expect(res.body.devMessage).toEqual(
          "Social media with id 999 not found"
        )
        done()
      })
  })

  // Success Testing Update Comment
  it("should send response with 200 status code", (done) => {
    request(app)
      .put("/socialmedias/" + socmedId)
      .set("token", token)
      .send({
        name: "tester_update",
        social_media_url: "testeredit.com",
        UserId,
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(200)
        expect(res.statusType).toEqual(2)
        expect(res.ok).toEqual(true)
        expect(res.body).toHaveProperty("social_media")
        expect(res.type).toEqual("application/json")
        expect(typeof res.body.social_media).toEqual("object")
        console.log(res.body.social_media)
        expect(res.body.social_media[0]).toHaveProperty("id")
        expect(res.body.social_media[0]).toHaveProperty("name")
        expect(res.body.social_media[0]).toHaveProperty("social_media_url")
        expect(res.body.social_media[0]).toHaveProperty("UserId")
        expect(res.body.social_media[0]).toHaveProperty("createdAt")
        expect(res.body.social_media[0]).toHaveProperty("updatedAt")

        done()
      })
  })
})

describe("DELETE /socialmedias/:id", () => {
  let UserId
  let token
  let socmedId

  beforeAll(async () => {
    try {
      const user = await User.create(userData)
      UserId = user.id
      token = generateToken({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      })
      socmedData = {
        name: "tester",
        social_media_url: "tester.com",
        UserId,
      }
      const socmed = await SocialMedia.create(socmedData)
      socmedId = socmed.id
    } catch (err) {
      console.log(err)
    }
  })
  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
      await SocialMedia.destroy({ where: {} })
    } catch (err) {
      console.log(err)
    }
  })

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .delete("/socialmedias/" + socmedId)
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

  // Error because did not input socmedId params
  it("should send response with 404 status code", (done) => {
    request(app)
      .delete("/socialmedias/")
      .set("token", token)
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

  // Error because socmedId not found
  it("should send response with 404 status code", (done) => {
    request(app)
      .put("/socialmedias/" + 999)
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(404)
        expect(res.type).toEqual("application/json")
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("devMessage")
        expect(res.body.name).toEqual("Data not found")
        expect(res.body.devMessage).toEqual(
          "Social media with id 999 not found"
        )
        done()
      })
  })

  // Success Testing Delete Comment
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete("/socialmedias/" + socmedId)
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
          "Your social media has been successfully deleted"
        )
        done()
      })
  })
})
