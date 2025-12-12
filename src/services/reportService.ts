import * as reportRepo from '../repositories/reportRepo';

export const generateStockReport = async () => {
    const rawData = await reportRepo.getStockSummary();
    const reportData = {
        generated_at: new Date(),
        total_products: rawData.length,
        items: rawData
    };

    return reportData;
};