export default class Turno {
  constructor({ id_turno = null, fecha = '', hora = '', id_cliente = null, id_diseno = null } = {}) {
    this.id_turno = id_turno
    this.fecha = fecha
    this.hora = hora
    this.id_cliente = id_cliente
    this.id_diseno = id_diseno
  }
}
