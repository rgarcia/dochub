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
    },

    url: function() {
      return this.urlRoot + '/' + this.get('name');
    },

  });

  return MozDevCSSProp;
});
