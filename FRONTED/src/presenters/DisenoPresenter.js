import { designService } from '../services/api'

export default class DisenoPresenter {
  async getAll() {
    try {
      return await designService.getAll()
    } catch (e) {
      console.error('getAll error:', e)
      return []
    }
  }

  async add(data) {
    try {
      return await designService.create(data)
    } catch (e) {
      console.error('add error:', e)
      return null
    }
  }

  async update(id, data) {
    try {
      return await designService.update(id, data)
    } catch (e) {
      console.error('update error:', e)
      return null
    }
  }

  async remove(id) {
    try {
      await designService.delete(id)
    } catch (e) {
      console.error('remove error:', e)
    }
  }
}
