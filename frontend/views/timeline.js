const domready = require('domready');
const Vue = require('vue/dist/vue.min');
domready(function () {
  let timeline = document.getElementById('timeline');
  if (!timeline) {
    return;
  }
  let vm = new Vue({
    el: "#timeline",
    data: {
      newToot: { body: '' },
      toots: []
    },
    methods: {
      postToot: function (event) {
        event.preventDefault();
        let fd = new URLSearchParams();
        fd.set('toot', this.newToot.body);
        fetch('/api/toots', {
          credentials: 'same-origin',
          method: 'POST',
          body: fd
        }).then((response) => {
          return response.json();
        }).then((data) => {
          console.log(data);
        }).catch((error) => {
          console.log(error);
        })
      },
      deleteToot: function (event, id) {
        for (let i = 0; i < this.toots.length; i++) {
          if (this.toots[i].id === id) {
            this.toots.splice(i, 1);
            break;
          }
        }
        if (!event) { return };
        event.preventDefault();
        fetch('/api/toots/' + id, {
          credentials: 'same-origin',
          method: 'DELETE',
        }).then((data) => {
          console.log(data);
        }).catch((error) => {
          console.log(error);
        })
      },
    }
  });
fetch('/api/toots', {
  credentials: 'same-origin',
}).then((response) => {
  return response.json();
}).then(((data) => {
  data.map((toot) => {
    toot.created_at = new Date(toot.created_at);
  });
  vm.toots = data;
})).catch((error) => {
  console.log(error);
})
let ws = new WebSocket("ws://localhost:3000/api/timeline");
ws.addEventListener('message', function (event) {
  let message = JSON.parse(event.data);
  message.toot.created_at = new Date();
  switch (message.action) {
    case "create":
      vm.toots.unshift(message.toot);
      break;
    case "delete":
      vm.deleteToot(null, message.toot.id);
      break;
  }
  //vm.toots.unshift(JSON.parse(event.data));
});
})