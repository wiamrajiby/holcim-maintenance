import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';

// Remplace par ton vrai fichier logo
import holcimLogo from '../assets/holcim-logo-dark.png';

function Machine() {
  const [capteurs, setCapteurs] = useState([]);
  const [latest, setLatest] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [tendance, setTendance] = useState(null);
  const navigate = useNavigate();
  const [panneGeree, setPanneGeree] = useState(false);

// Récupère depuis Node.js
useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const r = await axios.get('http://localhost:5000/api/predict/simulateur/status');
      setPanneGeree(r.data.geree === true);
    } catch {}
  }, 1000);
  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 1000); // toutes les 5 secondes
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [capteursRes, latestRes, tendanceRes] = await Promise.all([
        axios.get('http://localhost:5000/api/capteurs/realtime'),
        axios.get('http://localhost:5000/api/capteurs/realtime/latest'),
        axios.get('http://localhost:5000/api/predict/tendance')
      ]);
      setCapteurs(capteursRes.data);
      setLatest(latestRes.data);
      setTendance(tendanceRes.data);
      if (latestRes.data) {
        getPrediction(latestRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getPrediction = async (data) => {
    try {
      const response = await axios.post('http://localhost:5001/predict', {
        Intensite: data.intensite,
        Vitesse: data.vitesse,
        T_Bobinage_1: data.t_bobinage_1,
        T_Bobinage_2: data.t_bobinage_2,
        T_Bobinage_3: data.t_bobinage_3,
        T_Palier_1_moteur: data.t_palier_1_moteur,
        T_Palier_2_moteur: data.t_palier_2_moteur,
        Vibration: data.vibration,
        T_Palier_1_vent: data.t_palier_1_vent,
        T_Palier_2_vent: data.t_palier_2_vent,
        Debit_air: data.debit_air
      });
      setPrediction(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getScore = () => {
    if (!latest) return 100;
    if (latest.vibration > 7) return 10;
    if (latest.vibration > 5) return 50;
    return Math.round(100 - (latest.vibration / 7) * 50);
  };

  const score = getScore();
  const scoreColor = score > 70 ? '#6FC24C' : score > 40 ? '#D8A13A' : '#E24B4A';

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
        @keyframes pulseBanner {
          0%, 100% { box-shadow: 0 0 0 0 rgba(226,75,74,0.5); }
          50% { box-shadow: 0 0 0 10px rgba(226,75,74,0); }
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
      `}</style>

      {/* Header blanc, style Dashboard */}
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
            const active = path === '/machine';
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

        {/* Alerte automatique visible */}
{latest && latest.vibration > 7 && (
  <div className="fade-item" style={{
    background: localStorage.getItem('panneGeree') === 'true' ? '#1F4E79' : '#E24B4A',
    color: 'white',
    padding: '16px 20px',
    borderRadius: '10px',
    marginBottom: '24px',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    animation: 'pulseBanner 1.6s infinite'
  }}>
    {panneGeree
      ? '🔧 PANNE GÉRÉE — Intervention planifiée par le technicien ✅'
      : `🚨 ALERTE CRITIQUE — Vibration = ${latest.vibration} mm/s — Dépasse le seuil de 7 mm/s !`
    }
  </div>
)}

        <div className="fade-item" style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '12px', letterSpacing: '1px', color: '#6FC24C', fontWeight: 'bold', margin: '0 0 6px', textTransform: 'uppercase' }}>
            Détail machine
          </p>
          <h2 style={{ color: 'white', fontSize: '26px', fontWeight: 'bold', margin: 0 }}>
            Ventilateur De Tirage Royal BC1
          </h2>
        </div>

        {/* Score santé + Prédiction */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>

          {/* Score santé */}
          <div className="fade-item kpi-hover" style={{ animationDelay: '0.08s', background: 'white', borderRadius: '10px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <h3 style={{ color: '#051426', fontSize: '15px', fontWeight: 'bold' }}>Score de santé machine</h3>
            <div style={{
              width: '150px', height: '150px', borderRadius: '50%',
              background: `conic-gradient(${scoreColor} ${score * 3.6}deg, #eee 0deg)`,
              margin: '20px auto', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{ width: '112px', height: '112px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', color: scoreColor }}>
                {score}%
              </div>
            </div>
            <div style={{ fontSize: '15px', color: scoreColor, fontWeight: 'bold' }}>
              {score > 70 ? 'Bon état' : score > 40 ? 'Attention' : 'Critique'}
            </div>
          </div>

          {/* Prédiction ML */}
          <div className="fade-item kpi-hover" style={{ animationDelay: '0.16s', background: 'white', borderRadius: '10px', padding: '28px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', textAlign: 'center' }}>
            <h3 style={{ color: '#051426', fontSize: '15px', fontWeight: 'bold' }}>Prédiction machine learning</h3>
            {prediction ? (
              <>
                <div style={{
                  fontSize: '24px', fontWeight: 'bold', margin: '18px 0',
                  color: prediction.panne === 1 ? '#E24B4A' : '#6FC24C'
                }}>
                  {prediction.message}
                </div>
                <div style={{ fontSize: '16px', color: '#666' }}>
                  Confiance : <strong>{prediction.confiance}%</strong>
                </div>
                <div style={{
                  marginTop: '14px', padding: '10px', borderRadius: '8px',
                  background: prediction.panne === 1 ? '#FCEBEA' : '#EDF7EA',
                  color: prediction.panne === 1 ? '#C0392B' : '#3C8C3F',
                  fontSize: '13px'
                }}>
                  {prediction.panne === 1
                    ? 'Intervention recommandée'
                    : 'Machine en bon fonctionnement'}
                </div>
              </>
            ) : (
              <div style={{ color: '#999', marginTop: '30px' }}>Chargement prédiction...</div>
            )}
          </div>

        </div>

        {/* Prédiction Tendance */}
        {tendance && tendance.statut === 'alerte_predictive' && (
          <div className="fade-item" style={{
            background: '#FFF8E8',
            border: '1px solid #D8A13A',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '18px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#B07E1E' }}>
              🔮 {tendance.message}
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
              Vibration actuelle : {tendance.vibration_actuelle} mm/s
            </div>
            {tendance.recommandation && (
              <div style={{ color: '#E24B4A', fontWeight: 'bold', marginTop: '8px', fontSize: '13px' }}>
                🔧 {tendance.recommandation}
              </div>
            )}
          </div>
        )}

        {/* Graphique Oscillations Principal — style "monitor" Holcim */}
        <div className="fade-item" style={{ animationDelay: '0.24s', background: '#051426', borderRadius: '10px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', marginBottom: '18px', border: '1px solid rgba(111,194,76,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ color: 'white', margin: 0, fontSize: '15px', fontWeight: 'bold' }}>
              Oscillations vibration — seuil critique 7 mm/s
            </h3>
            {latest && (
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
                {latest.date} →{' '}
                <span style={{ color: latest.vibration > 7 ? '#E24B4A' : '#6FC24C', fontWeight: 'bold', fontSize: '16px' }}>
                  {latest.vibration} mm/s
                </span>
              </div>
            )}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={capteurs.slice(-25)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }}
                angle={-45}
                textAnchor="end"
                height={70}
                stroke="rgba(255,255,255,0.2)"
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fill: 'rgba(255,255,255,0.5)' }}
                stroke="rgba(255,255,255,0.2)"
              />
              <Tooltip
                contentStyle={{ background: '#0A2A40', border: '1px solid rgba(255,255,255,0.15)', color: 'white' }}
                formatter={(value) => [`${value} mm/s`, 'Vibration']}
                labelFormatter={(label) => `${label}`}
              />
              <ReferenceLine y={7} stroke="#E24B4A" strokeDasharray="5 5" label={{ value: 'Seuil 7mm/s', fill: '#E24B4A', fontSize: 11 }} />
              <ReferenceLine y={0.3} stroke="#D8A13A" strokeDasharray="5 5" label={{ value: 'Min 0.3mm/s', fill: '#D8A13A', fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="vibration"
                stroke="#6FC24C"
                dot={false}
                strokeWidth={2}
                name="Vibration"
                isAnimationActive={true}
                animationDuration={500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Graphiques capteurs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>

          <SensorCard delay={0.3} title="Température bobinage">
            <LineChart data={capteurs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="t_bobinage_1" stroke="#D8A13A" dot={false} name="Bobinage 1" />
              <Line type="monotone" dataKey="t_bobinage_2" stroke="#E67E22" dot={false} name="Bobinage 2" />
              <Line type="monotone" dataKey="t_bobinage_3" stroke="#F39C12" dot={false} name="Bobinage 3" />
            </LineChart>
          </SensorCard>

          <SensorCard delay={0.36} title="Intensité électrique">
            <LineChart data={capteurs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="intensite" stroke="#8E44AD" dot={false} name="Intensité (A)" />
            </LineChart>
          </SensorCard>

          <SensorCard delay={0.42} title="Vitesse de rotation">
            <LineChart data={capteurs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="vitesse" stroke="#6FC24C" dot={false} name="Vitesse (RPM)" />
            </LineChart>
          </SensorCard>

          <SensorCard delay={0.48} title="Débit d'air">
            <LineChart data={capteurs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="id" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="debit_air" stroke="#2E8FD6" dot={false} name="Débit (m³/h)" />
            </LineChart>
          </SensorCard>

        </div>
      </div>
    </div>
  );
}

function SensorCard({ title, delay, children }) {
  return (
    <div className="fade-item kpi-hover" style={{ animationDelay: `${delay}s`, background: 'white', borderRadius: '10px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
      <h3 style={{ color: '#051426', marginBottom: '14px', fontSize: '14px', fontWeight: 'bold' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={200}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export default Machine;