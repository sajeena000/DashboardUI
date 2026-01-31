import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { teamMembers, activityLogs, clients, projects, admins } from './schema';
import { hashPassword } from '../utils/password';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

// Setup connection for the seed script
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

// ========================
// DATA CONSTANTS
// ========================

const CLIENT_NAMES = [
  'Acme Corporation', 'Globex Industries', 'Initech Solutions', 'Hooli Tech',
  'Pied Piper', 'Umbrella Corp', 'Stark Industries', 'Wayne Enterprises',
  'Oscorp Technologies', 'Cyberdyne Systems', 'Aperture Science', 'Massive Dynamic',
  'Soylent Corp', 'Tyrell Corporation', 'Weyland-Yutani', 'InGen Labs',
  'LexCorp', 'Gekko & Co', 'Prestige Worldwide', 'Dunder Mifflin'
];

const PROJECT_PREFIXES = [
  'E-commerce Platform', 'Mobile Banking App', 'CRM Dashboard', 'Analytics Suite',
  'Inventory Management', 'Customer Portal', 'AI Chatbot', 'Cloud Migration',
  'DevOps Pipeline', 'Marketing Automation', 'HR System', 'Supply Chain App',
  'Payment Gateway', 'Social Media Tool', 'Document Management', 'API Gateway',
  'Data Warehouse', 'IoT Dashboard', 'Security Audit', 'Performance Optimization'
];

const PROJECT_TYPES = ['Web', 'Mobile', 'AI', 'DevOps', 'Consulting', 'Other'] as const;
const PRICING_PACKAGES = ['Basic', 'Professional', 'Enterprise', 'Custom'] as const;
const STATUSES = ['pending', 'active', 'completed', 'cancelled'] as const;

// Pricing values
const PRICING_VALUES: Record<string, number | { min: number; max: number }> = {
  Basic: 2999,
  Professional: 9999,
  Enterprise: { min: 15000, max: 50000 },
  Custom: { min: 5000, max: 100000 }
};

// Status distribution weights (40% completed, 30% active, 20% pending, 10% cancelled)
const STATUS_WEIGHTS = [
  { status: 'completed', weight: 40 },
  { status: 'active', weight: 30 },
  { status: 'pending', weight: 20 },
  { status: 'cancelled', weight: 10 }
];

// ========================
// HELPER FUNCTIONS
// ========================

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getWeightedStatus(): typeof STATUSES[number] {
  const total = STATUS_WEIGHTS.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * total;

  for (const item of STATUS_WEIGHTS) {
    random -= item.weight;
    if (random <= 0) {
      return item.status as typeof STATUSES[number];
    }
  }
  return 'pending';
}

function getPricingValue(pkg: string): number {
  const pricing = PRICING_VALUES[pkg];
  if (typeof pricing === 'number') {
    return pricing;
  }
  return getRandomInt(pricing.min, pricing.max);
}

function getRandomDateInPast12Months(): Date {
  const now = new Date();
  const daysAgo = getRandomInt(1, 365);
  const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return date;
}

function generateDicebearUrl(name: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
}

function generateClientEmail(name: string): string {
  // Convert to email format: "Acme Corporation" -> "contact@acme-corporation.com"
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `contact@${slug}.com`;
}

// ========================
// MAIN SEED FUNCTION
// ========================

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Clear existing data
  console.log('  🗑️  Clearing existing data...');
  await db.delete(projects);
  await db.delete(clients);
  await db.delete(teamMembers);
  await db.delete(activityLogs);
  await db.delete(admins);

  // 2. Create primary admin with hashed password
  console.log('  🔐 Creating primary admin...');
  const hashedPassword = await hashPassword('admin123');
  const [primaryAdmin] = await db.insert(admins).values({
    name: 'Admin',
    email: 'admin@dashboard.com',
    passwordHash: hashedPassword,
    isPrimary: true,
    allowRegistration: false // Registration disabled by default
  }).returning();
  console.log(`     ✓ Created primary admin: ${primaryAdmin.email}`);

  // 3. Insert Clients (20 unique clients)
  console.log('  👥 Creating 20 clients...');
  const clientRecords = CLIENT_NAMES.map(name => ({
    name,
    email: generateClientEmail(name),
    avatar: generateDicebearUrl(name),
    status: Math.random() > 0.1 ? 'active' : 'inactive' as 'active' | 'inactive'
  }));

  const insertedClients = await db.insert(clients).values(clientRecords).returning();
  console.log(`     ✓ Created ${insertedClients.length} clients`);

  // 4. Insert Projects (55 projects distributed across clients)
  console.log('  📁 Creating 55 projects...');

  // Ensure ~30% of clients have 2+ projects (retention simulation)
  // Strategy: First 6 clients (30%) get 3-4 projects each, rest get 0-2
  const projectRecords: Array<{
    name: string;
    clientId: number;
    projectType: typeof PROJECT_TYPES[number];
    pricingPackage: typeof PRICING_PACKAGES[number];
    value: number;
    status: typeof STATUSES[number];
    description: string;
    startDate: Date;
  }> = [];

  let projectCounter = 0;

  // High-retention clients (first 6): 3-4 projects each = ~21 projects
  for (let i = 0; i < 6; i++) {
    const clientId = insertedClients[i].id;
    const numProjects = getRandomInt(3, 4);

    for (let j = 0; j < numProjects; j++) {
      const projectType = getRandomElement(PROJECT_TYPES);
      const pricingPackage = getRandomElement(PRICING_PACKAGES);
      const status = getWeightedStatus();

      projectRecords.push({
        name: `${PROJECT_PREFIXES[projectCounter % PROJECT_PREFIXES.length]} v${j + 1}`,
        clientId,
        projectType,
        pricingPackage,
        value: getPricingValue(pricingPackage),
        status,
        description: `${projectType} project for ${insertedClients[i].name}`,
        startDate: getRandomDateInPast12Months()
      });
      projectCounter++;
    }
  }

  // Medium-retention clients (next 8): 1-2 projects each = ~12 projects
  for (let i = 6; i < 14; i++) {
    const clientId = insertedClients[i].id;
    const numProjects = getRandomInt(1, 2);

    for (let j = 0; j < numProjects; j++) {
      const projectType = getRandomElement(PROJECT_TYPES);
      const pricingPackage = getRandomElement(PRICING_PACKAGES);
      const status = getWeightedStatus();

      projectRecords.push({
        name: `${PROJECT_PREFIXES[projectCounter % PROJECT_PREFIXES.length]}`,
        clientId,
        projectType,
        pricingPackage,
        value: getPricingValue(pricingPackage),
        status,
        description: `${projectType} project for ${insertedClients[i].name}`,
        startDate: getRandomDateInPast12Months()
      });
      projectCounter++;
    }
  }

  // Low/single project clients (remaining 6): 1 project each = ~6 projects
  for (let i = 14; i < 20; i++) {
    const clientId = insertedClients[i].id;
    const projectType = getRandomElement(PROJECT_TYPES);
    const pricingPackage = getRandomElement(PRICING_PACKAGES);
    const status = getWeightedStatus();

    projectRecords.push({
      name: `${PROJECT_PREFIXES[projectCounter % PROJECT_PREFIXES.length]}`,
      clientId,
      projectType,
      pricingPackage,
      value: getPricingValue(pricingPackage),
      status,
      description: `${projectType} project for ${insertedClients[i].name}`,
      startDate: getRandomDateInPast12Months()
    });
    projectCounter++;
  }

  // Add additional projects to reach 55+
  while (projectRecords.length < 55) {
    const randomClient = getRandomElement(insertedClients);
    const projectType = getRandomElement(PROJECT_TYPES);
    const pricingPackage = getRandomElement(PRICING_PACKAGES);
    const status = getWeightedStatus();

    projectRecords.push({
      name: `${getRandomElement(PROJECT_PREFIXES)} - Phase ${getRandomInt(1, 5)}`,
      clientId: randomClient.id,
      projectType,
      pricingPackage,
      value: getPricingValue(pricingPackage),
      status,
      description: `${projectType} project for ${randomClient.name}`,
      startDate: getRandomDateInPast12Months()
    });
  }

  const insertedProjects = await db.insert(projects).values(projectRecords).returning();
  console.log(`     ✓ Created ${insertedProjects.length} projects`);

  // 5. Insert Team Members
  console.log('  👨‍💻 Creating team members...');
  await db.insert(teamMembers).values([
    {
      name: 'Tom Holland',
      role: 'Frontend Lead',
      email: 'tom@dashboard.com',
      online: true,
      tags: ['Vue', 'Design'],
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom Holland'
    },
    {
      name: 'Sajeena Malla',
      role: 'Backend Dev',
      email: 'sajeena@dashboard.com',
      online: false,
      tags: ['Node', 'SQL'],
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sajeena Malla'
    },
    {
      name: 'Chris Hemsworth',
      role: 'Product Designer',
      email: 'hemsworth@dashboard.com',
      online: true,
      tags: ['Figma', 'UX'],
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chris Hemsworth'
    },
    {
      name: 'Nishant Malla',
      role: 'DevOps Engineer',
      email: 'nishant@dashboard.com',
      online: false,
      tags: ['AWS', 'CI/CD'],
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nishant Malla'
    },
    {
      name: 'Ryan Gosling',
      role: 'Intern',
      email: 'ryan@dashboard.com',
      online: true,
      tags: ['Learning'],
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan Gosling'
    }
  ]);

  // 6. Insert Activity Logs
  console.log('  📋 Creating activity logs...');
  await db.insert(activityLogs).values([
    { text: 'Database seeded with analytics data', type: 'success' },
    { text: `Created ${insertedClients.length} client records`, type: 'info' },
    { text: `Created ${insertedProjects.length} project records`, type: 'info' },
    { text: 'System ready for analytics tracking', type: 'success' }
  ]);

  // 7. Print Summary Statistics
  console.log('\n📊 Seed Summary:');
  console.log('  ─────────────────────────────────────');

  const statusCounts = projectRecords.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = projectRecords.reduce((sum, p) => sum + p.value, 0);
  const clientsWithMultipleProjects = new Set(
    projectRecords
      .map(p => p.clientId)
      .filter((id, _, arr) => arr.filter(x => x === id).length > 1)
  ).size;

  console.log(`  Primary Admin: ${primaryAdmin.email} (password: admin123)`);
  console.log(`  Clients: ${insertedClients.length}`);
  console.log(`  Projects: ${insertedProjects.length}`);
  console.log(`  Total Value: $${totalValue.toLocaleString()}`);
  console.log(`  Status Distribution:`);
  Object.entries(statusCounts).forEach(([status, count]) => {
    const pct = ((count / projectRecords.length) * 100).toFixed(1);
    console.log(`    - ${status}: ${count} (${pct}%)`);
  });
  console.log(`  Retention Clients (>1 project): ${clientsWithMultipleProjects} (~${((clientsWithMultipleProjects / insertedClients.length) * 100).toFixed(0)}%)`);
  console.log('  ─────────────────────────────────────');

  console.log('\n✅ Seeding complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
