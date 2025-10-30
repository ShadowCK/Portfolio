// Read .env file and set environment variables for local development
import 'dotenv/config';

// Node.js modules and third-party
import { dirname, resolve as pathResolve } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import compression from 'compression';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import expressHandlebars from 'express-handlebars';
import helmet from 'helmet';
import router from './router.js';

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      imgSrc: ["'self'", 'data:', 'https://placehold.co', 'https://i.ytimg.com'], // Allow placeholder images and Youtube thumbnails
      frameSrc: [
        "'self'",
        'https://www.youtube.com',
        'https://www.youtube-nocookie.com',
        'https://www.google.com',
      ], // Allow embedded Youtube videos
      frameAncestors: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://cdn.jsdelivr.net',
        'https://cdnjs.cloudflare.com',
      ],
      fontSrc: ["'self'", 'data:', 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'],
    },
  }),
);
app.use('/assets', express.static(pathResolve(__dirname, '../hosted')));
app.use(favicon(pathResolve(__dirname, '../hosted/images/favicon.png')));
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
  // Server started
});
