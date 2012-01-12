define([
  'jQuery',
  'Underscore',
  'Backbone',
  'collections/pagescrapes'
], function($, _, Backbone, PageScrapes) {

  var PythonPages = PageScrapes.extend({
    url: '/data/python.json'
  });

  return PythonPages;
});

