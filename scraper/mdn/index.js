var requirejs = require('requirejs');

requirejs.config({
  // Pass the top-level main.js/index.js require
  // function to requirejs so that node modules
  // are loaded relative to the top-level JS file.
  nodeRequire: require
});

requirejs([
  'step',
  'request',
  'cheerio'
], function(step, request, cheerio) {

  step(

    function getIndexPage() {
      request({uri:'https://developer.mozilla.org/en/CSS/CSS_Reference'}, this);
    },

    function parseIndexHTML(error, response, body) {
      if (error && response.statusCode !== 200) {
        console.log('ERROR loading ' + url)
        throw(error);
      }
      var $ = cheerio.load(body); // use cheerio to generate a new jquery obj
      linksToScrape = {};
      $('code a').each(function(index) {
        console.log('"' + $(this).text().trim() + '" "' + $(this).attr('href') + '"');
      });
    }
  );

});
