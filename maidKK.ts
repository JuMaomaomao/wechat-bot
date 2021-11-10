import 'dotenv/config.js'

import { Contact, Message, ScanStatus, WechatyBuilder, log } from 'wechaty'

import qrcodeTerminal from 'qrcode-terminal'

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
		const qrcodeImageUrl = [
			'https://wechaty.js.org/qrcode/',
			encodeURIComponent(qrcode),
		].join('')
		log.info(
			'StarterBot',
			'onScan: %s(%s) - %s',
			ScanStatus[status],
			status,
			qrcodeImageUrl
		)

		qrcodeTerminal.generate(qrcode, { small: true }) // show qrcode on console
	} else {
		log.info('StarterBot', 'onScan: %s(%s)', ScanStatus[status], status)
	}
}

// 收到信息
async function onMessage(msg: Message) {
	log.info('StarterBot', msg.toString())
	const contact = msg.talker() // 信息的发送者
	const text = msg.text() // 信息的内容
	const room = msg.room() // 信息来自的群聊，如果不是来自群聊则返回null
	if (room) {
		// 群聊信息
		const topic = await room.topic() // 群名称
		console.log(
			`群聊: ${topic} 联系人: ${contact.name()} 文字内容: ${text}`
		)
	} else {
		// 个人消息
		console.log(`联系人: ${contact.name()} 文字内容: ${text}`)
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
