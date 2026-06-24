import React, { useEffect, useState } from 'react'
import { isNonEmpty } from '../utils/validators'

export default function DisenosView({ presenter }) {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: 0 })
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
  useEffect(() => load(), [])

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!isNonEmpty(form.nombre)) { setError('Nombre es requerido'); return }
    if (form.precio < 0) { setError('Precio inválido'); return }
    setSaving(true)
    try {
      if (editing) {
        await presenter.update(editing, form)
        setEditing(null)
        setSuccess('Diseño actualizado')
      } else {
        await presenter.add(form)
        setSuccess('Diseño agregado')
      }
      setForm({ nombre: '', descripcion: '', precio: 0 })
      await load()
      setTimeout(()=>setSuccess(null),2000)
    } catch(err) {
      setError('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const edit = (d) => {
    setEditing(d.id_diseno)
    setForm({ nombre: d.nombre, descripcion: d.descripcion, precio: d.precio })
  }

  const remove = async (id) => {
    if (!confirm('Eliminar diseño?')) return
    try {
      await presenter.remove(id)
      await load()
    } catch(err) {
      setError('Error: ' + err.message)
    }
  }

  return (
    <div>
      <h2>Diseños</h2>
      <div className="layout-row">
        <div className="col-1">
          <div className="card">
            <h3>{editing ? 'Editar Diseño' : 'Nuevo Diseño'}</h3>
            <form onSubmit={submit} className="form-grid">
              <input placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} />
              <input placeholder="Descripción" value={form.descripcion} onChange={e=>setForm({...form,descripcion:e.target.value})} />
              <input placeholder="Precio" type="number" value={form.precio} onChange={e=>setForm({...form,precio:parseFloat(e.target.value||0)})} />
              <div style={{display:'flex',gap:8}}>
                <button type="submit" className={`btn ${saving? 'saving':''}`} disabled={saving}>{editing ? 'Guardar' : 'Agregar'}</button>
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
              <thead><tr><th>Nombre</th><th>Descripción</th><th>Precio</th><th>Acciones</th></tr></thead>
              <tbody>
                {list.map(d => (
                  <tr key={d.id_diseno}>
                    <td>{d.nombre}</td>
                    <td>{d.descripcion}</td>
                    <td>{d.precio}</td>
                    <td>
                      <button onClick={() => edit(d)} className="btn">Editar</button>
                      <button onClick={() => remove(d.id_diseno)} className="btn btn-ghost btn-delete" style={{marginLeft:8}}>Borrar</button>
                    </td>
                  </tr>
                ))}
                {list.length===0 && <tr><td colSpan={4} className="empty-row">No hay diseños</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
