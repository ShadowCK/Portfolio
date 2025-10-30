import { getHomepage } from './controllers/index.js';

const router = (app) => {
  app.get('/', getHomepage);
};

export default router;
