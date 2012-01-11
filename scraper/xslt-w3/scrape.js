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
  var filename = path.dirname(__filename) + '/../../static/data/xslt-w3.json';
  console.log('[Dumping to ' + filename + '.]');
  var file = fs.openSync(filename, 'w');

  var urls = [
    'http://www.w3.org/TR/xslt20/',
    'http://www.w3.org/TR/xpath-functions/'
  ];
  var urlToTitleMap = {};
  urlToTitleMap[urls[0]] = 'XSLT';
  urlToTitleMap[urls[1]] = 'XPath';

  var getSearchableItems = function(url, $) {
    var filterSelector;
    var filterFunc;
    if (url === urls[0]) {
      filterSelector = 'a[href|="#element"]';
      filterFunc = function(elt) {
        return $(elt).text().trim().indexOf('xsl:') === 0;
      };
    } else if (url === urls[1]) {
      filterSelector = 'a[href|="#func"]';
      filterFunc = function(elt) {
        var children = $(elt).children();
        if (children.length === 0) {
          return false;
        }
        var txt = $(children[0]).text().trim();
        return txt.indexOf(' ') === -1 && txt.indexOf('(') === -1 &&
               (txt.indexOf('op:') === 0 || txt.indexOf('fn:') === 0);
      };
    } else {
      throw "What the heck we scrapin'??: " + url;
    }

    var searchableItems = _.map(
      _.filter($(filterSelector), filterFunc), function(elt) {
      var $elt = $(elt);
      return {
        // 'name'  : $elt.text().split(':')[1],
        'name'  : $elt.text(),
        'domId' : $elt.attr('href').substr(1)
      };
    });

    console.log(searchableItems.length);
    searchableItems = _.uniq(searchableItems.sort(function(a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }), true, function(item) {
      return item.name;
    });
    console.log(searchableItems.length);

    return searchableItems;
  }

  // W3's single-page xslt docs
  spidey.route('www.w3.org', '*', function ($, url) {

    console.log('---------');
    console.log('scraping:', url);


    // Get the list of all elements (searchable items) from Appendix D
    var searchableItems = getSearchableItems(url, $);

    // Change the html by taking all links that referred to by searchableItems
    // and prepending the title (which is this particular case is 'XSLT')
    // This is to avoid collisions if more than one page is visible (although
    // this doesn't apply to XSLT b/c there's only one page, but it could to Python).
    var title = urlToTitleMap[url];
    for (var i = 0; i < searchableItems.length; ++i) {
      var domId = searchableItems[i].domId;
      var newId = title + '_' + domId;

      var $elt = $('a[name=' + domId + ']');
      $elt.attr('name', newId);
      $elt.attr('id', newId);

      // Now go through and change all internal links that href to this.
      $('a[href=#' + domId + ']').each(function(i, elt) {
        $(elt).attr('href', '#' + newId);
      });

      // Do this after we modify the element.
      searchableItems[i].domId = newId;
    }

    // Each <a> without an href attribute is used as an anchor on this page.
    // It has <a name="anchorname">. Modify it so it becomes
    // <a name="anchorname" id="anchorname">. This is because the client
    // will select anchors by id, not by name.
    $('a').each(function(i, elt) {
      var $elt = $(elt);
      if ($elt.attr('name') && !$elt.attr('id')) {
        $elt.attr('id', $elt.attr('name'));
      }
    });

    // Change img srcs from relative to absolute
    $('img').each(function(i, img) {
      var src = img.attribs.src;
      console.log(src);
      if (src.indexOf('http') === -1) {
        img.attribs.src = url + src;
        console.log(img.attribs.src);
      }
    });

    scrapeData.push({
      url   : url,
      title : title,
      html  : _.map($('body').children(), function(obj) {
        return $(obj).html();
      }).join(''),
      searchableItems : searchableItems
    });
  });

  // Start 'er up
  _.each(urls, function(url) {
    spidey.get(url).log('info');
  });

  process.on('exit', function () {
    fs.writeSync(file, JSON.stringify(scrapeData, null, '\t'));
    console.log('DONE');
  });

  return;
});

