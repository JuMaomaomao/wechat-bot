// 最简单的机器人
const { Wechaty } = require('wechaty')

const bot = new Wechaty()
bot.on('scan', (qrcode, status) => console.log(['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode), '&size=220x220&margin=20',].join('')))
bot.on('login', user => console.log(`User ${user} logined`))
bot.on('message', message => console.log(`Message: ${message}`))
bot.start()

// 在实例化机器人时可以传参
const bot = new Wechaty({
    name: 'your-bot-name', // 命名用来存储登录信息
    puppet: 'wechaty-puppet-padchat', // puppet类型
    token: "WECHATY_PUPPET_PADCHAT_TOKEN", // token
})

// 监听事件，触发回调函数
wechaty.on(event, listener)