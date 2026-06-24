import React, { useEffect, useState } from 'react'
import { isNonEmpty } from '../utils/validators'

export default function PromocionesView({ presenter }) {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ titulo: '', descuento: 0, fecha_fin: '' })
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
    if (!isNonEmpty(form.titulo)) { setError('Título requerido'); return }
    if (form.descuento < 0 || form.descuento > 100) { setError('Descuento inválido'); return }
    if (!isNonEmpty(form.fecha_fin)) { setError('Fecha de fin requerida'); return }
    setSaving(true)
    try {
      if (editing) {
        await presenter.update(editing, form)
        setEditing(null)
        setSuccess('Promoción actualizada')
      } else {
        await presenter.add(form)
        setSuccess('Promoción creada')
      }
      setForm({ titulo: '', descuento: 0, fecha_fin: '' })
      await load()
      setTimeout(()=>setSuccess(null),2000)
    } catch(err) {
      setError('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const edit = (p) => {
    setEditing(p.id_promocion)
    setForm({ titulo: p.titulo, descuento: p.descuento, fecha_fin: p.fecha_fin })
  }

  const remove = async (id) => {
    if (!confirm('Eliminar promoción?')) return
    try {
      await presenter.remove(id)
      await load()
    } catch(err) {
      setError('Error: ' + err.message)
    }
  }

  return (
    <div>
      <h2>Promociones</h2>
      <div className="layout-row">
        <div className="col-1">
          <div className="card">
            <h3>{editing ? 'Editar Promoción' : 'Nueva Promoción'}</h3>
            <form onSubmit={submit} className="form-grid">
              <input placeholder="Título" value={form.titulo} onChange={e=>setForm({...form,titulo:e.target.value})} />
              <input placeholder="Descuento (%)" type="number" value={form.descuento} onChange={e=>setForm({...form,descuento:parseFloat(e.target.value||0)})} />
              <input type="date" value={form.fecha_fin} onChange={e=>setForm({...form,fecha_fin:e.target.value})} />
              <div style={{display:'flex',gap:8}}>
                <button type="submit" className={`btn ${saving? 'saving':''}`} disabled={saving}>{editing ? 'Guardar' : 'Crear'}</button>
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
              <thead><tr><th>Título</th><th>Descuento</th><th>Vence</th><th>Acciones</th></tr></thead>
              <tbody>
                {list.map(p => (
                  <tr key={p.id_promocion}>
                    <td>{p.titulo}</td>
                    <td>{p.descuento}%</td>
                    <td>{p.fecha_fin}</td>
                    <td>
                      <button onClick={() => edit(p)} className="btn">Editar</button>
                      <button onClick={() => remove(p.id_promocion)} className="btn btn-ghost btn-delete" style={{marginLeft:8}}>Borrar</button>
                    </td>
                  </tr>
                ))}
                {list.length===0 && <tr><td colSpan={4} className="empty-row">No hay promociones</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
