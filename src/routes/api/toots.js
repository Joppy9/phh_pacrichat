const Toot = require('../../models/toot');

module.exports = function (app) {
  app.get('/api/toots', function (req, res) {
    if (!res.locals.currentUser) {
      res.status(401).json({ 'error': 'Unauthorized' })
      return;
    }
    res.locals.currentUser.toots().order('id','desc').then((toots) => {
      res.json(toots.map((toots) => {
        return toots.data;
      }));
    }).catch((error) => {
      res.status(500).json({ error: error.toString() });
    });
  })
  app.post('/api/toots',function(req,res){
      if (!res.locals.currentUser) {
      res.status(401).json({ 'error': 'Unauthorized' })
      return;
    }
    Toot.create(res.locals.currentUser,req.body.toot).then((toot)=>{
      res.json({toot: toot.data});
    }).catch((err)=>{
      res.status(500).json({error: err.toString() });
    });
  });
  app.delete('/api/toots/:id',function(req,res){
       if (!res.locals.currentUser) {
      res.status(401).json({ 'error': 'Unauthorized' })
      return;
    }
    res.locals.currentUser.toots().where({
      id: req.params.id
    }).then((toots)=>{
      if(toots.length > 0){//idが重複するはずがない
        toots[0].destroy().catch(console.error);
      }
      res.status(200).end();
    }).catch((error)=>{
      res.status(500).json({'error':error.toString()});
    })
  });
};