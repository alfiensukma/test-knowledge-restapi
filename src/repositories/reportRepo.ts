import { query } from '../config/database';

export const getStockSummary = async (limitScore: number = 10) => {
    const sql = `
        SELECT 
            p.id AS product_id,
            p.sku,
            p.name AS product_name,
            p.stock AS current_stock,
            
            COALESCE(SUM(si.qty), 0) AS total_qty_in,
            
            MAX(si.created_at) AS last_restock_date,
            
            CASE 
                WHEN p.stock = 0 THEN 'EMPTY'
                WHEN p.stock < 5 THEN 'CRITICAL'
                WHEN p.stock < 20 THEN 'WARNING'
                ELSE 'SAFE'
            END AS stock_status

        FROM products p
        LEFT JOIN stock_ins si ON p.id = si.product_id
        
        GROUP BY p.id, p.sku, p.name, p.stock
        ORDER BY p.stock ASC
    `;

    const result = await query(sql);
    return result.rows;
};