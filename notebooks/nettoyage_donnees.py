import pandas as pd
import numpy as np

# 1. Chargement des données
print("Chargement des données...")
df = pd.read_excel('../data/DATA BC1.xlsx')
print(f"Lignes chargées: {len(df)}")

# 2. Nettoyage colonnes
df.columns = ['Date','Intensite','Vitesse','T_Bobinage_1',
              'T_Bobinage_2','T_Bobinage_3','T_Palier_1_moteur',
              'T_Palier_2_moteur','Vibration','T_Palier_1_vent',
              'T_Palier_2_vent','Debit_air']

# 3. Suppression valeurs manquantes
df = df.dropna()
print(f"Après nettoyage: {len(df)} lignes")

# 4. Création colonne Panne
df['Panne'] = (df['Vibration'] > 7).astype(int)
print(f"Pannes détectées: {df['Panne'].sum()}")

# 5. Séparation 3 parties
total = len(df)
train = df.iloc[:int(total*0.70)]
test  = df.iloc[int(total*0.70):int(total*0.85)]
valid = df.iloc[int(total*0.85):]

print(f"Training: {len(train)} lignes")
print(f"Test: {len(test)} lignes")
print(f"Validation: {len(valid)} lignes")

# 6. Sauvegarde
df.to_csv('../data/data_cleaned.csv', index=False)
train.to_csv('../data/data_train.csv', index=False)
test.to_csv('../data/data_test.csv', index=False)
valid.to_csv('../data/data_validation.csv', index=False)

print("✅ Fichiers sauvegardés avec succès !")