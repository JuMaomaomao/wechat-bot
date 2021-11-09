const { Wechaty } = require('wechaty')

// 在实例化机器人时可以传参
const bot = new Wechaty({
    name: 'your-bot-name', // 命名用来存储登录信息
    puppet: 'wechaty-puppet-padchat', // puppet类型
    token: "WECHATY_PUPPET_PADCHAT_TOKEN", // token
})

// 机器人可以监听的事件

// 当机器人需要扫码登陆的时候会触发这个事件
bot.on('scan', (url, code) => { console.log(`[${code}] Scan ${url} to login.`) })

// 当机器人成功登陆后，会触发login 事件，并会在事件中传递当前登陆机器人的信息
bot.on('login', (user) => { console.log(`user ${user} login`) })

// 当机器人检测到登出的时候，会触发logout 事件，并会在事件中传递机器人的信息
bot.on('logout', (user) => { console.log(`user ${user} logout`) })

// 当机器人收到消息的时候会触发这个事件
bot.on('message', (message) => { console.log(`message ${message} received`) })

// 当有人给机器人发好友请求的时候会触发这个事件
bot.on('friendship', async (friendship) => {
    const contact = friendship.contact()
    if (friendship.type() === bot.Friendship.Type.Receive) { // 1. 当收到一个新的好友请求
        let result = await friendship.accept()
        if (result) {
            console.log(`Request from ${contact.name()} is accept succesfully!`)
        } else {
            console.log(`Request from ${contact.name()} failed to accept!`)
        }
    } else if (friendship.type() === bot.Friendship.Type.Confirm) { // 2. 验证好友请求
        console.log(`New friendship confirmed with ${contact.name()}`)
    }
})

// 当有人进入微信群的时候会触发这个事件。机器人主动进入某个微信群，t那个样会触发这个事件
bot.on('room-join', (room, inviteeList, inviter) => {
    const nameList = inviteeList.map(c => c.name()).join(',')
    console.log(`Room ${room.topic()} got new member ${nameList}, invited by ${inviter}`)
})

// 当机器人把群里某个用户移出群聊的时候会触发这个时间。用户主动退群是无法检测到的
bot.on('room-leave', (room, leaverList) => {
    const nameList = leaverList.map(c => c.name()).join(',')
    console.log(`Room ${room.topic()} lost member ${nameList}`)
})

// 当有人修改群名称的时候会触发这个事件
bot.on('room-topic', (room, topic, oldTopic, changer) => {
    console.log(`Room ${room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
})

// 当收到群邀请的时候，会触发这个事件
bot.on('room-invite', async (roomInvitation) => {
    try {
        console.log(`received room-invite event.`)
        await roomInvitation.accept()
    } catch (error) {
        console.error(error)
    }
})

// 获取机器人的心跳
// bot.on('heartbeat', (heartbeat) => {
//     console.log(`Room ${room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
// })

// 当所有数据加载完成后，会触发这个事件。在wechaty-puppet-padchat 中，它意味着已经加载完成Contact 和Room 的信息
// bot.on('ready', (heartbeat) => {
//     console.log(`Room ${room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
// })

// 当机器人内部出错的时候会触发error 事件
​bot.on('error', (error) => {
    console.error(error)
})

// 启动机器人   返回值 Promise
bot.start()

// 停止机器人   返回值 Promise
bot.stop()

// 登出机器人   返回值 Promise
bot.logout()

// 获取机器人logon/logoff 的状态    返回值 boolean
bot.logonoff()

// 获取当前机器人的所有信息 返回值 ContactSelf
bot.userSelf()

// 机器人自己给自己发消息   返回值 Promise
bot.say('这是一句对自己说的话!')