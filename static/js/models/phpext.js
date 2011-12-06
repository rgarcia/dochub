define([
  'jQuery',
  'Underscore',
  'Backbone'
], function($, _, Backbone) {

  var PHPExtension = Backbone.Model.extend({

    idAttribute: '_id',

    urlRoot: '/phpext',
    defaults: {
      'title'                : '',
      'fullTitle'            : '',
      'htmlEscapedTitle'     : '', // Set in initialize
      'sectionNames'         : [],
      'sectionHTMLs'         : [],

      // display properties
      'tocVisible'           : false,
      'mainVisible'          : false,
    },

    initialize: function() {
      this.set({ htmlEscapedTitle: $('<div/>').html(this.get('title')).text() }, { silent: true });
    },

    url: function() {
      return this.urlRoot + '/' + this.get('name');
    },

  });

  return PHPExtension;
});

