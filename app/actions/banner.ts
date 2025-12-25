'use server'

import { supabase } from '@/utils/supabase/server' // or your supabase client path
import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createHeroBanner(formData: FormData) {
 
  const imageFile = formData.get('image') as File
  
  // 1. Upload to Supabase Storage
  const fileName = `${Date.now()}-${imageFile.name}`
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('hero-banners')
    .upload(fileName, imageFile)

    console.log('Upload Data:', uploadData)
    console.log('Upload Error:', uploadError)
  if (uploadError) throw new Error('Upload failed')

  // 2. Get the Public URL
  const { data: urlData } = supabase.storage
    .from('hero-banners')
    .getPublicUrl(uploadData.path)

  const publicUrl = urlData.publicUrl

  // 3. Save to Database with Prisma
  const newBanner = await prisma.heroBanner.create({
    data: {
      subTitle: formData.get('subTitle') as string,
      mainTitle: formData.get('mainTitle') as string,
      description: formData.get('description') as string,
      imageUrl: publicUrl, // The dynamic URL from Supabase
      buttonText: formData.get('buttonText') as string || "Shop Now",
      buttonLink: formData.get('buttonLink') as string || "/shop",
    }
  })

  revalidatePath('/') // Refresh the homepage to show the new banner
  return newBanner
}