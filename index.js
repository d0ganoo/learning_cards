const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');

const flashcardsRoutes = require('./routes/flashcards');
const decksRoutes = require('./routes/decks');
const usersRoutes = require('./routes/decks');

const app = express();

// Configuration Sequelize
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: '',
  database: 'flashcards_db',
});

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/flashcards', flashcardsRoutes(sequelize));
app.use('/decks', decksRoutes(sequelize));
app.use('/users', usersRoutes(sequelize));

// Port d'écoute
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
