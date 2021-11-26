import { FileBox }  from 'file-box'
import {
  Wechaty,
  UrlLink,
  MiniProgram,
}  from 'wechaty'

const bot = new Wechaty()
await bot.start()

const contact = await bot.Contact.find({name: 'lijiarui'})

// 给微信好友发送信息
// 1. 发送文本
await contact.say('welcome to wechaty!')
// 2. 发送文件
import { FileBox }  from 'file-box'
const fileBox1 = FileBox.fromUrl('https://wechaty.github.io/wechaty/images/bot-qr-code.png')
const fileBox2 = FileBox.fromFile('/tmp/text.txt')
await contact.say(fileBox1)
await contact.say(fileBox2)
// 3. 发送联系人名片
const contactCard = bot.Contact.load('contactId')
await contact.say(contactCard)
// 4. 发送url链接
const urlLink = new UrlLink({
  description : 'WeChat Bot SDK for Individual Account, Powered by TypeScript, Docker, and Love',
  thumbnailUrl: 'https://avatars0.githubusercontent.com/u/25162437?s=200&v=4',
  title       : 'Welcome to Wechaty',
  url         : 'https://github.com/wechaty/wechaty',
})
await contact.say(urlLink)
// 5. 发送小程序
const miniProgram = new MiniProgram ({
  appid              : 'gh_0aa444a25adc',
  title              : '我正在使用Authing认证身份，你也来试试吧',
  pagePath           : 'routes/explore.html',
  description        : '身份管家',
  thumbUrl           : '30590201000452305002010002041092541302033d0af802040b30feb602045df0c2c5042b777875706c6f61645f31373533353339353230344063686174726f6f6d3131355f313537363035393538390204010400030201000400',
  thumbKey           : '42f8609e62817ae45cf7d8fefb532e83',
});
await contact.say(miniProgram);

// 获取联系人的昵称
const name = contact.name()

// 获取/设置/删除 好友的备注
// 获取
const alias = await contact.alias()
if (alias === null) {
  console.log('你还没有为此联系人设置备注 ' + contact.name())
} else {
  console.log('你已经为此联系人设置了备注 ' + contact.name() + ':' + alias)
}
// 设置
try {
  await contact.alias('lijiarui')
  console.log(`更改 ${contact.name()} 的备注成功!`)
} catch (e) {
  console.log(`更改 ${contact.name()} 的备注失败!`)
}
// 删除
try {
  const oldAlias = await contact.alias(null)
  console.log(`删除 ${contact.name()} 的备注成功!`)
  console.log(`old alias is ${oldAlias}`)
} catch (e) {
  console.log(`删除 ${contact.name()} 的备注失败!`)
}