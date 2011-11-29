#!/bin/bash

node index.js > index.txt &&
while read line; do
    node page.js $line
done < index.txt
