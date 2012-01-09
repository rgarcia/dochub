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
  spidey.route('www.w3.org', '/TR/xslt', function ($, url) {

    console.log('---------');
    console.log('scraping:', url);


    // Get the list of all elements (searchable items) from Appendix B
    var searchableItems = _.map($('p.element-syntax-summary code a'), function(elt) {
      return {
        'name'  : elt.children[0].data.split(':')[1],
        'domId' : elt.attribs.href.split('#')[1]
      };
    });
    searchableItems = _.uniq(searchableItems.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    }), true, function(item) {
      return item.name;
    });

    // Change the html by taking all links that referred to by searchableItems
    // and prepnding the title (which is 'XSLT')
    // This is to avoid collisions if more than one page is visible (although
    // this doesn't apply to XSLT b/c there's only one page, but it could to Python).
    var title = 'XSLT';
    for (var i = 0; i < searchableItems.length; ++i) {
      var item = searchableItems[i];
      var newId = title + '_' + item.domId;

      var $elt = $('a[name=' + item.domId + ']');
      $elt.attr('name', newId);
      $elt.attr('id', newId);

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
  spidey.get('http://www.w3.org/TR/xslt').log('info');

  process.on('exit', function () {
    fs.writeSync(file, JSON.stringify(scrapeData, null, '\t'));
    console.log('DONE');
  });

  return;
});

