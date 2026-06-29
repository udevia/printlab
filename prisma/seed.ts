import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Create Categories
  const catTazas = await prisma.category.upsert({
    where: { slug: 'tazas' },
    update: {},
    create: {
      name: 'Tazas Personalizadas',
      slug: 'tazas',
      description: 'Tazas de cerámica premium de 11oz y 15oz, listas para sublimar.',
    },
  });

  const catFranelas = await prisma.category.upsert({
    where: { slug: 'franelas' },
    update: {},
    create: {
      name: 'Franelas y Textiles',
      slug: 'franelas',
      description: 'Franelas 100% poliéster tacto algodón, ideales para estampados vibrantes.',
    },
  });

  // Create Products
  await prisma.product.upsert({
    where: { slug: 'taza-blanca-11oz' },
    update: {},
    create: {
      name: 'Taza Blanca Clásica 11oz',
      slug: 'taza-blanca-11oz',
      description: 'La taza clásica por excelencia. Perfecta para regalos corporativos o detalles especiales.',
      price: 5.50,
      stock: 100,
      isCustomizable: true,
      categoryId: catTazas.id,
      images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=1000&auto=format&fit=crop'],
    },
  });

  await prisma.product.upsert({
    where: { slug: 'taza-magica-11oz' },
    update: {},
    create: {
      name: 'Taza Mágica 11oz',
      slug: 'taza-magica-11oz',
      description: 'Sorprende a todos. La imagen aparece cuando viertes líquido caliente.',
      price: 8.00,
      stock: 50,
      isCustomizable: true,
      categoryId: catTazas.id,
      images: ['https://images.unsplash.com/photo-1577937927133-66ef06acdf18?q=80&w=1000&auto=format&fit=crop'],
    },
  });

  await prisma.product.upsert({
    where: { slug: 'franela-blanca-cuello-v' },
    update: {},
    create: {
      name: 'Franela Cuello en V Blanca',
      slug: 'franela-blanca-cuello-v',
      description: 'Franela de excelente calidad, no encoge ni decolora. Sube tu diseño y nosotros lo estampamos.',
      price: 12.00,
      stock: 200,
      isCustomizable: true,
      categoryId: catFranelas.id,
      images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop'],
    },
  });
  
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
