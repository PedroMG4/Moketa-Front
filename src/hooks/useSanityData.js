import { useState, useEffect } from 'react'

// Fallback data cuando Sanity no esté disponible
const fallbackProducts = [
  {
    _id: '1',
    name: 'Copetuda',
    description: 'Pan, mayonesa, lechuga, tomate, carne, queso tybo x2, huevo, jamón',
    displayPrice: 'Simple: $7.000 | Doble: $10.000',
    category: 'burgers',
    variant: true,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop'
  },
  {
    _id: '2', 
    name: 'Koketa',
    description: 'Pan, salsa moketa, carne, huevo, panceta, cebolla caramelizada, queso tybo, queso cheddar',
    displayPrice: 'Simple: $7.000 | Doble: $10.000',
    category: 'burgers',
    variant: true,
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop'
  },
  {
    _id: '3',
    name: 'Muzarella',
    description: 'Prepizza casera, salsa casera, muzarella, aceitunas',
    displayPrice: '$7.000',
    category: 'pizzas',
    variant: false,
    imageUrl: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop'
  }
]

const fallbackPromotions = [
  {
    _id: '1',
    name: '2 Hamburguesas Simples',
    description: 'Tilin, golosa, pestoketa, cabron, chuchy, pecadora, filosa, macanuda, humita, gaucha, chimuelo, barba queen',
    displayPrice: '$8.000',
    productType: 'Simple',
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop'
  }
]

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

        // Intentar cargar desde Sanity si está disponible
        if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
          try {
            const { client, urlFor } = await import('../lib/sanity')
            
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
            
          } catch (sanityError) {
            console.warn('Sanity not available, using fallback data:', sanityError)
            setProducts(fallbackProducts)
            setPromotions(fallbackPromotions)
          }
        } else {
          // Usar datos de fallback
          setProducts(fallbackProducts)
          setPromotions(fallbackPromotions)
        }

      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message)
        // En caso de error, usar datos de fallback
        setProducts(fallbackProducts)
        setPromotions(fallbackPromotions)
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
