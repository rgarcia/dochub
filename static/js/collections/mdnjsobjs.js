define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/sectionscrape',
  'collections/cachedcollection'
], function($, _, Backbone, SectionScrape, CachedCollection) {

  var MDNJsObj = CachedCollection.extend({
    url: '/data/js-mdn.json',
    model: SectionScrape,

    comparator: function(model) {
      return model.get('title');
    },

  });

  return MDNJsObj;
});
