const express = require('express');
const bcrypt = require('bcryptjs');
const { openDb } = require('../db');

const router = express.Router();

router.post('/register', (req, res, next) => {
  const { nombre, usuario, password } = req.body;
  if (!nombre || !usuario || !password) {
    return res.status(400).json({ error: 'Nombre, usuario y contraseña son obligatorios.' });
  }

  const db = openDb();
  const passwordHash = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO Usuarios (nombre, usuario, password) VALUES (?, ?, ?)',
    [nombre, usuario, passwordHash],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'El usuario ya existe.' });
        }
        return next(err);
      }
      res.status(201).json({ id_usuario: this.lastID, nombre, usuario });
    }
  );
});

router.post('/login', (req, res, next) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios.' });
  }

  const db = openDb();
  db.get('SELECT * FROM Usuarios WHERE usuario = ?', [usuario], (err, row) => {
    if (err) {
      return next(err);
    }
    if (!row || !bcrypt.compareSync(password, row.password)) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    res.json({ id_usuario: row.id_usuario, nombre: row.nombre, usuario: row.usuario });
  });
});

module.exports = router;
