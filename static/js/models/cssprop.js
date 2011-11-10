define([
  'Underscore',
  'Backbone'
], function(_, Backbone) {

  var CSSProp = Backbone.Model.extend({

    // This is the 'id' attribute from the backend.
    idAttribute: '_id',

    urlRoot: '/cssprop',
    defaults: {
      'name'              : '',
      'description'       : '',
      'possibleValues'    : '',
      'example'           : '',
      'relatedProperties' : ''
    },

    initialize: function() {
    },

    url: function() {
      return this.urlRoot + '/' + this.get('name');
    },

  });

  return CSSProp;
});
