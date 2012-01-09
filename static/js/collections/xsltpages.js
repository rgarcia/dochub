define([
  'jQuery',
  'Underscore',
  'Backbone',
  'collections/pagescrapes'
], function($, _, Backbone, PageScrapes) {

  var XsltElements = PageScrapes.extend({
    url: '/data/xslt-w3.json'
  });

  return XsltElements;
});

