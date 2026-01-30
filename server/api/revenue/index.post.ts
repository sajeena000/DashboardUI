import { db } from '../../utils/db';
import { revenueData } from '../../database/schema';
import { eq, and } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  const body = await readBody(event) || {};
  
  // Validate input
  const { period, dataIndex, value } = body;
  
  if (!period || !['7d', '30d'].includes(period)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid period. Must be "7d" or "30d".',
    });
  }
  
  if (typeof dataIndex !== 'number' || dataIndex < 0 || dataIndex > 11) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid dataIndex. Must be between 0 and 11.',
    });
  }
  
  // Clamp value to 0-100 range
  const clampedValue = Math.max(0, Math.min(100, Math.round(value)));
  
  try {
    // Check if entry exists
    const existing = await db.select()
      .from(revenueData)
      .where(and(
        eq(revenueData.period, period),
        eq(revenueData.dataIndex, dataIndex)
      ));
    
    if (existing.length > 0) {
      // Update existing
      await db.update(revenueData)
        .set({ value: clampedValue })
        .where(and(
          eq(revenueData.period, period),
          eq(revenueData.dataIndex, dataIndex)
        ));
    } else {
      // Insert new
      await db.insert(revenueData).values({
        period,
        dataIndex,
        value: clampedValue
      });
    }
    
    return { success: true, period, dataIndex, value: clampedValue };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save revenue data',
    });
  }
});
