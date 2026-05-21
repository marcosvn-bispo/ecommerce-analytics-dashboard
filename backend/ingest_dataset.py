import sqlite3
import pandas as pd
import requests
import io

def ingest_data():
    # Common public URL for the Superstore dataset
    url = "https://raw.githubusercontent.com/zpio/datasets/main/sample_superstore.csv"
    print(f"Baixando dataset Superstore de {url}...")
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        
        # Read CSV data, often encoded in windows-1252 for this specific dataset
        df = pd.read_csv(io.StringIO(response.content.decode('windows-1252', errors='ignore')))
        
        # Clean column names for sqlite (replace spaces and dashes with underscores)
        df.columns = [c.replace(' ', '_').replace('-', '_').lower() for c in df.columns]
        
        print("Dataset baixado com sucesso. Limpando e convertendo datas...")
        # Convert date columns
        df['order_date'] = pd.to_datetime(df['order_date'], errors='coerce')
        df['ship_date'] = pd.to_datetime(df['ship_date'], errors='coerce')
        
        print("Salvando no banco de dados SQLite (ecommerce.db)...")
        conn = sqlite3.connect('ecommerce.db')
        df.to_sql('orders', conn, if_exists='replace', index=False)
        conn.close()
        
        print(f"Pronto! {len(df)} registros REAIS foram salvos na tabela 'orders'.")
        
    except Exception as e:
        print(f"Erro ao processar dataset: {e}")

if __name__ == "__main__":
    ingest_data()
