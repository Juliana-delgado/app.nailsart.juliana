const express = require('express');
const { openDb } = require('../db');

const router = express.Router();

router.get('/', (req, res, next) => {
  const db = openDb();
  db.all('SELECT * FROM Clientes ORDER BY nombre', [], (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

router.get('/:id', (req, res, next) => {
  const db = openDb();
  db.get('SELECT * FROM Clientes WHERE id_cliente = ?', [req.params.id], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ error: 'Cliente no encontrado.' });
    res.json(row);
  });
});

router.post('/', (req, res, next) => {
  const { nombre, telefono, email } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio.' });

  const db = openDb();
  db.run(
    'INSERT INTO Clientes (nombre, telefono, email) VALUES (?, ?, ?)',
    [nombre, telefono || '', email || ''],
    function (err) {
      if (err) return next(err);
      res.status(201).json({ id_cliente: this.lastID, nombre, telefono, email });
    }
  );
});

router.put('/:id', (req, res, next) => {
  const { nombre, telefono, email } = req.body;
  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio.' });

  const db = openDb();
  db.run(
    'UPDATE Clientes SET nombre = ?, telefono = ?, email = ? WHERE id_cliente = ?',
    [nombre, telefono || '', email || '', req.params.id],
    function (err) {
      if (err) return next(err);
      if (this.changes === 0) return res.status(404).json({ error: 'Cliente no encontrado.' });
      res.json({ id_cliente: Number(req.params.id), nombre, telefono, email });
    }
  );
});

router.delete('/:id', (req, res, next) => {
  const db = openDb();
  db.run('DELETE FROM Clientes WHERE id_cliente = ?', [req.params.id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) return res.status(404).json({ error: 'Cliente no encontrado.' });
    res.json({ message: 'Cliente eliminado correctamente.' });
  });
});

module.exports = router;
