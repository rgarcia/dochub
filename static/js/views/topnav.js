define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/topnav.html'
], function($, _, BackBone, topNavTemplate) {

  var TopNavView = BackBone.View.extend({
    events: {
      'click #nav-list > li > a'      : 'changeActive',
      'click #secondary-nav > li > a' : 'changeActive'
    },

    initialize: function() {
      _.bindAll(this, 'render', 'changeActive', 'setActiveElement');
      this.template = _.template(topNavTemplate);
    },

    changeActive: function(evt) {
      if (evt.target.id === 'twitter-link') {
        return;
      }

      this.setActiveElement(evt.target.id);
    },

    setActiveElement: function(elementName) {
      var elt = this.$('#' + elementName);
      this.$('#nav-list > .active').removeClass('active');
      this.$('#secondary-nav > .active').removeClass('active');
      elt.parent().addClass('active');  // Add 'active' to <li>, not <a>

      var newLanguage = elt.attr('data-lang');
      if (newLanguage) {
        this.trigger('changeLanguage', newLanguage);
      }
    },

    render: function() {
      $(this.el).html(this.template({}));
      return this;
    },
  });

  return TopNavView;
});
