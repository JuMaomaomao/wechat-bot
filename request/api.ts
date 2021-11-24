import { get, post } from './http'
const openAIToken = '3hB39sV2LD2kJBQn26VGqkCpcjB7bx'
// 获取signature接口
export const api1 = (p1:any) => post(`https://openai.weixin.qq.com/openapi/sign/${openAIToken}`, p1)
// 智能对话接口
export const api2 = (p2:any) => post(`https://openai.weixin.qq.com/openapi/aibot/${openAIToken}`, p2)
