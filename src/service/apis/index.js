import { Apior } from 'Utils/apior'
// 报告查询
import other from './other'
import user from './user'

export default new Apior({
    other, user
}, 'API')