"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("Comments", {
      fields: ["UserId"],
      type: "foreign key",
      name: "user_comments_fk",
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
      await queryInterface.addConstraint("Comments", {
        fields: ["PhotoId"],
        type: "foreign key",
        name: "photo_comments_fk",
        references: {
          table: "Photos",
          field: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Comments", "photo_comments_fk")
    await queryInterface.removeConstraint("Comments", "user_comments_fk")
  },
}
