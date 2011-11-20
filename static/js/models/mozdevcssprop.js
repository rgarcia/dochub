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
      // need to put an underscore before it otherwise pushing to the URL bar
      // might trigger an anchor scroll
      this.set({'validHtmlId': '_' + this.get('title').replace(/[\W\s]/g, '_') });
    },

    url: function() {
      return this.urlRoot + '/' + this.get('name');
    },

  });

  return MozDevCSSProp;
});
