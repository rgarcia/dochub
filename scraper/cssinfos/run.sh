node index.js > index.txt 2>&1
while read line; do
    node page.js $line 2>&1;
done < index.txt