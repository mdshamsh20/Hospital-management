import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const depts = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dental Care', 'General OPD'];
  for (const name of depts) {
    await prisma.department.create({ data: { name } });
  }

  const docs = ['Dr. Sarah Jenkins', 'Dr. Michael Chen', 'Dr. Emily Rodriguez', 'Dr. James Wilson'];
  for (const name of docs) {
    await prisma.doctor.create({ data: { name, specialization: 'General' } });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
