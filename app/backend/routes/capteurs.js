const express = require('express')
const router = express.Router()
const pool = require('../config/database')

// GET toutes les données
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM capteurs ORDER BY id DESC LIMIT 100'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET dernières mesures
router.get('/latest', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM capteurs ORDER BY id DESC LIMIT 1'
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// GET données temps réel
router.get('/realtime', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM capteurs_realtime ORDER BY id DESC LIMIT 50'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET dernière mesure temps réel
router.get('/realtime/latest', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM capteurs_realtime ORDER BY id DESC LIMIT 1'
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET pannes uniquement
router.get('/pannes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM capteurs WHERE panne = 1'
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router