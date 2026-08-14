import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Remplace par ton vrai fichier logo
import holcimLogo from '../assets/holcim-logo-dark.png';

function Historique() {
  const [pannes, setPannes] = useState([]);
  const [filtre, setFiltre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/capteurs/pannes');
      setPannes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Calcul MTBF et MTTR
  const mtbf = pannes.length > 1
    ? Math.round(18256 / pannes.length)
    : 0;

  // Données graphique par vibration
  const dataGraphique = [
    { name: '7-10', count: pannes.filter(p => p.vibration >= 7 && p.vibration < 10).length },
    { name: '10-15', count: pannes.filter(p => p.vibration >= 10 && p.vibration < 15).length },
    { name: '15-20', count: pannes.filter(p => p.vibration >= 15 && p.vibration < 20).length },
    { name: '>20', count: pannes.filter(p => p.vibration >= 20).length },
  ];

  const pannesFiltrees = pannes.filter(p =>
    filtre === '' || p.date.includes(filtre) || p.vibration.toString().includes(filtre)
  );

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
        @keyframes growUp {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
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
        .search-input {
          transition: border-color 0.2s ease, box-shadow 0.2s ease, width 0.25s ease;
        }
        .search-input:focus {
          outline: none;
          border-color: #2E8FD6 !important;
          box-shadow: 0 0 0 3px rgba(46,143,214,0.15);
          width: 240px !important;
        }
        .table-row { transition: background 0.15s ease, transform 0.15s ease; }
        .table-row:hover { background: #F0F6FB !important; transform: translateX(2px); }
        .fiche-item { transition: transform 0.2s ease, background 0.2s ease; }
        .fiche-item:hover { transform: translateY(-3px); background: #EEF2F6 !important; }
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
            const active = path === '/historique';
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
            Historique &amp; statistiques
          </p>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: 0 }}>
            Ventilateur De Tirage Royal BC1
          </h2>
        </div>

        {/* KPI MTBF MTTR */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '24px' }}>
          <StatCard delay={0.05} value={pannes.length} label="Total pannes" sub="Sur 2 ans de données" color="#E24B4A" />
          <StatCard delay={0.12} value={`${mtbf}h`} label="MTBF" sub="Temps moyen entre pannes" color="#6FC24C" />
          <StatCard delay={0.19} value="37" label="Vibration max" sub="mm/s enregistrée" color="#D8A13A" />
        </div>

        {/* Graphique fréquence pannes */}
        <div className="fade-item" style={{ animationDelay: '0.25s', background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginBottom: '20px' }}>
          <h3 style={{ color: '#051426', marginBottom: '16px', fontSize: '15px', fontWeight: 'bold' }}>
            Fréquence des pannes par niveau de vibration
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dataGraphique}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} label={{ value: 'Vibration (mm/s)', position: 'insideBottom', offset: -5, fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} label={{ value: 'Nombre', angle: -90, position: 'insideLeft', fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#E24B4A" name="Pannes" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={900} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fiche machine */}
        <div className="fade-item" style={{ animationDelay: '0.32s', background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginBottom: '20px' }}>
          <h3 style={{ color: '#051426', marginBottom: '16px', fontSize: '15px', fontWeight: 'bold' }}>
            Fiche machine — Ventilateur De Tirage Royal BC1
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {[
              ['Nom', 'Ventilateur De Tirage Royal BC1'],
              ['Type', 'Ventilateur industriel'],
              ['Vitesse max', '917 RPM'],
              ['Intensité max', '1326 A'],
              ['Vibration critique', '7 mm/s'],
              ['Données', 'Avril 2019 → Mai 2021'],
            ].map(([k, v]) => (
              <div key={k} className="fiche-item" style={{ padding: '12px', background: '#F7F9FB', borderRadius: '8px' }}>
                <div style={{ color: '#999', fontSize: '11px' }}>{k}</div>
                <div style={{ fontWeight: 'bold', color: '#051426', fontSize: '13px', marginTop: '2px' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tableau pannes */}
        <div className="fade-item" style={{ animationDelay: '0.4s', background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#051426', fontSize: '15px', fontWeight: 'bold', margin: 0 }}>Tableau des pannes</h3>
            <input
              className="search-input"
              type="text"
              placeholder="Filtrer..."
              value={filtre}
              onChange={(e) => setFiltre(e.target.value)}
              style={{ padding: '8px 14px', border: '2px solid #e5e5e5', borderRadius: '20px', width: '180px', fontSize: '13px' }}
            />
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#051426', color: 'white' }}>
                <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px', borderRadius: '6px 0 0 6px' }}>ID</th>
                <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>Date</th>
                <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>Vibration</th>
                <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>Intensité</th>
                <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px', borderRadius: '0 6px 6px 0' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {pannesFiltrees.slice(0, 20).map((p, i) => (
                <tr key={i} className="table-row" style={{ borderBottom: '1px solid #eee', background: i % 2 === 0 ? '#fff' : '#FAFBFC' }}>
                  <td style={{ padding: '10px', fontSize: '13px' }}>{p.id}</td>
                  <td style={{ padding: '10px', fontSize: '13px' }}>{p.date}</td>
                  <td style={{ padding: '10px', fontWeight: 'bold', color: '#E24B4A', fontSize: '13px' }}>{p.vibration} mm/s</td>
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
      </div>
    </div>
  );
}

function StatCard({ value, label, sub, color, delay = 0 }) {
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
      <div style={{ color: '#051426', fontSize: '13px', fontWeight: 'bold', marginTop: '4px' }}>{label}</div>
      <div style={{ color: '#aaa', fontSize: '11px', marginTop: '2px' }}>{sub}</div>
    </div>
  );
}

export default Historique;
