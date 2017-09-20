const electron = require('electron')
const shell = electron.shell
const body = [{ body: 'みんな大好きレポート!' },
              { body: '楽しいレポート!' },
              { body: '素敵なレポート!' },
              { body: 'とりあえずレポート!' },
              { body: 'エクセレントレポート!' },
              { body: 'report!!!!' }]
setTimeout(() => {
  let notification = new Notification(
    '進捗どうですか？',
    body[Math.floor(Math.random() * body.length)],
  )
  notification.onclick = (() => {
    shell.openExternal('https://secure.nnn.ed.jp/mypage/report/pc/list/index')
  })
}, 2000);



