var requirejs = require('requirejs');

requirejs([
  'spider',
  'underscore',
  '../../models/sectionscrape',
  'path',
  'fs'
], function(spider, _, SectionScrape, path, fs) {

  // c.f. http://docs.jquery.com/Frequently_Asked_Questions#How_do_I_select_an_element_by_an_ID_that_has_characters_used_in_CSS_notation.3F
  function jq(myid) { 
    return '#' + myid;
  }
  var extractJqueryId = function(url) {
    var remaining = url.split('manual/en/')[1];
    return jq(remaining.replace('.php', ''));
  }

  var desiredExts = _.map([
    "Apache",
    "Arrays",
    "Bzip2",
    "Calendar",
    "Classkit",
    "Class/Objects",
    "COM",
    "cURL",
    "Date/Time",
    "DBA",
    "DB++",
    "Direct IO",
    "Directories",
    "DOM",
    ".NET",
    "Eio",
    "Error Handling",
    "Program execution",
    "Filesystem",
    "FTP",
    "Function Handling",
    "Gearman",
    "GeoIP",
    "Hash",
    "HTTP",
    "ID3",
    "IIS",
    "IMAP",
    "Ingres",
    "Java",
    "JSON",
    "LDAP",
    "Libeventlibxml",
    "Mail",
    "Math",
    "Mailparse",
    "Memcache",
    "Memcached",
    "Mongo",
    "MySQL",
    "MySQLi",
    "OAuth",
    "OpenSSL",
    "Output Control",
    "PostgreSQL",
    "POSIX",
    "Readline",
    "SimpleXML",
    "SQLite",
    "SQLite3",
    "SQLSRV",
    "SSH2",
    "Streams",
    "Strings",
    "SWF",
    "Sybase",
    "ODBC",
    "URLs",
    "Variable handling",
    "WinCache",
    "XML-RPC",
    "XSL",
    "Yaml",
    "Zip",
    "Zlib",
  ], function(str) {
    return str.toLowerCase();
  });

  // File where we'll dump the json
  var filename = path.dirname(__filename) + '/../../static/data/php-ext.json';
  console.log('[Dumping to ' + filename + '.]');
  var file = fs.openSync(filename, 'w');

  // The list of results we're going to put into the file
  var results = [];

  var crawlfn = function($) {
    return function() {
      var href = 'http://www.php.net/manual/en/' + $(this).attr('href');
      jsSpider.get(href);
    };
  };

  // Config the crawler
  var jsSpider = spider();
  jsSpider.route('www.php.net', '/manual/en/extensions.alphabetical.php', function ($, url) {
    console.log(url);

    var links = _.filter($(jq('extensions.alphabetical') + ' a'), function(link) {
      var txt = $(link).text().trim().toLowerCase();
      return desiredExts.indexOf(txt) > -1;
    });
    $(links).each(crawlfn($));
  }).route('www.php.net', '/manual/en/book*', function ($, url) {
    console.log(url);
    var jqId = extractJqueryId(url);
    $(jqId + ' a').each(crawlfn($));
  }).route('www.php.net', '/manual/en/ref*', function ($, url) {
    console.log(url);
    var jqId = extractJqueryId(url);
    $(jqId + ' a').each(crawlfn($));
  });

  var subroutes = [
    'function*',
  ];
  for (var i = 0; i < subroutes.length; ++i) {
    // Need this closure to get the subroute
    (function() {
      var subroute = subroutes[i];
      jsSpider.route('www.php.net', '/manual/en/' + subroute, function ($, url) {
        var title = $('h1.refname').text().trim();
        if (title === '') return;

        // Extract everything after the subroute and lowercase first letter
        var remaining = url.split('manual/en/')[1];
        console.log('[Scraping ' + url + ' :: ' + title + ']');

        // Create new obj to save
        var scrapeData = new SectionScrape();

        scrapeData['title'] = title;
        scrapeData['url']   = url;
        scrapeData['sectionNames'] = [ title ];
        scrapeData['sectionHTMLs'] = [ $(extractJqueryId(url)).html() ];

        results.push(scrapeData.toJSON());

        // Continue crawling
        $('#pageText a').each(crawlfn($));
      });
    })();
  }

  // Start the crawler
  jsSpider.get('http://www.php.net/manual/en/extensions.alphabetical.php').log('info');

  // Write on exit
  process.on('exit', function() {
    fs.writeSync(file, JSON.stringify(results, null, '\t'));
    console.log('[Done.]');
  });

  return;
});

