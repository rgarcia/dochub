var requirejs = require('requirejs');

requirejs([
  'spider',
  'underscore',
  'cheerio',
  'path',
  'fs'
], function(spider, _, cheerio, path, fs) {

  var scrapeData = [];
  var spidey = spider();

  // file where we'll dump the json
  var filename = path.dirname(__filename) + '/../../static/data/python.json';
  console.log('[Dumping to ' + filename + '.]');
  var file = fs.openSync(filename, 'w');

  var rootUrls = [
    'http://docs.python.org/reference/',
    'http://docs.python.org/library/',
  ];

  spidey.route('docs.python.org', '/reference/', function ($, url) {
    // TODO:
    console.log('Skipping ' + url);
  });


  spidey.route('docs.python.org', '/library/', function ($, url) {
    console.log('---------');
    console.log('scraping:', url);

    var regex = /^((\d+)\.(\d+))\.\s+.+$/;
    var linksToFollow = _.filter($('a.reference'), function(elt) {
      var result = regex.exec($(elt).text().trim());
      if (result !== null) {
        // Only take certain sections
        var sectionNum = parseInt(result[2], 10);
        return (5 <= sectionNum) && (sectionNum <= 31);
      }
      return false;
    });
    _.each(linksToFollow, function(elt) {
      spidey.get(url + $(elt).attr('href'));
    });
  });

  spidey.route('docs.python.org', '/library/*', function ($, url) {

    // Some links are just hashtags to pages we've already scraped.
    // Skip these.
    if (url.indexOf('#') !== -1) {
      return false;
    }

    // Change the html by taking all links that referred to by searchableItems
    // and prepending the title. This is to avoid collisions if more than one page is visible.
    var title = $($($('h1').children()[0]).children()[0]).text();

    // Get the list of all elements from the page.
    // class declarations
    var searchableItems = _.map(
      _.filter($('dl.class'), function(elt) {
        var $firstChild = $($(elt).children()[0]);
        return $firstChild.attr('id');
      }), function(elt) {
      var $firstChild = $($(elt).children()[0]);
      return {
        'name'  : $firstChild.attr('id'),
        'domId' : $firstChild.attr('id')
      };
    });
    // class method declarations
    var methods = _.toArray($('dl.function')).concat(_.toArray($('dl.method')));
    searchableItems = searchableItems.concat(searchableItems,
      _.map(_.filter(methods, function(elt) {
        var $firstChild = $($(elt).children()[0]);
        return $firstChild.attr('id');
      }), function(elt) {
      var $firstChild = $($(elt).children()[0]);
      return {
        'name'  : $firstChild.attr('id'),
        'domId' : $firstChild.attr('id')
      };
    }));
    // class variable declarations
    searchableItems = searchableItems.concat(searchableItems,
      _.map(_.filter($('dl.class'), function(elt) {
        var $firstChild = $($(elt).children()[0]);
        return $firstChild.attr('id');
      }), function(elt) {
      var $firstChild = $($(elt).children()[0]);
      return {
        'name'  : $firstChild.attr('id'),
        'domId' : $firstChild.attr('id')
      };
    }));

    console.log(url + ' :: ' + title);
    console.log(searchableItems.length);
    searchableItems = _.uniq(searchableItems.sort(function(a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }), true, function(item) {
      return item.name;
    });
    console.log(searchableItems.length);
    for (var i = 0; i < searchableItems.length; ++i) {
      var domId = searchableItems[i].domId;
      var newId = title + '_' + domId;

      // Now go through and change:
      // (1) All internal links that ref this.
      $('a[href=#' + domId + ']').each(function(i, elt) {
        $(elt).attr('href', '#' + newId);
      });
      // (2) Ihe id of the element being referenced.
      $('#' + domId).attr('id', newId);

      // Do this after we modify the element.
      searchableItems[i].domId = newId;
    }

    // If a link href starts with a hashtag, leave it. If it is a relative url,
    // then make it absolute.
    var baseUrl = url.substr(0, url.lastIndexOf('/') + 1);
    $('a').each(function(i, elt) {
      var $elt = $(elt);
      var href = $elt.attr('href');
      if (href.charAt(0) != '#' && href.indexOf('://') === -1) {
        $elt.attr('href', baseUrl + href);
      }
    });

    // Change img srcs from relative to absolute
    $('img').each(function(i, img) {
      var src = img.attribs.src;
      if (src.indexOf('http') === -1) {
        img.attribs.src = baseUrl + src;
        // console.log(img.attribs.src);
      }
    });

    scrapeData.push({
      url   : url,
      title : title,
      html  : _.map($('div.body').children(), function(obj) {
        return $(obj).html();
      }).join(''),
      searchableItems : searchableItems
    });
  });

  // Start 'er up
  _.each(rootUrls, function(url) {
    spidey.get(url).log('info');
  });

  process.on('exit', function () {
    fs.writeSync(file, JSON.stringify(scrapeData, null, '\t'));
    console.log('DONE');
  });

  return;
});

