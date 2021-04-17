const { scheduler } = require('../../../utils/scheduler')
const { getCookies, saveCookies } = require('../../../utils/util')
const _request = require('../../../utils/request')

var start = async (params) => {
  const { cookies, options } = params

  let init = async (request, savedCookies) => {
    await require('./init')(request, {
      ...params,
      cookies: savedCookies || cookies
    })
    return {
      request
    }
  }
  let taskOption = {
    init
  }

  
await scheduler.regTask('exchangeDFlow', async (request) => {
   await require('./exchangeDFlow').doTask(request, options)
  }, {
    ...taskOption,
    startTime: 0,
    startHours: 0,
    ignoreRelay: true
  })

  // 定时检测流量兑换
  // 可使用 --exchangeDFlowCircle-intervalTime 1800 选项指定流量检查间隔时间，单位秒
  // 可使用 --exchangeDFlowCircle-minFlow 200 选项指定流量检查最小值
  // 可使用 --exchangeDFlowCircle-productId 21010621565413402 选项指定兑换流量包ID
        let { 'exchangeDFlowCircle-productId': productId = 'ff80808166c5ee6701676ce21fd14716' } = options



  // 每日奖励信息结果推送
  if (!('asm_func' in process.env) || process.env.asm_func === 'false') {
    await scheduler.regTask('dailyNotifyReward', async (request) => {
      await require('./dailyNotifyReward').doNotify(request, options)
    }, {
      ...taskOption,
      startTime: 22 * 3600,
      ignoreRelay: true
    })
  }

}
module.exports = {
  start
}