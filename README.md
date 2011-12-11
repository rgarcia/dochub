# Runnning locally

Run the server:

    npm install # downloads dependencies for web server
    node web.js

Open http://localhost:5000/ in your browser.

# Scraper

The `static/data/` directory contains our scrape of the sites we get content from. Right now we don't update this very often. If you want the most up-to-date content, you can run the scrapers:

    cd scraper
    npm install # downloads dependencies for scrapers
    (cd css-mdn;  node scrape.js)
    (cd html-mdn; node scrape.js)
    (cd js-mdn;   node scrape.js)
    (cd dom-mdn;  node scrape.js)
    (cd jquery;   node scrape.js)

# Notes

How to use the r.js optimizer:

    node node_modules/requirejs/bin/r.js -o static/js/app.build.js

Make sure the node server is serving the correct static folder
(whether you want /static or /static-build).
