# Infosys Solutions - Corporate Dashboard & Website

A comprehensive full-stack solution featuring a modern corporate website and a robust admin dashboard. Built with **Nuxt 4**, **Vue 3**, **Tailwind CSS**, and **PostgreSQL**.

## Key Features

### Public Website
- **Modern UI/UX**: Responsive design with glassmorphism effects and smooth transitions.
- **Dynamic Content**:
    - **Services & Pricing**: Showcasing offerings and packages.
    - **Gallery**: Visual portfolio of projects.
    - **News & Events**: Blog posts and company event highlights.
    - **About Us**: Detailed company and team sections.
- **AI Chatbot**: Integrated **Google Gemma 3** powered assistant for visitor support.
- **Dark/Light Mode**: Fully supported theme switching.

### Admin Dashboard
- **Secure Authentication**: Built-in Login and Registration system.
- **Analytics & Insights**: Visual data representation for revenue, client retention, and pipeline value.
- **Content Management System (CMS)**:
    - **Blogs**: Create and manage article content.
    - **Events**: Schedule and publish company events.
    - **Projects**: Manage portfolio case studies.
- **Team Management**: Administer team members, roles, and permissions.
- **Inquiry Management**: Track and respond to contact form submissions.
- **Global Search**: Instant search across all modules (Team, Projects, Blogs, etc.).
- **Settings**: Persistent configuration for application preferences.

## Tech Stack

- **Framework**: [Nuxt 4](https://nuxt.com)
- **Frontend**: Vue 3, Tailwind CSS, Lucide Icons
- **State Management**: Pinia
- **Database**: PostgreSQL
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **AI Integration**: Google GenAI SDK (Gemma 3)

## Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- PostgreSQL Database

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository_url>
    cd dashboard
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/dashboard_db"
    GEMINI_API_KEY="your_google_genai_api_key"
    ```

4.  **Database Migration**
    Push the schema to your database:
    ```bash
    npx drizzle-kit push
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Scripts

| Command | Description |
|Args|Description|
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npx drizzle-kit studio` | Launch Drizzle Studio (Database GUI) |
