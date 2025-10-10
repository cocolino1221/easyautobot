import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create super admin tenant
  const adminTenant = await prisma.tenant.upsert({
    where: { id: 'admin-tenant' },
    update: {},
    create: {
      id: 'admin-tenant',
      name: 'Admin Organization',
      plan: 'AGENCY',
      status: 'ACTIVE',
      maxIntegrations: 999,
      maxMessagesPerMonth: 999999,
      maxTeamMembers: 999,
      maxFlows: 999,
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
  });

  console.log('✅ Created admin tenant:', adminTenant.name);

  // Create super admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@platform.com' },
    update: {},
    create: {
      email: 'admin@platform.com',
      name: 'Super Admin',
      password: hashedPassword,
      role: 'ADMIN',
      tenantId: adminTenant.id,
    },
  });

  console.log('✅ Created super admin user:', adminUser.email);
  console.log('📧 Email: admin@platform.com');
  console.log('🔑 Password: admin123');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
