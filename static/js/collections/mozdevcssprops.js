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
  //  TODO: <xyz>
  var cssPropsPattern = new RegExp("^([-:@]*)(.+)$");

  var MozDevCSSProps = Backbone.Collection.extend({
    model: MozDevCSSProp,

  comparator: function(model) {
    var title = model.get('title');
    var results = cssPropsPattern.exec(title);
    var prefix = results[1];
    var name   = results[2].toLowerCase();

    return prefix ? ('1' + title) : ('0' + name);
  },

  });

  return MozDevCSSProps;
});
