const redis = require('redis');

module.exports = function(){
  return redis.createClient();
}