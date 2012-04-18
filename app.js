define([
  'express',
  'module',
  'path',
  './config',
  'fs'
], function (express, module, path, config, fs) {

  var app = null;

  console.log(global.process.env);

  // can't serve cache manifest w/ express static since it doesn't set the header
  // correctly. so we'll load the file once, keep it in memory, serve it up manually
  var filename = module.uri;
  var manifestFilename = 'dochub.appcache';
  var manifest = null;
  fs.readFile(path.dirname(filename) + '/static/' + manifestFilename, function(err,buf) {
    if(err)
      throw(err);
    manifest = {
      headers:{
        'Content-Type'  : 'text/cache-manifest',
        'Content-Length': buf.length,
        // 'Cache-Control' : 'public, max-age=' + 60*60 // do we need this caching?
      },
      body: buf
    };
  });

  return {
    initialize: function() {
      if ( app ) return;

      console.log('INITIALIZING APP');
      app = express.createServer();
      app.listen(config.app_port);

      app.configure(function() {
        app.use(express.logger({ format: ':method :url :status' }));
        app.use(function(req, res, next) {
          // overrides for coda
          var coda_overrides = {
            '/': '/coda/',
            '/css/bootstrap-responsive.css': '/coda/css/bootstrap-responsive.css',
            '/css/bootstrap-responsive.min.css': '/coda/css/bootstrap-responsive.min.css',
            '/css/bootstrap.css': '/coda/css/bootstrap.css',
            '/css/bootstrap.min.css': '/coda/css/bootstrap.min.css',
            '/js/views/fullwindow.js': '/coda/js/views/fullwindow.js',
            '/templates/toc.html': '/coda/templates/toc.html'
          };
          if (coda_overrides[req.url] && /Coda/.test(req.headers['user-agent'])) {
            req.url = coda_overrides[req.url];
          }
          next();
        });
        // preempt static to serve up cache manifest
        app.get("/" + manifestFilename, function(req, res){
          res.writeHead(200,manifest.headers);
          res.end(manifest.body);
        });
        var staticDir = path.dirname(filename) + '/static';
        console.log('initializing static: ' + staticDir);
        app.use(express.static(staticDir));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        console.log('dochub now running on port ' + config.app_port);
      });
    },

  };
});
