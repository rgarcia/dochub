define([
  'jQuery',
  'Underscore',
  'Backbone',
  'models/mozdevcssprop'
], function($, _, Backbone, MozDevCSSProp) {
    var MozDevCSSProps = Backbone.Collection.extend({
        model: MozDevCSSProp
    });

    return MozDevCSSProps;
});
