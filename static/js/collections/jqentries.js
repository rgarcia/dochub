define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/jqentry'
], function($, _, Backbone, JQEntry) {

  var jqEntryPattern = new RegExp("^(\\W*)(.+)$");

  var JQEntry = Backbone.Collection.extend({
    url: '/jqentry',
    model: JQEntry,


    comparator: function(model) {
      var title = model.get('fullTitle');
      var results = jqEntryPattern.exec(title);
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

  return JQEntry;
});

