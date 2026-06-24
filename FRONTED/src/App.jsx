import React, { useState } from 'react'
import AuthPresenter from './presenters/AuthPresenter'
import ClientePresenter from './presenters/ClientePresenter'
import DisenoPresenter from './presenters/DisenoPresenter'
import TurnoPresenter from './presenters/TurnoPresenter'
import PromocionPresenter from './presenters/PromocionPresenter'
import LoginView from './views/LoginView'
import ClientesView from './views/ClientesView'
import DisenosView from './views/DisenosView'
import TurnosView from './views/TurnosView'
import PromocionesView from './views/PromocionesView'

const auth = new AuthPresenter()
const clientePresenter = new ClientePresenter()
const disenoPresenter = new DisenoPresenter()
const turnoPresenter = new TurnoPresenter()
const promocionPresenter = new PromocionPresenter()

export default function App() {
  const [user, setUser] = useState(auth.getCurrentUser())
  const [route, setRoute] = useState(user ? 'clientes' : 'login')
  const theme = 'beige'

  const handleLogin = (u) => {
    setUser(u)
    setRoute('clientes')
  }

  const logout = () => {
    auth.logout()
    setUser(null)
    setRoute('login')
  }

  return (
    <div className={`app theme-${theme}`}>
      <header>
        <div style={{display:'flex',alignItems:'center'}}>
          <h1>Nailsart Juliana</h1>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
        </div>
        {user && (
          <nav>
            <button onClick={() => setRoute('clientes')}>Clientes</button>
            <button onClick={() => setRoute('disenos')}>Diseños</button>
            <button onClick={() => setRoute('turnos')}>Turnos</button>
            <button onClick={() => setRoute('promociones')}>Promociones</button>
            <button onClick={logout}>Salir</button>
          </nav>
        )}
      </header>

      <main>
        {route === 'login' && <LoginView presenter={auth} onLogin={handleLogin} />}
        {route === 'clientes' && <ClientesView presenter={clientePresenter} />}
        {route === 'disenos' && <DisenosView presenter={disenoPresenter} />}
        {route === 'turnos' && <TurnosView presenter={turnoPresenter} clientePresenter={clientePresenter} disenoPresenter={disenoPresenter} />}
        {route === 'promociones' && <PromocionesView presenter={promocionPresenter} />}
      </main>
    </div>
  )
}
