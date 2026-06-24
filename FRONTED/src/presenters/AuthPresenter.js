import { authService } from '../services/api'

export default class AuthPresenter {
  async login(username, password) {
    try {
      const u = await authService.login(username, password)
      if (u) {
        localStorage.setItem('stitch_current_user', JSON.stringify(u))
        return u
      }
      return null
    } catch (e) {
      console.error('Login error:', e)
      return null
    }
  }

  logout() {
    authService.logout()
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('stitch_current_user') || 'null')
  }
}
