define([], function() {
  return {
    app_port:     global.process.env.PORT || 5000,
    environment: global.process.env.NODE_ENV || 'development',

    db_host_prod: 'dbh74.mongolab.com',
    db_name_prod: 'heroku_app1740150',
    db_user_prod: 'scraper',
    db_pass_prod: 'scrapeit',
    db_port_prod: '27747'
  };
});
