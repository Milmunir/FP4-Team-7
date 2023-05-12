const { User, Photo, Comment } = require("../models")

// Create Comment Function
const createComment = async (req, res) => {
  const UserId = res.locals.user.id
  const { comment, PhotoId } = req.body
  try {
    let data = {
      UserId,
      PhotoId,
      comment,
    }
    const userComment = await Comment.create(data)
    if (userComment) {
      return res.status(201).json({
        comment: userComment,
      })
    }
  } catch (error) {
    console.log(error)
    res.status(401).json(error)
  }
}

// Get All Comments Function
const getAllComments = async (req, res) => {
  const usersComment = await Comment.findAll({
    include: { all: true },
  })

  const comments = usersComment.map((comment) => {
    return {
      id: comment.id,
      Userid: comment.UserId,
      Photoid: comment.PhotoId,
      comment: comment.comment,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      Photo: {
        id: comment.Photo.id,
        title: comment.Photo.title,
        caption: comment.Photo.caption,
        poster_image_url: comment.Photo.poster_image_url,
      },
      User: {
        id: comment.User.id,
        username: comment.User.username,
        profile_image_url: comment.User.profile_image_url,
        phone_number: comment.User.phone_number,
      },
    }
  })
  if (usersComment) {
    return res.status(200).json({
      comments: comments,
    })
  } else {
    return res.status(400).json({
      message: "Comment is empty!",
    })
  }
}

// Update Comment Function
const updateComment = async (req, res) => {
  const commentId = req.params.id
  try {
    const { comment } = req.body
    const userComment = await Comment.update(
      { comment: comment },
      {
        where: { id: commentId },
        returning: true,
      }
    )
    if (userComment) {
      return res.status(201).json({
        comment: userComment[1],
      })
    }
  } catch (error) {
    console.log(error)
    res.status(401).json(error)
  }
}

// Delete Comment Function
const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id
    const deletedUser = await Comment.destroy({
      where: {
        id: commentId,
      },
    })

    if (deletedUser) {
      return res.status(200).json({
        message: "Your comment has been successfully deleted",
      })
    }
  } catch (error) {
    console.log(error)
    res.status(401).json(error)
  }
}

module.exports = { createComment, getAllComments, updateComment, deleteComment }
