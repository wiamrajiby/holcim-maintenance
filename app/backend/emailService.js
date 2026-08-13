const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'wiamrajiby@gmail.com',
    pass: 'blchnzjrrgkmvesi'
  }
})

// Email alerte critique
const envoyerEmail = async (vibration, date) => {
  const mailOptions = {
    from: 'wiamrajiby@gmail.com',
    to: 'wiamrajiby@gmail.com',
    subject: '🚨 URGENT — Alerte Holcim BC1 Non Acquittée !',
    html: `
      <div style="font-family:Arial; padding:20px; border:2px solid red; border-radius:10px">
        <h2 style="color:red">🚨 ALERTE CRITIQUE NON TRAITÉE !</h2>
        <p><strong>Machine :</strong> Ventilateur De Tirage Royal BC1</p>
        <p><strong>Vibration :</strong> <span style="color:red">${vibration} mm/s</span></p>
        <p><strong>Seuil critique :</strong> 7 mm/s</p>
        <p><strong>Date alerte :</strong> ${date}</p>
        <p><strong>Statut :</strong> Non acquittée depuis 1 minute !</p>
        <hr>
        <p style="color:red"><strong>⚠️ Intervention immédiate requise !</strong></p>
        <p>LafargeHolcim Maroc — Usine de Meknès</p>
      </div>
    `
  }
  try {
    await transporter.sendMail(mailOptions)
    console.log('✅ Email urgent envoyé !')
  } catch (err) {
    console.error('❌ Erreur email:', err)
  }
}

// Email alerte prédictive ← NOUVEAU
const envoyerEmailPredictif = async (jours, vibration) => {
  const mailOptions = {
    from: 'wiamrajiby@gmail.com',
    to: 'wiamrajiby@gmail.com',
    subject: `⚠️ MAINTENANCE PRÉDICTIVE — Panne prévue dans ${jours} jours !`,
    html: `
      <div style="font-family:Arial; padding:20px; border:2px solid orange; border-radius:10px">
        <h2 style="color:orange">⚠️ ALERTE MAINTENANCE PRÉDICTIVE</h2>
        <p><strong>Machine :</strong> Ventilateur De Tirage Royal BC1</p>
        <p><strong>Panne prévue dans :</strong> 
          <span style="color:red; font-size:24px">${jours} jours</span>
        </p>
        <p><strong>Vibration actuelle :</strong> ${vibration || 'N/A'} mm/s</p>
        <hr>
        <h3>🔧 Actions recommandées :</h3>
        <ul>
          <li>Commander les pièces de rechange</li>
          <li>Planifier une intervention de maintenance</li>
          <li>Préparer les techniciens</li>
        </ul>
        <hr>
        <p>LafargeHolcim Maroc — Usine de Meknès</p>
      </div>
    `
  }
  try {
    await transporter.sendMail(mailOptions)
    console.log('✅ Email prédictif envoyé !')
  } catch (err) {
    console.error('❌ Erreur email prédictif:', err)
  }
}

module.exports = { envoyerEmail, envoyerEmailPredictif }