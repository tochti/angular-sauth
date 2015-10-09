module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'ext/crypto-js/rollups/sha1.js',
      'ext/jquery/jquery.js',
      'ext/angular/angular.js',
      'ext/angular-mocks/angular-mocks.js',
      'ext/angular-route/angular-route.js',
      '*.js',
      'test/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            //'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};
