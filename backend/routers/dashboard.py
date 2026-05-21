from fastapi import APIRouter, Query
from database import get_db_connection
from services.analytics_service import get_kpis_data, get_sales_trend_data, get_category_data, get_top_products_data

router = APIRouter()

@router.get("/kpis")
def get_kpis(year: str = Query("all"), region: str = Query("all")):
    conn = get_db_connection()
    data = get_kpis_data(conn, year, region)
    conn.close()
    return data

@router.get("/sales-trend")
def get_sales_trend(year: str = Query("all"), region: str = Query("all")):
    conn = get_db_connection()
    data = get_sales_trend_data(conn, year, region)
    conn.close()
    return data

@router.get("/sales-by-category")
def get_sales_by_category(year: str = Query("all"), region: str = Query("all")):
    conn = get_db_connection()
    data = get_category_data(conn, year, region)
    conn.close()
    return data

@router.get("/top-products")
def get_top_products(year: str = Query("all"), region: str = Query("all")):
    conn = get_db_connection()
    data = get_top_products_data(conn, year, region)
    conn.close()
    return data
