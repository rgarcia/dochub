define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/mozdevcssprop'
], function($, _, Backbone, MozDevCSSProp) {

  // Handle the following cases:
  //  -xyz
  //  ::-xyz
  //  ::xyz
  //  :xyz
  //  @xyz
  //  <xyz>
  var cssPropsPattern = new RegExp("^(\\W*)(.+)$");

  var MozDevCSSProps = Backbone.Collection.extend({
    url: '/mozdevcssprop',
    model: MozDevCSSProp,

  comparator: function(model) {
    var title = model.get('title');
    var results = cssPropsPattern.exec(title);
    var prefix = results[1];
    var name   = results[2].toLowerCase();

    var extractedSorting = prefix ? ('1' + title) : ('0' + name);
    return model.get('type') + extractedSorting;  // Sort 'css' before 'html'
  },

  });

  return MozDevCSSProps;
});
