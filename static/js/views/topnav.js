define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/topnav.html'
], function($, _, BackBone, topNavTemplate) {

  var TopNavView = BackBone.View.extend({
    className: 'topbar-inner',

    initialize: function() {
      _.bindAll(this, 'render');
      this.template = _.template(topNavTemplate);
      this.render();
    },

    render: function() {
      $(this.el).html(this.template({}));
      return this;
    },
  });

  return TopNavView;
});
