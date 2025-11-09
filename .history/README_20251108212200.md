# Nakl - Logistics & Transport Management System

A comprehensive logistics and transport management system built with Next.js 14, Node.js, PostgreSQL, and MongoDB.

## 🚀 Features

- **Bilingual Support**: Full Arabic and English support with AI-powered translation
- **Financial Management**: Complete accounting system with chart of accounts (Egyptian Pound)
- **Operations Management**: Tender bidding, work orders, shipment tracking
- **Vendor Management**: External vehicle fleet management
- **Warehouse Management**: Inventory tracking and warehouse operations
- **GPS Tracking**: Real-time vehicle tracking and monitoring
- **HR & Payroll**: Complete human resources management
- **HSE & Quality**: Health, Safety, Environment, and ISO compliance
- **Supply Chain**: Procurement and supplier management
- **Odoo-inspired UI**: Clean, modern interface with lightweight design

## 📁 Project Structure

```
nakl-logistics/
├── apps/
│   ├── frontend/          # Next.js 14 frontend application
│   └── backend/           # Node.js Express backend API
├── packages/
│   ├── database/          # Database schemas and utilities
│   ├── shared/            # Shared types and utilities
│   └── ui/                # Shared UI components
└── docs/                  # Documentation
```

## 🛠️ Tech Stack

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- next-i18next for internationalization
- Recharts for analytics

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL (accounting, users, roles)
- MongoDB (shipments, documents)
- Prisma ORM for PostgreSQL
- Mongoose for MongoDB
- JWT authentication

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- MongoDB 6+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd nakl-logistics
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/backend/.env.example apps/backend/.env
```

4. Setup databases
```bash
# Create PostgreSQL database
createdb nakl_logistics

# Run migrations
npm run db:migrate

# Seed initial data
npm run db:seed
```

5. Start development servers
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`
The backend API will be available at `http://localhost:4000`

## 📚 Documentation

Detailed documentation for each module can be found in the `/docs` directory.

## 🔐 Default Credentials

After seeding the database, you can login with:
- Email: admin@nakl.com
- Password: Admin@123

**Important**: Change these credentials in production!

## 🌐 Deployment

See [deployment documentation](./docs/deployment.md) for production deployment instructions.

## 📝 License

Proprietary - All rights reserved
