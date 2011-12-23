define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/sectionscrape',
  'collections/cachedcollection'
], function($, _, Backbone, SectionScrape, CachedCollection) {

  // Handle the following cases:
  //  -xyz
  //  ::-xyz
  //  ::xyz
  //  :xyz
  //  @xyz
  //  <xyz>
  var cssPropsPattern = new RegExp("^(\\W*)(.+)$");

  var MozDevCSSProps = CachedCollection.extend({
    url: '/data/css-mdn.json',
    model: SectionScrape,

    comparator: function(model) {
      var title = model.get('title');
      var results = cssPropsPattern.exec(title);
      var prefix = results[1];
      var name   = results[2];

      if (prefix) {
        return '2' + title;
      } else if (name[0] === name[0].toLowerCase()) {
        return '0' + name;
      } else {
        return '1' + name;
      }
    },

  });

  return MozDevCSSProps;
});
