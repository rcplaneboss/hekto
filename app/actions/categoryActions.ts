'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// Create a simple category
export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const slug = name.toLowerCase().replace(/\s+/g, '-')

  await prisma.category.create({
    data: { name, slug }
  })

  revalidatePath('/admin/categories')
  return { success: true }
}

// Create or Update the Discount Highlight for a category
export async function upsertDiscountItem(formData: FormData) {
  const categoryId = formData.get('categoryId') as string
  const productId = formData.get('productId') as string
  
  const featuresRaw = formData.get('features') as string
  const features = featuresRaw.split('\n').map(f => f.trim()).filter(Boolean)

  await prisma.discountItem.upsert({
    where: { categoryId },
    update: {
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      description: formData.get('description') as string,
      features,
      productId,
      buttonText: formData.get('buttonText') as string || "Shop Now",
    },
    create: {
      categoryId,
      productId,
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      description: formData.get('description') as string,
      features,
      buttonText: formData.get('buttonText') as string || "Shop Now",
    }
  })

  revalidatePath('/')
  return { success: true }
}