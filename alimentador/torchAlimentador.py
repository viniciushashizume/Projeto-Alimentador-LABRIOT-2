import pandas as pd
import numpy as np
import os
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import TensorDataset, DataLoader
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def gerar_dados():
    print("Gerando dados de exemplo com rótulos para treinamento...")
    base_times = [pd.Timestamp('2023-10-26 07:00:00'), pd.Timestamp('2023-10-26 18:00:00'),
                  pd.Timestamp('2023-10-27 07:10:00'), pd.Timestamp('2023-10-27 18:05:00'),
                  pd.Timestamp('2023-10-28 07:05:00'), pd.Timestamp('2023-10-28 18:10:00')]
    
    data = []
    
    for base in base_times:
        for _ in range(np.random.randint(40, 70)): 
            tempo = base + pd.Timedelta(minutes=np.random.randint(-25, 25))
            data.append({'tempo': tempo, 'label': 1}) 
            
    for _ in range(400):
        random_day = np.random.choice(base_times).date()
        random_time = pd.Timestamp(random_day) + pd.Timedelta(minutes=np.random.randint(0, 1439))
        data.append({'tempo': random_time, 'label': 0})
    
    return pd.DataFrame(data)

df = gerar_dados()

df['minuto_do_dia'] = df['tempo'].dt.hour * 60 + df['tempo'].dt.minute
df['dia_da_semana'] = df['tempo'].dt.dayofweek

features = df[['minuto_do_dia', 'dia_da_semana']]
labels = df['label']

X_train, X_test, y_train, y_test = train_test_split(features, labels, test_size=0.2, random_state=42, stratify=labels)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

X_train_tensor = torch.tensor(X_train_scaled, dtype=torch.float32)
y_train_tensor = torch.tensor(y_train.values, dtype=torch.float32).unsqueeze(1)
X_test_tensor = torch.tensor(X_test_scaled, dtype=torch.float32)
y_test_tensor = torch.tensor(y_test.values, dtype=torch.float32).unsqueeze(1)

train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
train_loader = DataLoader(dataset=train_dataset, batch_size=32, shuffle=True)

test_dataset = TensorDataset(X_test_tensor, y_test_tensor)
test_loader = DataLoader(dataset=test_dataset, batch_size=32, shuffle=False)

class ModeloDeClassificacao(nn.Module):
    def __init__(self):
        super(ModeloDeClassificacao, self).__init__()
        self.layer1 = nn.Linear(in_features=2, out_features=16)
        self.layer2 = nn.Linear(16, 8)
        self.layer_out = nn.Linear(8, 1)
        self.relu = nn.ReLU()
        
    def forward(self, x):
        x = self.relu(self.layer1(x))
        x = self.relu(self.layer2(x))
        x = self.layer_out(x)
        return x

model = ModeloDeClassificacao()
print("\nArquitetura do Modelo:")
print(model)

criterion = nn.BCEWithLogitsLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

epochs = 50
print("\nIniciando o treinamento...")

for epoch in range(epochs):
    model.train()
    
    for inputs, labels in train_loader:
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
    if (epoch+1) % 10 == 0:
        print(f'Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.4f}')

print("Treinamento concluído!")

model.eval()
correct_predictions = 0
total_samples = 0

with torch.no_grad():
    for inputs, labels in test_loader:
        outputs = model(inputs)
        predicted = (torch.sigmoid(outputs) > 0.5).float()
        total_samples += labels.size(0)
        correct_predictions += (predicted == labels).sum().item()

accuracy = 100 * correct_predictions / total_samples
print("\n--- Medição de Acurácia ---")
print(f'O modelo acertou {correct_predictions} de {total_samples} amostras no conjunto de teste.')
print(f'Acurácia no conjunto de teste: {accuracy:.2f}%')