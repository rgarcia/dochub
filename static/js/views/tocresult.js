define([
  'jQuery',
  'Underscore',
  'Backbone',
  'text!templates/tocresult.html',
], function($, _, BackBone, tocResultTemplate) {

  var TOCResult = BackBone.View.extend({

    events: {
      'click a' : 'onClick'
    },

    initialize: function() {
      _.bindAll(this,'render');
      this.template = _.template(tocResultTemplate);

      var self = this;
      this.model.bind("change:visible", function(model) {
        if (model.get("visible"))
          $(self.el).show();
        else
          $(self.el).hide();
      });
    },

    render: function() {
      var obj = {
        _ : _,
        model : this.model,
      }
      $(this.el).html(this.template(obj));
      $(this.el).show();
      return this;
    },

    onClick: function() {
      console.log('clicked ' + this.model.get('title'));

      // if nothing in the search bar, put it there
      if ( $('#search-box').val() === "" ) {
        $('#search-box').val(this.model.get('title'));
        $("#search-box").trigger('keyup');
      } else {
        //$('html,body').animate({
        $('#search-results').animate({
          scrollTop: $("#_" + this.model.get('title')).offset().top-60
        }, 'slow');
      }
    }

  });

  return TOCResult;
});
