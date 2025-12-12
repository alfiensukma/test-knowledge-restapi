import axios from 'axios';

import { AppError } from '../utils/AppError';
import * as logRepo from '../repositories/logRepo';

export const getExchangeRate = async (from: string, to: string) => {
    const url = `${process.env.EXTERNAL_API_URL}/latest?from=${from}&to=${to}`;
    
    try {
        const response = await axios.get(url);
        logRepo.saveApiLog(url, response.status, response.data).catch(console.error);

        return {
            amount: response.data.amount,
            base: response.data.base,
            date: response.data.date,
            rates: response.data.rates
        };

    } catch (error: any) {
        let statusCode = 502;
        let message = 'Failed to fetch data from external API';

        if (axios.isAxiosError(error)) {
            if (error.response) {
                statusCode = error.response.status;
                message = `External API Error: ${error.response.statusText}`;
                logRepo.saveApiLog(url, statusCode, error.response.data).catch(console.error);
            }
            else if (error.request) {
                message = 'External API is unreachable (Network Error)';
            }
        }

        throw new AppError(message, statusCode);
    }
};