class Template {
  constructor(titulo, mensaje, hashtag) {
    this.id = crypto.randomUUID(); // ID único garantizado (HU1)
    this.titulo = titulo;
    this.mensaje = mensaje;
    this.hashtag = hashtag;
    this.fecha = new Date();
  }

  obtenerFechaFormateada() {
    return this.fecha.toLocaleDateString('es-PE');
  }
}