define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/searchheader.html',
], function($, _, BackBone, searchHeaderTemplate) {

  // the header does not re-render on collection events
  // it just handles sending GETs to the server on clicking search
  var SearchHeaderView = BackBone.View.extend({
    tagName: 'section',
    id: 'search-header',

    events: {
      'click #search-button' : 'onSearch',
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
        return model.get('name').match(query);
      };
      this.collection.each(function(model) {
        model.set({visible: searchfn(model)});
      });
      this.collection.trigger('reset'); // hack, should make subviews for individual models
      // todo permalinks
      //BackBone.history.navigate('search/' + this.options.query, false);
    },

    onKeyup: function(evt) {
      this.onSearch();
      // if ( evt.keyCode === 13 )
      //   this.onSearch();
    },

  });

  return SearchHeaderView;
});
