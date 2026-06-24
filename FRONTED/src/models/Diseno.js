export default class Diseno {
  constructor({ id_diseno = null, nombre = '', descripcion = '', precio = 0 } = {}) {
    this.id_diseno = id_diseno
    this.nombre = nombre
    this.descripcion = descripcion
    this.precio = precio
  }
}
