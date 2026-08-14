import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Remplace par ton vrai fichier logo
import holcimLogo from '../assets/holcim-logo-dark.png';

function Rapports() {
  const [capteurs, setCapteurs] = useState([]);
  const [pannes, setPannes] = useState([]);
  const [periode, setPeriode] = useState('tout');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [capteursRes, pannesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/capteurs'),
        axios.get('http://localhost:5000/api/capteurs/pannes')
      ]);
      setCapteurs(capteursRes.data);
      setPannes(pannesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Vibration', 'Intensite', 'Vitesse', 'Panne'];
    const rows = capteurs.map(c => [c.id, c.date, c.vibration, c.intensite, c.vitesse, c.panne]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rapport_holcim_bc1.csv';
    a.click();
  };

  const exportPDF = () => {
    window.print();
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
        .kpi-hover:hover { transform: translateY(-5px); box-shadow: 0 8px 20px rgba(0,0,0,0.12); }
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
        .periode-btn { transition: all 0.2s ease; }
        .periode-btn:hover { transform: translateY(-2px); }
        .export-btn { transition: transform 0.15s ease, box-shadow 0.2s ease; }
        .export-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.25); }
        .export-btn:active { transform: scale(0.97); }
        .table-row { transition: background 0.15s ease; }
        .table-row:hover { background: #F7F9FB; }
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
            const active = path === '/rapports';
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
            Rapports
          </p>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: 0 }}>
            Ventilateur De Tirage Royal BC1
          </h2>
        </div>

        {/* Sélection période */}
        <div className="fade-item" style={{ animationDelay: '0.05s', background: 'white', borderRadius: '10px', padding: '22px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginBottom: '20px' }}>
          <h3 style={{ color: '#051426', marginBottom: '14px', fontSize: '15px', fontWeight: 'bold' }}>
            Sélection de la période
          </h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[['tout', 'Tout'], ['2019', '2019'], ['2020', '2020'], ['2021', '2021']].map(([val, label]) => (
              <button
                key={val}
                className="periode-btn"
                onClick={() => setPeriode(val)}
                style={{
                  padding: '10px 22px',
                  background: periode === val ? 'linear-gradient(90deg, #2E8FD6, #6FC24C)' : '#F0F3F7',
                  color: periode === val ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '13px'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Aperçu rapport */}
        <div className="fade-item" style={{ animationDelay: '0.12s', background: 'white', borderRadius: '10px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginBottom: '20px' }} id="rapport">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '150px', height: '30px', overflow: 'hidden', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={holcimLogo} alt="Holcim" style={{ height: '30px', transform: 'scale(2.4)', display: 'block' }} />
            </div>
            <div style={{ fontSize: '17px', color: '#051426', fontWeight: 'bold' }}>Rapport de maintenance prédictive</div>
            <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>Ventilateur De Tirage Royal BC1 — Usine Meknès</div>
            <div style={{ fontSize: '13px', color: '#999' }}>Période : {periode === 'tout' ? 'Avril 2019 → Mai 2021' : periode}</div>
          </div>

          {/* Statistiques */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
            {[
              ['Total mesures', capteurs.length, '#2E8FD6'],
              ['Pannes détectées', pannes.length, '#E24B4A'],
              ['Taux disponibilité', `${capteurs.length ? Math.round((1 - pannes.length / capteurs.length) * 100) : 0}%`, '#6FC24C'],
              ['Vibration max', '37 mm/s', '#D8A13A'],
            ].map(([label, val, color]) => (
              <div key={label} className="kpi-hover" style={{ textAlign: 'center', padding: '16px', background: '#F7F9FB', borderRadius: '10px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color }} />
                <div style={{ fontSize: '22px', fontWeight: 'bold', color }}>{val}</div>
                <div style={{ color: '#777', fontSize: '12px', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Tableau résumé */}
          <h3 style={{ color: '#051426', marginBottom: '14px', fontSize: '15px', fontWeight: 'bold' }}>
            Résumé des pannes
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#051426', color: 'white' }}>
                <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px', borderRadius: '6px 0 0 6px' }}>Date</th>
                <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>Vibration</th>
                <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>Intensité</th>
                <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px', borderRadius: '0 6px 6px 0' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {pannes.slice(0, 10).map((p, i) => (
                <tr key={i} className="table-row" style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', fontSize: '13px' }}>{p.date}</td>
                  <td style={{ padding: '10px', color: '#E24B4A', fontWeight: 'bold', fontSize: '13px' }}>{p.vibration} mm/s</td>
                  <td style={{ padding: '10px', fontSize: '13px' }}>{p.intensite} A</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: '#E24B4A', color: 'white', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                      PANNE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Boutons export */}
        <div className="fade-item" style={{ animationDelay: '0.2s', display: 'flex', gap: '16px' }}>
          <button
            className="export-btn"
            onClick={exportPDF}
            style={{ padding: '15px 30px', background: '#E24B4A', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Export PDF
          </button>
          <button
            className="export-btn"
            onClick={exportCSV}
            style={{ padding: '15px 30px', background: 'linear-gradient(90deg, #2E8FD6, #6FC24C)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Export Excel / CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default Rapports;
