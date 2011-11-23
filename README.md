# Runnning InstaCSS

Make sure you have a MongoDB server running on your system. For example, on Ubuntu, type

    apt-get install mongodb

Install the dependencies:

    npm install

Download the content:

    cd scraper/mdn
    ./run.sh

Run the server:

    node web.js

Open http://localhost:5000/ in your browser.

# Notes

How to use the r.js optimizer:

    node node_modules/requirejs/bin/r.js -o static/js/app.build.js

Make sure the node server is serving the correct static folder
(whether you want /static or /static-build).
