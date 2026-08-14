import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Remplace par ton vrai fichier logo
import holcimLogo from '../assets/holcim-logo-dark.png';

function Profil() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [seuils, setSeuils] = useState({
    vibration: 7,
    temperature: 100,
    intensite: 1200
  });
  const [notifications, setNotifications] = useState({
    email: true,
    alertes: true,
    rapports: false
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
        @keyframes popCheck {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        .fade-item { animation: fadeInUp 0.5s ease both; }
        .kpi-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .kpi-hover:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(0,0,0,0.25); }
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
        .avatar-hover { transition: transform 0.3s ease; }
        .avatar-hover:hover { transform: scale(1.08) rotate(-3deg); }
        input[type=range] {
          accent-color: #2E8FD6;
          cursor: pointer;
        }
        .toggle-switch { transition: background 0.25s ease; }
        .toggle-knob { transition: left 0.25s ease; }
        .save-btn { transition: transform 0.15s ease, box-shadow 0.2s ease; }
        .save-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(0,0,0,0.25); }
        .save-btn:active { transform: scale(0.97); }
        .saved-pop { animation: popCheck 0.4s ease; }
        .row-item { transition: background 0.15s ease; }
        .row-item:hover { background: #F7F9FB; }
      `}</style>

      {/* Header blanc */}
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
            const active = path === '/profil';
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
            Profil &amp; paramètres
          </p>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: 0 }}>
            Mon compte
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>

          {/* Infos utilisateur */}
          <div className="fade-item kpi-hover" style={{ animationDelay: '0.05s', background: 'white', borderRadius: '10px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', height: 'fit-content' }}>
            <h3 style={{ color: '#051426', marginBottom: '20px', fontSize: '15px', fontWeight: 'bold' }}>
              Informations utilisateur
            </h3>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div className="avatar-hover" style={{
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #2E8FD6, #6FC24C)',
                color: 'white', fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px', cursor: 'default'
              }}>
                👤
              </div>
              <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#051426' }}>{user.nom}</div>
              <div style={{ color: '#777', fontSize: '13px', marginBottom: '8px' }}>{user.email}</div>
              <span style={{ background: '#051426', color: 'white', padding: '4px 16px', borderRadius: '20px', fontSize: '12px' }}>
                {user.role}
              </span>
            </div>

            <div style={{ borderTop: '1px solid #eee', paddingTop: '16px' }}>
              {[
                ['Nom', user.nom],
                ['Email', user.email],
                ['Rôle', user.role],
                ['Entreprise', 'LafargeHolcim Maroc'],
                ['Site', 'Usine de Meknès'],
              ].map(([k, v]) => (
                <div key={k} className="row-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 8px', borderRadius: '6px' }}>
                  <span style={{ color: '#999', fontSize: '13px' }}>{k}</span>
                  <span style={{ fontWeight: 'bold', color: '#051426', fontSize: '13px' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Seuils d'alerte */}
            <div className="fade-item kpi-hover" style={{ animationDelay: '0.12s', background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <h3 style={{ color: '#051426', marginBottom: '18px', fontSize: '15px', fontWeight: 'bold' }}>
                Seuils d'alerte personnalisés
              </h3>

              {[
                ['Vibration critique (mm/s)', 'vibration', 0, 40],
                ['Température max (°C)', 'temperature', 0, 200],
                ['Intensité max (A)', 'intensite', 0, 1400],
              ].map(([label, key, min, max]) => (
                <div key={key} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ color: '#333', fontWeight: 'bold', fontSize: '13px' }}>{label}</label>
                    <span style={{ color: '#2E8FD6', fontWeight: 'bold', fontSize: '13px' }}>{seuils[key]}</span>
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={seuils[key]}
                    onChange={(e) => setSeuils({ ...seuils, [key]: e.target.value })}
                    style={{ width: '100%' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#bbb' }}>
                    <span>{min}</span>
                    <span>{max}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Notifications */}
            <div className="fade-item kpi-hover" style={{ animationDelay: '0.19s', background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
              <h3 style={{ color: '#051426', marginBottom: '18px', fontSize: '15px', fontWeight: 'bold' }}>
                Préférences notifications
              </h3>

              {[
                ['Alertes par email', 'email'],
                ['Notifications alertes', 'alertes'],
                ['Rapports automatiques', 'rapports'],
              ].map(([label, key]) => (
                <div key={key} className="row-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 8px', borderRadius: '6px' }}>
                  <span style={{ color: '#333', fontSize: '13px' }}>{label}</span>
                  <div
                    className="toggle-switch"
                    onClick={() => setNotifications({ ...notifications, [key]: !notifications[key] })}
                    style={{
                      width: '46px', height: '24px', borderRadius: '13px',
                      background: notifications[key] ? 'linear-gradient(90deg, #2E8FD6, #6FC24C)' : '#ddd',
                      cursor: 'pointer', position: 'relative'
                    }}
                  >
                    <div className="toggle-knob" style={{
                      width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                      position: 'absolute', top: '2px',
                      left: notifications[key] ? '24px' : '2px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                    }} />
                  </div>
                </div>
              ))}

              <button
                className={`save-btn ${saved ? 'saved-pop' : ''}`}
                onClick={handleSave}
                style={{
                  width: '100%', padding: '13px',
                  background: saved ? '#6FC24C' : 'linear-gradient(90deg, #2E8FD6, #6FC24C)',
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginTop: '18px'
                }}
              >
                {saved ? '✅ Sauvegardé !' : 'Sauvegarder'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profil;
