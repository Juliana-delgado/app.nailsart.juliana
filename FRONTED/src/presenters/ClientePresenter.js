import { clientService } from '../services/api'

export default class ClientePresenter {
  async getAll() {
    try {
      return await clientService.getAll()
    } catch (e) {
      console.error('getAll error:', e)
      return []
    }
  }

  async add(data) {
    try {
      return await clientService.create(data)
    } catch (e) {
      console.error('add error:', e)
      return null
    }
  }

  async update(id, data) {
    try {
      return await clientService.update(id, data)
    } catch (e) {
      console.error('update error:', e)
      return null
    }
  }

  async remove(id) {
    try {
      await clientService.delete(id)
    } catch (e) {
      console.error('remove error:', e)
    }
  }
}
