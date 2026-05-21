# E-Commerce Analytics & Business Intelligence Dashboard 📊

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)

Este é um projeto FullStack construído para o meu portfólio, focando na integração entre **Desenvolvimento Web** e **Business Intelligence (BI)**.

A aplicação processa registros de vendas de um e-commerce (dataset Superstore 2018-2021) e os disponibiliza em um painel gerencial, com foco na visualização clara dos dados e desempenho da aplicação.

## 🚀 Principais Funcionalidades

- **Dashboard Analítico:** Visualização de KPIs de negócio (Receita, Lucro, Total de Pedidos) com gráficos temporais usando Recharts.
- **Arquitetura FullStack:** Frontend construído com React (Vite) consumindo uma API REST feita em Python (FastAPI).
- **Interface Customizada:** Layout desenvolvido do zero com CSS Vanilla, focado em responsividade e apresentação visual.
- **Ingestão de Dados:** Script para ler dados brutos de arquivos CSV e carregá-los no banco de dados SQLite.
- **Exportação de Dados:** Rota no backend capaz de consolidar, formatar (conversão monetária localizada) e exportar os registros filtrados em formato CSV.

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- React.js + Vite (Ambiente de desenvolvimento ultrarrápido)
- Recharts (Gráficos analíticos renderizados via SVG)
- SWR (Stale-While-Revalidate para cache inteligente de requisições)
- CSS3 (Variáveis e layout responsivo)

**Backend:**
- FastAPI (Framework Python moderno e de alta performance)
- Uvicorn (Servidor ASGI)
- Pandas (Manipulação e agregação avançada de dados tabulares em memória)
- SQLite3 (Banco de dados relacional leve e embutido)

## ⚙️ Como Executar Localmente

### 1. Preparando o Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # No Windows
pip install fastapi uvicorn pandas
python ingest_dataset.py  # Ingestão de dados para criar o banco .db
uvicorn main:app --reload
```
A API estará rodando em `http://localhost:8000`

### 2. Preparando o Frontend
```bash
cd frontend
npm install
npm run dev
```
O painel estará disponível em `http://localhost:5173`

## 📈 Lições Aprendidas / Destaques Técnicos

Neste projeto, apliquei conceitos avançados de tratamento de dados:
- Tratamento de campos numéricos problemáticos em datasets reais (como formatações de LTV para o padrão Excel BR).
- Resolução de gargalos de renderização gráfica ao transitar entre filtros com volumes de dados heterogêneos.
- Otimização do uso de memória no backend com queries SQL aliadas a filtros do Pandas antes da serialização em JSON.

---
Desenvolvido com dedicação focado em performance, análise de dados e design de interfaces. 
