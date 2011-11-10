define([
  'express',
  'mongoose',
  'controllers/loader',
  'module',
  'path',
  './config'
], function (express, mongoose, controllerLoader, module, path, config) {

  var app = null;

  return {
    initialize: function() {
      if ( app ) return;

      console.log('INITIALIZING APP');
      app = express.createServer();
      app.listen(config.app_port);

      app.configure(function() {
        var db = mongoose.connect(
          'mongodb://' + config.db_user_prod + ':' + config.db_pass_prod +
            '@' + config.db_host_prod + ':' + config.db_port_prod + '/' + config.db_name_prod,
          function(err) {
            if (err)
              throw err;
          });
        app.use(express.logger({ format: ':method :url :status' }));
        console.log('initializing static: ' + path.dirname(filename) + '/static');
        var filename = module.uri;
        app.use(express.static(path.dirname(filename) + '/static'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        controllerLoader.bootControllers(app);
        console.log('instacss version now running on port ' + config.app_port);
      });
    },

    getApp: function() {
      return app;
    },
  };
});
