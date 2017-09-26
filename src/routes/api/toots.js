const Toot = require('../../models/toot');

module.exports = function (app) {
  app.get('/api/toots', function (req, res) {
    if (!res.locals.currentUser) {
      res.status(401).json({ 'error': 'Unauthorized' })
      return;
    }
    Toot.all_toots().order('id', 'desc').then((toots) => {
      let users = toots.map((toot) => {
        return toot.user();//tootのuserの配列
      });
      Promise.all(users).then((users) => {//解決
        res.json(toots.map((toot, idx) => {//tootのuserの配列
          let data = toot.data;
          data.nickname = users[idx].data.nickname;//くっつける
          return data;
        }));
      })
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