import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Remplace par ton vrai fichier logo (version claire si dispo, sinon garde le foncé)
import holcimLogo from '../assets/holcim-logo-dark.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email, password
      });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect !');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 70% 30%, #1F5C8C, #051426 65%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        width: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
      }}>

        {/* Logo Holcim */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
  width: '280px',
  height: '90px',
  overflow: 'hidden',
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
  <img
    src={holcimLogo}
    alt="Holcim"
    style={{ height: '90px', transform: 'scale(2.65)', display: 'block' }}
  />
</div>
          <p style={{ color: '#666', marginTop: '14px', fontSize: '14px' }}>
            Maintenance Prédictive — Ventilateur BC1
          </p>
        </div>

        {/* Titre */}
        <h2 style={{ textAlign: 'center', color: '#051426', marginBottom: '25px' }}>
          Connexion
        </h2>

        {/* Email */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="wiam@holcim.ma"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#333', fontWeight: 'bold' }}>
            Mot de passe
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Erreur */}
        {error && (
          <div style={{
            background: '#fee',
            color: '#c00',
            padding: '10px',
            borderRadius: '8px',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* Bouton */}
        <button
          onClick={handleLogin}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(90deg, #2E8FD6, #6FC24C)',
            color: '#051426',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Se connecter
        </button>

      </div>
    </div>
  );
}

export default Login;
