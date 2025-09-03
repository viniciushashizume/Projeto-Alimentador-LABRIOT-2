import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import DBSCAN
from sklearn.metrics import silhouette_score
import os

try:
    df = pd.read_csv('sensor_data.csv', parse_dates=['tempo'])
except FileNotFoundError:
    print("Arquivo 'sensor_data.csv' não encontrado. Gerando dados de exemplo.")
    base_times = [pd.Timestamp('2023-10-26 07:00:00'), pd.Timestamp('2023-10-26 18:00:00'),
                  pd.Timestamp('2023-10-27 07:10:00'), pd.Timestamp('2023-10-27 18:05:00')]
    data = []
    for base in base_times:
        for _ in range(np.random.randint(40, 70)): # Leituras densas para refeição
            data.append({'tempo': base + pd.Timedelta(minutes=np.random.randint(-15, 15)), 'distance': np.random.uniform(2, 10)})
    for _ in range(30): # Leituras de ruído
        data.append({'tempo': pd.Timestamp('2023-10-26 00:00:00') + pd.Timedelta(minutes=np.random.randint(0, 1439)), 'distance': np.random.uniform(2, 10)})
    df = pd.DataFrame(data)

print("Cabeçalho dos dados:")
print(df.head())

df['minuto_do_dia'] = df['tempo'].dt.hour * 60 + df['tempo'].dt.minute
X = df['minuto_do_dia'].values.reshape(-1, 1)
dbscan = DBSCAN(eps=20, min_samples=5)
clusters = dbscan.fit_predict(X)
df['cluster'] = clusters

print(f"\nClusters encontrados: {np.unique(clusters)}")
refeicoes_df = df[df['cluster'] != -1]

# Calcule o Silhouette Score apenas para os pontos clusterizados
# (removendo os pontos de ruído com cluster_id -1)
if len(np.unique(refeicoes_df['cluster'])) > 1:
    silhouette_avg = silhouette_score(refeicoes_df[['minuto_do_dia']], refeicoes_df['cluster'])
    print(f"\nCoeficiente de Silhueta (Silhouette Score): {silhouette_avg:.4f}")
else:
    print("\nNão há clusters suficientes para calcular o Coeficiente de Silhueta.")


print("\nAnálise dos horários de refeição encontrados:")
# Para cada cluster (refeição), calcular a hora de início, fim e o centro
for cluster_id in sorted(refeicoes_df['cluster'].unique()):
    cluster_data = refeicoes_df[refeicoes_df['cluster'] == cluster_id]
    
    # Hora média da refeição
    mean_minute = int(cluster_data['minuto_do_dia'].mean())
    hora_media = f"{mean_minute // 60:02d}:{mean_minute % 60:02d}"
    
    # Contagem de leituras
    count = len(cluster_data)
    
    print(f"  -> Refeição (Cluster {cluster_id}):")
    print(f"     - Aproximadamente às {hora_media}")
    print(f"     - {count} leituras do sensor agrupadas.")


# Visualização dos clusters ao longo dos dias
plt.figure(figsize=(14, 7))

sns.scatterplot(data=df, x=df['tempo'].dt.date, y='minuto_do_dia', hue='cluster', palette='deep', s=50)

plt.title('Clusters de Horários de Alimentação (DBSCAN)')
plt.xlabel('Data')
plt.ylabel('Horas)')
plt.yticks(ticks=range(0, 1441, 120), labels=[f'{h:02d}:00' for h in range(0, 25, 2)])
plt.xticks(rotation=45)
plt.grid(True, which='both', linestyle='--', linewidth=0.5)
plt.legend(title='Cluster de Refeição\n(-1 = Ruído)')

plt.tight_layout()
output_dir = 'alimentador-dashboard/src/assets'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
plt.savefig(os.path.join(output_dir, 'leituraDBSCAN.png'))