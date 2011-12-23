define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/sectionscrape',
  'collections/cachedcollection'
], function($, _, Backbone, SectionScrape, CachedCollection) {

  // Handle the following cases:
  //  <xyz>
  var htmlElementPattern = new RegExp("^(\\W*)(.+)$");

  var MDNHtmlElemnts = CachedCollection.extend({
    url: '/data/html-mdn.json',
    model: SectionScrape,

  comparator: function(model) {
    var title = model.get('title');
    var results = htmlElementPattern.exec(title);
    var prefix = results[1];
    var name   = results[2].toLowerCase();

    return prefix ? ('1' + title) : ('0' + name);
  },

  });

  return MDNHtmlElemnts;
});
