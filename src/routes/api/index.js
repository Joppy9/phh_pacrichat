module.exports = function(app){
  require('./toots')(app);
  require('./timeline')(app);
}