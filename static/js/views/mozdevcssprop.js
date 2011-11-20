define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/mozdevcssprop.html',
], function($, _, BackBone, mozDevCSSPropTemplate) {

  var MozDevCSSPropView = BackBone.View.extend({
    initialize: function() {
      _.bindAll(this,'render');
      this.template = _.template(mozDevCSSPropTemplate);
      var self = this;
      this.model.bind("change:visible", function(model) {
        if (model.get("visible"))
          $(self.el).show();
        else
          $(self.el).hide();
      });
    },

    render: function() {
      var obj = {
        _ : _,
        model : this.model,
      }
      $(this.el).html(this.template(obj));
      $(this.el).hide();
      return this;
    },
  });

  return MozDevCSSPropView;
});
