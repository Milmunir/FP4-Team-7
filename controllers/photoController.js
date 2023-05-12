const { Photo, User, Comment } = require("../models")

// Create Photo Function
const createPhoto = async (req, res) => {
  const { title, caption, poster_image_url } = req.body
  const UserId = res.locals.user.id
  let data = {
    title,
    caption,
    poster_image_url,
    UserId,
  }
  try {
    const photo = await Photo.create(data)
    res.status(201).json({
      id: photo.id,
      poster_image_url: photo.poster_image_url,
      title: photo.title,
      caption: photo.caption,
      UserId: photo.UserId,
    })
  } catch (error) {
    res.status(401).json(error)
    console.log(error)
  }
}

// GetAllPhotos Function
const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll({
      include: [
        { model: User },
        { model: Comment, include: [{ model: User }] },
      ],
    })
    const eachPhoto = photos.map((photo) => {
      const comment = photo.Comments.map((comment) => {
        return {
          comment: comment.comment,
          User: {
            username: comment.User.username,
          },
        }
      })

      return {
        id: photo.id,
        title: photo.title,
        caption: photo.caption,
        poster_image_url: photo.poster_image_url,
        UserId: photo.UserId,
        createdAt: photo.createdAt,
        updatedAt: photo.updatedAt,
        Comments: comment,
        User: {
          id: photo.User.id,
          username: photo.User.username,
          profile_image_url: photo.User.profile_image_url,
        },
      }
    })
    res.status(200).json({
      photos: eachPhoto,
    })
  } catch (error) {
    res.status(401).json(error)
    console.log(error)
  }
}

// UpdatePhoto Function
const updatePhoto = async (req, res) => {
  try {
    const { title, caption, poster_image_url } = req.body
    const UserId = res.locals.user.id
    const photoId = req.params.id
    let data = {
      title,
      caption,
      poster_image_url,
      UserId,
    }

    const photo = await Photo.update(data, {
      where: { id: photoId },
      returning: true,
    })

    return res.status(200).json({
      photo: {
        id: photo[1][0].id,
        title: photo[1][0].title,
        caption: photo[1][0].caption,
        poster_image_url: photo[1][0].poster_image_url,
        UserId: photo[1][0].UserId,
        createdAt: photo[1][0].createdAt,
        updatedAt: photo[1][0].updatedAt,
      },
    })
  } catch (error) {
    res.status(401).json(error)
    console.log(error)
  }
}

const deletePhoto = async (req, res) => {
  const photoId = req.params.id
  try {
    const deletedUser = await Photo.destroy({ where: { id: photoId } })
    console.log(deletedUser)
    if (deletedUser) {
      return res.status(200).json({
        message: "Your photo has been successfully deleted",
      })
    }
  } catch (error) {
    res.status(401).json(error)
    console.log(error)
  }
}

module.exports = { createPhoto, getAllPhotos, updatePhoto, deletePhoto }
