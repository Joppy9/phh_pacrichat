const redis = require('../../redis');

module.exports = function(app){
  app.ws('/api/timeline',function(ws,req){
    let subscriber = redis();

    subscriber.on('message',(channel,message)=>{
      /*//jsonに直す
      message = JSON.parse(message);
      message.toot.nickname = currentUser.toot;
      //object
      message = JSON.stringify(message)
      //json
      //JSON.parse(message)
      */
      ws.send(message);
    })
    subscriber.subscribe('local');
    ws.on('message',(message)=>{
      console.log(message);
    });
    ws.on('close',()=>{
      subscriber.unsubscribe();
      subscriber.quit()
    })
  });
}
