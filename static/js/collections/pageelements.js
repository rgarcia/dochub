define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/pageelement'
], function($, _, Backbone, PageElement) {

  var PageElements = Backbone.Collection.extend({
    model: PageElement,

    comparator: function(model) {
      return model.get('lowerCaseTitle');
    }
  });

  return PageElements;
});

