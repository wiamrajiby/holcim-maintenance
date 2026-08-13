const express = require('express')
const router = express.Router()
const pool = require('../config/database')

// GET toutes les maintenances
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM maintenances ORDER BY date DESC'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// POST intervention terminée → reset simulateur
router.post('/intervention-terminee', async (req, res) => {
  try {
    // Résoudre alerte prédictive
    await pool.query(`
      UPDATE alertes 
      SET statut = 'resolue'
      WHERE type_alerte = 'predictive' 
      AND statut = 'active'
    `)

    // Créer flag dans PostgreSQL
    await pool.query(`
      INSERT INTO alertes (type, valeur, niveau, statut, type_alerte, email_envoye)
      VALUES ('intervention_terminee', 0, 'info', 'resolue', 'intervention', TRUE)
    `)

    res.json({ message: '✅ Intervention terminée ! Simulateur va reprendre normalement.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// POST créer une maintenance
router.post('/', async (req, res) => {
  try {
    const { description, technicien, priorite } = req.body
    const result = await pool.query(
      'INSERT INTO maintenances (description, technicien, priorite) VALUES ($1, $2, $3) RETURNING *',
      [description, technicien, priorite]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT mettre à jour statut
router.put('/:id', async (req, res) => {
  try {
    const { statut } = req.body
    const result = await pool.query(
      'UPDATE maintenances SET statut = $1 WHERE id = $2 RETURNING *',
      [statut, req.params.id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router