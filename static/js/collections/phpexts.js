define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/SectionScrape'
], function($, _, Backbone, SectionScrape) {

  var PhpExt = Backbone.Collection.extend({
    url: '/data/php.json',
    model: SectionScrape,

    comparator: function(model) {
      return model.get('title').toLowerCase();
    },
  });

  return PhpExt;
});
