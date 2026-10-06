import { PrismaClient } from "@prisma/client";

import { addDaysFromToday } from "../lib/dates";

const prisma = new PrismaClient();

async function main() {
  await prisma.job.deleteMany();

  const jobs = [
    {
      customerName: "Maria Lopez",
      company: "ABC Restaurant",
      phone: "555-0101",
      jobDescription: "Walk-in freezer not maintaining temperature",
      source: "PHONE" as const,
      status: "WAITING_ON_CUSTOMER" as const,
      nextFollowUp: addDaysFromToday(-2),
      notes: "Quote sent last week; manager traveling.",
    },
    {
      customerName: "James Chen",
      company: "FreshMart Grocery",
      phone: "555-0102",
      jobDescription: "Walk-in cooler compressor noise",
      source: "WEBSITE" as const,
      status: "WAITING_ON_QUOTE" as const,
      nextFollowUp: addDaysFromToday(0),
      notes: "Needs parts list before quote.",
    },
    {
      customerName: "Pat Rivera",
      company: "Central Warehouse",
      phone: "555-0103",
      jobDescription: "Ice machine production down",
      source: "REPEAT_CUSTOMER" as const,
      status: "SCHEDULED" as const,
      nextFollowUp: addDaysFromToday(3),
    },
    {
      customerName: "Sam Ortiz",
      company: "Burger House",
      phone: "555-0104",
      jobDescription: "Reach-in freezer icing over",
      source: "TEXT" as const,
      status: "NEW" as const,
      nextFollowUp: addDaysFromToday(0),
    },
    {
      customerName: "Denise Kim",
      company: "Metro Grocery",
      jobDescription: "Walk-in freezer completed last month",
      source: "REFERRAL" as const,
      status: "DONE" as const,
      nextFollowUp: addDaysFromToday(-10),
    },
    {
      customerName: "Alex Morgan",
      company: "Harbor Bistro",
      phone: "555-0106",
      jobDescription: "Prep cooler temperature swings",
      source: "PHONE" as const,
      status: "WAITING_ON_CUSTOMER" as const,
      nextFollowUp: addDaysFromToday(-1),
    },
    {
      customerName: "Chris Nguyen",
      company: "Sunrise Cafe",
      phone: "555-0107",
      jobDescription: "Ice machine leak under unit",
      source: "WEBSITE" as const,
      status: "NEW" as const,
      nextFollowUp: addDaysFromToday(1),
    },
    {
      customerName: "Taylor Brooks",
      company: "Valley Foods",
      phone: "555-0108",
      jobDescription: "Freezer door gasket replacement",
      source: "REPEAT_CUSTOMER" as const,
      status: "WAITING_ON_QUOTE" as const,
      nextFollowUp: addDaysFromToday(2),
    },
    {
      customerName: "Jordan Lee",
      company: "Pizza Palace",
      jobDescription: "Walk-in cooler fan motor",
      source: "OTHER" as const,
      status: "SCHEDULED" as const,
      nextFollowUp: addDaysFromToday(5),
      phone: "555-0109",
    },
    {
      customerName: "Riley Adams",
      company: "Corner Market",
      phone: "555-0110",
      jobDescription: "Emergency freezer repair callback",
      source: "PHONE" as const,
      status: "WAITING_ON_CUSTOMER" as const,
      nextFollowUp: addDaysFromToday(0),
    },
    {
      customerName: "Casey Wright",
      company: "Dockside Grill",
      phone: "555-0111",
      jobDescription: "Ice machine sanitize and tune-up",
      source: "REFERRAL" as const,
      status: "NEW" as const,
      nextFollowUp: addDaysFromToday(-3),
    },
    {
      customerName: "Morgan Ellis",
      company: "Northside Distribution",
      phone: "555-0112",
      jobDescription: "Blast freezer alarm fault",
      source: "TEXT" as const,
      status: "WAITING_ON_QUOTE" as const,
      nextFollowUp: addDaysFromToday(4),
    },
    {
      customerName: "Jamie Fox",
      company: "Family Diner",
      jobDescription: "Display case not cooling",
      source: "PHONE" as const,
      status: "DONE" as const,
      nextFollowUp: addDaysFromToday(-5),
    },
  ];

  for (const job of jobs) {
    await prisma.job.create({ data: job });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
