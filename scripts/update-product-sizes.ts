import { PrismaClient, ProductSize } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const defaultSizes: ProductSize[] = ["XS", "S", "M", "L", "XL"];

  const products = await prisma.product.findMany();

  console.log(`Found ${products.length} products to update`);

  for (const product of products) {
    if (product.sizes.length === 1 && product.sizes[0] === "XL") {
      await prisma.product.update({
        where: { id: product.id },
        data: { sizes: defaultSizes },
      });
      console.log(`Updated: ${product.name} (${product.slug})`);
    } else {
      console.log(`Skipped: ${product.name} (${product.slug}) - already has sizes: ${product.sizes.join(", ")}`);
    }
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });