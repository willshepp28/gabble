'use strict';
module.exports = function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
    message: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    dateCreated: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
         Message.belongsTo(models.User, { foreignKey: 'userId' });
        Message.hasMany(models.Like, { foreignKey: 'messageId'});
      }
    }
  });
  return Message;
};