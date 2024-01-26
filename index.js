const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const sequelize = require('./src/db/sequelize')
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT_API


// Middlewares
app
  .use(morgan('dev'))
  .use(bodyParser.json())
  .use(cors({origin: process.env.URL_ORIGIN}))
  .use(express.json());

sequelize.initDb();

// Routes
require('./src/routes/flashcards')(app)
require('./src/routes/decks')(app)
require('./src/routes/users')(app)
require('./src/routes/login')(app)

// On gère les routes 404.
app.use(({res}) => {
  const message = 'Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.'
	res.status(404).json({message});
});

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))
