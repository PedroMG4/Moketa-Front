import { useState, useEffect } from 'react'
import { client, urlFor } from '../lib/sanity'

export function useSanityData() {
  const [products, setProducts] = useState([])
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch products
        const productsQuery = `*[_type == "product"] | order(_createdAt desc) {
          _id,
          name,
          description,
          price,
          image,
          category,
          options,
          variant
        }`
        
        const productsData = await client.fetch(productsQuery)
        
        // Process products data
        const processedProducts = productsData.map(product => ({
          ...product,
          displayPrice: product.price,
          imageUrl: product.image ? urlFor(product.image).width(400).height(300).url() : null,
          variant: product.category === 'burgers' ? true : false
        }))
        
        setProducts(processedProducts)

        // Fetch promotions
        const promotionsQuery = `*[_type == "promotion"] | order(_createdAt desc) {
          _id,
          name,
          description,
          price,
          image,
          burgerType,
          quantity
        }`
        
        const promotionsData = await client.fetch(promotionsQuery)
        
        // Process promotions data
        const processedPromotions = promotionsData.map(promotion => ({
          ...promotion,
          displayPrice: promotion.price,
          imageUrl: promotion.image ? urlFor(promotion.image).width(400).height(300).url() : null,
          productType: promotion.burgerType || 'Simple',
          quantity: promotion.quantity || 2
        }))
        
        setPromotions(processedPromotions)

      } catch (err) {
        console.error('Error fetching data from Sanity:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    products,
    promotions,
    loading,
    error
  }
}
