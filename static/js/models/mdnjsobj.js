define([
  'jQuery',
  'Underscore',
  'Backbone'
], function($, _, Backbone) {

  var MDNJsObj = Backbone.Model.extend({

    idAttribute: '_id',

    urlRoot: '/mdnjsobj',
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
      this.set({ title: this.get('fullTitle') }, { silent: true }); // TODO: fix this hack
      this.set({ htmlEscapedTitle: $('<div/>').html(this.get('title')).text() }, { silent: true });
    },

    url: function() {
      return this.urlRoot + '/' + this.get('name');
    },

  });

  return MDNJsObj;
});

