define([
  'Underscore',
  'Backbone',
  'SocketIO',
  'libs/util/util',
], function(_, Backbone, SocketIO, Utils) {

  var SocketCollection = Backbone.Collection.extend({

    initialize: function() {
      _.bindAll(this, 'onConnect', 'onServerReady', 'onAddItem', 'onError', 'onDisconnect');
      this.guid = Utils.guid();
      this.socket = null;
    },

    onConnect: function() {
      console.log('Sending guid to server: ' + this.guid);
      this.socket.emit('guid', this.guid);
    },

    // Dervied classes must implement to ask server for data.
    onServerReady: function() {
      throw "Unimplemented pure virtual function: SocketCollection.onServerReady";
    },

    // By default, add item to collection
    onAddItem: function(item) {
      this.add(item);
    },

    // By default, log and do nothing
    onError: function(err) {
      console.log('Socket error: ' + err);
    },

    // By default, disconnect and set socket to null.
    onDisconnect: function() {
      console.log('Disconnecting');
      this.socket.disconnect();
      this.socket = null;
    },

    // Overwrite sync for 'read' calls to set up socket.io. 
    sync: function(method, model, options) {
      if ('read' !== method) {
        // Make the HTTP request that will use this socket.
        return Backbone.sync(method, model, options);
      }

      //  - If we're not adding, first empty this collection
      //  - Create a socket
      //  - When it's ready, ask the socket for data.
      //  - On each new model, call this.add
      //
      //  XXX: Assumes we get all the models in the correct sorted order we want for display!
      if (_.isUndefined(options.add)) {
        this.reset();
      }

      this.socket = io.connect(null, { 'force new connection': true });
      this.socket.on('connect',     this.onConnect);
      this.socket.on('serverReady', this.onServerReady);  // Derived classes must implement
      this.socket.on('addItem',     this.onAddItem);
      this.socket.on('error',       this.onError);
      this.socket.on('disconnect',  this.onDisconnect);

      return null;
    },

  });

  return SocketCollection;
});

