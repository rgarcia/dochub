define([
  'jQuery',
  'Underscore',
  'Backbone'
], function($, _, Backbone) {

  var MDNHtmlElement = Backbone.Model.extend({

    idAttribute: '_id',

    urlRoot: '/mdnhtmlelement',
    defaults: {
      'title'                : '',
      'htmlEscapedTitle'     : '', // Set in initialize
      'sectionNames'         : [],
      'sectionHTMLs'         : [],

      // display properties
      'tocVisible'           : false,
      'mainVisible'          : false,
    },

    initialize: function() {
      var htmlEscapedTitle = $('<div/>').html(this.get('title')).text();
      this.set({
        htmlEscapedTitle: htmlEscapedTitle,
        lowerCaseTitle: htmlEscapedTitle.toLowerCase()
      }, {
        silent: true
      });
    },

    url: function() {
      return this.urlRoot + '/' + this.get('name');
    },

  });

  return MDNHtmlElement;
});

