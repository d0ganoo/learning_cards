const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const sequelize = require('./db/sequelize')
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000


// Middlewares
app
  .use(morgan('dev'))
  .use(bodyParser.json())
  .use(cors())
  .use(express.json());

sequelize.initDb();

// Routes
require('./routes/flashcards')(app)
require('./routes/decks')(app)
require('./routes/users')(app)
require('./routes/login')(app)

// On gère les routes 404.
app.use(({res}) => {
  const message = 'Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.'
	res.status(404).json({message});
});

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))
