export interface StockInInput {
    productId: number;
    qty: number;
}

export interface StockReportQuery {
    minStock?: number;
}

export interface StockReportDTO {
    product_id: number;
    sku: string;
    product_name: string;
    current_stock: number;
    total_qty_in: number;
    last_restock_date: Date | null;
    stock_status: 'SAFE' | 'WARNING' | 'CRITICAL';
}