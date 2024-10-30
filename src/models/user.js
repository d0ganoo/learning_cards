// models/user.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Le nom d’utilisateur est déjà pris.',
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Cet email est déjà associé à un compte.',
      },
      validate: {
        isEmail: {
          msg: 'L’email doit être valide.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Ajoutez des associations ici
  User.associate = (models) => {
    User.hasMany(models.Deck, { foreignKey: 'ownerId' });
    User.hasMany(models.Flashcard, { foreignKey: 'ownerId' });
  };

  return User;
};
