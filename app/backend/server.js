const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./cronJob')
const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Route test
app.get('/', (req, res) => {
  res.json({ 
    message: '✅ Serveur Holcim Maintenance opérationnel !',
    machine: 'Ventilateur De Tirage Royal BC1'
  })
})

/// Routes
app.use('/api/capteurs', require('./routes/capteurs'))
app.use('/api/alertes', require('./routes/alertes'))
app.use('/api/predict', require('./routes/predict'))
app.use('/api/auth', require('./routes/auth'))           // ← AJOUTE
app.use('/api/maintenance', require('./routes/maintenance')) // ← AJOUTE
app.use('/api/simulateur', require('./routes/predict')) // ← AJOUTE

// Démarrage serveur
const PORT = 5000
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`)
})