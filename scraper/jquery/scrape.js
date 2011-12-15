var requirejs = require('requirejs');

requirejs([
  'step',
  'spider',
  'underscore',
  'cheerio',
  '../../models/sectionscrape',
  'path',
  'fs'
], function(step, spider, _, cheerio, SectionScrape, path, fs) {

  var results = [];

  var spidey = spider();

  // file where we'll dump the json
  var filename = path.dirname(__filename) + '/../../static/data/jquery.json';
  console.log('dumping to ' + filename);
  var file = fs.openSync(filename,'w');

  // main index
  spidey.route('api.jquery.com', '/', function ($) {
    $('#content a.title-link').each(function() {
      spidey.get($(this).attr('href'));
    });
  });

  var blacklist = [
  ];

  // protect against different urls but same content (=> same content)
  var titles = [];

  // Change '.add()' to 'add'
  var jQueryFunctionNameRegex = /^\.?(\S+)\(\)$/;
  var defunctionfy = function(txt) {
    var result = txt.match(jQueryFunctionNameRegex);
    if (result === null) {
      return txt;
    } else {
      return result[1];
    }
  }

  spidey.route('api.jquery.com', '\/*', function ($, url) {
    if ( _.indexOf(blacklist,url) !== -1 ) return;

    console.log('---------');
    console.log('scraping:',url);

    var title = defunctionfy($('h1.jq-clearfix').text().trim());
    if ( title === '' || title === null ) {
      console.log('ERROR: could not get title, skipping');
      return;
    } else if ( _.indexOf(titles,title) !== -1 ) {
      console.log('WARNING: already scraped something with this title, skipping');
      return;
    }

    console.log('title:',title);

    var scrapeData = new SectionScrape();
    scrapeData['title'] = title;
    scrapeData['url'] = url;
    scrapeData['sectionNames'] = [title];
    scrapeData['sectionHTMLs'] = 
      _.map(_.toArray($('div.entry-content').children()).slice(1),
            function(obj) {
              return $(obj).html();
            });

    results.push(scrapeData.toJSON());
    titles.push(title);
  });

  // start 'er up
  spidey.get('http://api.jquery.com/').log('info');

  process.on('exit', function () {
    fs.writeSync(file,JSON.stringify(results,null,'\t'));
    console.log('DONE');
  });

  return;
});
