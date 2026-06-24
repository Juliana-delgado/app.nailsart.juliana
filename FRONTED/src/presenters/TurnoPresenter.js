import { appointmentService } from '../services/api'

export default class TurnoPresenter {
  async getAll() {
    try {
      return await appointmentService.getAll()
    } catch (e) {
      console.error('getAll error:', e)
      return []
    }
  }

  async add(data) {
    try {
      return await appointmentService.create(data)
    } catch (e) {
      console.error('add error:', e)
      return null
    }
  }

  async update(id, data) {
    try {
      return await appointmentService.update(id, data)
    } catch (e) {
      console.error('update error:', e)
      return null
    }
  }

  async remove(id) {
    try {
      await appointmentService.delete(id)
    } catch (e) {
      console.error('remove error:', e)
    }
  }
}
