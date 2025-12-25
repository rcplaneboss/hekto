'use server'

import { supabase } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createProduct(formData: FormData) {
  const imageFile = formData.get('image') as File
  
  // 1. Upload to Supabase Storage (using a 'products' bucket)
  const fileName = `prod-${Date.now()}-${imageFile.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('products') 
    .upload(fileName, imageFile)

  if (uploadError) {
    console.error('Upload Error:', uploadError)
    throw new Error('Image upload failed')
  }

  // 2. Get the Public URL
  const { data: urlData } = supabase.storage
    .from('products')
    .getPublicUrl(uploadData.path)

  const publicUrl = urlData.publicUrl

  // 3. Process Tags and Colors
  // Converts "featured, latest" -> ["featured", "latest"]
  const tags = (formData.get('tags') as string)
    ?.split(',')
    .map(t => t.trim().toLowerCase())
    .filter(t => t !== "") || []

  const colors = (formData.get('colors') as string)
    ?.split(',')
    .map(c => c.trim())
    .filter(c => c !== "") || []

  // 4. Save to Database with Prisma
  const newProduct = await prisma.product.create({
    data: {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      price: parseFloat(formData.get('price') as string),
      description: formData.get('description') as string,
      imageUrl: publicUrl,
      tags: tags,
      colors: colors,
    }
  })

  revalidatePath('/') 
  return newProduct
}