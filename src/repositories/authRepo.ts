import { query } from '../config/database';
import { UserData, UserRegInput } from '../types/userTypes';

export const findUserByIdentifier = async (identifier: string) => {
    const sql = `
        SELECT * FROM users 
        WHERE email = $1 OR username = $1
    `;
    const result = await query(sql, [identifier]);
    return result.rows[0];
};

export const findUserById = async (id: string) => {
    const sql = `
        SELECT * FROM users 
        WHERE id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0];
};

export const checkEmailOrUsernameExists = async (email: string, username: string) => {
    const sql = `SELECT id FROM users WHERE email = $1 OR username = $2`;
    const result = await query(sql, [email, username]);
    return result.rowCount ? result.rowCount > 0 : false;
}

export const createUser = async (data: UserRegInput, hashedPassword: string) => {
    const sql = `
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at
    `;
    const result = await query(sql, [data.username, data.email, hashedPassword]);
    return result.rows[0];
};