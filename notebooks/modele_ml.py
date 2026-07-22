import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib

# 1. Chargement des données
print("Chargement des données...")
train = pd.read_csv('../data/data_train.csv')
test  = pd.read_csv('../data/data_test.csv')
print(f"Training: {len(train)} lignes")
print(f"Test: {len(test)} lignes")

# 2. Séparation features / target
features = ['Intensite','Vitesse','T_Bobinage_1','T_Bobinage_2',
            'T_Bobinage_3','T_Palier_1_moteur','T_Palier_2_moteur',
            'Vibration','T_Palier_1_vent','T_Palier_2_vent','Debit_air']

X_train = train[features]
y_train = train['Panne']
X_test  = test[features]
y_test  = test['Panne']

# 3. Entraînement du modèle
print("\nEntraînement du modèle Random Forest...")
# APRÈS
model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
model.fit(X_train, y_train)
print("✅ Modèle entraîné !")

# 4. Prédiction et précision
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\nPrécision du modèle: {accuracy*100:.2f}%")
print("\nRapport de classification:")
print(classification_report(y_test, y_pred))
print("Matrice de confusion:")
print(confusion_matrix(y_test, y_pred))

# 5. Sauvegarde du modèle
joblib.dump(model, '../models/modele_maintenance.pkl')
print("\n✅ Modèle sauvegardé dans models/modele_maintenance.pkl")