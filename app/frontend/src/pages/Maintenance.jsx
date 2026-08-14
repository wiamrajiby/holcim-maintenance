import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Remplace par ton vrai fichier logo
import holcimLogo from '../assets/holcim-logo-dark.png';

function Maintenance() {
  const [maintenances, setMaintenances] = useState([]);
  const [form, setForm] = useState({
    description: '',
    technicien: '',
    priorite: 'normale'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/maintenance');
      setMaintenances(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const creerMaintenance = async () => {
    try {
      await axios.post('http://localhost:5000/api/maintenance', form);
      setForm({ description: '', technicien: '', priorite: 'normale' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatut = async (id, statut) => {
    try {
      await axios.put(`http://localhost:5000/api/maintenance/${id}`, { statut });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatutColor = (statut) => {
    if (statut === 'termine') return '#6FC24C';
    if (statut === 'en_cours') return '#2E8FD6';
    return '#D8A13A';
  };

  const getPrioriteColor = (priorite) => {
    if (priorite === 'haute') return '#E24B4A';
    if (priorite === 'normale') return '#D8A13A';
    return '#6FC24C';
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
        .form-input {
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .form-input:focus {
          outline: none;
          border-color: #2E8FD6 !important;
          box-shadow: 0 0 0 3px rgba(46,143,214,0.15);
        }
        .mo-card { transition: box-shadow 0.2s ease, transform 0.2s ease; }
        .mo-card:hover { box-shadow: 0 6px 18px rgba(0,0,0,0.1); transform: translateY(-2px); }
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
            const active = path === '/maintenance';
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
            Gestion de la maintenance
          </p>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: 0 }}>
            Ventilateur De Tirage Royal BC1
          </h2>
        </div>

        {/* Compteurs statut */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '24px' }}>
          <CounterCard delay={0.05} value={maintenances.filter(m => m.statut === 'en_attente').length} label="En attente" color="#D8A13A" />
          <CounterCard delay={0.12} value={maintenances.filter(m => m.statut === 'en_cours').length} label="En cours" color="#2E8FD6" />
          <CounterCard delay={0.19} value={maintenances.filter(m => m.statut === 'termine').length} label="Terminées" color="#6FC24C" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '18px' }}>

          {/* Formulaire */}
          <div className="fade-item" style={{ animationDelay: '0.25s', background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', height: 'fit-content' }}>
            <h3 style={{ color: '#051426', marginBottom: '20px', fontSize: '15px', fontWeight: 'bold' }}>
              Créer un ordre de travail
            </h3>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>Description</label>
              <textarea
                className="form-input"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Ex: Vérification vibration BC1..."
                style={{ width: '100%', padding: '10px', border: '2px solid #e5e5e5', borderRadius: '8px', height: '80px', boxSizing: 'border-box', fontFamily: 'Arial, sans-serif' }}
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>Technicien</label>
              <input
                className="form-input"
                type="text"
                value={form.technicien}
                onChange={(e) => setForm({ ...form, technicien: e.target.value })}
                placeholder="Nom du technicien"
                style={{ width: '100%', padding: '10px', border: '2px solid #e5e5e5', borderRadius: '8px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>Priorité</label>
              <select
                className="form-input"
                value={form.priorite}
                onChange={(e) => setForm({ ...form, priorite: e.target.value })}
                style={{ width: '100%', padding: '10px', border: '2px solid #e5e5e5', borderRadius: '8px', boxSizing: 'border-box' }}
              >
                <option value="basse">🟢 Basse</option>
                <option value="normale">🟡 Normale</option>
                <option value="haute">🔴 Haute</option>
              </select>
            </div>

            <button
              className="btn-action"
              onClick={creerMaintenance}
              style={{
                width: '100%', padding: '13px',
                background: 'linear-gradient(90deg, #2E8FD6, #6FC24C)',
                color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '14px', fontWeight: 'bold', cursor: 'pointer'
              }}
            >
              Créer l'ordre de travail
            </button>
          </div>

          {/* Liste maintenances */}
          <div className="fade-item" style={{ animationDelay: '0.32s', background: 'white', borderRadius: '10px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <h3 style={{ color: '#051426', marginBottom: '16px', fontSize: '15px', fontWeight: 'bold' }}>
              Ordres de travail
            </h3>
            {maintenances.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#999', padding: '24px', fontSize: '13px' }}>
                Aucun ordre de travail
              </div>
            ) : (
              maintenances.map(m => (
                <div key={m.id} className="mo-card" style={{
                  border: '1px solid #eee', borderRadius: '8px', padding: '16px', marginBottom: '10px',
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: getPrioriteColor(m.priorite) }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 'bold', color: '#051426', marginBottom: '4px', fontSize: '14px' }}>{m.description}</div>
                      <div style={{ color: '#777', fontSize: '13px' }}>{m.technicien}</div>
                      <div style={{ color: '#aaa', fontSize: '12px' }}>{new Date(m.date).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                      <span style={{ background: getPrioriteColor(m.priorite), color: 'white', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                        {m.priorite}
                      </span>
                      <span style={{ background: getStatutColor(m.statut), color: 'white', padding: '3px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                        {m.statut}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px', paddingLeft: '8px' }}>
                    {m.statut === 'en_attente' && (
                      <button
                        className="btn-action"
                        onClick={() => updateStatut(m.id, 'en_cours')}
                        style={{ background: '#2E8FD6', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        Démarrer
                      </button>
                    )}
                    {m.statut === 'en_cours' && (
                      <button
                        className="btn-action"
                        onClick={() => updateStatut(m.id, 'termine')}
                        style={{ background: '#6FC24C', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        Terminer
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

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

export default Maintenance;
