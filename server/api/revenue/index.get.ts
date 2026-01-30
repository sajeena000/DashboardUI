import { db } from '../../utils/db';
import { revenueData } from '../../database/schema';
import { eq, asc } from 'drizzle-orm';

// Default data to return if no data exists in database
const defaultData = {
  '7d': [35, 45, 30, 60, 75, 50, 65, 80, 70, 45, 90, 60],
  '30d': [15, 20, 25, 40, 30, 45, 35, 30, 50, 60, 55, 40]
};

export default defineEventHandler(async (event) => {
  try {
    // Fetch all revenue data
    const data = await db.select().from(revenueData).orderBy(asc(revenueData.dataIndex));
    
    // Group by period
    const grouped: Record<string, number[]> = {
      '7d': [...defaultData['7d']],
      '30d': [...defaultData['30d']]
    };
    
    // Override default values with stored values
    for (const row of data) {
      if (row.period === '7d' || row.period === '30d') {
        grouped[row.period][row.dataIndex] = row.value;
      }
    }
    
    return grouped;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch revenue data',
    });
  }
});
