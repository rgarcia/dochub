define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/mdnhtmlelement'
], function($, _, Backbone, MDNHtmlElement) {

  // Handle the following cases:
  //  <xyz>
  var htmlElementPattern = new RegExp("^(\\W*)(.+)$");

  var MDNHtmlElemnts = Backbone.Collection.extend({
    url: '/mdnhtmlelement',
    model: MDNHtmlElement,

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
