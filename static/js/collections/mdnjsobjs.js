define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/sectionscrape'
], function($, _, Backbone, SectionScrape) {

  var MDNJsObj = Backbone.Collection.extend({
    url: '/data/js-mdn.json',
    model: SectionScrape,

    comparator: function(model) {
      return model.get('title');
    },

  });

  return MDNJsObj;
});
