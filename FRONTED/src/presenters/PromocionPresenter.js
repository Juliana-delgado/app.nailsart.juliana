import { promotionService } from '../services/api'

export default class PromocionPresenter {
  async getAll() {
    try {
      return await promotionService.getAll()
    } catch (e) {
      console.error('getAll error:', e)
      return []
    }
  }

  async add(data) {
    try {
      return await promotionService.create(data)
    } catch (e) {
      console.error('add error:', e)
      return null
    }
  }

  async update(id, data) {
    try {
      return await promotionService.update(id, data)
    } catch (e) {
      console.error('update error:', e)
      return null
    }
  }

  async remove(id) {
    try {
      await promotionService.delete(id)
    } catch (e) {
      console.error('remove error:', e)
    }
  }
}
