define([
  'scraper',
  'underscore',
  '../models/cssprop'
], function(scraper, _, CSSProp) {

  // scrapes w3schools css reference page
  var csspropMap = {};

  return {

    detailPageScraper: function(err,$) {
      if (err) throw(err);
      var elemName = $('h1 span').text().trim();
      console.log('scraping detail page for ' + elemName);
      var cssprop = csspropMap[elemName];
      if ( !cssprop ) {
        console.log('ERROR could not find ' + elemName + ' in results from root url scrape');
        return;
      }

      // example
      cssprop['examples'].push({
        description: $('.example p').text(),
        code: $('.example_code').text().trim()
      });
      //console.log(cssprop['examples']);

      // TODO scrape browser support section

      // definition and usage
      // if present, replace the description with this, more detailed desc
      var $defandusage = $('h2').filter(function(index) { return $(this).text().trim() === "Definition and Usage"; });
      if ( $defandusage.length === 1 ) {
        cssprop['description'] = '';
        // TODO: this is ugly and i hate it
        var $p = $defandusage.next();
        for (; $p.is('p') || $p.is('ul'); $p = $p.next() ) {
          if ( $p.is('p') )
            cssprop['description'] += '<p>' + $p.html() + '</p>';
          else if ( $p.is('ul') )
            cssprop['description'] += '<ul>' + $p.html() + '</ul>';
        }
        //console.log(cssprop['description']);

        // if table comes after description, look for "Default value:",
        // "Inherited:", "Javascript syntax:"
        var $table = $p.is('table') ? $p : null;
        if ( $table ) {
          var $trs = $table.children(0); // skip over tbody

          for (var i = 0; i < $trs.length; i++) {
            var th = $($trs[i]).children(0).filter('th').text().trim();
            var tr = $($trs[i]).children(0).filter('td').html();
            if ( th === 'Default value:' ) {
              cssprop['defaultValue'] = tr;
            } else if ( th === 'Inherited:' ) {
              cssprop['inherited'] = tr;
            } else if ( th === 'JavaScript syntax:' ) {
              cssprop['jsSyntax'] = tr;
            }
          }
          // console.log(cssprop['defaultValue']);
          // console.log(cssprop['inherited']);
          // console.log(cssprop['jsSyntax']);
        }
      }

      // Property Values table
      var $propvalues = $('h2').filter(function(index) { return $(this).text().trim() === "Property Values"; });
      if ( $propvalues.length === 1 ) {
        var $table = $propvalues.next();
        for ( ; !$table.is('table'); $table = $table.next() );
        $table = $table.is('table') ? $table : null;
        if ( $table ) {
          var $trs = $table.children(0); // skip over tbody

          for (var i = 1 /* skip heading */; i < $trs.length; i++) {
            cssprop['values'].push({
              value: $($($trs[i]).children(0)[0]).text(),
              description: $($($trs[i]).children(0)[1]).text()
            });
          }
          // console.log(cssprop['values']);
        }
      }

      // save to db!
      cssprop.save();
    },

    rootLevelScraper: function() {
      // goes to root css reference page, gathers the content there and
      // generates more urls to scrape
      var url = 'http://www.w3schools.com/cssref/default.asp';
      var newUrls = [];

      // get all of the tables of property, description, css {1,2,3} data
      var self = this;
      scraper(url, function(err, $) {
        if (err) throw err;

        $('.reference tr').map(function() {
          var cssprop = new CSSProp();
          $(this).find('td').each(function(index) {
            if ( index === 0 ) {
              // some properties have links to more info
              if ($(this).children(':first').is('a') ) {
                var $a = $(this).children(':first')
                cssprop['name'] = $a.html();
                cssprop['srcUrl'] = 'http://www.w3schools.com/cssref/' + $a.attr('href');
                newUrls.push(cssprop['srcUrl']);
              } else {
                cssprop['name'] = $(this).html();
                cssprop['srcUrl'] = url;
              }
              if ( cssprop['name'] === undefined ) {
                console.log('ERROR')
                console.log(cssprop);
                return;
              } else {
                console.log(cssprop['name']);
                csspropMap[cssprop['name']] = cssprop;
              }
            } else if ( index === 1 ) {
              cssprop['description'] = '<p>' + $(this).html() + '</p>';
            } else if ( index === 2 ) {
              cssprop['version'] = $(this).html();
            }
          });
        });

        // scrape the detail urls
        console.log('scraping detail pages');
        scraper(newUrls,self.detailPageScraper);
      });

    }
  };
});
