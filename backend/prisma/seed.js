const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const users = [
  { name: "Admin User", email: "admin@example.com", password: "password123", role: "admin" },
  { name: "Regular User", email: "user@example.com", password: "password123", role: "user" }
];

const events = [
  {
    title: "Tech Conference 2026",
    description: "Annual technology conference focusing on AI and Web Dev.",
    date: new Date("2026-09-15T09:00:00Z"),
    venue: "San Francisco Convention Center",
    totalSeats: 500
  },
  {
    title: "React Workshop",
    description: "A hands-on workshop for building React applications.",
    date: new Date("2026-10-05T14:00:00Z"),
    venue: "Online",
    totalSeats: 100
  }
];

async function main() {
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, password: hashed, role: u.role }
    });
  }
  console.log(`Seeded ${users.length} users`);

  for (const e of events) {
    // Instead of upsert on a non-unique field, we use findFirst + create
    const existingEvent = await prisma.event.findFirst({
      where: { title: e.title }
    });
    if (!existingEvent) {
      await prisma.event.create({
        data: e
      });
    }
  }
  console.log(`Seeded ${events.length} events`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
