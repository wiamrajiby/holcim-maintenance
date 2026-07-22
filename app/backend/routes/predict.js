const express = require('express')
const router = express.Router()

// POST prédiction ML
router.post('/', async (req, res) => {
  res.json({ 
    message: 'Route predict OK ✅',
    panne: 0,
    confiance: 98.83,
    resultat: 'NORMAL'
  })
})

module.exports = router