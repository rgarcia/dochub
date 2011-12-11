define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/sectionscrape'
], function($, _, Backbone, SectionScrape) {

  // Handle the following cases:
  //  -xyz
  //  ::-xyz
  //  ::xyz
  //  :xyz
  //  @xyz
  //  <xyz>
  var cssPropsPattern = new RegExp("^(\\W*)(.+)$");

  var MozDevCSSProps = Backbone.Collection.extend({
    url: '/data/css-mdn.json',
    model: SectionScrape,

    comparator: function(model) {
      var title = model.get('title');
      var results = cssPropsPattern.exec(title);
      var prefix = results[1];
      var name   = results[2].toLowerCase();

      return prefix ? ('1' + title) : ('0' + name);
    },

  });

  return MozDevCSSProps;
});
