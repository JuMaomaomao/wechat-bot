import 'dotenv/config.js'
import { FileBox } from 'file-box'
import {
    Contact,
    Message,
    ScanStatus,
    WechatyBuilder,
    log,
    UrlLink,
    MiniProgram
} from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'
import { WechatyWeixinOpenAI } from 'wechaty-weixin-openai'
import { MiniProgramImpl, UrlLinkImpl } from 'wechaty/impls'

import { api1, api2 } from '../request/api'

const openAIAppid = 'XAdRQrKjSzZIw03'
const openAIToken = '3hB39sV2LD2kJBQn26VGqkCpcjB7bx'
const openAIEncodingAESKey = 'dfhxxoN5bPvcHq3bdBlaSCdkOmFklWNdqwMZrz3NMHg'

// 登录
function onLogin(user: Contact) {
	log.info('StarterBot', '%s login', user)
}

// 退出登录
function onLogout(user: Contact) {
	log.info('StarterBot', '%s logout', user)
}

// 扫码
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

// 收到信息
// const processCommonMaterial = async function onMessage(msg: Message) {
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
        interface p1 {
            userid: string
        }
        let params1:p1 = {
            userid: '112123'
        }
        api1(params1).then((res: any) => {
            // success
            interface p2 {
                signature: string;
                query: string;
            }
            let params2:p2 = {
                signature: res.signature,
                query: text
            }
            api2(params2).then((res: any) => {
                // success
                console.log(res.msg)
            }).catch((error) => {
                // error
                console.log(error)
            })
        }).catch((error) => {
            // error
            console.log(error)
        })

    } else { // 否则为 个人消息
        console.log(`联系人: ${contact.name()} 信息内容: ${text}`)
        // 2、回复 文字
        if (/^text$/i.test(msg.text())) {
            await msg.say('当匹配到text时，我就会回复这句话')
        }

        // 调用api接口，并且提供了两个参数
        api1("").then(res => {
            // success
            console.log(res)
        }).catch((error) => {
            // error
            console.log(error)
        })
    }
}

// 初始化机器人
const bot = WechatyBuilder.build({
	name: 'maidKK',
	puppet: 'wechaty-puppet-wechat',
	// puppet: 'wechaty-puppet-service'
	// puppetOptions: {
	//   token: 'xxx',
	// }
})

// 绑定事件
bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

// 启动机器人
bot.start()
	.then(() => log.info('StarterBot', 'Starter Bot Started.'))
	.catch((e) => log.error('StarterBot', e))
