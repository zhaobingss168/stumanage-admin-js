/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */
// 后台管理系统服务器地址
  //本地测试
export const baseUrl = 'http://localhost:8001'
 //环境测试
//export const baseUrl = 'http://39.98.248.171:6016'

export default {
  baseUrl
}
