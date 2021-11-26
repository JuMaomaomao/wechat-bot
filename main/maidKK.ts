import 'dotenv/config.js'
import {
    Contact,
    Message,
    ScanStatus,
    WechatyBuilder,
    log,
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'

import { aibot } from '../request/api'

/* ------------------------------ 定义参数 ------------------------------ */
let signature: string = "" // 微信对话开放平台bot对话能力所需签名

/* ------------------------------ 登录 ------------------------------ */
function onLogin(user: Contact) {
    log.info('登陆成功', '%s login', user)
}

/* ------------------------------ 退出登录 ------------------------------ */
function onLogout(user: Contact) {
    log.info('退出登录', '%s logout', user)
}

/* ------------------------------ 扫码 ------------------------------ */
function onScan(qrcode: string, status: ScanStatus) {
    if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
        const qrcodeImageUrl = ['https://wechaty.js.org/qrcode/', encodeURIComponent(qrcode)].join('')
        log.info('请扫码登录', 'onScan: %s(%s) - %s', ScanStatus[status], status, qrcodeImageUrl)
        // 控制台展示二维码
        qrcodeTerminal.generate(qrcode, { small: true })

    } else {
        log.info('扫码成功，请点击确认', 'onScan: %s(%s)', ScanStatus[status], status)
    }
}

/* ------------------------------ 收到信息 ------------------------------ */
async function onMessage(msg: Message) {
    log.info('收到信息', msg.toString())
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
        // return掉机器人自己发出的信息
        if (msg.self()) return
        // 获取撤回的信息
        // if (msg.type() === bot.Message.Type.Recalled && msg.type() === bot.Message.Type.Text) {
        //     const recalledMessage = await msg.toRecalled()
        //     console.log(`撤回的信息为: ${recalledMessage}`)
        //     msg.say(`我知道你撤回的什么哦——${recalledMessage}`)
        // }

        // 接入微信对话开放平台
        // interface p { signature: string; query: string; }
        // let params: p = { signature: signature, query: text }

        // 请求对话
        aibot(text).then((res: any) => {
            if (res && res.msg && res.msg[0] && res.msg[0].content) {
                msg.say(res.msg[0].content)
            }
        }).catch((error) => {
            console.log(error)
        })
    }
}

/* ------------------------------ 初始化机器人 ------------------------------ */
const bot = WechatyBuilder.build({
    name: 'maidKK',
    puppet: 'wechaty-puppet-wechat',
    // puppet: 'wechaty-puppet-service'
    // puppetOptions: {
    //   token: 'xxx',
    // }
})

/* ------------------------------ 机器人绑定事件 ------------------------------ */
bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

/* ------------------------------ 启动机器人 ------------------------------ */
bot.start()
    .then(() => log.info('机器人启动成功', 'Starter Bot Started.'))
    .catch((e) => log.error('机器人启动失败', e))
