const API_BASE = 'http://localhost:3000/api'

export async function get(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`)
  if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`)
  return res.json()
}

export async function post(endpoint, data) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error(`POST ${endpoint} failed: ${res.status}`)
  return res.json()
}

export async function put(endpoint, data) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error(`PUT ${endpoint} failed: ${res.status}`)
  return res.json()
}

export async function del(endpoint) {
  const res = await fetch(`${API_BASE}${endpoint}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`DELETE ${endpoint} failed: ${res.status}`)
  return res.status === 204 ? null : res.json()
}
