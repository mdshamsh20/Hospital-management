import prisma from './src/prismaClient';

async function main() {
  try {
    let patient = await prisma.patient.create({
      data: {
        name: "Test User",
        age: null,
        gender: null,
        phone: "1231231234"
      }
    });
    console.log("Patient:", patient);
  } catch (e) {
    console.error(e);
  }
}

main();
