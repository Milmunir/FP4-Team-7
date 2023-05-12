"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("SocialMedia", {
      fields: ["UserId"],
      type: "foreign key",
      name: "user_socialmedia_fk",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("SocialMedia", "user_socialmedia_fk")
  },
}
