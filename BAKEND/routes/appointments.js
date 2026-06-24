const express = require('express');
const { openDb } = require('../db');

const router = express.Router();

router.get('/', (req, res, next) => {
  const db = openDb();
  const sql = `
    SELECT 
      t.id_turno,
      t.fecha,
      t.hora,
      t.id_cliente,
      c.nombre AS cliente_nombre,
      t.id_diseno,
      d.nombre AS diseno_nombre,
      d.descripcion AS diseno_descripcion,
      d.precio AS diseno_precio
    FROM Turnos t
    JOIN Clientes c ON t.id_cliente = c.id_cliente
    JOIN Disenos d ON t.id_diseno = d.id_diseno
    ORDER BY t.fecha, t.hora
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return next(err);
    res.json(rows);
  });
});

router.get('/:id', (req, res, next) => {
  const db = openDb();
  const sql = `
    SELECT 
      t.id_turno,
      t.fecha,
      t.hora,
      t.id_cliente,
      c.nombre AS cliente_nombre,
      t.id_diseno,
      d.nombre AS diseno_nombre,
      d.descripcion AS diseno_descripcion,
      d.precio AS diseno_precio
    FROM Turnos t
    JOIN Clientes c ON t.id_cliente = c.id_cliente
    JOIN Disenos d ON t.id_diseno = d.id_diseno
    WHERE t.id_turno = ?
  `;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ error: 'Turno no encontrado.' });
    res.json(row);
  });
});

router.post('/', (req, res, next) => {
  const { fecha, hora, id_cliente, id_diseno } = req.body;
  if (!fecha || !hora || !id_cliente || !id_diseno) {
    return res.status(400).json({ error: 'Fecha, hora, cliente y diseño son obligatorios.' });
  }

  const db = openDb();
  db.run(
    'INSERT INTO Turnos (fecha, hora, id_cliente, id_diseno) VALUES (?, ?, ?, ?)',
    [fecha, hora, id_cliente, id_diseno],
    function (err) {
      if (err) return next(err);
      res.status(201).json({ id_turno: this.lastID, fecha, hora, id_cliente, id_diseno });
    }
  );
});

router.put('/:id', (req, res, next) => {
  const { fecha, hora, id_cliente, id_diseno } = req.body;
  if (!fecha || !hora || !id_cliente || !id_diseno) {
    return res.status(400).json({ error: 'Fecha, hora, cliente y diseño son obligatorios.' });
  }

  const db = openDb();
  db.run(
    'UPDATE Turnos SET fecha = ?, hora = ?, id_cliente = ?, id_diseno = ? WHERE id_turno = ?',
    [fecha, hora, id_cliente, id_diseno, req.params.id],
    function (err) {
      if (err) return next(err);
      if (this.changes === 0) return res.status(404).json({ error: 'Turno no encontrado.' });
      res.json({ id_turno: Number(req.params.id), fecha, hora, id_cliente, id_diseno });
    }
  );
});

router.delete('/:id', (req, res, next) => {
  const db = openDb();
  db.run('DELETE FROM Turnos WHERE id_turno = ?', [req.params.id], function (err) {
    if (err) return next(err);
    if (this.changes === 0) return res.status(404).json({ error: 'Turno no encontrado.' });
    res.json({ message: 'Turno eliminado correctamente.' });
  });
});

module.exports = router;
