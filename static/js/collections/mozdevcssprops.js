define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/mozdevcssprop'
], function($, _, Backbone, MozDevCSSProp) {
  var MozDevCSSProps = Backbone.Collection.extend({
    model: MozDevCSSProp,

    comparator: function(model) {
      return model.get('title');
    },

  });

  return MozDevCSSProps;
});
