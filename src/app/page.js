'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSanityData } from '../hooks/useSanityData'
import ProductCard from '../components/ProductCard'
import PromotionCard from '../components/PromotionCard'

export default function Home() {
  const [cart, setCart] = useState([])
  const [showCartModal, setShowCartModal] = useState(false)
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [currentPromo, setCurrentPromo] = useState(null)
  const [selectedBurgers, setSelectedBurgers] = useState([])
  const [modalMessage, setModalMessage] = useState('')
  
  // Sanity data
  const { products, promotions, loading: sanityLoading, error: sanityError } = useSanityData()

  useEffect(() => {
    // Cargar carrito desde localStorage al inicio
    const savedCart = localStorage.getItem('moketaCart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  // Función para agregar producto al carrito
  const addToCart = (productName, productPrice) => {
    const product = {
      name: productName,
      price: productPrice,
      id: Date.now() // ID único basado en timestamp
    }
    
    const newCart = [...cart, product]
    setCart(newCart)
    
    // Guardar en localStorage
    localStorage.setItem('moketaCart', JSON.stringify(newCart))
    
    // Mostrar modal de confirmación
    showCartModalFunction(productName)
    
    // Actualizar contador del carrito
    updateCartCounter(newCart.length)
  }

  // Función para manejar agregado al carrito desde componentes Sanity
  const handleAddToCartFromSanity = (productName, productPrice) => {
    addToCart(productName, productPrice)
  }

  // Función para mostrar el modal
  const showCartModalFunction = (productName) => {
    setModalMessage(`Agregaste "${productName}" al carrito`)
    setShowCartModal(true)
    
    // Cerrar modal después de 3 segundos automáticamente
    setTimeout(() => {
      setShowCartModal(false)
    }, 3000)
  }

  // Función para cerrar el modal
  const closeModal = () => {
    setShowCartModal(false)
  }

  // Función para actualizar contador del carrito
  const updateCartCounter = (count) => {
    // Esta función se ejecuta automáticamente al actualizar el estado
  }

  // Función para abrir modal de promoción
  const openPromoModal = (promoName, promoPrice, burgerType, quantity) => {
    setCurrentPromo({ name: promoName, price: promoPrice, burgerType, quantity })
    setSelectedBurgers([])
    setShowPromoModal(true)
  }

  // Función para seleccionar hamburguesa en promoción
  const selectBurger = (burgerName) => {
    if (selectedBurgers.length < currentPromo.quantity) {
      setSelectedBurgers(prev => [...prev, burgerName])
    } else {
      // FIFO replacement
      setSelectedBurgers(prev => {
        const newSelection = [...prev]
        newSelection.shift() // Remove first
        newSelection.push(burgerName) // Add new
        return newSelection
      })
    }
  }

  // Función para confirmar selección de promoción
  const confirmPromoSelection = () => {
    if (selectedBurgers.length === currentPromo.quantity) {
      // Calcular el precio por hamburguesa (precio total dividido entre cantidad)
      const pricePerBurger = parseInt(currentPromo.price.replace(/[^\d]/g, '')) / currentPromo.quantity
      const pricePerBurgerFormatted = `$${pricePerBurger.toLocaleString('es-ES').replace(/,/g, '.')}`
      
      // Crear productos para cada hamburguesa seleccionada
      const newProducts = selectedBurgers.map(burgerName => ({
        name: burgerName,
        price: pricePerBurgerFormatted,
        id: Date.now() + Math.random(), // ID único
        isFromPromo: true,
        promoName: currentPromo.name,
        promoPrice: currentPromo.price
      }))
      
      // Agregar todos los productos al carrito
      const newCart = [...cart, ...newProducts]
      setCart(newCart)
      
      // Guardar en localStorage
      localStorage.setItem('moketaCart', JSON.stringify(newCart))
      
      // Cerrar modal y mostrar confirmación
      setShowPromoModal(false)
      setModalMessage(`Agregaste "${currentPromo.name}" al carrito`)
      setShowCartModal(true)
      
      // Cerrar modal después de 3 segundos
      setTimeout(() => {
        setShowCartModal(false)
      }, 3000)
      
      // Actualizar contador del carrito
      updateCartCounter(newCart.length)
    }
  }

  // Función para cerrar modal de promoción
  const closePromoModal = () => {
    setShowPromoModal(false)
    setSelectedBurgers([])
  }

  // Lista de hamburguesas disponibles para promociones
  const availableBurgers = {
    'Simple': [
      'Tilin Simple', 'Golosa Simple', 'Pestoketa Simple', 'Cabron Simple',
      'Chuchy Simple', 'Pecadora Simple', 'Chimuelo Simple', 'Barba Queen Simple',
      'Filosa Simple', 'Macanuda Simple', 'Humita Simple', 'Gaucha Simple'
    ],
    'Doble': [
      'Tilin Doble', 'Golosa Doble', 'Pestoketa Doble', 'Cabron Doble',
      'Chuchy Doble', 'Pecadora Doble', 'Chimuelo Doble', 'Barba Queen Doble',
      'Filosa Doble', 'Macanuda Doble', 'Humita Doble', 'Gaucha Doble'
    ]
  }

  return (
    <>

      <header>
        <div className="wrap">
          <Link href="/" className="brand">
            <div className="name">MOKETA</div>
            <img className="brand__img" src="/logo-moketa.png" alt="Logo MOKETA" />
          </Link>
          <Link className="cart" href="/carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 12.39A2 2 0 0 0 9.61 15H19a2 2 0 0 0 2-1.61l1.38-7.39H6"></path>
            </svg>
            <span>Carrito ({cart.length})</span>
          </Link>
        </div>
      </header>

      <main>
        <div className="container">
          {/* Loading state */}
          {sanityLoading && (
            <section className="category">
              <div className="loading-state">
                <h2 className="category__title">Cargando menú...</h2>
                <p style={{ color: 'white', textAlign: 'center' }}>Cargando productos desde Sanity CMS...</p>
              </div>
            </section>
          )}
          
          {/* Error state */}
          {sanityError && (
            <section className="category">
              <div className="error-state">
                <h2 className="category__title">Error al cargar menú</h2>
                <p style={{ color: 'white', textAlign: 'center' }}>
                  Error: {sanityError}
                </p>
                <p style={{ color: 'white', textAlign: 'center' }}>Por favor, inténtalo de nuevo más tarde.</p>
              </div>
            </section>
          )}
          
          {/* Productos desde Sanity */}
          {products.length > 0 && (
            <>
              {/* Productos por categoría */}
              {['hamburguesas', 'pizzas', 'milanesas', 'papas', 'sandwiches'].map(category => {
                const categoryProducts = products.filter(p => p.category === category)
                if (categoryProducts.length === 0) return null
                
                const categoryTitles = {
                  hamburguesas: 'Hamburguesas',
                  pizzas: 'Pizzas',
                  milanesas: 'Milanesas',
                  papas: 'Papas Fritas',
                  sandwiches: 'Sandwiches'
                }
                
                return (
                  <section key={category} className="category">
                    <h2 className="category__title">{categoryTitles[category]}</h2>
                    <div className="grid">
                      {categoryProducts.map(product => (
                        <ProductCard 
                          key={product._id}
                          product={product}
                          onAddToCart={handleAddToCartFromSanity}
                        />
                      ))}
                    </div>
                  </section>
                )
              })}
              
              {/* Promociones desde Sanity */}
              {promotions.length > 0 && (
                <section className="category">
                  <h2 className="category__title">Promos</h2>
                  <div className="grid">
                    {promotions.map(promotion => (
                      <PromotionCard 
                        key={promotion._id}
                        promotion={promotion}
                        onAddToCart={openPromoModal}
                      />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* Empty state */}
          {!sanityLoading && !sanityError && products.length === 0 && (
            <section className="category">
              <div className="loading-state">
                <h2 className="category__title">No hay productos disponibles</h2>
                <p style={{ color: 'white', textAlign: 'center' }}>
                  Por favor, agrega productos desde Sanity Studio.
                </p>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Sección de redes sociales */}
      <section className="social-section">
        <div className="social-container">
          <h2 className="social-title">Síguenos</h2>
          <div className="social-buttons">
            <a href="https://www.instagram.com/moketaoficial/" className="social-btn" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram
            </a>
          </div>
          <p className="address">📍 Avenida Paysandú 4265, Corrientes, Argentina</p>
        </div>
      </section>

      <footer>
        <div className="footer-credits">
          <div>© 2025 Moketa | Todos los derechos reservados</div>
          <div className="devby">DevBy Pedro Garay</div>
        </div>
      </footer>

      {/* Modal de confirmación del carrito */}
      {showCartModal && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <div className="modal-body">
              <div className="modal-icon">✅</div>
              <h3>¡Agregado al carrito!</h3>
              <p>{modalMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de selección de promoción */}
      {showPromoModal && currentPromo && (
        <div className="modal" onClick={closePromoModal}>
          <div className="promo-modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closePromoModal}>&times;</span>
            <div className="modal-body">
              <h3>Selecciona {currentPromo.quantity} hamburguesa(s) {currentPromo.burgerType.toLowerCase()}(s)</h3>
              <p>Precio total: {currentPromo.price}</p>
              
              <div className="burger-grid">
                {availableBurgers[currentPromo.burgerType]?.map(burgerName => (
                  <div
                    key={burgerName}
                    className={`burger-option ${selectedBurgers.includes(burgerName) ? 'selected' : ''}`}
                    onClick={() => selectBurger(burgerName)}
                  >
                    {burgerName}
                  </div>
                ))}
              </div>
              
              {selectedBurgers.length > 0 && (
                <div className="selected-burgers">
                  <h4>Hamburguesas seleccionadas:</h4>
                  <ul>
                    {selectedBurgers.map((burger, index) => (
                      <li key={index}>{burger}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="modal-actions">
                <button 
                  className="btn-confirm-promo" 
                  onClick={confirmPromoSelection}
                  disabled={selectedBurgers.length !== currentPromo.quantity}
                >
                  Confirmar ({selectedBurgers.length}/{currentPromo.quantity})
                </button>
                <button className="btn-cancel" onClick={closePromoModal}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}