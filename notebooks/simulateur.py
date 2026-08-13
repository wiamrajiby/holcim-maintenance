import psycopg2
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import time
import random
import requests
from datetime import datetime

conn = psycopg2.connect(
    host="localhost",
    port=5432,
    database="holcim_maintenance",
    user="postgres",
    password="holcim2026"
)
cursor = conn.cursor()

# Vider la table
cursor.execute("TRUNCATE TABLE capteurs_realtime RESTART IDENTITY")
conn.commit()
print("✅ Table vidée !")

# Charger vraie data du prof
df = pd.read_csv('../data/data_cleaned.csv')
print(f"✅ {len(df)} mesures chargées !")

print("🚀 Simulation démarrée avec vraie data...")

# Historique vibrations pour prédiction
historique = []
i = 7290

while True:
    try:
        # Vérifier reset
        try:
            r = requests.get('http://localhost:5000/api/predict/simulateur/status', timeout=1)
            if r.json().get('reset') == True:
                print("🔄 Reset ! Panne évitée ✅")
                i = 7360  # ← Saute après les pannes !
                historique = []
                cursor.execute("TRUNCATE TABLE capteurs_realtime RESTART IDENTITY")
                conn.commit()
                requests.post('http://localhost:5000/api/predict/simulateur/reset-done', timeout=1)
        except:
            pass

        # Lire mesure réelle
        row = df.iloc[i % len(df)]
        vibration = round(float(row['Vibration']) + random.uniform(-0.05, 0.05), 2)
        vibration = max(0, vibration)
        panne = 1 if vibration > 7 else 0

        # Insérer dans PostgreSQL
        cursor.execute("""
            INSERT INTO capteurs_realtime 
            (date, intensite, vitesse, t_bobinage_1, t_bobinage_2, t_bobinage_3,
             t_palier_1_moteur, t_palier_2_moteur, vibration, t_palier_1_vent,
             t_palier_2_vent, debit_air, panne)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            str(row['Date']),
            float(row['Intensite']),
            float(row['Vitesse']),
            float(row['T_Bobinage_1']),
            float(row['T_Bobinage_2']),
            float(row['T_Bobinage_3']),
            float(row['T_Palier_1_moteur']),
            float(row['T_Palier_2_moteur']),
            vibration,
            float(row['T_Palier_1_vent']),
            float(row['T_Palier_2_vent']),
            float(row['Debit_air']),
            panne
        ))
        conn.commit()

        # ← AJOUTE ICI
        if panne == 1:
            try:
                requests.post(
                    'http://localhost:5000/api/alertes',
                    json={
                        'type': 'Vibration critique BC1',
                        'valeur': float(vibration),
                        'niveau': 'critique' if vibration > 10 else 'avertissement'
                    },
                    timeout=2
                )
                print(f"🚨 Alerte créée dans PostgreSQL !")
            except:
                pass

        # Ajouter au historique
        historique.append(vibration)

        # Ajouter au historique
        historique.append(vibration)
        if len(historique) > 50:
            historique.pop(0)

        status = "🔴 PANNE!" if panne == 1 else "✅ Normal"
        print(f"Mesure {i+1} → Vibration: {vibration} mm/s → {status}")

        # Prédiction ML sur tendance
        if len(historique) >= 20:
            X = np.array(range(len(historique))).reshape(-1, 1)
            y = np.array(historique)
            model = LinearRegression()
            model.fit(X, y)
            tendance = float(model.coef_[0])

            if vibration > 7:
                prediction = {
                    "statut": "panne_en_cours",
                    "message": "🔴 PANNE EN COURS !",
                    "jours_restants": 0,
                    "vibration_actuelle": vibration,
                    "recommandation": "Intervention immédiate !"
                }
            elif tendance > 0:
                # Calculer jours restants
                # 1 mesure CSV = 1 heure réelle
                mesures_restantes = (7 - vibration) / tendance
                jours_restants = round(mesures_restantes / 24, 1)

                if 0 < jours_restants <= 15:
                    prediction = {
                        "statut": "alerte_predictive",
                        "message": f"⚠️ Panne prévue dans {jours_restants} jours !",
                        "jours_restants": jours_restants,
                        "vibration_actuelle": vibration,
                        "recommandation": "Commander les pièces et planifier intervention !"
                    }
                    print(f"🔮 PRÉDICTION: Panne dans {jours_restants} jours !")
                else:
                    prediction = {
                        "statut": "normal",
                        "message": "✅ Machine en bon état",
                        "jours_restants": jours_restants if jours_restants > 0 else None,
                        "vibration_actuelle": vibration
                    }
            else:
                prediction = {
                    "statut": "normal",
                    "message": "✅ Tendance stable",
                    "jours_restants": None,
                    "vibration_actuelle": vibration
                }

            # Envoyer prédiction à Node.js
            try:
                requests.post(
                    'http://localhost:5000/api/predict/save-tendance',
                    json=prediction,
                    timeout=2
                )
            except:
                pass

        i += 1
        time.sleep(2)

    except KeyboardInterrupt:
        print("\n⏹️ Simulation arrêtée !")
        break
    except Exception as e:
        print(f"Erreur: {e}")
        conn.rollback()

cursor.close()
conn.close()