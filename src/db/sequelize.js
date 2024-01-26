const { Sequelize, DataTypes } = require('sequelize')
const FlashcardModel = require('../models/flashcard')
const bcrypt = require('bcrypt')
// const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/user')
// const pokemons = require('./mock-pokemon')

let sequelize

// if(process.env.NODE_ENV === 'production') {
//   sequelize = new Sequelize('kk8u5y871hfoaw9y', 't09tvm6qofrtvc7h', 'ryujse9ftf40wpqn', {
//     host: 'klbcedmmqp7w17ik.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
//     dialect: 'mariadb',
//     dialectOptions: {
//       timezone: 'Etc/GMT-2',
//     },
//     logging: true
//   })
// } else {
   sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    database: 'flashcards_db',
  });
  
// }
const User = UserModel(sequelize, DataTypes)
const Flashcard = FlashcardModel(sequelize)

const initDb = () => {
  return sequelize.sync().then(_ => {
    // User.destroy({
    //   where: {},
    //   truncate: true
    // })

    // bcrypt.hash('tata', 10)
    // .then(hash => User.create({ username: 'pikachu', password: hash }))
    // .then(user => console.log("user.toJSON()"))

    console.log('La base de donnée a bien été initialisée !')
  })
}

module.exports = { 
  initDb, User, Flashcard
}