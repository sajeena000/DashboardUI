# Dashboard UI

A modern admin dashboard built with **Nuxt 4**, **Vue 3**, and **PostgreSQL**.

## Tech Stack

- **Frontend:** Nuxt 4, Vue 3, Tailwind CSS, Pinia
- **Backend:** Nuxt Server API, Drizzle ORM
- **Database:** PostgreSQL
- **Icons:** Lucide Vue

## Features

- 📊 **Analytics** – Revenue trends and data visualization
- 👥 **Team Management** – CRUD operations for team members with role-based permissions
- 📝 **Activity Logs** – Track system events and user actions
- 🔔 **Notifications** – Dynamic notification system
- 🔍 **Global Search** – Search across team, activities, and settings
- ⚙️ **Settings** – Persistent user/app configuration

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your DATABASE_URL to .env

# Run database migrations
npx drizzle-kit push

# Start development server
npm run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npx drizzle-kit studio` | Open Drizzle Studio |
