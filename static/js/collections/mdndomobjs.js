define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/mdndomobj'
], function($, _, Backbone, MDNDomObj) {

  var MDNDomObj = Backbone.Collection.extend({
    url: '/mdndomobj',
    model: MDNDomObj,

    comparator: function(model) {
      return model.get('fullTitle');
    },
  });

  return MDNDomObj;
});

