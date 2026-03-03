import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Departments
  const depts = [
    { name: 'Dental Care' },
    { name: 'Radiology' },
    { name: 'General OPD' },
    { name: 'Pediatrics' },
    { name: 'Cardiology' },
  ];

  for (const dept of depts) {
    await prisma.department.upsert({
      where: { id: depts.indexOf(dept) + 1 },
      update: {},
      create: dept,
    });
  }
  console.log('Departments seeded.');

  // 2. Doctors
  const docs = [
    { name: 'Dr. Sarah Jenkins', specialization: 'General Physician', onDuty: true, availability: 'Available' },
    { name: 'Dr. Michael Chen', specialization: 'Dentist', onDuty: true, availability: 'Busy' },
    { name: 'Dr. Emily Rodriguez', specialization: 'Radiologist', onDuty: true, availability: 'Available' },
    { name: 'Dr. James Wilson', specialization: 'Cardiologist', onDuty: true, availability: 'On Break' },
  ];

  for (const doc of docs) {
    await prisma.doctor.upsert({
      where: { id: docs.indexOf(doc) + 1 },
      update: {},
      create: doc,
    });
  }
  console.log('Doctors seeded.');

  // 3. Clinic Settings
  await prisma.clinicSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      clinicName: "Radiance Medical Centre",
      startTime: "09:00",
      endTime: "21:00",
      tokenResetRule: "Daily",
    },
  });
  console.log('Settings seeded.');

  // 4. Sample Patient
  const patient = await prisma.patient.upsert({
    where: { phone: '9876543210' },
    update: {},
    create: {
      name: 'Rahul Sharma',
      age: 28,
      gender: 'Male',
      phone: '9876543210',
      address: 'New Delhi'
    }
  });
  console.log('Sample patient seeded.');

  console.log('Seed complete! Dashboard should be working now.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
