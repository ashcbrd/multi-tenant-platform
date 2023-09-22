const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Resort" },
        { name: "Cafe" },
        { name: "Restaurant" },
        { name: "Boutique" },
        { name: "Art Gallery" },
        { name: "Park" },
        { name: "Bookstore" },
        { name: "Theater" },
        { name: "Museum" },
        { name: "Sports Venue" },
      ],
    });
  } catch (error) {
    console.error("Error seeding default categories");
  } finally {
    await db.$disconnect();
  }
}

main();
