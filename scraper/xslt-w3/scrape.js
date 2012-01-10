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

  // W3's single-page xslt docs
  spidey.route('www.w3.org', '/TR/xslt20', function ($, url) {

    console.log('---------');
    console.log('scraping:', url);


    // Get the list of all elements (searchable items) from Appendix D
    var searchableItems = _.map(
      _.filter($('a[href|="#element"]'), function(elt) {
        return $(elt).text().indexOf('xsl:') === 0;
      }), function(elt) {
      var $elt = $(elt);
      return {
        'name'  : $elt.text().split(':')[1],
        'domId' : $elt.attr('href').substr(1)
      };
    });
    console.log(searchableItems.length);
    searchableItems = _.uniq(searchableItems.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    }), true, function(item) {
      return item.name;
    });
    console.log(searchableItems.length);

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

    // Change the html by taking all links that referred to by searchableItems
    // and prepending the title (which is this particular case is 'XSLT')
    // This is to avoid collisions if more than one page is visible (although
    // this doesn't apply to XSLT b/c there's only one page, but it could to Python).
    var title = 'XSLT';
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
  spidey.get('http://www.w3.org/TR/xslt20').log('info');

  process.on('exit', function () {
    fs.writeSync(file, JSON.stringify(scrapeData, null, '\t'));
    console.log('DONE');
  });

  return;
});

