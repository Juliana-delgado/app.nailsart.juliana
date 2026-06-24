const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const designRoutes = require('./routes/designs');
const appointmentRoutes = require('./routes/appointments');
const promotionRoutes = require('./routes/promotions');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initDb();

app.get('/', (req, res) => {
  res.json({ message: 'Backend de gestión para salón de uñas en funcionamiento.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/promotions', promotionRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
