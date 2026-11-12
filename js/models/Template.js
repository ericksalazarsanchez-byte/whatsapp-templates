class Template {
  constructor(titulo, mensaje, hashtag) {
    this.titulo = titulo;
    this.mensaje = mensaje;
    this.hashtag = hashtag;
    this.fecha = new Date();
  }

  obtenerFechaFormateada() {
    return this.fecha.toLocaleDateString('es-PE');
  }
}