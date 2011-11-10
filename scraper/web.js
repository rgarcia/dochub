var scraper = require('scraper');
var mongoose = require('mongoose');

var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var CSSProperty = new Schema({
  id                : ObjectId,
  name              : { type: String, required: true },
  description       : { type: String, required: true },
  possibleValues    : [String],
  relatedProperties : [String]
});

var CSSProperty =  mongoose.model('CSSProperty',CSSProperty);



var urlroot = 'http://www.htmldog.com/reference/cssproperties/';

scraper('http://www.htmldog.com/reference/cssproperties/', function(err, jQuery) {
  if (err) {throw err}

  jQuery('#sec a').each(function() {
    var str = jQuery(this).attr('href').trim();
    str = str.slice(0,str.length-1);
    console.log(urlroot + str);
  });

});