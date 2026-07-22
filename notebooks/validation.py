import pandas as pd
import matplotlib.pyplot as plt
import joblib

# 1. Chargement données validation
print("Chargement données validation...")
valid = pd.read_csv('../data/data_cleaned.csv')
print(f"Lignes validation: {len(valid)}")

# 2. Chargement modèle ML
model = joblib.load('../models/modele_maintenance.pkl')

# 3. Prédiction sur données validation
features = ['Intensite','Vitesse','T_Bobinage_1','T_Bobinage_2',
            'T_Bobinage_3','T_Palier_1_moteur','T_Palier_2_moteur',
            'Vibration','T_Palier_1_vent','T_Palier_2_vent','Debit_air']

X_valid = valid[features]
predictions = model.predict(X_valid)
print(f"Pannes détectées: {predictions.sum()}")

# 4. Graphique oscillations vibration
plt.figure(figsize=(15, 6))
plt.plot(valid['Vibration'].values, color='blue', linewidth=0.8, label='Vibration (mm/s)')
plt.axhline(y=7, color='red', linewidth=2, linestyle='--', label='Seuil critique 7 mm/s')
plt.axhline(y=0.3, color='green', linewidth=2, linestyle='--', label='Seuil minimal 0.3 mm/s')

# 5. Marquer les pannes détectées
for i, pred in enumerate(predictions):
    if pred == 1:
        plt.axvline(x=i, color='orange', alpha=0.7, linewidth=1.5)

plt.title('Ventilateur De Tirage Royal BC1 — Oscillations Vibration\nDonnées Validation', fontsize=14, fontweight='bold')
plt.xlabel('Temps (heures)', fontsize=12)
plt.ylabel('Vibration (mm/s)', fontsize=12)
plt.legend(fontsize=11)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('../data/graphique_validation.png', dpi=150)
plt.show()
print("✅ Graphique sauvegardé !")