import { query } from '../config/database';

export const saveApiLog = async (endpoint: string, statusCode: number, response: any) => {
    const sql = `
        INSERT INTO api_logs (endpoint, status_code, response_body)
        VALUES ($1, $2, $3)
    `;
    await query(sql, [endpoint, statusCode, JSON.stringify(response)]);
};