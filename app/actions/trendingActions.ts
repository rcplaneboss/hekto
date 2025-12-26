'use server'

import { supabase } from '@/utils/supabase/server'
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createTrendingPromo(formData: FormData) {
  const imageFile = formData.get('image') as File | null
  let imageUrl = ""

  // 1. Upload Promo Image
  if (imageFile && imageFile.size > 0) {
    const fileName = `trending-${Date.now()}-${imageFile.name}`
    const { data, error } = await supabase.storage
      .from('products') 
      .upload(fileName, imageFile)

    if (error) throw new Error('Trending promo image upload failed')
    const { data: urlData } = supabase.storage.from('products').getPublicUrl(data.path)
    imageUrl = urlData.publicUrl
  }

  // 2. Create the Promo record
  await prisma.trendingPromo.create({
    data: {
      title: formData.get('title') as string,
      linkText: formData.get('linkText') as string,
      linkUrl: formData.get('linkUrl') as string,
      bgColor: formData.get('bgColor') as string, // e.g. #FFF6FB
      imageUrl: imageUrl,
      isActive: true,
    }
  })

  revalidatePath('/')
  return { success: true }
}

export async function deleteTrendingPromo(id: string) {
  await prisma.trendingPromo.delete({ where: { id } })
  revalidatePath('/')
}