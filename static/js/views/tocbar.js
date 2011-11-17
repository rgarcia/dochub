define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/toc.html',
], function($, _, BackBone, tocTemplate) {

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
      var obj = {
        cssprops: this.collection
      }
      $(this.el).html(this.template(obj));

      return this;
    },
  });

  return TOCBar;
});

