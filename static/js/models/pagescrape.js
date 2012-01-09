define([
  'jQuery',
  'Backbone'
], function($, Backbone) {

  var PageScrape = Backbone.Model.extend({

    defaults: {
      'url'             : '',
      'title'           : '',
      'html'            : '',
      // TODO: override fetch to parse searchableItems into PageElements collection
      //       of PageElement models
      'searchableItems' : [], // [ { 'name': ..., 'domId' : ... }, ... ]

      // Display properties
      'mainVisible'     : false,
    },

  });

  return PageScrape;
});

