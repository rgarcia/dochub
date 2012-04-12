// shortcut aliases
require.config({
  paths: {
    jQuery:     'libs/jquery/jquery',
    Underscore: 'libs/underscore/underscore',
    Backbone:   'libs/backbone/backbone',
    templates:  '../templates'
  }
});

require([
  // Load our app module and pass it to our definition function
  'app',

  // Some plugins have to be loaded in order due to their non AMD compliance
  // Because these scripts are not "modules" they do not pass any values to the definition function below
  // 'order!libs/prettify/prettify.min',
  'order!libs/jquery/jquery-min',
  // 'order!libs/jquery/jquery.syntaxhighlighter.min',
  'order!libs/bootstrap/bootstrap-dropdown',
  'order!libs/bootstrap/bootstrap-twipsy',
  'order!libs/bootstrap/bootstrap-collapse',
  'order!libs/bootstrap/bootstrap-scrollspy',
  'order!libs/underscore/underscore-min',
], function(App) {
  App.initialize();
});
