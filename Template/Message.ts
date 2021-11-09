import 'dotenv/config.js'
import { FileBox } from 'file-box'
import {
    Message,
    log,
} from 'wechaty'

// 收到信息
async function onMessage(msg: Message) {
    log.info('StarterBot', msg.toString())
    // 信息的发送者
    const contact = msg.talker()
    // 信息的接收者
    const toContact = msg.listener()
    // 信息的内容
    const text = msg.text()
    // 信息来自的群聊，如果不是来自群聊则返回null
    const room = msg.room()

    // 信息处理
    if (room) { // 群聊信息
        const topic = await room.topic() // 群名称
        console.log(`群聊: ${topic} 联系人: ${contact.name()} 信息内容: ${text}`)
    } else { // 否则为 个人消息
        console.log(`联系人: ${contact.name()} 信息内容: ${text}`)

        // 回复信息
        // 1、回复 图片
        if (/^ding$/i.test(msg.text())) {
            const fileBox = FileBox.fromUrl('https://chatie.io/wechaty/images/bot-qr-code.png')
            await msg.say(fileBox)
        }
        // 2、回复 文字
        if (/^dong$/i.test(msg.text())) {
            await msg.say('dingdingding')
        }
        // 3、回复 联系人
        if (/^lijiarui$/i.test(msg.text())) {
            const contactCard = await bot.Contact.find({ name: 'lijiarui' })
            if (!contactCard) {
                console.log('not found')
                return
            }
            await msg.say(contactCard)
        }
        // 4、回复 URl链接
        if (/^link$/i.test(msg.text())) {
            const urlLink = new UrlLink({
                description: 'Wechaty is a Bot SDK for Wechat Individual Account which can help you create a bot in 6 lines of javascript, with cross-platform support including Linux, Windows, Darwin(OSX/Mac) and Docker.',
                thumbnailUrl: 'https://camo.githubusercontent.com/f310a2097d4aa79d6db2962fa42bb3bb2f6d43df/68747470733a2f2f6368617469652e696f2f776563686174792f696d616765732f776563686174792d6c6f676f2d656e2e706e67',
                title: 'Wechaty',
                url: 'https://github.com/wechaty/wechaty',
            });
            await msg.say(urlLink);
        }
        // 5、回复小程序
        if (/^mini-program$/i.test(msg.text())) {
            const miniProgram = new MiniProgram ({
                appid: 'gh_0aa444a25adc',
                title: '我正在使用Authing认证身份，你也来试试吧',
                pagePath: 'routes/explore.html',
                thumbUrl: '30590201000452305002010002041092541302033d0af802040b30feb602045df0c2c5042b777875706c6f61645f31373533353339353230344063686174726f6f6d3131355f313537363035393538390204010400030201000400',
                thumbKey: '42f8609e62817ae45cf7d8fefb532e83',
            });
            await msg.say(miniProgram);
        }
    }

    // 获取撤回的信息
    if (msg.type() === bot.Message.Type.Recalled) {
        const recalledMessage = await msg.toRecalled()
        console.log(`撤回的信息为: ${recalledMessage}`)
    }

    // 判断收到的信息的类型
    if (msg.type() === bot.Message.Type.Text) {
        console.log('这是一条文本信息')
    }

    // 判断信息是不是机器人自己发出的
    if (msg.self()) {
        console.log('这条信息是机器人自己发出的!')
    }

    // 获取在群中@的用户列表    (在不同的平台可能表现不同
    const contactList = await msg.mentionList()
    console.log(contactList)

    // 获取机器人是否在群里被@ 了
    if (await msg.mentionSelf()) {
        console.log('有人@我!')
    }

    // 转发信息
    const targetRoom = await bot.Room.find({ topic: '要转发的群名称' })
    if (targetRoom) {
        await msg.forward(targetRoom)
        console.log('forward this message to wechaty room!')
    }

    // 发送信息的时间
    console.log(msg.date())

    // 发送信息的时差，即 发出信息的时间 - 收到信息的时间 中间的时差
    console.log(msg.age())

    // 从消息中提取多媒体文件并把它存入到FileBox里
    msg.toFileBox()

    // 提取转发的微信好友名片内容，并封装成Contact 类型
    msg.toContact()

    // 该方法从Message中提取UrlLink，并将其封装到UrlLink类中
    msg.toUrlLink()

    // 在缓存里找信息
    // msg.find()
    // msg.findAll()
}
