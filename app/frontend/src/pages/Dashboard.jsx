import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

// Remplace par ton vrai fichier logo
import holcimLogo from '../assets/holcim-logo-dark.png';

function Dashboard() {
  const [capteurs, setCapteurs] = useState([]);
  const [latest, setLatest] = useState(null);
  const [alertes, setAlertes] = useState([]);
  const [pannes, setPannes] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [capteursRes, latestRes, alertesRes, pannesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/capteurs'),
        axios.get('http://localhost:5000/api/capteurs/latest'),
        axios.get('http://localhost:5000/api/alertes'),
        axios.get('http://localhost:5000/api/capteurs/pannes')
      ]);
      setCapteurs(capteursRes.data.slice(0, 50));
      setLatest(latestRes.data);
      setAlertes(alertesRes.data);
      setPannes(pannesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatut = () => {
    if (!latest) return { text: 'Chargement...', color: '#888', pulse: false };
    if (latest.vibration > 7) return { text: 'CRITIQUE', color: '#E24B4A', pulse: true };
    if (latest.vibration > 5) return { text: 'ATTENTION', color: '#D8A13A', pulse: true };
    return { text: 'NORMAL', color: '#6FC24C', pulse: false };
  };

  const statut = getStatut();

  const navItems = [
    ['Dashboard', '/dashboard'],
    ['Machine BC1', '/machine'],
    ['Alertes', '/alertes'],
    ['Maintenance', '/maintenance'],
    ['Historique', '/historique'],
    ['Rapports', '/rapports'],
    ['Profil', '/profil'],
  ];

  const disponibilite = capteurs.length > 0
    ? Math.round((capteurs.filter(c => c.vibration <= 7).length / capteurs.length) * 100)
    : 0;

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
        @keyframes pulseDot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(226,75,74,0.5); }
          50% { box-shadow: 0 0 0 6px rgba(226,75,74,0); }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        .fade-item {
          animation: fadeInUp 0.5s ease both;
        }
        .kpi-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .kpi-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.28);
        }
        .status-dot-pulse {
          animation: pulseDot 1.6s infinite;
        }
        .nav-link {
          position: relative;
          background: transparent;
          border: none;
          padding: 14px 16px;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
          color: #555;
          transition: color 0.2s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 0;
          height: 3px;
          border-radius: 3px;
          background: linear-gradient(90deg, #2E8FD6, #6FC24C);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .nav-link:hover {
          color: #051426;
        }
        .nav-link:hover::after {
          transform: scaleX(1);
        }
        .nav-link.active {
          color: #051426;
        }
        .nav-link.active::after {
          transform: scaleX(1);
        }
        .nav-link:active {
          color: #2E8FD6;
        }
        .logout-btn {
          transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
        }
        .logout-btn:hover {
          background: #E24B4A;
          color: white;
        }
        .logout-btn:active {
          transform: scale(0.96);
        }
      `}</style>

      {/* Header blanc, style Login */}
      <div style={{ background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.15)' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 40px',
          borderBottom: '1px solid #eee'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '150px', height: '26px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
              <img src={holcimLogo} alt="Holcim" style={{ height: '26px', transform: 'scale(3)', transformOrigin: 'left center', display: 'block' }} />
            </div>
            <span style={{ color: '#999', fontSize: '13px' }}>/ maintenance prédictive</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#333' }}>{user.nom}</span>
            <span style={{
              background: '#F0F3F7',
              color: '#333',
              padding: '5px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              border: '1px solid #e5e5e5'
            }}>
              {user.role}
            </span>
            <button
              className="logout-btn"
              onClick={() => { localStorage.clear(); navigate('/'); }}
              style={{
                background: 'transparent',
                color: '#E24B4A',
                border: '1px solid #E24B4A',
                padding: '7px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Déconnexion
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', padding: '0 40px' }}>
          {navItems.map(([label, path]) => {
            const active = path === '/dashboard';
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

        {/* En-tête page */}
        <div className="fade-item" style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '12px', letterSpacing: '1px', color: '#6FC24C', fontWeight: 'bold', margin: '0 0 6px', textTransform: 'uppercase' }}>
            Vue d'ensemble
          </p>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: 0 }}>
            Ventilateur De Tirage Royal BC1
          </h2>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginBottom: '28px' }}>
          <KpiCard delay={0.05} label="Statut machine" value={statut.text} sub="Ventilateur BC1" color={statut.color} pulse={statut.pulse} />
          <KpiCard delay={0.12} label="Alertes actives" value={alertes.length} sub="Total alertes" color="#D8A13A" />
          <KpiCard delay={0.19} label="Disponibilité" value={`${disponibilite}%`} sub="Taux normal" color="#6FC24C" />
          <KpiCard delay={0.26} label="Pannes détectées" value={pannes.length} sub="Total historique" color="#E24B4A" />
        </div>

        {/* Dernière mesure */}
        {latest && (
          <div className="fade-item" style={{ animationDelay: '0.32s', background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ color: '#051426', fontSize: '15px', fontWeight: 'bold', margin: 0 }}>
                Dernière mesure
              </h3>
              <span style={{ fontSize: '12px', color: '#999' }}>{latest.date}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
              {[
                ['Vibration', latest.vibration, 'mm/s', latest.vibration > 7 ? '#E24B4A' : '#6FC24C'],
                ['Intensité', latest.intensite, 'A', '#051426'],
                ['Vitesse', latest.vitesse, 'RPM', '#051426'],
                ['T° Bobinage', latest.t_bobinage_1, '°C', '#D8A13A'],
                ['T° Palier', latest.t_palier_1_moteur, '°C', '#D8A13A'],
                ['Débit Air', latest.debit_air, 'm³/h', '#051426'],
              ].map(([label, val, unit, color]) => (
                <div key={label} className="kpi-hover" style={{ textAlign: 'center', padding: '14px 8px', background: '#F7F9FB', borderRadius: '8px' }}>
                  <div style={{ color: '#999', fontSize: '11px', marginBottom: '4px' }}>{label}</div>
                  <div style={{ fontSize: '19px', fontWeight: 'bold', color }}>{val}</div>
                  <div style={{ color: '#bbb', fontSize: '10px' }}>{unit}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Graphique Oscillations */}
        <div className="fade-item" style={{ animationDelay: '0.4s', background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#051426', fontSize: '15px', fontWeight: 'bold', margin: 0 }}>
              Oscillations vibration
            </h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#999' }}>
              <span><span style={{ display: 'inline-block', width: '10px', height: '2px', background: '#E24B4A', marginRight: '5px' }} />Seuil 7 mm/s</span>
              <span><span style={{ display: 'inline-block', width: '10px', height: '2px', background: '#6FC24C', marginRight: '5px' }} />Min 0.3 mm/s</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={capteurs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="id" tick={{ fontSize: 11 }} label={{ value: 'Mesures', position: 'insideBottom', fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} label={{ value: 'mm/s', angle: -90, position: 'insideLeft', fontSize: 11 }} />
              <Tooltip />
              <ReferenceLine y={7} stroke="#E24B4A" strokeDasharray="5 5" />
              <ReferenceLine y={0.3} stroke="#6FC24C" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="vibration" stroke="#2E8FD6" dot={false} strokeWidth={2} isAnimationActive animationDuration={1200} />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

function KpiCard({ label, value, sub, color, delay = 0, pulse = false }) {
  return (
    <div
      className="fade-item kpi-hover"
      style={{
        animationDelay: `${delay}s`,
        background: 'white',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color }} />
      <div style={{ color: '#999', fontSize: '12px', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#051426', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          className={pulse ? 'status-dot-pulse' : ''}
          style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: color }}
        />
        {value}
      </div>
      <div style={{ color: '#bbb', fontSize: '11px' }}>{sub}</div>
    </div>
  );
}

export default Dashboard;
