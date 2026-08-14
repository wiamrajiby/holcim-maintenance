const express = require('express')
const router = express.Router()
const pool = require('../config/database')

// GET toutes les alertes
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM alertes ORDER BY date DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST créer une alerte
router.post('/', async (req, res) => {
  try {
    const { type, valeur, niveau, gere } = req.body
    
    // Vérifier si alerte prédictive acquittée
    const predictiveAcquittee = await pool.query(`
      SELECT * FROM alertes 
      WHERE type = 'alerte_predictive'
      AND statut = 'traitee'
      AND date > NOW() - INTERVAL '5 minutes'
    `)
    
    const statut = predictiveAcquittee.rows.length > 0 ? 'geree' : 'active'
    
    const result = await pool.query(
      'INSERT INTO alertes (type, valeur, niveau, statut) VALUES ($1, $2, $3, $4) RETURNING *',
      [type, valeur, niveau, statut]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT acquitter une alerte
router.put('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE alertes SET statut = $1 WHERE id = $2 RETURNING *',
      ['traitee', req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router