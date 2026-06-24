const express = require('express');
const { openDb } = require('../db');

const router = express.Router();

router.get('/', (req, res, next) => {
  const db = openDb();
  db.all('SELECT * FROM Promociones ORDER BY fecha_fin DESC', [], (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

router.get('/:id', (req, res, next) => {
  const db = openDb();
  db.get('SELECT * FROM Promociones WHERE id_promocion = ?', [req.params.id], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ error: 'Promoción no encontrada.' });
    res.json(row);
  });
});

router.post('/', (req, res, next) => {
  const { titulo, descuento, fecha_fin } = req.body;
  if (!titulo || typeof descuento !== 'number') {
    return res.status(400).json({ error: 'Título y descuento son obligatorios, descuento debe ser numérico.' });
  }

  const db = openDb();
  db.run(
    'INSERT INTO Promociones (titulo, descuento, fecha_fin) VALUES (?, ?, ?)',
    [titulo, descuento, fecha_fin || null],
    function (err) {
      if (err) return next(err);
      res.status(201).json({ id_promocion: this.lastID, titulo, descuento, fecha_fin });
    }
  );
});

router.put('/:id', (req, res, next) => {
  const { titulo, descuento, fecha_fin } = req.body;
  if (!titulo || typeof descuento !== 'number') {
    return res.status(400).json({ error: 'Título y descuento son obligatorios, descuento debe ser numérico.' });
  }

  const db = openDb();
  db.run(
    'UPDATE Promociones SET titulo = ?, descuento = ?, fecha_fin = ? WHERE id_promocion = ?',
    [titulo, descuento, fecha_fin || null, req.params.id],
    function (err) {
      if (err) return next(err);
      if (this.changes === 0) return res.status(404).json({ error: 'Promoción no encontrada.' });
      res.json({ id_promocion: Number(req.params.id), titulo, descuento, fecha_fin });
    }
  );
});

router.delete('/:id', (req, res, next) => {
  const db = openDb();
  db.run('DELETE FROM Promociones WHERE id_promocion = ?', [req.params.id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) return res.status(404).json({ error: 'Promoción no encontrada.' });
    res.json({ message: 'Promoción eliminada correctamente.' });
  });
});

module.exports = router;
