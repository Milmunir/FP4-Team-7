const { User, Photo, Comment, SocialMedia } = require("../models")

const authorization = (req, res, next) => {
  const id = req.params.id
  const authenticatedUser = res.locals.user
  // const method = res.locals.method
  const url = req.baseUrl

  // Authorization Handler for Users Endpoint
  if (url === `/users/${id}`) {
    User.findOne({ where: { id } })
      .then((user) => {
        if (!user) {
          return res.status(404).json({
            name: "Data not found",
            devMessage: `User with id ${id} not found`,
          })
        }
        if (user.id === authenticatedUser.id) {
          return next()
        } else {
          return res.status(403).json({
            name: "Authorization Error",
            devMessage: `User with id "${authenticatedUser.id}" does not have permission to access User with id "${id}"`,
          })
        }
      })
      .catch((err) => {
        console.log(err)
        return res.status(500).json(err)
      })

    // Authorization Handler for Photos Endpoint
  } else if (url === `/photos/${id}`) {
    Photo.findOne({ where: { id } })
      .then((photo) => {
        if (!photo) {
          return res.status(404).json({
            name: "Data not found",
            devMessage: `Photo with id ${id} not found`,
          })
        }
        if (photo.UserId === authenticatedUser.id) {
          return next()
        } else {
          return res.status(403).json({
            name: "Authorization Error",
            devMessage: `User with id "${authenticatedUser.id}" does not have permission to access Photo with id "${id}"`,
          })
        }
      })
      .catch((err) => {
        console.log(err)
        return res.status(500).json(err)
      })

    // Authorization Handler for Comments Endpoint
  } else if (url === "/comments") {
    // For createComment
    const { PhotoId } = req.body
    console.log(url)
    if (PhotoId) {
      Photo.findOne({ where: { id: PhotoId } })
        .then((photo) => {
          if (!photo) {
            return res.status(404).json({
              name: "Data not found",
              devMessage: `Photo with id ${PhotoId} not found`,
            })
          }
          return next()
        })
        .catch((err) => {
          console.log(err)
          return res.status(500).json(err)
        })
    }
  } else if (url === `/comments/${id}`) {
    // For UpdateComment
    if (id) {
      Comment.findOne({ where: { id } })
        .then((comment) => {
          if (!comment) {
            return res.status(404).json({
              name: "Data not found",
              devMessage: `Comment with id ${id} not found`,
            })
          }

          if (comment.UserId === authenticatedUser.id) {
            return next()
          } else {
            return res.status(403).json({
              name: "Authorization Error",
              devMessage: `User with id "${authenticatedUser.id}" does not have permission to access Comment with id "${id}"`,
            })
          }
        })
        .catch((err) => {
          console.log(err)
          return res.status(500).json(err)
        })
    }
    // Authorization Handler for SocialMedias Endpoint
  } else if (url === `/socialmedias/${id}`) {
    SocialMedia.findOne({ where: { id } })
      .then((socmed) => {
        if (!socmed) {
          return res.status(404).json({
            name: "Data not found",
            devMessage: `Social media with id ${id} not found`,
          })
        }

        if (socmed.UserId === authenticatedUser.id) {
          return next()
        } else {
          return res.status(403).json({
            name: "Authorization Error",
            devMessage: `User with id "${authenticatedUser.id}" does not have permission to access Social Media with id "${id}"`,
          })
        }
      })
      .catch((err) => {
        console.log(err)
        return res.status(500).json(err)
      })
  } else {
    return console.log(false)
  }
}

module.exports = authorization
