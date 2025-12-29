'use server'

import { supabase } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// Helper to handle image uploads
async function uploadImage(imageFile: File) {
  const fileName = `prod-${Date.now()}-${imageFile.name}`
  const { data, error } = await supabase.storage
    .from('products')
    .upload(fileName, imageFile)

  if (error) throw new Error('Image upload failed')

  const { data: urlData } = supabase.storage
    .from('products')
    .getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function createProduct(formData: FormData) {
  const imageFile = formData.get('image') as File
  let publicUrl = ""

  if (imageFile && imageFile.size > 0) {
    publicUrl = await uploadImage(imageFile)
  }

  const tags = (formData.get('tags') as string)?.split(',').filter(Boolean) || []
  const colors = (formData.get('colors') as string)?.split(',').filter(Boolean) || []

  const newProduct = await prisma.product.create({
    data: {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      price: parseFloat(formData.get('price') as string),
      discountPercentage: parseFloat(formData.get('discountPercentage') as string) || 0,
      description: formData.get('description') as string,
      stock: parseInt(formData.get('stock') as string) || 0,
      categoryId: formData.get('categoryId') as string || null,
      imageUrl: publicUrl,
      tags: tags,
      colors: colors,
      isActive: formData.get('isActive') === 'true',
    }
  })

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  return newProduct
}

export async function updateProduct(id: string, formData: FormData) {
  const imageFile = formData.get('image') as File
  let updateData: any = {
    name: formData.get('name') as string,
    code: formData.get('code') as string,
    price: parseFloat(formData.get('price') as string),
    discountPercentage: parseFloat(formData.get('discountPercentage') as string) || 0,
    description: formData.get('description') as string,
    stock: parseInt(formData.get('stock') as string) || 0,
    categoryId: formData.get('categoryId') as string || null,
    tags: (formData.get('tags') as string)?.split(',').filter(Boolean) || [],
    colors: (formData.get('colors') as string)?.split(',').filter(Boolean) || [],
    isActive: formData.get('isActive') === 'true',
  }

  // Only upload new image if a file was provided
  if (imageFile && imageFile.size > 0) {
    updateData.imageUrl = await uploadImage(imageFile)
  }

  const updated = await prisma.product.update({
    where: { id },
    data: updateData
  })

  revalidatePath('/admin/products')
  revalidatePath('/shop')
  return updated
}

export async function deleteProduct(id: string) {
  // Optional: Delete image from Supabase here if you have the URL path
  await prisma.product.delete({ where: { id } })
  revalidatePath('/admin/products')
  revalidatePath('/shop')
}