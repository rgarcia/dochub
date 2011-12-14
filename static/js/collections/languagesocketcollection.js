define([
  'Underscore',
  'models/sectionscrape',
  'collections/socketcollection',
  'libs/util/util',
], function(_, SectionScrapeModel, SocketCollection, Utils) {

  var LanguageSocketCollection = SocketCollection.extend({

    model: SectionScrapeModel,

    initialize: function(models, languageName) {
      _.bindAll(this, 'onConnect', 'onServerReady', 'onAddItem', 'onError', 'onDisconnect');
      this.guid = Utils.guid();
      this.socket = null;
      
      this.languageName = languageName;
    },

    onServerReady: function() {
      console.log('LanguageSocketCollection.onServerReady asking for ' + this.languageName);
      this.socket.emit('getLanguage', this.languageName);
    },

  });

  return LanguageSocketCollection;
});

