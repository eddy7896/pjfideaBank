import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Schools table
export const schools = sqliteTable('schools', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  location: text('location').notNull(),
  address: text('address').notNull(),
  phone: text('phone').notNull(),
  website: text('website'),
  principalName: text('principal_name').notNull(),
  udaiseCode: text('udaise_code').notNull().unique(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  createdBy: text('created_by'),
});

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  role: text('role').notNull(), // 'super-admin' | 'school' | 'education-dept' | 'student'
  schoolName: text('school_name'),
  displayName: text('display_name').notNull(),
  email: text('email').notNull().unique(),
  teamId: text('team_id'), // for students
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Student Teams table
export const studentTeams = sqliteTable('student_teams', {
  id: text('id').primaryKey(),
  pin: text('pin').notNull(),
  name: text('name').notNull(),
  schoolName: text('school_name').notNull(),
  members: text('members'), // JSON string: TeamMember[]
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Ideas table
export const ideas = sqliteTable('ideas', {
  id: text('id').primaryKey(),
  schoolName: text('school_name').notNull(),
  title: text('title').notNull(),
  theme: text('theme').notNull(),
  teamId: text('team_id'),
  studentTeam: text('student_team').notNull(),
  problemStatement: text('problem_statement').notNull(),
  targetAudience: text('target_audience').notNull(),
  status: text('status').notNull(), // Design Thinking stage
  lastUpdated: text('last_updated').notNull(),
  stageData: text('stage_data'), // JSON string
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Timeline Events table
export const timelineEvents = sqliteTable('timeline_events', {
  id: text('id').primaryKey(),
  ideaId: text('idea_id').notNull(),
  type: text('type').notNull(), // 'created' | 'stage_change' | 'form_submitted' | 'comment' | 'test_failed'
  stage: text('stage'),
  fromStage: text('from_stage'),
  toStage: text('to_stage'),
  content: text('content'),
  author: text('author'),
  timestamp: text('timestamp').notNull(),
});

// Theme Activities table
export const themeActivities = sqliteTable('theme_activities', {
  id: text('id').primaryKey(),
  date: integer('date').notNull(), // 1-31
  month: integer('month').notNull(), // 0-11
  year: integer('year').notNull(),
  title: text('title').notNull(),
  theme: text('theme').notNull(),
  schoolName: text('school_name'),
  description: text('description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
