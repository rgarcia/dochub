define([
  'jQuery',
  'Underscore',
  'Backbone',
], function($, _, Backbone) {

  var MozDevCSSPropView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this,'render');
      this.template = _.template(this.options.template);
      var self = this;

      this.model.bind("change:" + this.options.visibleField, function(model) {
        if (model.get(self.options.visibleField)) {
          $(self.el).show();
        } else {
          $(self.el).hide();
        }
      });

      this.render();
    },

    render: function() {
      var obj = {
        _ : _,
        model : this.model,
      }
      $(this.el).html(this.template(obj));
      $(this.el).hide(); // by default need to have everything hidden, only search unhides
      return this;
    },
  });

  return MozDevCSSPropView;
});
