'use server'

import { supabase } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const imageFile = formData.get('image') as File // Get file from form
  const showOnTop = formData.get('showOnTop') === 'true'
  const slug = name.toLowerCase().replace(/\s+/g, '-')

  let imageUrl = ""

  // 1. Upload to Supabase Storage if file exists
  if (imageFile && imageFile.size > 0) {
    const fileName = `cat-${Date.now()}-${imageFile.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products') 
      .upload(fileName, imageFile)

    if (uploadError) {
      console.error('Category Image Upload Error:', uploadError)
      throw new Error('Image upload failed')
    }

    // 2. Get the Public URL
    const { data: urlData } = supabase.storage
      .from('products')
      .getPublicUrl(uploadData.path)
    
    imageUrl = urlData.publicUrl
  }

  // 3. Save to Database
  await prisma.category.create({
    data: { 
      name, 
      slug,
      imageUrl,
      showOnTop
    }
  })

  revalidatePath('/admin/categories')
  revalidatePath('/')
  return { success: true }
}


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
      buttonText: (formData.get('buttonText') as string) || "Shop Now",
    },
    create: {
      categoryId,
      productId,
      title: formData.get('title') as string,
      subtitle: formData.get('subtitle') as string,
      description: formData.get('description') as string,
      features,
      buttonText: (formData.get('buttonText') as string) || "Shop Now",
    }
  })

  revalidatePath('/')
  return { success: true }
}