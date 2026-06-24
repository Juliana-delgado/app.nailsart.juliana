const express = require('express');
const { openDb } = require('../db');

const router = express.Router();

router.get('/', (req, res, next) => {
  const db = openDb();
  db.all('SELECT * FROM Disenos ORDER BY nombre', [], (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

router.get('/:id', (req, res, next) => {
  const db = openDb();
  db.get('SELECT * FROM Disenos WHERE id_diseno = ?', [req.params.id], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ error: 'Diseño no encontrado.' });
    res.json(row);
  });
});

router.post('/', (req, res, next) => {
  const { nombre, descripcion, precio } = req.body;
  if (!nombre || typeof precio !== 'number') {
    return res.status(400).json({ error: 'Nombre y precio son obligatorios, precio debe ser numérico.' });
  }

  const db = openDb();
  db.run(
    'INSERT INTO Disenos (nombre, descripcion, precio) VALUES (?, ?, ?)',
    [nombre, descripcion || '', precio],
    function (err) {
      if (err) return next(err);
      res.status(201).json({ id_diseno: this.lastID, nombre, descripcion, precio });
    }
  );
});

router.put('/:id', (req, res, next) => {
  const { nombre, descripcion, precio } = req.body;
  if (!nombre || typeof precio !== 'number') {
    return res.status(400).json({ error: 'Nombre y precio son obligatorios, precio debe ser numérico.' });
  }

  const db = openDb();
  db.run(
    'UPDATE Disenos SET nombre = ?, descripcion = ?, precio = ? WHERE id_diseno = ?',
    [nombre, descripcion || '', precio, req.params.id],
    function (err) {
      if (err) return next(err);
      if (this.changes === 0) return res.status(404).json({ error: 'Diseño no encontrado.' });
      res.json({ id_diseno: Number(req.params.id), nombre, descripcion, precio });
    }
  );
});

router.delete('/:id', (req, res, next) => {
  const db = openDb();
  db.run('DELETE FROM Disenos WHERE id_diseno = ?', [req.params.id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) return res.status(404).json({ error: 'Diseño no encontrado.' });
    res.json({ message: 'Diseño eliminado correctamente.' });
  });
});

module.exports = router;
