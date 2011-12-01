define([], function() {

  return {
    host_dev: 'localhost',
    host_prod: 'instacss.herokuapp.com',
    host_staging: 'instacss-staging.herokuapp.com',

    app_port:     global.process.env.PORT || 5000,
    environment:  global.process.env.NODE_ENV || 'development',

    // MONGOLAB_URI is provided by heroku mongolab add-on
    mongo_uri: global.process.env.MONGOLAB_URI || 'mongodb://127.0.0.1/instacss',

  };
});

