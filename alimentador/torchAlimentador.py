import pandas as pd
import torch
import matplotlib.pyplot as plt
import seaborn as sns

# Lê o CSV com parse de datas
df = pd.read_csv('sensor_data.csv', parse_dates=['tempo'])
print(df.head())

# Cria nova coluna com data e hora:minuto
df['data_hora_minuto'] = df['tempo'].dt.strftime('%Y-%m-%d %H:%M')

data_hora_minute_counts = df.groupby('data_hora_minuto')['distance'].count().reset_index()
data_hora_minute_counts.columns = ['data_hora_minuto', 'count']

features = torch.tensor(data_hora_minute_counts['count'].values, dtype=torch.float32)

plt.figure(figsize=(14, 6))
sns.barplot(x='data_hora_minuto', y='count', data=data_hora_minute_counts, palette='viridis')

plt.title('Análise de Leituras por Data e Horário')
plt.xlabel('Data e Horário (YYYY-MM-DD HH:MM)')
plt.ylabel('Número de Leituras')
plt.xticks(rotation=90)  # Melhor visualização
plt.grid()

plt.tight_layout()
plt.savefig('leituras_por_data_horario.png')
plt.show()
