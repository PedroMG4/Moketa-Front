'use client'

import { useState, useEffect } from 'react'
import { getProducts, getPromotions, urlFor } from '../lib/sanity'
import { mockProducts, mockPromotions } from '../lib/mockData'

export const useSanityData = () => {
  const [products, setProducts] = useState([])
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Check if we have valid Sanity configuration
        const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
        if (!projectId || projectId === 'your_project_id') {
          console.log('Sanity not configured, using mock data')
          setProducts(mockProducts)
          setPromotions(mockPromotions)
          setError(null)
          setLoading(false)
          return
        }
        
        // Try to fetch from Sanity API
        try {
          console.log('Fetching data from Sanity API...')
          const [productsData, promotionsData] = await Promise.all([
            getProducts(),
            getPromotions()
          ])

          console.log('Products fetched:', productsData.length)
          console.log('Promotions fetched:', promotionsData.length)

          // Process products data
          const processedProducts = productsData.map(product => ({
            ...product,
            imageUrl: product.image ? urlFor(product.image).width(800).height(600).url() : null,
            displayPrice: `$${product.price.toLocaleString('es-ES').replace(/,/g, '.')}`
          }))

          // Process promotions data
          const processedPromotions = promotionsData.map(promotion => ({
            ...promotion,
            imageUrl: promotion.image ? urlFor(promotion.image).width(800).height(600).url() : null,
            displayPrice: `$${promotion.price.toLocaleString('es-ES').replace(/,/g, '.')}`
          }))

          setProducts(processedProducts)
          setPromotions(processedPromotions)
          setError(null)
        } catch (apiError) {
          console.error('Error fetching from Sanity API:', apiError)
          setError(`Error al conectar con Sanity CMS: ${apiError.message}`)
          setProducts([])
          setPromotions([])
        }
      } catch (err) {
        console.error('Error in useSanityData:', err)
        setError('Error al conectar con Sanity CMS. Mostrando menú estático.')
        setProducts([])
        setPromotions([])
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
