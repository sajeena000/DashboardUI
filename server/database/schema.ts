import { pgTable, serial, text, boolean, timestamp, json, integer, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const clientStatus = pgEnum('client_status', ['active', 'inactive']);
export const pricingPackage = pgEnum('pricing_package', ['Basic', 'Professional', 'Enterprise', 'Custom']);

// Table 1: Team Members (with public profile support)
export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: text('role').notNull(),
  // We store tags as a JSON array since it's a list of strings
  tags: json('tags').$type<string[]>().default([]),
  online: boolean('online').default(false),
  avatarUrl: text('avatar_url'), // For the Dicebear URL
  // Public profile fields
  bio: text('bio'),
  jobTitle: text('job_title'),
  linkedinUrl: text('linkedin_url'),
  imageUrl: text('image_url'),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table: Clients (for retention tracking and project grouping)
export const clients = pgTable('clients', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  avatar: text('avatar'),
  status: clientStatus('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table 6: Blog Posts
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  authorId: integer('author_id'),
  publishedAt: timestamp('published_at'),
  coverImage: text('cover_image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at'),
});

// Table 7: Events
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  eventDate: timestamp('event_date').notNull(),
  location: text('location'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table 8: Contact Submissions
export const contactSubmissions = pgTable('contact_submissions', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject'),
  message: text('message').notNull(),
  status: text('status', { enum: ['new', 'in-progress', 'resolved'] }).default('new'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table 9: Projects (modified with client_id FK, start_date, pricing_package)
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  clientId: integer('client_id').notNull(),
  projectType: text('project_type', { enum: ['Web', 'Mobile', 'AI', 'DevOps', 'Consulting', 'Other'] }).notNull(),
  pricingPackage: pricingPackage('pricing_package').default('Basic'),
  value: integer('value').default(0),
  status: text('status', { enum: ['pending', 'active', 'completed', 'cancelled'] }).default('pending'),
  description: text('description'),
  startDate: timestamp('start_date').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Table 4: Admin Users (for authentication)
export const admins = pgTable('admins', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  isPrimary: boolean('is_primary').default(false), // Only the seeded admin
  allowRegistration: boolean('allow_registration').default(false), // Only settable by primary
  createdAt: timestamp('created_at').defaultNow(),
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