define([
  'jQuery',
  'Underscore',
  'Backbone'
], function($, _, Backbone) {

  var MozDevCSSProp = Backbone.Model.extend({

    idAttribute: '_id',

    urlRoot: '/mozdevcssprop',
    defaults: {
      'type'                 : '',
      'title'                : '',
      'htmlEscapedTitle'     : '', // Set in initialize
      'sectionNames'         : [],
      'sectionHTMLs'         : [],

      // display properties
      'tocVisible'           : false,
      'mainVisible'          : false,
    },

    initialize: function() {
      this.set({ htmlEscapedTitle: $('<div/>').html(this.get('title')).text() });
    },

    url: function() {
      return this.urlRoot + '/' + this.get('name');
    },

  });

  return MozDevCSSProp;
});

