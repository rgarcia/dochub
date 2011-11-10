var scraper = require('scraper');
var mongoose = require('mongoose');
var config = require('./config');
var _ = require('underscore');

var Schema    = mongoose.Schema;
var ObjectId  = Schema.ObjectId;

var CSSProperty = new Schema({
  id                : ObjectId,
  name              : { type: String, required: true },
  description       : { type: String, required: true },
  possibleValues    : String, // todo list
  example           : String,
  relatedProperties : String // todo list
});

var CSSPropertyModel =  mongoose.model('CSSProperty',CSSProperty);
CSSPropertyModel.collection.remove({});

var db = mongoose.connect(
  'mongodb://' + config.db_user_prod + ':' + config.db_pass_prod +
    '@' + config.db_host_prod + ':' + config.db_port_prod + '/' + config.db_name_prod,
  function(err) {
    if (err) {
      console.log(err);
      throw err;
    }
  });

var urlroot = 'http://www.htmldog.com/reference/cssproperties/';
var propertyUrls = [];
scraper('http://www.htmldog.com/reference/cssproperties/', function(err, $) {
  if (err) {throw err}

  $('#sec a').each(function() {
    var property = $(this).attr('href').trim();
    property = property.slice(0,property.length-1);
    propertyUrls.push(urlroot + property);
  });

  console.log(propertyUrls);


  cssprops = [];
  scraper(propertyUrls,function(err, $) {
    if (err) {throw err;}

    cssprop = new CSSPropertyModel();

    cssprop['name'] = $('#intro h1').text();
    cssprop['name'] = cssprop['name'].slice(14,cssprop['name'].length);
    cssprop['description'] = $('#intro p').text();
    cssprop['possibleValues'] = $('#ai2 ul:first').html();
    cssprop['example'] = $('#ai2 pre:first').html();
    if ($('#r2 h2').next().is('ul'))
      cssprop['relatedProperties'] = $('#r2 h2').next().html();
    else
      cssprop['relatedProperties'] = '';


    console.log("-------");
    //    console.log(cssprop['name']);
    // console.log(cssprop['description']);
    // console.log(cssprop['possibleValues']);
    //console.log(cssprop['example']);
    //console.log(cssprop['relatedProperties']);

    console.log(cssprop);
    cssprop.save(function(err) {
      if (err) {
        console.log(err);
      }
    });
  });
});
