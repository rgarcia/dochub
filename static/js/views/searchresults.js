define([
  'jQuery',
  'Underscore',
  'Backbone',
  'libs/spin/spin',
  'views/mozdevcssprop'
], function($, _, BackBone, Spinner, MozDevCSSPropView) {

  // the results view is just tied to a collection and re-renders itself
  var SearchResultsView = BackBone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render', 'renderAdditional', 'startSpinner');
      this.collection.bind('reset', this.render);
      this.collection.bind('add', this.renderAdditional);
    },

    startSpinner: function() {
      // Render the loading spinner
      if (this.options.spinner) {
        var opts = {
          lines  : 12,      // The number of lines to draw
          length : 30,      // The length of each line
          width  : 10,      // The line thickness
          radius : 31,      // The radius of the inner circle
          color  : '#000',  // #rgb or #rrggbb
          speed  : 0.7,     // Rounds per second
          trail  : 60,      // Afterglow percentage
          shadow : false    // Whether to render a shadow
        };
        this.spinner = new Spinner(opts).spin();
        $(this.spinner.el).css('margin-top',  $(window).height()/4);
        $(this.spinner.el).css('margin-left', $(window).width()/4);
        $(this.el).append(this.spinner.el);
      }
    },

    render: function() {
      console.log('db loaded, rendering models');
      // render a subview for each model in the collection
      var self = this;
      this.collection.each(function(model) {
        var view = new MozDevCSSPropView({
          model: model,
          template: self.options.itemTemplate,
          visibleField: self.options.visibleField
        });
        $(self.el).append(view.el);
      });

      return this;
    },

    renderAdditional: function(newModel) {
      // render a subview for each new model
      var view = new MozDevCSSPropView({
        model: newModel,
        template: this.options.itemTemplate,
        visibleField: this.options.visibleField
      });
      $(this.el).append(view.el);
      if (this.options.visibleOnCreate) {
        // newModel.set({ this.options.visibleField: true });
        newModel.set({ tocVisible: true });  // XXX: Testing hack
      }

      return this;
    },
  });

  return SearchResultsView;
});

