import { pgTable, serial, text, boolean, timestamp, json, integer } from 'drizzle-orm/pg-core';

// Table 1: Team Members
export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull(),
  // We store tags as a JSON array since it's a list of strings
  tags: json('tags').$type<string[]>().default([]),
  online: boolean('online').default(false),
  avatarUrl: text('avatar_url'), // For the Dicebear URL
  createdAt: timestamp('created_at').defaultNow(),
});

// Table 4: User Settings
export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().default('Intern Developer'),
  email: text('email').notNull().default('dev@dashboard.com'),
  notifications: boolean('notifications').default(true),
  userRole: text('user_role', { enum: ['admin', 'manager', 'member'] }).default('admin'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Table 2: Activity Logs
// This relates to the "Recent Activity" section of your dashboard
export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  type: text('type', { enum: ['info', 'success', 'warning', 'error'] }).default('info'),
  timestamp: timestamp('timestamp').defaultNow(),
});

// Table 3: Revenue Data
// Stores chart data for Revenue Trends on the analytics page
export const revenueData = pgTable('revenue_data', {
  id: serial('id').primaryKey(),
  period: text('period', { enum: ['7d', '30d'] }).notNull(),
  dataIndex: integer('data_index').notNull(), // Position in chart (0-11)
  value: integer('value').notNull(), // Percentage value (0-100)
  createdAt: timestamp('created_at').defaultNow(),
});

// Table 5: Notifications
// Stores dynamic notifications that can be auto-generated from system events
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  type: text('type', { enum: ['info', 'success', 'warning', 'error'] }).default('info'),
  color: text('color').default('bg-indigo-500'), // CSS class for indicator color
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});