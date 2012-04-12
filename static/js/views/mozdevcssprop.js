define([
  'jQuery',
  'Underscore',
  'Backbone',
], function($, _, Backbone) {

  var MozDevCSSPropView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render');
      this.template = _.template(this.options.template);
      var self = this;
      var $selfEl = $(self.el);

      this.model.bind("change:" + this.options.visibleField, function(model) {
        if (model.get(self.options.visibleField)) {
          $selfEl.css('display', 'block');
        } else {
          $selfEl.css('display', 'none');
        }
      });

      this.render();
    },

    render: function() {
      var $thisEl = $(this.el);

      // A LOT faster to set css display: none BEFORE setting the HTML.
      $thisEl.css('display', 'none'); // Default hidden, only search makes things visible
      var href = '#' + this.options.languageName.toLowerCase() + '/' + this.model.get('lowerCaseTitle');
      $thisEl.html(this.template({
        _ : _,
        model : this.model,
        href: href
      }));
      return this;
    },
  });

  return MozDevCSSPropView;
});

