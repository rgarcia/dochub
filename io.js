define([
  'fs',
  'socket.io',
], function(fs, socketio) {

  // Load languages into memory.
  console.log('[Loading language data into memory.]');
  var processJsonData = function(rawStr) {
    return JSON.parse(rawStr);

    /*
    var jsonObj = JSON.parse(rawStr);
    var stringified = [];
    for (var i = 0; i < jsonObj.length; ++i) {
      stringified.push(JSON.stringify(jsonObj[i]));
    }
    return stringified;
    */
  }
  var languageData = {
    'css'        : processJsonData(fs.readFileSync('static/data/css-mdn.json',  'ascii')),
    'html'       : processJsonData(fs.readFileSync('static/data/html-mdn.json', 'ascii')),
    'javascript' : processJsonData(fs.readFileSync('static/data/js-mdn.json',   'ascii')),
    'dom'        : processJsonData(fs.readFileSync('static/data/dom-mdn.json',  'ascii')),
    'jquery'     : processJsonData(fs.readFileSync('static/data/jquery.json',   'ascii')),
  };
  console.log('[Done loading language data into memory.]');

  var io = null;

  return {
    initialize: function(app) {

      console.log('[INITIALIZING IO.]');
      io = socketio.listen(app);

      // In order for socketio to work on heroku we need to long poll :(
      io.configure(function () {
        io.set("transports", ["xhr-polling"]);
        io.set("polling duration", 10);
      });

      io.sockets.on('connection', function(socket) {

        // Client sends unique id and asks for language.
        // We put each request in its own "room" so we can send messages to it specifically
        socket.on('guid', function(guid) {
          socket.join(guid);
          socket.set('guid', guid);
          console.log('[Client connected, setting guid = ' + guid + '.]');
          socket.get('guid', function(err, theGuid) {
            if (err) {
              console.log('Error getting guid: ' + guid);
              return;
            }
            console.log('Successfully got guid: ' + theGuid);
            console.log('Sending serverReady over the socket.');
            socket.emit('serverReady');
          });
        });

        socket.on('getLanguage', function(languageName) {
          var data = languageData[languageName];
          for (var i = 0; i < data.length; ++i) {
            socket.emit('addItem', data[i]);
          }
          socket.emit('disconnect');
        });

        socket.on('disconnect', function(msg) {
          socket.get('guid', function(err, guid) {
            if (err) {
              console.log('Error getting guid: ' + guid);
              return;
            }
            console.log('[Connection id ' + guid + ' disconnected.]');
            socket.leave(guid);
          });
        });

      }); // END io.sockets.on('connection' ...);
    },  // END initialize

    getIO: function() {
      return io;
    },

  };  // end return
});

