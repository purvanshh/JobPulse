import { PrismaClient } from "@prisma/client";

import { addDaysFromToday } from "../lib/dates";

const prisma = new PrismaClient();

async function main() {
  await prisma.inboundRequest.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.job.deleteMany();

  const hoursAgo = (hours: number) => {
    const date = new Date();
    date.setHours(date.getHours() - hours);
    return date;
  };

  const daysAgoAt = (days: number, hour: number) => {
    const date = addDaysFromToday(-days);
    date.setHours(hour, 15, 0, 0);
    return date;
  };

  // --- Jobs: morning attention mix + pipeline ---
  const casey = await prisma.job.create({
    data: {
      customerName: "Casey Wright",
      company: "Dockside Grill",
      phone: "555-0111",
      jobDescription: "Ice machine sanitize and tune-up",
      source: "REFERRAL",
      status: "NEW",
      nextFollowUp: addDaysFromToday(-3),
      notes: "Left voicemail three days ago. Still no callback.",
    },
  });

  const maria = await prisma.job.create({
    data: {
      customerName: "Maria Lopez",
      company: "ABC Restaurant",
      phone: "555-0101",
      email: "maria@abcrestaurant.example",
      jobDescription: "Walk-in freezer not maintaining temperature",
      source: "PHONE",
      status: "WAITING_ON_CUSTOMER",
      nextFollowUp: addDaysFromToday(-2),
      notes: "Quote sent; manager said they would decide soon.",
    },
  });

  const alex = await prisma.job.create({
    data: {
      customerName: "Alex Morgan",
      company: "Harbor Bistro",
      phone: "555-0106",
      jobDescription: "Prep cooler temperature swings",
      source: "PHONE",
      status: "WAITING_ON_CUSTOMER",
      nextFollowUp: addDaysFromToday(-1),
    },
  });

  const james = await prisma.job.create({
    data: {
      customerName: "James Chen",
      company: "FreshMart Grocery",
      phone: "555-0102",
      email: "james@freshmart.example",
      jobDescription: "Walk-in cooler compressor noise",
      source: "WEBSITE",
      status: "WAITING_ON_QUOTE",
      nextFollowUp: addDaysFromToday(0),
      notes: "Needs parts list before quote.",
    },
  });

  const sam = await prisma.job.create({
    data: {
      customerName: "Sam Ortiz",
      company: "Burger House",
      phone: "555-0104",
      jobDescription: "Reach-in freezer icing over",
      source: "TEXT",
      status: "NEW",
      nextFollowUp: addDaysFromToday(0),
    },
  });

  const riley = await prisma.job.create({
    data: {
      customerName: "Riley Adams",
      company: "Corner Market",
      phone: "555-0110",
      jobDescription: "Emergency freezer repair callback",
      source: "PHONE",
      status: "WAITING_ON_CUSTOMER",
      nextFollowUp: addDaysFromToday(0),
    },
  });

  const chris = await prisma.job.create({
    data: {
      customerName: "Chris Nguyen",
      company: "Sunrise Cafe",
      phone: "555-0107",
      jobDescription: "Ice machine leak under unit",
      source: "WEBSITE",
      status: "NEW",
      nextFollowUp: addDaysFromToday(1),
    },
  });

  const taylor = await prisma.job.create({
    data: {
      customerName: "Taylor Brooks",
      company: "Valley Foods",
      phone: "555-0108",
      jobDescription: "Freezer door gasket replacement",
      source: "REPEAT_CUSTOMER",
      status: "WAITING_ON_QUOTE",
      nextFollowUp: addDaysFromToday(2),
    },
  });

  const pat = await prisma.job.create({
    data: {
      customerName: "Pat Rivera",
      company: "Central Warehouse",
      phone: "555-0103",
      jobDescription: "Ice machine production down",
      source: "REPEAT_CUSTOMER",
      status: "SCHEDULED",
      nextFollowUp: addDaysFromToday(3),
    },
  });

  const morgan = await prisma.job.create({
    data: {
      customerName: "Morgan Ellis",
      company: "Northside Distribution",
      phone: "555-0112",
      jobDescription: "Blast freezer alarm fault",
      source: "TEXT",
      status: "WAITING_ON_QUOTE",
      nextFollowUp: addDaysFromToday(4),
    },
  });

  const jordan = await prisma.job.create({
    data: {
      customerName: "Jordan Lee",
      company: "Pizza Palace",
      phone: "555-0109",
      jobDescription: "Walk-in cooler fan motor",
      source: "OTHER",
      status: "SCHEDULED",
      nextFollowUp: addDaysFromToday(5),
    },
  });

  const deniseKim = await prisma.job.create({
    data: {
      customerName: "Denise Kim",
      company: "Metro Grocery",
      phone: "555-0155",
      jobDescription: "Walk-in freezer completed last month",
      source: "REFERRAL",
      status: "DONE",
      nextFollowUp: addDaysFromToday(-10),
    },
  });

  const jamie = await prisma.job.create({
    data: {
      customerName: "Jamie Fox",
      company: "Family Diner",
      phone: "555-0144",
      jobDescription: "Display case not cooling",
      source: "PHONE",
      status: "DONE",
      nextFollowUp: addDaysFromToday(-5),
    },
  });

  // Converted-from-inbox story job (linked inbound below)
  const bayview = await prisma.job.create({
    data: {
      customerName: "Bayview Grill",
      company: "Bayview Grill",
      phone: "555-0190",
      email: "kitchen@bayview.example",
      jobDescription: "Ice machine slow — website form last week",
      source: "WEBSITE",
      status: "WAITING_ON_QUOTE",
      nextFollowUp: addDaysFromToday(1),
      notes: "Converted from inbox. Parts list drafted.",
    },
  });

  // Activities that tell a short story on key jobs
  await prisma.activity.createMany({
    data: [
      {
        jobId: casey.id,
        type: "NOTE",
        note: "Job created.",
        createdAt: daysAgoAt(5, 9),
      },
      {
        jobId: casey.id,
        type: "CONTACTED",
        note: "Left voicemail. No callback yet.",
        createdAt: daysAgoAt(3, 10),
      },
      {
        jobId: casey.id,
        type: "NOTE",
        note: "Next follow-up scheduled for earlier this week.",
        createdAt: daysAgoAt(3, 10),
      },

      {
        jobId: maria.id,
        type: "NOTE",
        note: "Job created from phone call.",
        createdAt: daysAgoAt(6, 8),
      },
      {
        jobId: maria.id,
        type: "STATUS_CHANGED",
        note: "Status changed to Waiting on Quote.",
        createdAt: daysAgoAt(5, 11),
      },
      {
        jobId: maria.id,
        type: "CONTACTED",
        note: "Quote emailed. Manager will decide this week.",
        createdAt: daysAgoAt(4, 14),
      },
      {
        jobId: maria.id,
        type: "STATUS_CHANGED",
        note: "Status changed to Waiting on Customer.",
        createdAt: daysAgoAt(4, 14),
      },
      {
        jobId: maria.id,
        type: "NOTE",
        note: "Next follow-up scheduled — still waiting on yes/no.",
        createdAt: daysAgoAt(4, 14),
      },

      {
        jobId: alex.id,
        type: "NOTE",
        note: "Job created.",
        createdAt: daysAgoAt(4, 9),
      },
      {
        jobId: alex.id,
        type: "CONTACTED",
        note: "Spoke with prep lead. Waiting on owner approval.",
        createdAt: daysAgoAt(2, 16),
      },

      {
        jobId: james.id,
        type: "NOTE",
        note: "Request received via Website.",
        createdAt: daysAgoAt(2, 8),
      },
      {
        jobId: james.id,
        type: "NOTE",
        note: "Converted from inbound request to Job.",
        createdAt: daysAgoAt(2, 9),
      },
      {
        jobId: james.id,
        type: "STATUS_CHANGED",
        note: "Status changed to Waiting on Quote.",
        createdAt: daysAgoAt(1, 11),
      },

      {
        jobId: sam.id,
        type: "NOTE",
        note: "Job created from text.",
        createdAt: hoursAgo(6),
      },
      {
        jobId: riley.id,
        type: "NOTE",
        note: "Job created.",
        createdAt: hoursAgo(8),
      },
      {
        jobId: riley.id,
        type: "CONTACTED",
        note: "Emergency call — waiting on customer to confirm window.",
        createdAt: hoursAgo(5),
      },

      {
        jobId: chris.id,
        type: "NOTE",
        note: "Job created.",
        createdAt: daysAgoAt(1, 10),
      },
      {
        jobId: taylor.id,
        type: "NOTE",
        note: "Job created.",
        createdAt: daysAgoAt(1, 12),
      },
      {
        jobId: pat.id,
        type: "NOTE",
        note: "Job created.",
        createdAt: daysAgoAt(3, 9),
      },
      {
        jobId: pat.id,
        type: "STATUS_CHANGED",
        note: "Status changed to Scheduled.",
        createdAt: daysAgoAt(1, 15),
      },
      {
        jobId: morgan.id,
        type: "NOTE",
        note: "Job created.",
        createdAt: daysAgoAt(2, 13),
      },
      {
        jobId: jordan.id,
        type: "NOTE",
        note: "Job created.",
        createdAt: daysAgoAt(4, 10),
      },
      {
        jobId: jordan.id,
        type: "STATUS_CHANGED",
        note: "Status changed to Scheduled.",
        createdAt: daysAgoAt(2, 11),
      },
      {
        jobId: deniseKim.id,
        type: "NOTE",
        note: "Job created.",
        createdAt: daysAgoAt(20, 9),
      },
      {
        jobId: deniseKim.id,
        type: "STATUS_CHANGED",
        note: "Status changed to Done.",
        createdAt: daysAgoAt(10, 16),
      },
      {
        jobId: jamie.id,
        type: "NOTE",
        note: "Job created.",
        createdAt: daysAgoAt(12, 9),
      },
      {
        jobId: jamie.id,
        type: "STATUS_CHANGED",
        note: "Status changed to Done.",
        createdAt: daysAgoAt(5, 14),
      },

      {
        jobId: bayview.id,
        type: "NOTE",
        note: "Request received via Website · last week.",
        createdAt: daysAgoAt(7, 10),
      },
      {
        jobId: bayview.id,
        type: "NOTE",
        note: "Converted from inbound request to Job.",
        createdAt: daysAgoAt(6, 11),
      },
      {
        jobId: bayview.id,
        type: "STATUS_CHANGED",
        note: "Status changed to Waiting on Quote.",
        createdAt: daysAgoAt(6, 11),
      },
      {
        jobId: bayview.id,
        type: "CONTACTED",
        note: "Called kitchen. Gathering model numbers for quote.",
        createdAt: daysAgoAt(5, 15),
      },
      {
        jobId: bayview.id,
        type: "NOTE",
        note: "Next follow-up scheduled for tomorrow.",
        createdAt: daysAgoAt(5, 15),
      },
    ],
  });

  // --- Inbound requests (channels from the customer interview) ---
  await prisma.inboundRequest.create({
    data: {
      source: "WEBSITE",
      customerName: "Mario's Pizza",
      customerPhone: "555-0142",
      customerEmail: "manager@marios.example",
      message:
        "Walk-in freezer stopped cooling. Product is soft — need help today.",
      receivedAt: hoursAgo(1),
      status: "NEW",
    },
  });

  await prisma.inboundRequest.create({
    data: {
      source: "EMAIL",
      customerName: "Lakeside Catering",
      customerPhone: "555-0160",
      customerEmail: "ops@lakeside.example",
      message:
        "Two prep coolers are warm ahead of Saturday's banquet. Looking for a quote and earliest slot.",
      receivedAt: hoursAgo(3),
      status: "NEW",
    },
  });

  await prisma.inboundRequest.create({
    data: {
      source: "TEXT",
      customerName: "Quick Stop Market",
      customerPhone: "555-0177",
      message: "Ice cream case running warm. Can someone call today?",
      receivedAt: hoursAgo(5),
      status: "NEW",
    },
  });

  await prisma.inboundRequest.create({
    data: {
      source: "PHONE",
      customerName: "Riverfront Seafood",
      customerPhone: "555-0133",
      message:
        "Walk-in cooler compressor kicking on and off every few minutes. Owner called this morning.",
      receivedAt: hoursAgo(2),
      status: "REVIEWED",
    },
  });

  await prisma.inboundRequest.create({
    data: {
      source: "REFERRAL",
      customerName: "Oak Street Bakery",
      customerPhone: "555-0188",
      customerEmail: "hello@oakstreet.example",
      message:
        "Referred by Harbor Bistro — proofing fridge not holding temp since Monday.",
      receivedAt: hoursAgo(26),
      status: "NEW",
    },
  });

  await prisma.inboundRequest.create({
    data: {
      source: "NOTEBOOK",
      customerName: "Corner Deli",
      customerPhone: "555-0121",
      message:
        "Front display case icing up. Owner stopped by the front desk while Denise was on another call.",
      receivedAt: hoursAgo(30),
      status: "NEW",
    },
  });

  await prisma.inboundRequest.create({
    data: {
      source: "WEBSITE",
      customerName: "Bayview Grill",
      customerPhone: "555-0190",
      customerEmail: "kitchen@bayview.example",
      message: "Ice machine slow — filled out the website form last week.",
      receivedAt: daysAgoAt(7, 10),
      status: "CONVERTED",
      jobId: bayview.id,
    },
  });

  await prisma.inboundRequest.create({
    data: {
      source: "EMAIL",
      customerName: "Old Town Tavern",
      customerPhone: "555-0120",
      customerEmail: "bar@oldtown.example",
      message: "Spam / wrong number — not a service request.",
      receivedAt: hoursAgo(48),
      status: "DISMISSED",
    },
  });
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
