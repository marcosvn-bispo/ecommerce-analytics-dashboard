import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

def build_base_query(year: str = None, region: str = None):
    query = "SELECT * FROM orders WHERE 1=1"
    params = []
    
    if year and year != "all":
        query += " AND strftime('%Y', order_date) = ?"
        params.append(year)
        
    if region and region != "all":
        query += " AND region = ?"
        params.append(region)
        
    return query, params

def get_kpis_data(conn, year: str, region: str):
    query, params = build_base_query(year, region)
    df = pd.read_sql_query(query, conn, params=params)
    
    if df.empty:
        return {"total_sales": 0, "total_profit": 0, "total_orders": 0}
        
    total_sales = df['sales'].sum()
    total_profit = df['profit'].sum()
    total_orders = df['order_id'].nunique()
    
    return {
        "total_sales": float(total_sales),
        "total_profit": float(total_profit),
        "total_orders": int(total_orders)
    }

def get_sales_trend_data(conn, year: str, region: str):
    query, params = build_base_query(year, region)
    df = pd.read_sql_query(query, conn, params=params)
    
    if df.empty:
        return []
        
    df['order_date'] = pd.to_datetime(df['order_date'])
    monthly = df.groupby(df['order_date'].dt.to_period('M'))[['sales', 'profit']].sum().reset_index()
    monthly['order_date'] = monthly['order_date'].astype(str)
    monthly.rename(columns={'order_date': 'month'}, inplace=True)
    
    return monthly.to_dict(orient="records")

def get_category_data(conn, year: str, region: str):
    query, params = build_base_query(year, region)
    df = pd.read_sql_query(query, conn, params=params)
    
    if df.empty:
        return []
        
    cat_sales = df.groupby('category')['sales'].sum().reset_index()
    cat_sales.rename(columns={'sales': 'value'}, inplace=True)
    return cat_sales.to_dict(orient="records")

def get_top_products_data(conn, year: str, region: str):
    query, params = build_base_query(year, region)
    df = pd.read_sql_query(query, conn, params=params)
    
    if df.empty:
        return []
        
    product_sales = df.groupby(['product_name', 'category'])['sales'].sum().reset_index().sort_values(by='sales', ascending=False)
    product_sales.rename(columns={'product_name': 'product', 'sales': 'amount'}, inplace=True)
    return product_sales.head(5).to_dict(orient="records")
