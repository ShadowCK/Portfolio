const controllers = require('./controllers');

const router = (app) => {
  app.get('/', controllers.getHomepage);
};

module.exports = router;
