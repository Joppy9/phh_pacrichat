const redis = require('../../redis');

module.exports = function(app){
  app.ws('/api/timeline',function(ws,req){
    let subscriber = redis();

    subscriber.on('message',(channel,message)=>{
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
