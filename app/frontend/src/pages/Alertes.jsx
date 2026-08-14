import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Remplace par ton vrai fichier logo
import holcimLogo from '../assets/holcim-logo-dark.png';

function Alertes() {
  const [alertes, setAlertes] = useState([]);
  const [capteurs, setCapteurs] = useState([]);
  const [alertesPredictives, setAlertesPredictives] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [alertesRes, capteursRes] = await Promise.all([
        axios.get('http://localhost:5000/api/alertes'),
        axios.get('http://localhost:5000/api/capteurs/realtime')
      ]);

      const toutesAlertes = alertesRes.data;
      setAlertesPredictives(toutesAlertes.filter(a => a.type === 'alerte_predictive'));
      setAlertes(toutesAlertes)
      setCapteurs(capteursRes.data.filter(c => c.vibration > 7));
    } catch (err) {
      console.error(err);
    }
  };

  const acquitter = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/alertes/${id}`);

      const alerte = alertesPredictives.find(a => a.id === id);
      if (alerte) {
        await axios.post('http://localhost:5000/api/predict/simulateur/reset');
         localStorage.setItem('panneGeree', 'true'); // ← AJOUTE
        alert('✅ Intervention planifiée ! La panne a été évitée avec succès !');
      }
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    ['Dashboard', '/dashboard'],
    ['Machine BC1', '/machine'],
    ['Alertes', '/alertes'],
    ['Maintenance', '/maintenance'],
    ['Historique', '/historique'],
    ['Rapports', '/rapports'],
    ['Profil', '/profil'],
  ];

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      minHeight: '100vh',
      background: 'radial-gradient(circle at 70% 30%, #1F5C8C, #051426 65%)'
    }}>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-item { animation: fadeInUp 0.5s ease both; }
        .kpi-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .kpi-hover:hover { transform: translateY(-5px); box-shadow: 0 12px 28px rgba(0,0,0,0.28); }
        .nav-link {
          position: relative; background: transparent; border: none;
          padding: 14px 16px; font-size: 15px; font-weight: bold;
          cursor: pointer; color: #555; transition: color 0.2s ease;
        }
        .nav-link::after {
          content: ''; position: absolute; left: 16px; right: 16px; bottom: 0;
          height: 3px; border-radius: 3px;
          background: linear-gradient(90deg, #2E8FD6, #6FC24C);
          transform: scaleX(0); transform-origin: left; transition: transform 0.25s ease;
        }
        .nav-link:hover { color: #051426; }
        .nav-link:hover::after { transform: scaleX(1); }
        .nav-link.active { color: #051426; }
        .nav-link.active::after { transform: scaleX(1); }
        .nav-link:active { color: #2E8FD6; }
        .btn-action { transition: transform 0.15s ease, opacity 0.2s ease; }
        .btn-action:hover { opacity: 0.9; }
        .btn-action:active { transform: scale(0.96); }
        .table-row { transition: background 0.15s ease; }
        .table-row:hover { background: #F7F9FB; }
      `}</style>

      {/* Header blanc, style Dashboard/Machine */}
      <div style={{ background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 40px', borderBottom: '1px solid #eee'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '150px', height: '26px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
              <img src={holcimLogo} alt="Holcim" style={{ height: '26px', transform: 'scale(2.4)', transformOrigin: 'left center', display: 'block' }} />
            </div>
            <span style={{ color: '#999', fontSize: '13px' }}>/ maintenance prédictive</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'linear-gradient(90deg, #2E8FD6, #6FC24C)',
              color: 'white', border: 'none', padding: '9px 18px',
              borderRadius: '6px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer'
            }}
          >
            ← Dashboard
          </button>
        </div>

        <div style={{ display: 'flex', gap: '4px', padding: '0 40px' }}>
          {navItems.map(([label, path]) => {
            const active = path === '/alertes';
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`nav-link ${active ? 'active' : ''}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '36px 40px' }}>

        <div className="fade-item" style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', letterSpacing: '1px', color: '#6FC24C', fontWeight: 'bold', margin: '0 0 6px', textTransform: 'uppercase' }}>
            Système d'alertes
          </p>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: 0 }}>
            Ventilateur De Tirage Royal BC1
          </h2>
        </div>

        {/* Compteurs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '24px' }}>
          <CounterCard
            delay={0.05}
            value={capteurs.filter(c => c.vibration > 20).length}
            label="Alertes critiques"
            color="#E24B4A"
          />
          <CounterCard
            delay={0.12}
            value={alertesPredictives.filter(a => a.statut === 'active').length}
            label="Alertes prédictives"
            color="#D8A13A"
          />
          <CounterCard
            delay={0.19}
            value={capteurs.length}
            label="Total dépassements"
            color="#2E8FD6"
          />
        </div>

        {/* Alertes prédictives */}
        {alertesPredictives.length > 0 && (
          <div className="fade-item" style={{ animationDelay: '0.25s', background: 'white', borderRadius: '10px', padding: '22px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ width: '4px', height: '18px', background: '#D8A13A', borderRadius: '2px' }} />
              <h3 style={{ color: '#B07E1E', margin: 0, fontSize: '15px', fontWeight: 'bold' }}>
                🔮 Alertes prédictives — Panne prévue
              </h3>
            </div>
            {alertesPredictives.map(alerte => (
              <div key={alerte.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px', border: '1px solid #F0DDA8', borderRadius: '8px',
                marginBottom: '10px', background: '#FFFBF0'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#B07E1E', fontSize: '16px' }}>
                    Panne prévue dans {alerte.valeur} jours
                  </div>
                  <div style={{ color: '#777', fontSize: '13px', marginTop: '4px' }}>
                    Commander les pièces et planifier une intervention
                  </div>
                  <div style={{ color: '#aaa', fontSize: '12px', marginTop: '4px' }}>
                    {new Date(alerte.date).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  <StatusBadge active={alerte.statut === 'active'} activeText="En attente" doneText="Traitée" activeColor="#D8A13A" />
                   {/* Bouton acquitter visible si active OU email_envoye */}
               {(alerte.statut === 'active' || alerte.statut === 'email_envoye') && (
                 <button
      className="btn-action"
      onClick={() => acquitter(alerte.id)}
      style={{ background: '#6FC24C', color: 'white', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
    >
      Intervention planifiée
    </button>
  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dépassements vibration > 7 */}
        <div className="fade-item" style={{ animationDelay: '0.32s', background: 'white', borderRadius: '10px', padding: '22px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginBottom: '20px' }}>
          <h3 style={{ color: '#051426', marginBottom: '16px', fontSize: '15px', fontWeight: 'bold' }}>
            Dépassements seuil vibration {'>'} 7 mm/s
          </h3>
          {capteurs.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#6FC24C', padding: '24px', fontSize: '15px', fontWeight: 'bold' }}>
              ✅ Aucun dépassement détecté
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#051426', color: 'white' }}>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px', borderRadius: '6px 0 0 6px' }}>Date</th>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>Vibration</th>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>Intensité</th>
                  <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px', borderRadius: '0 6px 6px 0' }}>Niveau</th>
                </tr>
              </thead>
              <tbody>
                {capteurs.slice(0, 10).map((c, i) => (
                  <tr key={i} className="table-row" style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 10px', fontSize: '13px' }}>{c.date}</td>
                    <td style={{ padding: '12px 10px', fontWeight: 'bold', color: '#E24B4A', fontSize: '13px' }}>{c.vibration} mm/s</td>
                    <td style={{ padding: '12px 10px', fontSize: '13px' }}>{c.intensite} A</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{
                        background: c.vibration > 10 ? '#E24B4A' : '#D8A13A',
                        color: 'white', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold'
                      }}>
                        {c.vibration > 10 ? 'CRITIQUE' : 'AVERTISSEMENT'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Historique alertes normales */}
        <div className="fade-item" style={{ animationDelay: '0.4s', background: 'white', borderRadius: '10px', padding: '22px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          <h3 style={{ color: '#051426', marginBottom: '16px', fontSize: '15px', fontWeight: 'bold' }}>
            Historique alertes
          </h3>
          {alertes.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#999', padding: '24px', fontSize: '13px' }}>
              Aucune alerte enregistrée
            </div>
          ) : (
            alertes.map(alerte => (
              <div key={alerte.id} className="table-row" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#051426', fontSize: '14px' }}>{alerte.type}</div>
                  <div style={{ color: '#777', fontSize: '13px' }}>Valeur: {alerte.valeur} | Niveau: {alerte.niveau}</div>
                  <div style={{ color: '#aaa', fontSize: '12px' }}>{new Date(alerte.date).toLocaleString()}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <span style={{ 
  background: alerte.statut === 'active' ? '#C00000' : 
              alerte.statut === 'geree' ? '#1F4E79' :
              '#1E7145', 
  color: 'white', 
  padding: '3px 10px', 
  borderRadius: '20px', 
  fontSize: '12px' 
}}>
  {alerte.statut === 'active' ? '⚠️ Active' : 
   alerte.statut === 'geree' ? '🔧 Gérée' : 
   alerte.statut === 'email_envoye' ? '📧 Email envoyé' :
   '✅ Traitée'}
</span>
                  {alerte.statut === 'active' && (
                    <button
                      className="btn-action"
                      onClick={() => acquitter(alerte.id)}
                      style={{ background: '#6FC24C', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      Acquitter
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function CounterCard({ value, label, color, delay = 0 }) {
  return (
    <div className="fade-item kpi-hover" style={{
      animationDelay: `${delay}s`,
      background: 'white',
      borderRadius: '10px',
      padding: '22px',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color }} />
      <div style={{ fontSize: '32px', fontWeight: 'bold', color }}>{value}</div>
      <div style={{ color: '#777', fontSize: '13px', marginTop: '4px' }}>{label}</div>
    </div>
  );
}

function StatusBadge({ active, activeText, doneText, activeColor }) {
  return (
    <span style={{
      background: active ? activeColor : '#6FC24C',
      color: 'white',
      padding: '3px 12px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 'bold'
    }}>
      {active ? activeText : doneText}
    </span>
  );
}

export default Alertes;
