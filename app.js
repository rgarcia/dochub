define([
  'express',
  'mongoose',
  'controllers/loader',
  'module',
  'path',
  './config'
], function (express, mongoose, controllerLoader, module, path, config) {

  var app = null;

  console.log(global.process.env);

  return {
    initialize: function() {
      if ( app ) return;

      console.log('INITIALIZING APP');
      app = express.createServer();
      app.listen(config.app_port);

      app.configure(function() {
        var db = mongoose.connect(config.mongo_uri, function(err) {
          if (err)
            throw err;
          else
            console.log('connected to ' + config.mongo_uri);
        });
        app.use(express.logger({ format: ':method :url :status' }));
        var filename = module.uri;
        var staticDir = path.dirname(filename) + '/static';
        console.log('initializing static: ' + staticDir);
        app.use(express.static(staticDir));
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
