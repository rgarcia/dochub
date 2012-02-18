define([], function() {

  return {
    host_dev: 'localhost',
    host_prod: 'instacss.herokuapp.com',
    host_staging: 'instacss-staging.herokuapp.com',

    app_port:     global.process.env.PORT || 5000,
    environment:  global.process.env.NODE_ENV || 'development',

  };
});
