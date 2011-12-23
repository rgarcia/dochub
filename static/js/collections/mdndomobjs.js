define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/sectionscrape',
  'collections/cachedcollection'
], function($, _, Backbone, SectionScrape, CachedCollection) {

  var MDNDomObj = CachedCollection.extend({
    url: '/data/dom-mdn.json',
    model: SectionScrape,

    comparator: function(model) {
      var title = model.get('title');
      if (title[0] === title[0].toLowerCase()) {
        return '0' + title;
      } else {
        return '1' + title;
      }
    },
  });

  return MDNDomObj;
});
