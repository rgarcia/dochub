define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/sectionscrape',
  'collections/cachedcollection'
], function($, _, Backbone, SectionScrape, CachedCollection) {

  var PhpExt = CachedCollection.extend({
    url: '/data/php-ext.json',
    model: SectionScrape,

    comparator: function(model) {
      return model.get('title').toLowerCase();
    },
  });

  return PhpExt;
});
