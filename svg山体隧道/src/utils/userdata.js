import MD5 from 'js-md5'
/**
 * 用户加密操作
 */
class Userservice {
  constructor () {
    this.setTime()
  }
  /**
     * 加密
     * @param {string} txt 密码
     */
  encryPassword (txt) {
    const md5 = MD5(txt)
    const password = MD5(md5 + 'Pt213')
    return password
  }
  /**
     * 存储
     * @param {string} phone 手机号
     * @param {string} password 密码
     */
  saveUserData (phone, password) {
    const psd = this.encryPassword(password)
    const lastLogin = Date.now()
    const uses = {
      phone,
      psd,
      lastLogin
    }
    const USERS = JSON.stringify(uses)
    localStorage.setItem('userDATA', USERS)
    return uses
  }
  /**
     * 获取
     */
  getUserData () {
    const uses = localStorage.getItem('userDATA')
    return uses
  }
  /**
     * 时间限制24小时
     */
  async setTime () {
    const nowtime = Date.now()
    const UserData = this.getUserData()
    const lasttime = await JSON.parse(UserData)
    if (lasttime && lasttime.lastLogin) {
      if ((nowtime - lasttime.lastLogin) > (1000 * 60 * 60 * 24)) {
        localStorage.clear()
        return false
      } else {
        return true
      }
    } else {
      localStorage.clear()
      return false
    }
  }
}
export default new Userservice()
