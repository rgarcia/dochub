define([
  'jQuery',
  'Underscore',
  'Backbone'
], function($, _, Backbone) {

  var SectionScrape = Backbone.Model.extend({

    idAttribute: '_id',

    defaults: {
      'title'                : '',
      'htmlEscapedTitle'     : '', // Set in initialize
      'url'                  : '',
      'sectionNames'         : [],
      'sectionHTMLs'         : [],
      'lowerCaseTitle'       : '', // queries and fragments; set in initialize

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

  });

  return SectionScrape;
});
