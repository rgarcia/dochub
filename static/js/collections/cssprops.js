define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/cssprop'
], function($, _, Backbone, CSSProp) {
    var CSSProps = Backbone.Collection.extend({
        model: CSSProp
    });

    return CSSProps;
});
