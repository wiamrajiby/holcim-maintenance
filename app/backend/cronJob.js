const cron = require('node-cron')
const pool = require('./config/database')
const { envoyerEmail, envoyerEmailPredictif } = require('./emailService')

// ✅ Cron 1 — Email urgent alerte critique non acquittée
cron.schedule('* * * * *', async () => {
  try {
    console.log('🔍 Vérification alertes critiques non acquittées...')
    const result = await pool.query(`
      SELECT * FROM alertes 
      WHERE statut = 'active' 
      AND type != 'alerte_predictive'
      AND date < NOW() - INTERVAL '1 minute'
    `)
    if (result.rows.length > 0) {
      for (const alerte of result.rows) {
        await envoyerEmail(alerte.valeur, alerte.date)
        await pool.query(
          "UPDATE alertes SET statut = 'email_envoye' WHERE id = $1",
          [alerte.id]
        )
        console.log(`📧 Email urgent envoyé pour alerte ID: ${alerte.id}`)
      }
    } else {
      console.log('✅ Aucune alerte critique non acquittée')
    }
  } catch (err) {
    console.error('Erreur cron critique:', err)
  }
})

// 🆕 Cron 2 — Email prédictif si pas acquitté après 1 minute
cron.schedule('* * * * *', async () => {
  try {
    const result = await pool.query(`
      SELECT * FROM alertes 
      WHERE statut = 'active' 
      AND type = 'alerte_predictive'
      AND date < NOW() - INTERVAL '1 minute'
    `)
    if (result.rows.length > 0) {
      for (const alerte of result.rows) {
        await envoyerEmailPredictif(alerte.valeur, null)
        await pool.query(
          "UPDATE alertes SET statut = 'email_envoye' WHERE id = $1",
          [alerte.id]
        )
        console.log(`📧 Email prédictif envoyé pour alerte ID: ${alerte.id}`)
      }
    }
  } catch (err) {
    console.error('Erreur cron prédictif:', err)
  }
})

console.log('✅ Cron job démarré — vérification chaque minute')