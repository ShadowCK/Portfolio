// Read .env file and set environment variables for local development
require('dotenv').config();

// Require modules
// Node.js path module
const path = require('path');
// Express web framework
const express = require('express');
// Compression middleware
const compression = require('compression');
// Favicon middleware
const favicon = require('serve-favicon');
// Body parsing middleware
const bodyParser = require('body-parser');
// Handlebars view engine
const expressHandlebars = require('express-handlebars');
// Helmet security middleware
const helmet = require('helmet');
// Router
const router = require('./router.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      imgSrc: ["'self'", 'data:', 'https://placehold.co'], // Allow images from https://placehold.co
    },
  }),
);
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/images/favicon.png`));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
