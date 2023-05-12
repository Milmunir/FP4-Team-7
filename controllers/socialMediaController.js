const { SocialMedia, User } = require("../models")

class socialMediaController {
  static createsocialmedia(req, res) {
    const { name, social_media_url } = req.body
    const UserId = res.locals.user.id
    console.log(res.locals.user)

    SocialMedia.create({
      name,
      social_media_url,
      UserId,
    })
      .then((result) => {
        res.status(201).json({ social_media: result })
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json(error)
      })
  }

  static readsocialmedia(req, res) {
    SocialMedia.findAll({ include: User })
      .then((result) => {
        const socialMedias = result.map((socmed) => {
          return {
            id: socmed.id,
            name: socmed.name,
            social_media_url: socmed.social_media_url,
            UserId: socmed.UserId,
            createdAt: socmed.createdAt,
            updatedAt: socmed.updatedAt,
            User: {
              id: socmed.User.id,
              username: socmed.User.username,
              profile_image_url: socmed.User.profile_image_url,
            },
          }
        })
        if (socialMedias) {
          return res.status(200).json({
            social_medias: socialMedias,
          })
        }
      })
      .catch((error) => {
        res.status(500).json(error)
      })
  }
  static updatesocialmedia(req, res) {
    const { name, social_media_url } = req.body
    const socmedId = req.params.id

    let data = { name, social_media_url }
    SocialMedia.update(data, {
      where: {
        id: socmedId,
      },
      returning: true,
    })
      .then((result) => {
        if (result[0] == 1) {
          res.status(200).json({
            social_media: result[1],
          })
        } else {
          return res.status(500).json({
            message: "Update Error",
          })
        }
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json(error)
      })
  }
  static deletesocialmedia(req, res) {
    let socialMediaId = req.params.id

    SocialMedia.destroy({
      where: {
        id: socialMediaId,
      },
    })
      .then((result) => {
        if (result) {
          return res.status(200).json({
            message: "Your social media has been successfully deleted",
          })
        } else {
          return res.status(401).json({
            message: `Social Media with id ${socialMediaId} does not exist`,
          })
        }
      })
      .catch((error) => {
        console.log(err)
        return res.status(500).json(error)
      })
  }
}

module.exports = socialMediaController
