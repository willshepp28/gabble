'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    like: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
    messageId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Like.belongsTo(models.Message, { foreignKey: 'messageId' });
      }
    }
  });
  return Like;
};