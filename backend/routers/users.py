from fastapi import APIRouter, Query, Response
from database import get_db_connection
import pandas as pd
import io
import csv

router = APIRouter()

@router.get("/")
def get_users(search: str = "", skip: int = Query(0, ge=0), limit: int = Query(10, gt=0)):
    conn = get_db_connection()
    search_param = f"%{search}%"
    
    query = """
    SELECT customer_id, customer_name, segment, state, region, SUM(sales) as ltv
    FROM orders
    WHERE customer_name LIKE ?
    GROUP BY customer_id, customer_name, segment, state, region
    ORDER BY ltv DESC
    LIMIT ? OFFSET ?
    """
    df_users = pd.read_sql_query(query, conn, params=(search_param, limit, skip))
    
    count_query = "SELECT COUNT(DISTINCT customer_id) as total FROM orders WHERE customer_name LIKE ?"
    total_count = conn.execute(count_query, (search_param,)).fetchone()['total']
    conn.close()
    
    return {
        "data": df_users.to_dict(orient="records"),
        "total": total_count,
        "skip": skip,
        "limit": limit
    }

@router.get("/export")
def export_users(search: str = ""):
    conn = get_db_connection()
    search_param = f"%{search}%"
    
    query = """
    SELECT customer_id, customer_name, segment, state, region, SUM(sales) as ltv
    FROM orders
    WHERE customer_name LIKE ?
    GROUP BY customer_id, customer_name, segment, state, region
    ORDER BY ltv DESC
    """
    df_users = pd.read_sql_query(query, conn, params=(search_param,))
    conn.close()
    
    output = io.StringIO()
    output.write('\ufeff') # BOM
    writer = csv.writer(output, delimiter=';', lineterminator='\n')
    writer.writerow(['ID do Cliente', 'Nome', 'Segmento', 'Estado', 'Região', 'LTV (USD)'])
    
    for _, row in df_users.iterrows():
        ltv_formatted = f"{row['ltv']:.2f}".replace('.', ',')
        writer.writerow([row['customer_id'], row['customer_name'], row['segment'], row['state'], row['region'], ltv_formatted])
        
    return Response(
        content=output.getvalue(), 
        media_type="text/csv", 
        headers={"Content-Disposition": "attachment; filename=relatorio_clientes_ltv.csv"}
    )

