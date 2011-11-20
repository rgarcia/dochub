define([
  'jQuery',
  'Underscore',
  'Backbone'
], function($, _, Backbone) {

  var MozDevCSSProp = Backbone.Model.extend({

    idAttribute: '_id',

    urlRoot: '/mozdevcssprop',
    defaults: {
      'title'                : '',
      'sectionNames'         : [],
      'sectionHTMLs'         : [],

      // display properties
      'tocVisible'           : false,
      'mainVisible'          : false,
      'validHtmlId'          : ''  // title is not always a valid HTML id value
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
