export default class Cliente {
  constructor({ id_cliente = null, nombre = '', telefono = '', email = '' } = {}) {
    this.id_cliente = id_cliente
    this.nombre = nombre
    this.telefono = telefono
    this.email = email
  }
}
