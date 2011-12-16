define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/sectionscrape'
], function($, _, Backbone, SectionScrape) {

  var PhpExt = Backbone.Collection.extend({
    url: '/data/php-ext.json',
    model: SectionScrape,

    comparator: function(model) {
      return model.get('title').toLowerCase();
    },
  });

  return PhpExt;
});
