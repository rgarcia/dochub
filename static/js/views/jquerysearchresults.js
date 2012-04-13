define([
  'jQuery',
  'Underscore',
  'Backbone',
  'views/searchresults',
  'views/mozdevcssprop'
], function($, _, BackBone, SearchResultsView, MozDevCSSPropView) {

  // the results view is just tied to a collection and re-renders itself
  var JQuerySearchResultsView = SearchResultsView.extend({

    render: function() {
      console.log('[Data loaded, rendering models.]');
      // render a subview for each model in the collection
      var self = this;
      this.collection.each(function(model) {
        var view = new MozDevCSSPropView({
          model: model,
          languageName: self.options.languageName,
          template: self.options.itemTemplate,
          visibleField: self.options.visibleField
        });
        $(self.el).append(view.el);
      });

      var self = this;
      $('div.code-demo').each(function(index) {
        var demoBtn = $('<button class="button primary">Click for demo</button>');
        demoBtn.bind('click', { demoCodeDivIdx: index }, self.codeDemoClick);
        $(this).append(demoBtn);
      });

      return this;
    },

    // Dervied from http://static.jquery.com/api/demo.js
    codeDemoClick: function(evt) {
      var $parent = $($(evt.target).parent());

      var iframe = document.createElement("iframe");
      iframe.type  = "text/javascript";
      iframe.width = "100%";
      iframe.height = $parent.attr("rel") || "125";
      iframe.style.border = "none";
      $parent.html(iframe);

      var doc = iframe.contentDocument ||
                (iframe.contentWindow && iframe.contentWindow.document) ||
                iframe.document ||
                null;

      if (doc == null) {
        return true;
      }

      var demoCodeDiv = $('code.demo-code').eq(evt.data.demoCodeDivIdx);
      var source = demoCodeDiv.html()
            // .replace(/<\/?a.*?>/ig, "")
            // .replace(/<\/?strong.*?>/ig, "")
            .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
            .replace(/\/images/g, "http://api.jquery.com/images");  // Fix img links

      doc.open();
      doc.write(source);
      doc.close();
    },

  });

  return JQuerySearchResultsView;
});

