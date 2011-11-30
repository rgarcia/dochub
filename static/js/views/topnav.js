define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/topnav.html'
], function($, _, BackBone, topNavTemplate) {

  var TopNavView = BackBone.View.extend({
    events: {
      'click #nav-list > li > a': 'changeLanguage'
    },

    initialize: function() {
      _.bindAll(this, 'render', 'changeLanguage');
      this.template = _.template(topNavTemplate);
    },

    changeLanguage: function(evt) {
      var elt = this.$('#' + evt.target.id);
      this.$('#nav-list > .active').removeClass('active');
      elt.parent().addClass('active');  // Add 'active' to <li>, not <a>

      var newLanguage = elt.attr('data-lang');
      this.trigger('changeLanguage', newLanguage);
    },

    render: function() {
      $(this.el).html(this.template({}));
      return this;
    },
  });

  return TopNavView;
});
