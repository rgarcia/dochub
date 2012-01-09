define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/pagescrape'
], function($, _, Backbone, PageScrape) {

  var PageScrapes = Backbone.Collection.extend({
    model: PageScrape
  });

  return PageScrapes;
});

