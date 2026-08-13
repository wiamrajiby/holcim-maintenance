const express = require('express')
const router = express.Router()
const axios = require('axios')
const pool = require('../config/database')

// Stockage prédiction en mémoire
let derniereTendance = null
let resetDemande = false

// POST — Simulateur envoie prédiction
router.post('/save-tendance', async (req, res) => {
  derniereTendance = req.body

  // Si alerte prédictive → créer dans PostgreSQL
  if (req.body.statut === 'alerte_predictive') {
    try {
      // Vérifier si alerte prédictive déjà créée dans la dernière heure
    // APRÈS — crée toujours une alerte active
// Vérifier si alerte active existe déjà
const existing = await pool.query(`
  SELECT * FROM alertes 
  WHERE type = 'alerte_predictive'
  AND statut = 'active'
`)

if (existing.rows.length === 0) {
  await pool.query(`
    INSERT INTO alertes (type, valeur, niveau, statut)
    VALUES ($1, $2, $3, $4)
  `, [
    'alerte_predictive',
    req.body.jours_restants,
    'predictive',
    'active'
  ])
  console.log(`⚠️ Alerte prédictive créée — Panne dans ${req.body.jours_restants} jours !`)
}
    } catch (err) {
      console.error('Erreur alerte prédictive:', err)
    }
  }

  res.json({ ok: true })
})

// GET — React récupère la prédiction
router.get('/tendance', (req, res) => {
  if (derniereTendance) {
    res.json(derniereTendance)
  } else {
    res.json({
      statut: 'normal',
      message: '✅ En attente de données...',
      jours_restants: null,
      vibration_actuelle: null
    })
  }
})

// GET — Simulateur vérifie si reset demandé
router.get('/simulateur/status', (req, res) => {
  res.json({ reset: resetDemande })
})

// POST — Reset simulateur après intervention
router.post('/simulateur/reset', (req, res) => {
  resetDemande = true
  derniereTendance = null
  console.log('🔄 Reset simulateur demandé !')
  res.json({ ok: true })
})

// POST — Simulateur confirme reset effectué
router.post('/simulateur/reset-done', (req, res) => {
  resetDemande = false
  console.log('✅ Reset simulateur effectué !')
  res.json({ ok: true })
})

// POST prédiction ML normale
router.post('/', async (req, res) => {
  try {
    const response = await axios.post('http://127.0.0.1:5001/predict', req.body)
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ error: 'ML API non disponible' })
  }
})

module.exports = router