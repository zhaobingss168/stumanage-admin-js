/*
 * 接口统一集成模块
 */
import * as login from './moudules/login'
import * as user from './moudules/user'
import * as role from './moudules/role'
import * as menu from './moudules/menu'
import * as sysConfig from './moudules/sysConfig'
import * as sysLog from './moudules/sysLog'
import * as scheduledTasks from './moudules/scheduledTasks'
import * as applyInfo from './moudules/applyInfo'
import * as dashboard from './moudules/dashboard'

// 默认全部导出
export default {
  login,
  user,
  role,
  menu,
  sysLog,
  scheduledTasks,
  sysConfig,
  dashboard,
  applyInfo
}
