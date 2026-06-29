"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData): Promise<void> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) throw new Error("El nombre es requerido");

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    await prisma.category.create({
      data: { name, slug, description }
    });
    revalidatePath("/admin/categories");
    revalidatePath("/products"); // public store
  } catch (error) {
    console.error(error);
    throw new Error("Error al crear la categoría. Es posible que el slug ya exista.");
  }
}

export async function createProduct(data: {
  name: string;
  price: number;
  stock: number;
  description: string;
  categoryId: string;
  isCustomizable: boolean;
  images: string[];
}) {
  if (!data.name || !data.categoryId || data.price < 0) {
    return { error: "Datos inválidos" };
  }

  const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        price: data.price,
        stock: data.stock,
        description: data.description,
        categoryId: data.categoryId,
        isCustomizable: data.isCustomizable,
        images: data.images
      }
    });
    
    revalidatePath("/admin/products");
    revalidatePath("/products"); // public store
    return { success: true, productId: product.id };
  } catch (error) {
    console.error(error);
    return { error: "Error al crear el producto. Es posible que el nombre ya exista." };
  }
}

export async function updateStoreConfig(formData: FormData): Promise<void> {
  const heroTitle = formData.get("heroTitle") as string;
  const heroSubtitle = formData.get("heroSubtitle") as string;

  try {
    await prisma.storeConfig.upsert({
      where: { id: "default" },
      update: { heroTitle, heroSubtitle },
      create: { id: "default", heroTitle, heroSubtitle }
    });
    revalidatePath("/"); // Update home page
  } catch (error) {
    console.error(error);
    throw new Error("Error al guardar la configuración.");
  }
}
