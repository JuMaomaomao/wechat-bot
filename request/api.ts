import { get, post } from './http'
let jwt = require('json-web-token')

const openAIAppid = 'XAdRQrKjSzZIw03'
const openAIToken = '3hB39sV2LD2kJBQn26VGqkCpcjB7bx'
const openAIEncodingAESKey = 'dfhxxoN5bPvcHq3bdBlaSCdkOmFklWNdqwMZrz3NMHg'

// interface p { userid: string }
// const userid: p = { userid: 'fml19991111' }
let signature: string = ""

// 获取signature接口
// export const getSignature = () => post(`https://openai.weixin.qq.com/openapi/sign/${openAIToken}`, userid)
export const getSignature = () => post(`https://openai.weixin.qq.com/openapi/sign/${openAIToken}`, { userid: openAIAppid })
    .then((res: any) => {
        signature = res.signature || ""
        return res.signature
    }).catch((error) => {
        console.log(error)
    })

// 智能对话接口
export const aibot = (p: any) => post(`https://openai.weixin.qq.com/openapi/aibot/${openAIToken}`, { signature: signature || getSignature(), p })

// 敏感内容检测接口
export const sensitive = (query: any) => post(`https://openai.weixin.qq.com/openapi/nlp/sensitive/${openAIToken}`, jwt.encode(openAIEncodingAESKey, {
    uid: openAIAppid, //能标识用户的唯一用户id，可以是openid
    data: {
        q: query,
        model: 'cnnn'
    }
}))

// 情感分析接口
export const sentiment = (query: any) => post(`https://openai.weixin.qq.com/openapi/nlp/sentiment/${openAIToken}`, jwt.encode(openAIEncodingAESKey, {
    uid: openAIAppid, //能标识用户的唯一用户id，可以是openid
    data: {
        q: query,
        // 3类别： 正面，负面，无情感
        // 6类别： 喜欢，高兴，厌恶，悲伤，愤怒，无情感
        mode: "3class"
    }
}))

// 智能对话接口2
export const message = (query: any) => post(`https://openai.weixin.qq.com/openapi/message/${openAIToken}`, jwt.encode(openAIEncodingAESKey, {
    username: query.username,
    msg: query.text
}))

// 闲聊接口
export const casualChat = (query: any) => post(`https://openai.weixin.qq.com/openapi/nlp/casual_chat/${openAIToken}`, jwt.encode(openAIEncodingAESKey, {
    uid: openAIAppid, //能标识用户的唯一用户id，可以是openid
    data: {
        q: query
    }
}))