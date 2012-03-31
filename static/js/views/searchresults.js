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
      _.bindAll(this, 'render', 'startSpinner');
      this.collection.on('reset', this.render);
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
        var halfHeight = opts.radius + opts.length + opts.width;
        $(this.spinner.el).css('margin-top',  $(window).height()/4 + halfHeight);
        $(this.spinner.el).css('margin-left', "50%");
        $(this.spinner.el).css("height", halfHeight + "px");
        $(this.el).append(this.spinner.el);
      }
    },

    render: function() {
      console.log('[Data loaded, rendering models.]');
      // render a subview for each model in the collection
      var self = this;
      var $thisEl = $(this.el);
      this.collection.each(function(model) {
        var options = {
          model: model,
          template: self.options.itemTemplate,
          visibleField: self.options.visibleField
        };
        if ('itemViewOptions' in self.options)
          _.extend(options, self.options.itemViewOptions)
        var view = new MozDevCSSPropView(options);
        $thisEl.append(view.el);
      });

      return this;
    },
  });

  return SearchResultsView;
});
