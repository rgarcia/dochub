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
      if (this.options.type === 'toc') {
        this.model.bind("change:tocVisible", function(model) {
          if (model.get("tocVisible")) // todo does this get passed in the callback?
            $(self.el).show();
          else
            $(self.el).hide();
        });
      } else if (this.options.type === 'main') {
        this.model.bind("change:mainVisible", function(model) {
          if (model.get("mainVisible")) // todo does this get passed in the callback?
            $(self.el).show();
          else
            $(self.el).hide();
        });
      } else {
        throw 'Type option value: ' + this.options.type + ' must be "toc" or "main".';
      }
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
