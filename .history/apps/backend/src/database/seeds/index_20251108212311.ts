import prisma from '../../config/postgres';
import bcrypt from 'bcryptjs';
import { logger } from '../../utils/logger';

async function seedRoles() {
  logger.info('Seeding roles...');

  const roles = [
    {
      name: 'admin',
      nameAr: 'مدير النظام',
      description: 'Full system access',
      permissions: {
        'users.read': true,
        'users.create': true,
        'users.update': true,
        'users.delete': true,
        'accounts.read': true,
        'accounts.create': true,
        'accounts.update': true,
        'accounts.delete': true,
        'tenders.read': true,
        'tenders.create': true,
        'tenders.update': true,
        'workOrders.read': true,
        'workOrders.create': true,
        'workOrders.update': true,
        'financial.read': true,
        'financial.create': true,
        'financial.update': true,
        'reports.read': true,
      },
    },
    {
      name: 'financial_manager',
      nameAr: 'مدير مالي',
      description: 'Financial management access',
      permissions: {
        'accounts.read': true,
        'accounts.create': true,
        'accounts.update': true,
        'financial.read': true,
        'financial.create': true,
        'financial.update': true,
        'reports.read': true,
      },
    },
    {
      name: 'operations_manager',
      nameAr: 'مدير عمليات',
      description: 'Operations management access',
      permissions: {
        'tenders.read': true,
        'tenders.create': true,
        'tenders.update': true,
        'workOrders.read': true,
        'workOrders.create': true,
        'workOrders.update': true,
        'reports.read': true,
      },
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: role,
      create: role,
    });
  }

  logger.info('Roles seeded successfully');
}

async function seedDepartments() {
  logger.info('Seeding departments...');

  const departments = [
    { code: 'EXEC', name: 'Executive Management', nameAr: 'الإدارة العليا' },
    { code: 'FIN', name: 'Financial', nameAr: 'المالية' },
    { code: 'OPS', name: 'Operations', nameAr: 'العمليات' },
    { code: 'HR', name: 'Human Resources', nameAr: 'الموارد البشرية' },
    { code: 'WARE', name: 'Warehouse', nameAr: 'المخازن' },
    { code: 'IT', name: 'IT & Digital Transformation', nameAr: 'تكنولوجيا المعلومات' },
  ];

  for (const dept of departments) {
    await prisma.department.upsert({
      where: { code: dept.code },
      update: dept,
      create: dept,
    });
  }

  logger.info('Departments seeded successfully');
}

async function seedUsers() {
  logger.info('Seeding users...');

  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  if (!adminRole) throw new Error('Admin role not found');

  const hashedPassword = await bcrypt.hash('Admin@123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@nakl.com' },
    update: {},
    create: {
      email: 'admin@nakl.com',
      password: hashedPassword,
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+20 2 1234 5678',
      roleId: adminRole.id,
      isActive: true,
      emailVerified: true,
    },
  });

  logger.info('Users seeded successfully');
}

async function seedChartOfAccounts() {
  logger.info('Seeding chart of accounts...');

  const accounts = [
    // Assets (1000)
    {
      code: '1000',
      name: 'Assets',
      nameAr: 'الأصول',
      type: 'ASSET',
      level: 1,
      allowPosting: false,
    },
    {
      code: '1100',
      name: 'Current Assets',
      nameAr: 'الأصول المتداولة',
      type: 'ASSET',
      level: 2,
      parentCode: '1000',
      allowPosting: false,
    },
    {
      code: '1110',
      name: 'Cash and Cash Equivalents',
      nameAr: 'النقدية وما في حكمها',
      type: 'ASSET',
      level: 3,
      parentCode: '1100',
      allowPosting: false,
    },
    {
      code: '1111',
      name: 'Cash on Hand',
      nameAr: 'النقدية في الصندوق',
      type: 'ASSET',
      level: 4,
      parentCode: '1110',
      allowPosting: true,
    },
    {
      code: '1112',
      name: 'Bank Accounts',
      nameAr: 'الحسابات البنكية',
      type: 'ASSET',
      level: 4,
      parentCode: '1110',
      allowPosting: true,
    },

    // Liabilities (2000)
    {
      code: '2000',
      name: 'Liabilities',
      nameAr: 'الخصوم',
      type: 'LIABILITY',
      level: 1,
      allowPosting: false,
    },
    {
      code: '2100',
      name: 'Current Liabilities',
      nameAr: 'الخصوم المتداولة',
      type: 'LIABILITY',
      level: 2,
      parentCode: '2000',
      allowPosting: false,
    },
    {
      code: '2110',
      name: 'Accounts Payable',
      nameAr: 'الدائنون',
      type: 'LIABILITY',
      level: 3,
      parentCode: '2100',
      allowPosting: true,
    },

    // Equity (3000)
    {
      code: '3000',
      name: 'Equity',
      nameAr: 'حقوق الملكية',
      type: 'EQUITY',
      level: 1,
      allowPosting: false,
    },
    {
      code: '3100',
      name: 'Capital',
      nameAr: 'رأس المال',
      type: 'EQUITY',
      level: 2,
      parentCode: '3000',
      allowPosting: true,
    },

    // Revenue (4000)
    {
      code: '4000',
      name: 'Revenue',
      nameAr: 'الإيرادات',
      type: 'REVENUE',
      level: 1,
      allowPosting: false,
    },
    {
      code: '4100',
      name: 'Service Revenue',
      nameAr: 'إيرادات الخدمات',
      type: 'REVENUE',
      level: 2,
      parentCode: '4000',
      allowPosting: false,
    },
    {
      code: '4110',
      name: 'Transport Services Revenue',
      nameAr: 'إيرادات خدمات النقل',
      type: 'REVENUE',
      level: 3,
      parentCode: '4100',
      allowPosting: true,
    },

    // Expenses (5000)
    {
      code: '5000',
      name: 'Expenses',
      nameAr: 'المصروفات',
      type: 'EXPENSE',
      level: 1,
      allowPosting: false,
    },
    {
      code: '5100',
      name: 'Operating Expenses',
      nameAr: 'المصروفات التشغيلية',
      type: 'EXPENSE',
      level: 2,
      parentCode: '5000',
      allowPosting: false,
    },
    {
      code: '5110',
      name: 'Vendor Payments',
      nameAr: 'مدفوعات الموردين',
      type: 'EXPENSE',
      level: 3,
      parentCode: '5100',
      allowPosting: true,
    },
    {
      code: '5120',
      name: 'Fuel Expenses',
      nameAr: 'مصروفات الوقود',
      type: 'EXPENSE',
      level: 3,
      parentCode: '5100',
      allowPosting: true,
    },
    {
      code: '5130',
      name: 'Maintenance Expenses',
      nameAr: 'مصروفات الصيانة',
      type: 'EXPENSE',
      level: 3,
      parentCode: '5100',
      allowPosting: true,
    },
  ];

  // Create accounts hierarchically
  const accountMap = new Map();

  for (const account of accounts) {
    const { parentCode, ...accountData } = account as any;
    let parentId: string | undefined;

    if (parentCode) {
      parentId = accountMap.get(parentCode);
    }

    const created = await prisma.account.upsert({
      where: { code: account.code },
      update: { ...accountData, parentId },
      create: { ...accountData, parentId },
    });

    accountMap.set(account.code, created.id);
  }

  logger.info('Chart of accounts seeded successfully');
}

async function main() {
  try {
    logger.info('Starting database seed...');

    await seedRoles();
    await seedDepartments();
    await seedUsers();
    await seedChartOfAccounts();

    logger.info('✅ Database seeded successfully');
  } catch (error) {
    logger.error('❌ Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
