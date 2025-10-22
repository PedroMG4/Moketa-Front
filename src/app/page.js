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
      <style jsx>{`
        :root {
          --primary: #FF6B35;
          --secondary: #F7931E;
          --accent: #FFD23F;
          --dark: #2C3E50;
          --light: #ECF0F1;
          --white: #FFFFFF;
          --gray-100: #F8F9FA;
          --gray-200: #E9ECEF;
          --gray-300: #DEE2E6;
          --gray-400: #CED4DA;
          --gray-500: #ADB5BD;
          --gray-600: #6C757D;
          --gray-700: #495057;
          --gray-800: #343A40;
          --gray-900: #212529;
          --success: #28A745;
          --danger: #DC3545;
          --warning: #FFC107;
          --info: #17A2B8;
          --radius: 8px;
          --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: var(--gray-800);
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        header {
          background: var(--white);
          box-shadow: var(--shadow);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
          color: var(--primary);
        }

        .name {
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .brand__img {
          height: 50px;
          width: auto;
        }

        .cart {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: var(--primary);
          color: var(--white);
          text-decoration: none;
          border-radius: var(--radius);
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .cart:hover {
          background: var(--secondary);
          transform: translateY(-2px);
        }

        .cart svg {
          width: 20px;
          height: 20px;
        }

        .category {
          margin-bottom: 3rem;
        }

        .category__title {
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--white);
          text-align: center;
          margin-bottom: 2rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .card {
          background: var(--white);
          border-radius: var(--radius);
          overflow: hidden;
          box-shadow: var(--shadow);
          transition: all 0.3s ease;
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }

        .card__img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .card__body {
          padding: 1.5rem;
        }

        .card__title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--dark);
          margin-bottom: 0.5rem;
        }

        .card__desc {
          color: var(--gray-600);
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .card__row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .card__price {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary);
        }

        .btn-add {
          padding: 0.75rem 1.5rem;
          background: var(--primary);
          color: var(--white);
          border: none;
          border-radius: var(--radius);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-add:hover {
          background: var(--secondary);
          transform: translateY(-2px);
        }

        .btn-promo {
          background: var(--accent);
          color: var(--dark);
        }

        .btn-promo:hover {
          background: var(--secondary);
        }

        .add-to-cart-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .add-to-cart-label {
          font-size: 0.875rem;
          color: var(--gray-600);
          text-align: center;
        }

        .burger-options {
          display: flex;
          gap: 0.5rem;
        }

        .burger-options .btn-add {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        /* Modal styles */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: var(--white);
          padding: 2rem;
          border-radius: var(--radius);
          max-width: 400px;
          width: 90%;
          text-align: center;
          position: relative;
        }

        .close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--gray-500);
        }

        .close:hover {
          color: var(--gray-700);
        }

        .modal-body {
          padding: 1rem 0;
        }

        .modal-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .modal-body h3 {
          color: var(--dark);
          margin-bottom: 1rem;
        }

        .modal-body p {
          color: var(--gray-600);
        }

        /* Promo modal styles */
        .promo-modal-content {
          background: var(--white);
          padding: 2rem;
          border-radius: var(--radius);
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }

        .burger-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .burger-option {
          padding: 0.75rem;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius);
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .burger-option:hover {
          border-color: var(--primary);
          background: var(--gray-100);
        }

        .burger-option.selected {
          border-color: var(--primary);
          background: var(--primary);
          color: var(--white);
        }

        .selected-burgers {
          margin: 1rem 0;
          padding: 1rem;
          background: var(--gray-100);
          border-radius: var(--radius);
        }

        .selected-burgers h4 {
          margin-bottom: 0.5rem;
          color: var(--dark);
        }

        .selected-burgers ul {
          list-style: none;
          padding: 0;
        }

        .selected-burgers li {
          padding: 0.25rem 0;
          color: var(--gray-600);
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .btn-confirm-promo {
          padding: 0.75rem 1.5rem;
          background: var(--primary);
          color: var(--white);
          border: none;
          border-radius: var(--radius);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-confirm-promo:disabled {
          background: var(--gray-300);
          cursor: not-allowed;
        }

        .btn-cancel {
          padding: 0.75rem 1.5rem;
          background: var(--gray-200);
          color: var(--gray-700);
          border: none;
          border-radius: var(--radius);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-cancel:hover {
          background: var(--gray-300);
        }

        /* Social section */
        .social-section {
          background: var(--dark);
          color: var(--white);
          padding: 3rem 0;
          text-align: center;
        }

        .social-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .social-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .social-buttons {
          margin-bottom: 2rem;
        }

        .social-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: var(--primary);
          color: var(--white);
          text-decoration: none;
          border-radius: var(--radius);
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .social-btn:hover {
          background: var(--secondary);
          transform: translateY(-2px);
        }

        .social-btn svg {
          width: 20px;
          height: 20px;
        }

        .address {
          font-size: 1.1rem;
          color: var(--gray-300);
        }

        /* Footer */
        footer {
          background: var(--gray-800);
          color: var(--gray-300);
          padding: 2rem 0;
          text-align: center;
        }

        .footer-credits {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .devby {
          color: var(--primary);
          font-weight: 600;
        }

        /* Loading and error states */
        .loading-state {
          text-align: center;
          padding: 3rem 0;
        }

        .error-state {
          text-align: center;
          padding: 3rem 0;
          background: rgba(220, 53, 69, 0.1);
          border-radius: var(--radius);
          margin: 2rem 0;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
          
          .card__row {
            flex-direction: column;
            align-items: stretch;
          }
          
          .burger-options {
            justify-content: center;
          }
          
          .footer-credits {
            flex-direction: column;
            gap: 0.5rem;
          }

          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>

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
                <p style={{ color: 'white', textAlign: IPython.embed() }}>Por favor, inténtalo de nuevo más tarde.</p>
              </div>
            </section>
          )}
          
          {/* Productos desde Sanity */}
          {products.length > 0 && (
            <>
              {/* Productos por categoría */}
              {['burgers', 'pizzas', 'milanesas', 'papas', 'sandwiches'].map(category => {
                const categoryProducts = products.filter(p => p.category === category)
                if (categoryProducts.length === 0) return null
                
                const categoryTitles = {
                  burgers: 'Hamburguesas',
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
        <div className="modal show" onClick={closeModal}>
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
        <div className="modal show" onClick={closePromoModal}>
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