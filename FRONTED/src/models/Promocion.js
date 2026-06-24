export default class Promocion {
  constructor({ id_promocion = null, titulo = '', descuento = 0, fecha_fin = '' } = {}) {
    this.id_promocion = id_promocion
    this.titulo = titulo
    this.descuento = descuento
    this.fecha_fin = fecha_fin
  }
}
