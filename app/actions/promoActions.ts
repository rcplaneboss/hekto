'use server'

import { supabase } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createPromoBanner(formData: FormData) {
  const imageFile = formData.get('image') as File | null
  let imageUrl = ""

  // 1. Handle Image Upload to 'products' bucket
  if (imageFile && imageFile.size > 0) {
    const fileName = `promo-${Date.now()}-${imageFile.name}`
    const { data, error } = await supabase.storage
      .from('products') 
      .upload(fileName, imageFile)

    if (error) throw new Error('Promo image upload failed')
    const { data: urlData } = supabase.storage.from('products').getPublicUrl(data.path)
    imageUrl = urlData.publicUrl
  }

  // 2. Process Features (split by newline)
  const featuresRaw = formData.get('features') as string
  const features = featuresRaw
    .split('\n')
    .map(f => f.trim())
    .filter(f => f !== "")

  // 3. Database Transaction: Set all others to inactive, then create new active one
  await prisma.$transaction([
    prisma.promoBanner.updateMany({
      data: { isActive: false }
    }),
    prisma.promoBanner.create({
      data: {
        title: formData.get('title') as string,
        features: features,
        productId: formData.get('productId') as string,
        customImage: imageUrl || undefined,
        isActive: true,
      }
    })
  ])

  revalidatePath('/')
  return { success: true }
}

export async function togglePromoStatus(id: string) {
  // Sets the selected banner to active and all others to inactive
  await prisma.$transaction([
    prisma.promoBanner.updateMany({ data: { isActive: false } }),
    prisma.promoBanner.update({
      where: { id },
      data: { isActive: true }
    })
  ])
  revalidatePath('/')
}