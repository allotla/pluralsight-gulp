module.exports = function() {
  var client = './src/client/';
  var temp = './tmp/';
  var clientApp = client + 'app/';
  var server = './src/server/';

  var config = {
    /* File paths */
    /**************/
    alljs: [
      './src/**/*.js',
      './*.js'
    ],
    sass: client + 'styles/*.??ss',
    css: temp + 'styles.css',
    index: client + 'index.html',
    client: client,
    server: server,
    temp: temp,
    js: [
      clientApp + '**/*.module.js',
      clientApp + '**/*.js',
      '!' + clientApp + '**/*.spec.js'  // do not take spec.js files
    ],

    /* Bower locations */
    /***************************/
    bower: {
      json: require('./bower.json'),
      directory: './bower_components/',
      ignorePath: '../..'
    },

    /* Node configuration */
    /**********************/
    defaultPort: 7203,
    nodeServer: server + 'app.js'
  };

  config.getWiredepDefaultOptions = function() {
    return {
      bowerJson: config.bower.json,
      directory: config.bower.directory,
      ignorePath: config.bower.ignorePath
    };
  };

  return config;
};

