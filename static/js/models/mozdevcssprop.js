define([
  'Underscore',
  'Backbone'
], function(_, Backbone) {

  var MozDevCSSProp = Backbone.Model.extend({

    idAttribute: '_id',

    urlRoot: '/mozdevcssprop',
    defaults: {
      'visible'              : false,
      'title'                : '',
      'validHtmlId'          : '',  // title is not always a valid HTML id value
      'summary'              : null,
      'syntax'               : null,
      'values'               : null,
      'relatedProperties'    : null,
      'examples'             : null,
      'notes'                : null,
      'specifications'       : null,
      'browserCompatability' : null,
    },

    initialize: function() {
      this.set({'validHtmlId': this.get('title').replace(/[\W\s]/g, '_') });
    },

    url: function() {
      return this.urlRoot + '/' + this.get('name');
    },

  });

  return MozDevCSSProp;
});
