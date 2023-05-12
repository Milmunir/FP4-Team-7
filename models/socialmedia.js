"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class SocialMedia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User)
    }
  }
  SocialMedia.init(
    {
      name: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: {
            args: true,
            msg: "Name is required",
          },
        },
      },
      social_media_url: {
        type: DataTypes.TEXT,
        validate: {
          isUrl: true,
          notEmpty: {
            args: true,
            msg: "Social Media Url is required",
          },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            args: true,
            msg: "UserId is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "SocialMedia",
    }
  )
  return SocialMedia
}
