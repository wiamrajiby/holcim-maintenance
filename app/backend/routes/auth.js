const express = require('express')
const router = express.Router()
const pool = require('../config/database')

// POST login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    )
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }
    const user = result.rows[0]
    res.json({
      message: '✅ Connexion réussie !',
      user: {
        id: user.id,
        nom: user.nom,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nom, email, role FROM users')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router