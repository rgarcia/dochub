define([
  'jQuery',
  'Underscore',
  'Backbone',
  'views/tocresult',
  'text!templates/toc.html',
], function($, _, BackBone, TOCResult, tocTemplate) {

  // the contents view view is just tied to a collection and re-renders itself
  var TOCBar = BackBone.View.extend({
    id: 'toc',
    className: 'sidebar',

    initialize: function() {
      _.bindAll(this, 'render');
      this.collection.bind('reset', this.render);
      this.template = _.template(tocTemplate);
    },

    render: function() {
      $(this.el).html(this.template({}));

      var tocResultsUl = $('toc-results');
      var self = this;
      this.collection.each(function(cssprop) {
        var view = new TOCResult({ model: cssprop });
        tocResultsUl.append(view.render().el);
      });

      return this;
    },
  });

  return TOCBar;
});

