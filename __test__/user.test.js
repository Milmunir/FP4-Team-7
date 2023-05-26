const request = require("supertest")
const app = require("../index")
const { User } = require("../models")
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

// Success Testing User Register
describe("POST /users/register", () => {
  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
    } catch (error) {
      console.log(error)
    }
  })

  it("should send response with 201 status code", (done) => {
    request(app)
      .post("/users/register")
      .send(userData)
      .end(function (err, res) {
        if (err) {
          done(err)
        }

        // Min 5 expects
        expect(res.status).toEqual(201)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("user.email")
        expect(res.body).toHaveProperty("user.full_name")
        expect(res.body).toHaveProperty("user.profile_image_url")
        expect(res.body).toHaveProperty("user.age")
        expect(res.body).toHaveProperty("user.phone_number")
        expect(res.body.user.email).toEqual(userData.email)
        expect(res.body.user.full_name).toEqual(userData.full_name)
        expect(res.body.user.profile_image_url).toEqual(
          userData.profile_image_url
        )
        expect(res.body.user.age).toEqual(userData.age)
        expect(res.body.user.phone_number).toEqual(userData.phone_number)
        done()
      })
  })
})

// Failed Testing User Register
describe("POST /users/register", () => {
  beforeAll(async () => {
    try {
      await User.create(userData)
    } catch (error) {
      console.log(error)
    }
  })

  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
    } catch (error) {
      console.log(error)
    }
  })

  it("should send response with 401 status code", (done) => {
    request(app)
      .post("/users/register")
      .send(userData)
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(401)
        expect(res.type).toEqual("application/json")
        expect(typeof res.body).toEqual("object")
        expect(res.text).toEqual(
          '{"msg":"Email has been used, try another one"}'
        )
        expect(res.created).toEqual(false)
        expect(res.accepted).toEqual(false)
        expect(res.unauthorized).toEqual(true)
        done()
      })
  })
})

// Success Testing User Login
describe("POST /users/login", () => {
  beforeAll(async () => {
    try {
      await User.create(userData)
    } catch (err) {
      console.log(err)
    }
  })

  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
    } catch (error) {
      console.log(error)
    }
  })

  it("should send response with 200 status code", (done) => {
    request(app)
      .post("/users/login")
      .send(userData)
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(200)
        expect(res.type).toEqual("application/json")
        expect(res.statusType).toEqual(2)
        expect(res.ok).toEqual(true)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("token")
        expect(typeof res.body.token).toEqual("string")
        done()
      })
  })
})

// Failed Testing User Login
describe("POST /users/login", () => {
  beforeAll(async () => {
    try {
      await User.create(userData)
    } catch (error) {
      console.log(error)
    }
  })

  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
    } catch (error) {
      console.log(error)
    }
  })

  it("should send response with 401 status code", (done) => {
    request(app)
      .post("/users/login")
      .send({
        email: "wrong-user@gmail.com",
        password: "wrong-password",
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(401)
        expect(res.type).toEqual("application/json")
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("name")
        expect(res.body.name).toEqual("User Login Error")
        expect(res.body).toHaveProperty("devMessage")
        expect(res.body.devMessage).toEqual("User not found!")
        done()
      })
  })
})

// Success & Failed Testing User Update
describe("PUT /users/:id", () => {
  let id
  let token
  beforeAll(async () => {
    try {
      const user = await User.create(userData)
      id = user.id
      token = generateToken({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      })
    } catch (error) {
      console.log(error)
    }
  })

  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
    } catch (error) {
      console.log(error)
    }
  })

  // Error because id not found
  it("should send response with 404 status code", (done) => {
    request(app)
      .put("/users/" + 999)
      .set("token", token)
      .send({
        email: "tester@gmail.com",
        full_name: "tester",
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        expect(res.type).toEqual("application/json")
        expect(res.status).toEqual(404)
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("devMessage")
        expect(res.body.name).toEqual("Data not found")
        expect(res.body.devMessage).toEqual("User with id 999 not found")
        done()
      })
  })

  // Update success
  it("should send response with 200 status code", (done) => {
    request(app)
      .put("/users/" + id)
      .set("token", token)
      .send({
        email: "tester@gmail.com",
        full_name: "tester",
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(200)
        expect(typeof res.body).toEqual("object")
        expect(res.body.user).toHaveProperty("email")
        expect(res.body.user).toHaveProperty("username")
        expect(res.body.user).toHaveProperty("profile_image_url")
        expect(res.body.user).toHaveProperty("age")
        expect(res.body.user).toHaveProperty("phone_number")
        done()
      })
  })

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .put("/users/" + id)
      .send({
        email: "tester@gmail.com",
        full_name: "tester",
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
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

  // Error because the token data has changed and the previous token is no longer valid
  it("should send response with 400 status code", (done) => {
    request(app)
      .put("/users/" + id)
      .set("token", token)
      .send({
        email: "tester2@gmail.com",
        full_name: "tester2",
      })
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        // Min 5 expects
        expect(res.status).toEqual(400)
        expect(typeof res.body).toEqual("object")
        expect(res.type).toEqual("application/json")
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("devMessage")
        expect(res.body.name).toEqual("Authentication Error")
        expect(res.body.devMessage).toEqual(
          'User with email "admin@gmail.com" not found in database'
        )
        done()
      })
  })
})

// Success & Failed Testing User Delete
describe("DELETE /users/:id", () => {
  let id
  let token
  beforeAll(async () => {
    try {
      const user = await User.create(userData)
      id = user.id
      token = generateToken({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
      })
    } catch (error) {
      console.log(error)
    }
  })

  afterAll(async () => {
    try {
      await User.destroy({ where: {} })
    } catch (error) {
      console.log(error)
    }
  })

  // Error because id not found
  it("should send response with 404 status code", (done) => {
    request(app)
      .delete("/users/" + 999)
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        expect(res.type).toEqual("application/json")
        expect(typeof res.body).toEqual("object")
        expect(res.status).toEqual(404)
        expect(res.body).toHaveProperty("name")
        expect(res.body).toHaveProperty("devMessage")
        expect(res.body.name).toEqual("Data not found")
        expect(res.body.devMessage).toEqual("User with id 999 not found")
        done()
      })
  })

  // Error for not including token
  it("should send response with 401 status code", (done) => {
    request(app)
      .delete("/users/" + id)
      .end(function (err, res) {
        if (err) {
          done(err)
        }
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

  // Success delete
  it("should send response with 200 status code", (done) => {
    request(app)
      .delete("/users/" + id)
      .set("token", token)
      .end(function (err, res) {
        if (err) {
          done(err)
        }
        expect(res.status).toEqual(200)
        expect(res.statusType).toEqual(2)
        expect(res.type).toEqual("application/json")
        expect(res.unauthorized).toEqual(false)
        expect(typeof res.body).toEqual("object")
        expect(res.body).toHaveProperty("message")
        expect(res.body.message).toEqual(
          "Your account has been sucecessfully deleted"
        )
        done()
      })
  })
})
