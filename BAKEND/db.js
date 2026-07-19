const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const databaseFile = path.join(__dirname, 'database.sqlite3');
let db;

function openDb() {
  if (!db) {
    db = new sqlite3.Database(databaseFile, (err) => {
      if (err) {
        console.error('No se pudo abrir la base de datos:', err.message);
        return;
      }
    });
  }
  return db;
}

function initDb() {
  const database = openDb();

  database.serialize(() => {
    database.run(`
      CREATE TABLE IF NOT EXISTS Usuarios (
        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        usuario TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS Clientes (
        id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        telefono TEXT,
        email TEXT
      );
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS Disenos (
        id_diseno INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        descripcion TEXT,
        precio REAL NOT NULL
      );
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS Turnos (
        id_turno INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT NOT NULL,
        hora TEXT NOT NULL,
        id_cliente INTEGER NOT NULL,
        id_diseno INTEGER NOT NULL,
        FOREIGN KEY (id_cliente) REFERENCES Clientes(id_cliente),
        FOREIGN KEY (id_diseno) REFERENCES Disenos(id_diseno)
      );
    `);

    database.run(`
      CREATE TABLE IF NOT EXISTS Promociones (
        id_promocion INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descuento REAL NOT NULL,
        fecha_fin TEXT
      );
    `);

    database.get('SELECT id_usuario FROM Usuarios WHERE usuario = ?', ['admin'], (err, row) => {
      if (err) {
        console.error('Error verificando usuario inicial:', err.message);
        return;
      }
      if (!row) {
        const passwordHash = bcrypt.hashSync('admin', 10);
        database.run(
          'INSERT INTO Usuarios (nombre, usuario, password) VALUES (?, ?, ?)',
          ['Administrador', 'admin', passwordHash],
          (insertErr) => {
            if (insertErr) {
              console.error('Error creando usuario inicial:', insertErr.message);
            } else {
              console.log('Usuario inicial creado: admin / admin');
            }
          }
        );
      }
    });
  });
}

module.exports = {
  openDb,
  initDb,
};
