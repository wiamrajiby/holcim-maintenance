import { useNavigate } from 'react-router-dom';

// Remplace ce chemin par ton vrai fichier logo
import holcimLogo from '../assets/holcim-logo-dark.png';

function LandingPage() {
  const navigate = useNavigate();

  const stack = ['React', 'Node.js', 'Flask', 'PostgreSQL', 'Scikit-learn', 'Docker'];

  const legacy = [
    { title: 'Maintenance réactive', text: "On intervient après la panne, quand la production est déjà arrêtée." },
    { title: 'Données inexploitées', text: "Les fichiers Excel du BC1 sont stockés sans jamais être analysés." },
    { title: 'Alertes absentes', text: "Aucun signal avant que la vibration atteigne un niveau critique." },
    { title: 'Décisions à l\u2019aveugle', text: "Les interventions se planifient sans donnée fiable sur l\u2019état réel de la machine." },
  ];

  const withHolcim = [
    { title: 'Maintenance prédictive', text: "Le modèle ML détecte les signes de panne avant qu'elle survienne." },
    { title: 'Deux ans de données exploités', text: "18 256 mesures nettoyées et transformées en intelligence exploitable." },
    { title: 'Alertes automatiques', text: "Notification immédiate dès que la vibration dépasse 7 mm/s." },
    { title: 'Décisions guidées par la donnée', text: "Dashboard temps réel avec score de santé et pourcentage de confiance." },
  ];

  const solutions = [
    {
      word: 'surveillance',
      text: 'Oscillations de vibration du BC1 affichées en direct, avec les seuils critiques toujours visibles.',
      gradient: 'linear-gradient(135deg, #123353, #1F5C8C)',
    },
    {
      word: 'alertes',
      text: 'Notification automatique dès que la vibration dépasse 7 mm/s, avec historique complet.',
      gradient: 'linear-gradient(135deg, #2E5C3E, #4E9A5E)',
    },
    {
      word: 'prédiction',
      text: 'Modèle Random Forest entraîné sur deux ans de données, avec pourcentage de confiance.',
      gradient: 'linear-gradient(135deg, #1F4E79, #2E8FD6)',
    },
    {
      word: 'rapports',
      text: "Export PDF et Excel des données et statistiques, prêts à partager avec l'équipe.",
      gradient: 'linear-gradient(135deg, #3A2E5C, #6B4E9A)',
    },
  ];

  const results = [
    { value: '98.83%', label: 'Précision du modèle ML', tag: 'Random Forest' },
    { value: '18 256', label: 'Mesures nettoyées et analysées', tag: 'Données 2019-2021' },
    { value: '35', label: 'Pannes historiques détectées', tag: 'Vibration > 7 mm/s' },
  ];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#111' }}>

      {/* Navbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 40px',
        borderBottom: '1px solid #eee',
        background: 'white'
      }}>
        <img 
  src={holcimLogo} 
  alt="Holcim" 
  style={{ 
    height: '26px', 
    transform: 'scale(3.8)', 
    transformOrigin: 'left center',
    display: 'block'
  }} 
/>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '13px', fontWeight: 'bold', color: '#333' }}>
          <span>DASHBOARD</span>
          <span>ALERTES</span>
          <span>MAINTENANCE</span>
          <span>RAPPORTS</span>
        </div>
        <button
          onClick={() => navigate('/login')}
          style={{
            background: 'linear-gradient(90deg, #2E8FD6, #6FC24C)',
            color: 'white',
            border: 'none',
            padding: '10px 22px',
            fontSize: '13px',
            fontWeight: 'bold',
            borderRadius: '20px',
            cursor: 'pointer'
          }}
        >
          SE CONNECTER
        </button>
      </div>

      {/* Hero plein écran */}
      <div style={{
        position: 'relative',
        minHeight: '520px',
        background: 'radial-gradient(circle at 70% 40%, #1F5C8C, #051426 65%)',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '60px'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(0deg, rgba(5,20,38,0.85), rgba(5,20,38,0.3))'
        }} />
        <div style={{ position: 'relative', maxWidth: '540px' }}>
          <h1 style={{ color: 'white', fontSize: '46px', fontWeight: 'bold', lineHeight: '1.15', margin: '0 0 16px' }}>
            We <span style={{ color: '#6FC24C' }}>surveillons</span><br />votre ventilateur BC1
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: '1.6', margin: '0 0 28px', maxWidth: '420px' }}>
            Maintenance prédictive intelligente basée sur le big data et le machine
            learning, pour anticiper les pannes avant qu'elles surviennent.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                background: '#0A2A40',
                color: 'white',
                border: 'none',
                padding: '13px 24px',
                fontSize: '13px',
                fontWeight: 'bold',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              accéder au dashboard
            </button>
            <button
              onClick={() => navigate('/machine')}
              style={{
                background: 'white',
                color: '#051426',
                border: 'none',
                padding: '13px 24px',
                fontSize: '13px',
                fontWeight: 'bold',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              voir la machine →
            </button>
          </div>
        </div>
      </div>

      {/* Section blanche intro */}
      <div style={{ background: 'white', padding: '60px 40px' }}>
        <div style={{ maxWidth: '640px' }}>
          <h2 style={{ fontSize: '26px', fontWeight: 'bold', color: '#111', lineHeight: '1.4', margin: '0 0 20px' }}>
            Rendre la maintenance du <span style={{ color: '#2E8FD6' }}>Ventilateur de Tirage Royal BC1</span> plus{' '}
            <span style={{ color: '#4E9A5E' }}>intelligente</span>.
          </h2>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', margin: '0 0 8px' }}>
            L'usine de Meknès collectait ses données de vibration, température et
            intensité sans les exploiter. Ce projet transforme deux ans d'historique
            en un modèle prédictif <strong>de plus de 90% de précision</strong>, connecté
            à un dashboard temps réel.
          </p>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', margin: 0 }}>
            L'objectif : <strong>réduire les arrêts non planifiés</strong> et donner
            aux équipes de maintenance une longueur d'avance sur la panne.
          </p>
        </div>
      </div>

      {/* NOUVEAU — Comparatif inspiré d'Augury (Legacy Tools vs With Augury) */}
      <div style={{ background: '#051426', padding: '64px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px' }}>
            La panne n'a pas à être une surprise.
          </h2>
          <p style={{ color: '#F0997B', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
            Elle peut être anticipée.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', marginBottom: '12px' }}>
              AVANT
            </p>
            {legacy.map((l, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '4px', padding: '16px', marginBottom: '10px' }}>
                <p style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px' }}>{l.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>{l.text}</p>
              </div>
            ))}
          </div>
          <div>
            <p style={{ color: '#6FC24C', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', marginBottom: '12px' }}>
              AVEC HOLCIM MAINTENANCE
            </p>
            {withHolcim.map((w, i) => (
              <div key={i} style={{ background: 'rgba(111,194,76,0.08)', borderRadius: '4px', padding: '16px', marginBottom: '10px' }}>
                <p style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px' }}>{w.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0, lineHeight: '1.5' }}>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bandeau stack technique (remplace "our clients") */}
      <div style={{ background: '#0A2A40', padding: '48px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#6FC24C', margin: '0 0 24px' }}>
          NOTRE STACK TECHNIQUE
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '14px' }}>
          {stack.map((s, i) => (
            <span key={i} style={{
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '13px',
              fontWeight: 'bold',
              padding: '8px 18px',
              borderRadius: '20px'
            }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Blocs solutions alternés, style vintecc */}
      <div style={{ background: '#0A2A40' }}>
        {solutions.map((s, i) => {
          const isReversed = i % 2 === 1;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: isReversed ? 'row-reverse' : 'row',
                alignItems: 'center',
                gap: '40px',
                padding: '40px',
                maxWidth: '1000px',
                margin: '0 auto'
              }}
            >
              <div style={{
                flex: '0 0 380px',
                height: '220px',
                borderRadius: '4px',
                background: s.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: isReversed ? 'flex-end' : 'flex-start',
                padding: '0 24px',
                overflow: 'hidden'
              }}>
                <span style={{ fontSize: '44px', fontWeight: 'bold', color: 'white' }}>
                  {s.word}
                </span>
              </div>
              <div style={{ flex: 1, textAlign: isReversed ? 'right' : 'left' }}>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', margin: '0 0 16px', maxWidth: '360px', marginLeft: isReversed ? 'auto' : 0 }}>
                  {s.text}
                </p>
                <button style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.35)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  padding: '9px 20px',
                  borderRadius: '20px',
                  cursor: 'pointer'
                }}>
                  explorer
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Résultats (remplace les témoignages) */}
      <div style={{ background: '#0A2A40', padding: '20px 40px 64px' }}>
        <p style={{ fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px', color: '#6FC24C', textAlign: 'center', margin: '0 0 28px' }}>
          RÉSULTATS DU PROJET
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {results.map((r, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '4px',
              padding: '24px',
              borderTop: '3px solid #6FC24C'
            }}>
              <p style={{ fontSize: '30px', fontWeight: 'bold', color: 'white', margin: '0 0 8px' }}>
                {r.value}
              </p>
              <p style={{ fontSize: '14px', color: 'white', margin: '0 0 4px', fontWeight: 'bold' }}>
                {r.label}
              </p>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                {r.tag}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA téléchargement rapport, style "casebook" */}
      <div style={{
        background: 'linear-gradient(90deg, #0A2A40, #123353)',
        padding: '56px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '32px'
      }}>
        <div>
          <h3 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: '0 0 8px', lineHeight: '1.3' }}>
            télécharger le<br />rapport technique
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', maxWidth: '360px', margin: 0 }}>
            Retrouvez le détail du nettoyage des données, de l'entraînement du
            modèle ML et de l'architecture complète du projet.
          </p>
        </div>
        <div style={{
          width: '140px',
          height: '100px',
          background: 'white',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#0A2A40',
          fontSize: '13px',
          boxShadow: '0 8px 0 -4px rgba(255,255,255,0.4)'
        }}>
          RAPPORT PFA
        </div>
      </div>

      {/* Footer minimal */}
      <div style={{ background: 'white', padding: '32px 40px', textAlign: 'center' }}>
        <img src={holcimLogo} alt="Holcim" style={{ height: '22px', marginBottom: '16px', filter: 'invert(1)' }} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '12px', color: '#2E8FD6', fontWeight: 'bold', marginBottom: '16px' }}>
          <span>DASHBOARD</span>
          <span>ALERTES</span>
          <span>MAINTENANCE</span>
          <span>RAPPORTS</span>
        </div>
        <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>
          © 2026 LafargeHolcim Maroc — Usine de Meknès · Wiam Rajiby · PFA
        </p>
      </div>

    </div>
  );
}

export default LandingPage;
