define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/searchheader.html',
], function($, _, BackBone, searchHeaderTemplate) {

  // the header does not re-render on collection events
  // it just handles applying the query to the collection of models
  var SearchHeaderView = BackBone.View.extend({
    tagName: 'section',
    id: 'search-header',

    events: {
      'keyup #search-box'    : 'onKeyup',
    },

    initialize: function() {
      _.bindAll(this, 'render');
      this.template = _.template(searchHeaderTemplate);
    },

    render: function() {
      $(this.el).html(this.template({}));
      return this;
    },

    onSearch: function() {
      var query = $.trim(this.$('#search-box').val()).toLowerCase();
      if (query === '') {
        return;
      }
      console.log('searching for ' + query);
      var searchfn = function(model) {
        // BEGIN GLORIOUS SEARCH ALGORITHM
        return model.get('title').match(query);
        // END GLORIOUS SEARCH ALGORITHM
      };
      this.collection.each(function(model) {
        model.set({visible: searchfn(model)});
      });

      // todo permalinks
      // BackBone.history.navigate('search/' + this.options.query, false);
    },

    onKeyup: function(evt) {
      this.onSearch();
    },

  });

  return SearchHeaderView;
});
