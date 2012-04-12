define([
  'jQuery',
  'Backbone'
], function($, Backbone) {

  var PageElement = Backbone.Model.extend({

    defaults: {
      'name'  : '',
      'domId' : '',
      'page'  : null,

      'lowerCaseTitle' : '', // queries and fragments; set in initialize

      // Display properties
      'tocVisible'  : false,
    },

    initialize: function() {
      this.set({'lowerCaseTitle': this.get('name').toLowerCase()});
    },

  });

  return PageElement;
});

