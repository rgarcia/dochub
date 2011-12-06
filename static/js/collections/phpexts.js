define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/phpext'
], function($, _, Backbone, PhpExt) {

  var PhpExt = Backbone.Collection.extend({
    url: '/phpext',
    model: PhpExt,

    comparator: function(model) {
      return model.get('fullTitle').toLowerCase();
    },
  });

  return PhpExt;
});

