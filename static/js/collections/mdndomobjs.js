define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/sectionscrape'
], function($, _, Backbone, SectionScrape) {

  var MDNDomObj = Backbone.Collection.extend({
    url: '/data/dom-mdn.json',
    model: SectionScrape,

    comparator: function(model) {
      return model.get('title');
    },
  });

  return MDNDomObj;
});
