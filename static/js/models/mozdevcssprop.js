define([
  'Underscore',
  'Backbone'
], function(_, Backbone) {

  var MozDevCSSProp = Backbone.Model.extend({

    idAttribute: '_id',

    urlRoot: '/mozdevcssprop',
    defaults: {
      'title'                : '',
      'sectionNames'         : [],
      'sectionHTMLs'         : [],

      // display properties
      'visible'              : false,
      'validHtmlId'          : ''  // title is not always a valid HTML id value
    },

    initialize: function() {
    },

    url: function() {
      return this.urlRoot + '/' + this.get('name');
    },

  });

  return MozDevCSSProp;
});
