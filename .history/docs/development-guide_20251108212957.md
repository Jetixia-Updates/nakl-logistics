# Nakl Logistics - Development Guide

## Project Structure

### Backend (`apps/backend`)

#### Database Architecture
- **PostgreSQL**: Relational data (accounting, users, roles, customers, vendors)
- **MongoDB**: Operational data (tenders, work orders, GPS tracking, warehouse operations)

#### Main Modules
1. **Authentication** (`/api/auth`)
   - Login, register, refresh token
   - JWT-based authentication

2. **Accounting** (`/api/accounts`)
   - Chart of accounts (شجرة الحسابات)
   - Journal entries
   - Financial reports

3. **Tenders** (`/api/tenders`)
   - Tender management
   - Bid submission
   - Award tracking

4. **Work Orders** (`/api/work-orders`)
   - Order creation from tenders
   - Vehicle assignment
   - Shipment tracking

5. **Financial** (`/api/invoices`, `/api/payments`)
   - Customer invoices
   - Vendor bills
   - Payment processing

6. **Operations** (`/api/vehicles`, `/api/gps`)
   - Vehicle management
   - GPS tracking
   - Route monitoring

7. **Warehouse** (`/api/warehouse`)
   - Inventory management
   - Goods receipt/issue
   - Stock movements

### Frontend (`apps/frontend`)

#### Pages Structure
- `/` - Landing page
- `/login` - Login page
- `/dashboard` - Main dashboard
- `/tenders` - Tender management
- `/work-orders` - Operations management
- `/financial` - Financial module
- `/warehouse` - Warehouse operations
- `/reports` - Analytics and reports

#### Key Features
- Bilingual (Arabic/English)
- Odoo-inspired UI
- Real-time GPS tracking
- Responsive design (128k resolution)
- Lightweight and fast

## Development Workflow

### Backend Development

1. **Database Migrations**
```bash
cd apps/backend
npm run db:migrate
npm run db:generate
```

2. **Seed Database**
```bash
npm run db:seed
```

3. **Start Development Server**
```bash
npm run dev
```

### Frontend Development

1. **Start Development Server**
```bash
cd apps/frontend
npm run dev
```

2. **Build for Production**
```bash
npm run build
```

## Key Technologies

### Backend
- Node.js + Express
- TypeScript
- Prisma (PostgreSQL ORM)
- Mongoose (MongoDB ODM)
- JWT authentication
- Socket.io (real-time)
- OpenTelemetry (distributed tracing)

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Zustand (state management)
- React Query (data fetching)
- next-i18next (internationalization)

## API Documentation

### Authentication

**POST /api/auth/login**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**POST /api/auth/register**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "roleId": "uuid"
}
```

### Tenders

**GET /api/tenders**
- Get all tenders
- Query params: status, page, limit

**POST /api/tenders**
- Create new tender

**POST /api/tenders/:id/submit-bid**
- Submit bid for tender

### Work Orders

**GET /api/work-orders**
- Get all work orders
- Query params: status, customerId, page, limit

**POST /api/work-orders**
- Create new work order

**POST /api/work-orders/:id/assign-vehicle**
- Assign vehicle to work order

## Best Practices

1. **Code Style**
   - Use TypeScript strict mode
   - Follow ESLint rules
   - Use Prettier for formatting

2. **Database**
   - Always use transactions for financial operations
   - Index frequently queried fields
   - Use proper foreign keys and constraints

3. **Security**
   - Never expose sensitive data in API responses
   - Validate all inputs
   - Use parameterized queries
   - Implement rate limiting

4. **Performance**
   - Use pagination for large datasets
   - Implement caching where appropriate
   - Optimize database queries
   - Use CDN for static assets

## Deployment

### Backend Deployment
1. Set environment variables
2. Run database migrations
3. Build TypeScript
4. Start with PM2 or similar

### Frontend Deployment
1. Set environment variables
2. Build Next.js
3. Deploy to Vercel or similar platform

## Contributing

1. Create feature branch
2. Make changes
3. Write tests
4. Submit pull request

## License

Proprietary - All rights reserved
