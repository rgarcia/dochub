# Runnning InstaCSS

Make sure you have a MongoDB server running on your system. For example, on Ubuntu, type

    apt-get install mongodb

Download the content:

    cd scraper
    npm install # downloads dependencies for scrapers
    (cd css-mdn;      ./run.sh)
    (cd css-cssinfos; ./run.sh)
    (cd html-mdn;     ./run.sh)

Run the server:

    npm install # downloads dependencies for web server
    node web.js

Open http://localhost:5000/ in your browser.

# Notes

How to use the r.js optimizer:

    node node_modules/requirejs/bin/r.js -o static/js/app.build.js

Make sure the node server is serving the correct static folder
(whether you want /static or /static-build).
