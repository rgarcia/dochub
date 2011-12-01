define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/mdnjsobj'
], function($, _, Backbone, MDNJsObj) {

  var MDNJsObj = Backbone.Collection.extend({
    url: '/mdnjsobj',
    model: MDNJsObj,

    comparator: function(model) {
      return model.get('fullTitle');
    },
  });

  return MDNJsObj;
});

