import * as http from './httpClient'

export const authService = {
  login: (usuario, password) => http.post('/auth/login', { usuario, password }),
  logout: () => localStorage.removeItem('stitch_current_user')
}

export const clientService = {
  getAll: () => http.get('/clients'),
  create: (data) => http.post('/clients', data),
  update: (id, data) => http.put(`/clients/${id}`, data),
  delete: (id) => http.del(`/clients/${id}`)
}

export const designService = {
  getAll: () => http.get('/designs'),
  create: (data) => http.post('/designs', data),
  update: (id, data) => http.put(`/designs/${id}`, data),
  delete: (id) => http.del(`/designs/${id}`)
}

export const appointmentService = {
  getAll: () => http.get('/appointments'),
  create: (data) => http.post('/appointments', data),
  update: (id, data) => http.put(`/appointments/${id}`, data),
  delete: (id) => http.del(`/appointments/${id}`)
}

export const promotionService = {
  getAll: () => http.get('/promotions'),
  create: (data) => http.post('/promotions', data),
  update: (id, data) => http.put(`/promotions/${id}`, data),
  delete: (id) => http.del(`/promotions/${id}`)
}
