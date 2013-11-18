// -*- js2-basic-offset: 2 -*-

var requirejs = require('requirejs');

requirejs([
  'step',
  'spider',
  'underscore',
  'cheerio',
  '../../models/sectionscrape',
  'path',
  'fs',
  'url'
], function(step, spider, _, cheerio, SectionScrape, path, fs, url) {

  var results = [];

  var spidey = spider();

  // use this to visit all links on a page
  var visitLinks = function($) {
    $('a[href]').each(function() {
      var href = $(this).attr('href');
      var hrefUrl = url.parse(href);

      // Skip pathless URLs.
      if (hrefUrl.pathname === null) {
        return;
      }

      // Skip links to special wiki pages: /login/*, $history, $edit, ...
      if (hrefUrl.pathname.indexOf('$') !== -1 ||
          hrefUrl.pathname.indexOf('/login/') !== -1 ||
          hrefUrl.pathname.indexOf('?redirect=no') !== -1) {
        return;
      }

      // MDN uses path-only URLs in most places now.  Fill in protocol/host.
      if (!hrefUrl.protocol) {
        hrefUrl.protocol = 'https';
      }
      if (!hrefUrl.host) {
        hrefUrl.host = 'developer.mozilla.org';
      }

      spidey.get(url.format(hrefUrl));
    });
  };

  // file where we'll dump the json
  var filename = path.dirname(__filename) + '/../../static/data/css-mdn.json';
  console.log('dumping to ' + filename);
  var file = fs.openSync(filename,'w');

  // main index of mdn's css docs
  spidey.route('developer.mozilla.org',
               '/en-US/docs/Web/CSS/Reference', function ($) {
    visitLinks($);
  });

  var blacklist = [
      'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference'
      , 'https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Property_Template'
  ];

  // some urls redirect to other pages w/o changing the url (for example: https://developer.mozilla.org/en/CSS/-moz-scrollbars-none)
  // so in addition to not visiting the same url twice, keep this list to prevent visiting the same title twice
  var titles = [];

  spidey.route('developer.mozilla.org',
               /^\/en-US\/docs\/Web\/CSS\/(.*)$/,
               function ($, pageUrl) {
    if (_.include(blacklist, pageUrl)) {
      console.log('skipping blacklisted URL: ' + pageUrl);
      return;
    }
    visitLinks($);

    console.log('---------');
    console.log('scraping:', pageUrl);

    var title = $('#article-head h1.page-title').text().trim();
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
    scrapeData['url'] = pageUrl;
    scrapeData['sectionNames'] = [];
    scrapeData['sectionHTMLs'] = [];

    // As of Nov 2013 CSS reference wiki bodies have the following form:
    //
    // <div id="wikiArticle">
    //   ... <!-- some nav & other boilerplate -->
    //   <h2 id="Section_Name">Section Name</h2>
    //   <div>content</div>
    //   <div>...</div>
    //   <h2 id="Another_Section">Another Section</h2>
    //   <div>...</div>
    // </div>
    //
    // We'll select the wikiArticle div and use a little state machine to
    // extract the sections by scanning down the children.

    var $section, sectionName, sectionBody;
    var state = 'SEEKING_FIRST_SECTION';

    var startNextSection = function(headerElem) {
      sectionName = headerElem.attribs.id;
      $section = cheerio.load('<div>');
      sectionBody = $section('div');
      sectionBody.append(headerElem);
      state = 'IN_SECTION';
    };

    var finishCurrentSection = function() {
      scrapeData['sectionNames'].push(sectionName);

      // strip scripts.
      $section('script').remove();

      // replace each header from h2-h5 with the next-less-important header
      // down. MDN now fairly consistently uses h2 as the most-important header
      // level, which clashes with dochub style.
      // TODO(keunwoo): Probably should handle this instead by styling headers
      // beneath the entry div differently, but I don't feel like tangling with
      // dochub's global CSS right now since it's shared across the output of
      // all scrapers.
      var i, replacementTag;
      for (i = 5; i >= 2; --i) {
        replacementTag = 'h' + (i + 1);
        $section('h' + i).each(function(i, elem) {
          elem.name = replacementTag;
        });
      }

      // find relative hrefs and turn them into absolute hrefs
      $section('a[href]').each(function(i, elem) {
        var hrefUrl = url.parse(elem.attribs.href);
        var hrefPath = hrefUrl.pathname || '';
        var match;
        if (!hrefUrl.hostname) {
          // Check if the path links to a page that we might be scraping in this
          // run. This differs from the regex we used above in spidey.route()
          // because there are some legacy links to paths without the /Web/
          // subcomponent, for example
          //   https://developer.mozilla.org/en-US/docs/CSS/angle
          // We don't want to scrape these (they all redirect to their /Web/*
          // versions), but we do want to rewrite links to them.
          match = hrefPath.match(/^\/en-US\/docs\/(?:Web\/)?CSS\/(.*)$/);
          if (match) {
            // Create internal dochub link.  Note that MDN's wiki uses '_' in
            // URLs for space, but dochub just stores the title (including
            // spaces) and uses it directly.
            hrefUrl.pathname = null;
            hrefUrl.hash = '#css/' + match[1].replace(/_/g, '%20');
          } else {
            hrefUrl.protocol = 'https:';
            hrefUrl.hostname = 'developer.mozilla.org';
          }
          elem.attribs.href = url.format(hrefUrl);
        }
      });

      // find relative img srcs and turn them into absolute urls
      $section('img[src]').each(function(i, elem) {
        var srcUrl = url.parse(elem.attribs.src);
        if (!srcUrl.hostname) {
          srcUrl.protocol = 'https:';
          srcUrl.hostname = 'developer.mozilla.org';
        }
        elem.attribs.src = url.format(srcUrl);
      });

      scrapeData['sectionHTMLs'].push($section.html());
    };

    $('#wikiArticle').children().each(function(i, elem) {
      if (state === 'SEEKING_FIRST_SECTION') {
        if (elem.name === 'h2') {
          startNextSection(elem);
        }
        return;

      } else if (state === 'IN_SECTION') {
        if (elem.name === 'h2') {
          finishCurrentSection();
          startNextSection(elem);
        } else {
          // Continuing section; just append to current body.
          sectionBody.append(elem);
        }
      }
    });

    // Handle final section after we run off the end of the article.
    if ($section) {
      finishCurrentSection();
    }

    if ( scrapeData['sectionNames'].length === 0 ) {
      console.log('WARNING: no sections...');
      return;
    }

    results.push(scrapeData.toJSON());
    titles.push(title);
  });

  // start 'er up
  spidey.get('https://developer.mozilla.org/en-US/docs/Web/CSS/Reference').log('info');

  process.on('exit', function () {
    fs.writeSync(file,JSON.stringify(results,null,'\t'));
    console.log('DONE');
  });
  return;
});
