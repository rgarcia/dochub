define([
  'jQuery',
  'Underscore',
  'Backbone'
], function($, _, Backbone) {

  var CachedCollection = Backbone.Collection.extend({

    fetchFromCache: function(name) {
      if (typeof(localStorage) === 'undefined')
        return false;

      var cachedJSON = localStorage.getItem(name);
      if (!cachedJSON)
        return false;

      console.log('loading cached json for ' + name);
      this.reset(JSON.parse(cachedJSON));
      return true;
    },

    saveToCache: function(name) {
      if (typeof(localStorage) === 'undefined')
        return false;
      localStorage.removeItem(name);
      localStorage.setItem(name, JSON.stringify(this.toJSON()));
      return true;
    }

  });

  return CachedCollection;
});
