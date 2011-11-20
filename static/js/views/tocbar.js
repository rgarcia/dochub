define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/toc.html',
], function($, _, BackBone, tocTemplate) {

  var TOCBar = BackBone.View.extend({
    id: 'toc',
    className: 'sidebar',

    events: {
      'click a' : 'onClick'
    },


    initialize: function() {
      _.bindAll(this, 'render');
      this.template = _.template(tocTemplate);
      this.render();
    },

    render: function() {
      console.log('rendering tocbar');
      $(this.el).html(this.template({}));
      return this;
    },

    onClick: function(e) {
      console.log('clicked', e);
      var modelid = $(e.currentTarget).attr('data-model-id');
      var searchResultsTopVal = $('#search-results').scrollTop();
      var topVal = $('#search-results [data-model-id="' + modelid + '"]').offset().top;
      $('#search-results').animate({
        scrollTop: searchResultsTopVal + topVal - 60
      }, 'slow');
    }

  });

  return TOCBar;
});
