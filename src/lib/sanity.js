import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'p4ifa5jg',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true, // Usar CDN para producción
  apiVersion: '2023-05-03',
  // Para desarrollo, no necesitamos token
  // token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)

// Queries
export const getProducts = async () => {
  const query = `*[_type == "product" && available == true] | order(_createdAt desc)`
  return await client.fetch(query)
}

export const getPromotions = async () => {
  const query = `*[_type == "promotion" && active == true] | order(_createdAt desc)`
  return await client.fetch(query)
}

export const getProductBySlug = async (slug) => {
  const query = `*[_type == "product" && slug.current == $slug][0]`
  return await client.fetch(query, { slug })
}

export const getPromotionBySlug = async (slug) => {
  const query = `*[_type == "promotion" && slug.current == $slug][0]`
  return await client.fetch(query, { slug })
}

export default client
