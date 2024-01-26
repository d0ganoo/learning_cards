// Exemple d'utilisation dans un script Node.js
const SequelizeFixtures = require('sequelize-fixtures');
const models = require('../models'); // Assure-toi que ce chemin est correct

const fixtures = require('./fixtures');

(async () => {
  try {
    await SequelizeFixtures.loadFixtures(fixtures, models)
    console.log('Fixtures insérées avec succès')
  } catch (error) {
    console.error("Erreur lors de l'insertion des fixtures :", error)
  }
})()
