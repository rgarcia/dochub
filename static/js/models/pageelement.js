define([
  'jQuery',
  'Backbone'
], function($, Backbone) {

  var PageElement = Backbone.Model.extend({

    defaults: {
      'name'  : '',
      'domId' : '',
      'page'  : null,

      // Display properties
      'tocVisible'  : false,
    },

    initialize: function() {
      this.set({'lowerCaseName': this.get('name').toLowerCase()});
    },

  });

  return PageElement;
});

