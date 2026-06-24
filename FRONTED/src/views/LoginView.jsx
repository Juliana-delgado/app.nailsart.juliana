import React, { useState } from 'react'
import { isNonEmpty } from '../utils/validators'

export default function LoginView({ presenter, onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!isNonEmpty(usuario) || !isNonEmpty(password)) {
      setError('Completar usuario y contraseña')
      return
    }
    setSaving(true)
    try {
      const u = await presenter.login(usuario, password)
      if (u) {
        setSuccess('Login correcto')
        setTimeout(()=> onLogin(u), 300)
      } else setError('Usuario o contraseña incorrectos')
    } catch(err) {
      setError('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card card--center">
      <h2>Login</h2>
      <form onSubmit={submit} className="form-grid">
        <input placeholder="Usuario" value={usuario} onChange={e=>setUsuario(e.target.value)} />
        <input placeholder="Contraseña" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" className={`btn ${saving? 'saving':''}`} disabled={saving}>Entrar</button>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
      <div style={{marginTop:8}} className="muted">Usuario por defecto: <strong>admin</strong> / <strong>admin</strong></div>
    </div>
  )
}
