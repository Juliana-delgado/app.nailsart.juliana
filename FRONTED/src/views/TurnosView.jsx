import React, { useEffect, useState } from 'react'
import { isNonEmpty } from '../utils/validators'

export default function TurnosView({ presenter, clientePresenter, disenoPresenter }) {
  const [list, setList] = useState([])
  const [clientes, setClientes] = useState([])
  const [disenos, setDisenos] = useState([])
  const [form, setForm] = useState({ fecha: '', hora: '', id_cliente: '', id_diseno: '' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const [turnos, clientes, disenos] = await Promise.all([
        presenter.getAll(),
        clientePresenter.getAll(),
        disenoPresenter.getAll()
      ])
      setList(turnos)
      setClientes(clientes)
      setDisenos(disenos)
    } catch(err) {
      console.error('Error loading:', err)
    }
  }

  useEffect(() => load(), [])

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!isNonEmpty(form.fecha) || !isNonEmpty(form.hora)) { setError('Fecha y hora son requeridas'); return }
    if (!isNonEmpty(form.id_cliente) || !isNonEmpty(form.id_diseno)) { setError('Seleccione cliente y diseño'); return }
    setSaving(true)
    try {
      const payload = { ...form, id_cliente: parseInt(form.id_cliente||0)||null, id_diseno: parseInt(form.id_diseno||0)||null }
      if (editing) {
        await presenter.update(editing, payload)
        setEditing(null)
        setSuccess('Turno actualizado')
      } else {
        await presenter.add(payload)
        setSuccess('Turno reservado')
      }
      setForm({ fecha: '', hora: '', id_cliente: '', id_diseno: '' })
      await load()
      setTimeout(()=>setSuccess(null),2000)
    } catch(err) {
      setError('Error: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const edit = (t) => {
    setEditing(t.id_turno)
    setForm({ fecha: t.fecha, hora: t.hora, id_cliente: t.id_cliente, id_diseno: t.id_diseno })
  }

  const remove = async (id) => {
    if (!confirm('Eliminar turno?')) return
    try {
      await presenter.remove(id)
      await load()
    } catch(err) {
      setError('Error: ' + err.message)
    }
  }

  const getClienteName = (id) => (clientes.find(c=>c.id_cliente===id)||{}).nombre || '—'
  const getDisenoName = (id) => (disenos.find(d=>d.id_diseno===id)||{}).nombre || '—'

  return (
    <div>
      <h2>Turnos</h2>
      <div className="layout-row">
        <div className="col-1">
          <div className="card">
            <h3>{editing ? 'Editar Turno' : 'Nuevo Turno'}</h3>
            <form onSubmit={submit} className="form-grid">
              <input type="date" value={form.fecha} onChange={e=>setForm({...form,fecha:e.target.value})} />
              <input type="time" value={form.hora} onChange={e=>setForm({...form,hora:e.target.value})} />
              <select value={form.id_cliente||''} onChange={e=>setForm({...form,id_cliente:e.target.value})}>
                <option value="">-- Seleccionar Cliente --</option>
                {clientes.map(c=> <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>)}
              </select>
              <select value={form.id_diseno||''} onChange={e=>setForm({...form,id_diseno:e.target.value})}>
                <option value="">-- Seleccionar Diseño --</option>
                {disenos.map(d=> <option key={d.id_diseno} value={d.id_diseno}>{d.nombre}</option>)}
              </select>
              <div style={{display:'flex',gap:8}}>
                <button type="submit" className={`btn ${saving? 'saving':''}`} disabled={saving}>{editing ? 'Guardar' : 'Reservar'}</button>
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
              <thead><tr><th>Fecha</th><th>Hora</th><th>Cliente</th><th>Diseño</th><th>Acciones</th></tr></thead>
              <tbody>
                {list.map(t => (
                  <tr key={t.id_turno}>
                    <td>{t.fecha}</td>
                    <td>{t.hora}</td>
                    <td>{getClienteName(t.id_cliente)}</td>
                    <td>{getDisenoName(t.id_diseno)}</td>
                    <td>
                      <button onClick={() => edit(t)} className="btn">Editar</button>
                      <button onClick={() => remove(t.id_turno)} className="btn btn-ghost btn-delete" style={{marginLeft:8}}>Borrar</button>
                    </td>
                  </tr>
                ))}
                {list.length===0 && <tr><td colSpan={5} className="empty-row">No hay turnos</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
