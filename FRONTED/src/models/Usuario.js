export default class Usuario {
  constructor({ id_usuario = null, nombre = '', usuario = '', password = '' } = {}) {
    this.id_usuario = id_usuario
    this.nombre = nombre
    this.usuario = usuario
    this.password = password
  }
}
