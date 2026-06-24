import React, { useEffect, useState } from 'react'
import { isNonEmpty, isEmail } from '../utils/validators'

export default function ClientesView({ presenter }) {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ nombre: '', telefono: '', email: '' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const data = await presenter.getAll()
      setList(data)
    } catch(err) {
      console.error('Error loading:', err)
    }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!isNonEmpty(form.nombre)) { setError('Nombre es requerido'); return }
    if (form.email && !isEmail(form.email)) { setError('Email inválido'); return }
    setSaving(true)
    try {
      if (editing) {
        await presenter.update(editing, form)
        setEditing(null)
        setSuccess('Cliente actualizado')
      } else {
        await presenter.add(form)
        setSuccess('Cliente agregado')
      }
      setForm({ nombre: '', telefono: '', email: '' })
      await load()
      setTimeout(()=>setSuccess(null),2000)
    } catch(err) {
      setError('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const edit = (c) => {
    setEditing(c.id_cliente)
    setForm({ nombre: c.nombre, telefono: c.telefono, email: c.email })
  }

  const remove = async (id) => {
    if (!confirm('Eliminar cliente?')) return
    try {
      await presenter.remove(id)
      await load()
    } catch(err) {
      setError('Error: ' + err.message)
    }
  }

  return (
    <div>
      <h2>Clientes</h2>
      <div className="layout-row">
        <div className="col-1">
          <div className="card">
            <h3>{editing ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
            <form onSubmit={submit} className="form-grid">
              <input placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} />
              <input placeholder="Teléfono" value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})} />
              <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
              <div style={{display:'flex',gap:8}}>
                <button type="submit" className={`btn ${saving? 'saving':''}`} disabled={saving}>{editing ? 'Guardar' : 'Agregar'}</button>
                <div style={{flex:1}} />
              </div>
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}
            </form>
          </div>
        </div>
        <div className="col-2">
          <div className="card">
            <h3>Listado</h3>
            <table>
              <thead><tr><th>Nombre</th><th>Teléfono</th><th>Email</th><th>Acciones</th></tr></thead>
              <tbody>
                {list.map(c => (
                  <tr key={c.id_cliente}>
                    <td>{c.nombre}</td>
                    <td>{c.telefono}</td>
                    <td>{c.email}</td>
                    <td>
                      <button onClick={() => edit(c)} className="btn">Editar</button>
                      <button onClick={() => remove(c.id_cliente)} className="btn btn-ghost btn-delete" style={{marginLeft:8}}>Borrar</button>
                    </td>
                  </tr>
                ))}
                {list.length===0 && <tr><td colSpan={4} className="empty-row">No hay clientes registrados</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
