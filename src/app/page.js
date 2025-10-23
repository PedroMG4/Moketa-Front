'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSanityData } from '../hooks/useSanityData'
import ProductCard from '../components/ProductCard'
import PromotionCard from '../components/PromotionCard'

export default function Home() {
  const [cart, setCart] = useState([])
  const [showCartModal, setShowCartModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  
  // Sanity data
  const { products, promotions, loading: sanityLoading, error: sanityError } = useSanityData()

  useEffect(() => {
    // Cargar carrito desde localStorage al inicio
    const savedCart = localStorage.getItem('moketaCart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error al cargar el carrito:', error)
      }
    }
  }, [])

  // Función para agregar al carrito
  const addToCart = (productName, productPrice) => {
    const newItem = {
      id: Date.now(),
      name: productName,
      price: productPrice,
      quantity: 1
    }
    
    const newCart = [...cart, newItem]
    setCart(newCart)
    
    // Guardar en localStorage
    localStorage.setItem('moketaCart', JSON.stringify(newCart))
    
    // Mostrar modal de confirmación
    setModalMessage(`Agregaste "${productName}" al carrito`)
    setShowCartModal(true)
    
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
  }

  // Función para cerrar el modal
  const closeCartModal = () => {
    setShowCartModal(false)
  }

  // Función para actualizar el contador del carrito
  const updateCartCounter = (count) => {
    const counter = document.querySelector('.cart__count')
    if (counter) {
      counter.textContent = count
    }
  }

  return (
    <>
      <header>
        <div className="wrap">
          <a href="/" className="brand" aria-label="Marca">
            <div className="name">MOKETA</div>
            <img className="brand__img" src="/logo-moketa.png" alt="Logo MOKETA" />
          </a>
          <Link href="/carrito" className="cart" aria-label="Ir al carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 12.39A2 2 0 0 0 9.61 15H19a2 2 0 0 0 2-1.61l1.38-7.39H6"></path>
            </svg>
            <span>Carrito</span>
            <span className="cart__count">{cart.length}</span>
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
                        onAddToCart={handleAddToCartFromSanity}
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
        <div className="container">
          <h2 className="social-title">Seguinos en nuestras redes</h2>
          <div className="social-links">
            <a href="https://instagram.com/moketa" className="social-link" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </a>
            <a href="https://facebook.com/moketa" className="social-link" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="name">MOKETA</div>
              <p>Hamburguesas artesanales</p>
            </div>
            <div className="footer-links">
              <a href="/carrito">Carrito</a>
              <a href="/checkout">Checkout</a>
              <a href="/confirmacion">Confirmación</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 MOKETA. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal de confirmación */}
      {showCartModal && (
        <div className="modal" onClick={closeCartModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeCartModal}>&times;</span>
            <div className="modal-body">
              <h3>¡Agregado al carrito!</h3>
              <p>{modalMessage}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :root{
          /* Colores corporativos del negocio */
          --violeta: #6A0DAD;
          --amarillo: #D8B63A;
          
          /* Gradientes basados en colores corporativos */
          --primary: linear-gradient(135deg, #6A0DAD 0%, #8B2BE2 100%);
          --secondary: linear-gradient(135deg, #D8B63A 0%, #FFD700 100%);
          --accent: linear-gradient(135deg, #6A0DAD 0%, #D8B63A 100%);
          --success: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          
          /* Colores sólidos para compatibilidad */
          --primary-solid: #6A0DAD;
          --secondary-solid: #D8B63A;
          --accent-solid: #8B2BE2;
          --success-solid: #43e97b;
          
          /* Neutros modernos */
          --white: #ffffff;
          --black: #1a1a1a;
          --gray-50: #f8fafc;
          --gray-100: #f1f5f9;
          --gray-200: #e2e8f0;
          --gray-300: #cbd5e1;
          --gray-400: #94a3b8;
          --gray-500: #64748b;
          --gray-600: #475569;
          --gray-700: #334155;
          --gray-800: #1e293b;
          --gray-900: #0f172a;
          
          /* Sombras modernas */
          --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
          --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
          --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
          
          /* Bordes redondeados */
          --radius-sm: 0.375rem;
          --radius: 0.5rem;
          --radius-md: 0.75rem;
          --radius-lg: 1rem;
          --radius-xl: 1.5rem;
          --radius-2xl: 2rem;
        }

        /* Reset y base */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: var(--white);
          background: var(--primary);
          min-height: 100vh;
        }

        /* Header */
        .wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        header {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--white);
        }

        .name {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--secondary-solid);
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .brand__img {
          height: 2rem;
          width: auto;
        }

        .cart {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-lg);
          color: var(--white);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          position: relative;
        }

        .cart:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .cart svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        .cart__count {
          background: var(--secondary);
          color: var(--black);
          border-radius: 50%;
          width: 1.5rem;
          height: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          position: absolute;
          top: -0.5rem;
          right: -0.5rem;
        }

        /* Main content */
        main {
          padding: 2rem 0;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* Categories */
        .category {
          margin-bottom: 3rem;
        }

        .category__title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--white);
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        /* Grid */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        /* Cards */
        .card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-xl);
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-lg);
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
          background: rgba(255, 255, 255, 0.15);
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
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--white);
        }

        .card__desc {
          color: rgba(255, 255, 255, 0.8);
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
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--secondary-solid);
        }

        /* Buttons */
        .btn-add {
          background: var(--secondary);
          color: var(--black);
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-lg);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-md);
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
        }

        .btn-promo {
          background: var(--accent);
          color: var(--white);
        }

        .btn-promo:hover {
          background: linear-gradient(135deg, #8B2BE2 0%, #6A0DAD 100%);
        }

        .add-to-cart-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .add-to-cart-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          font-weight: 500;
        }

        .burger-options {
          display: flex;
          gap: 0.5rem;
        }

        .burger-options .btn-add {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        /* Social section */
        .social-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          padding: 3rem 0;
          margin: 2rem 0;
        }

        .social-title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 2rem;
          color: var(--white);
        }

        .social-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-lg);
          color: var(--white);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .social-link svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        /* Footer */
        .footer {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          padding: 2rem 0;
          margin-top: 2rem;
        }

        .footer-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .footer-brand .name {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--secondary-solid);
        }

        .footer-brand p {
          color: rgba(255, 255, 255, 0.7);
          margin-top: 0.25rem;
        }

        .footer-links {
          display: flex;
          gap: 1rem;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-links a:hover {
          color: var(--secondary-solid);
        }

        .footer-bottom {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-bottom p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
        }

        /* Modal */
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: var(--white);
          border-radius: var(--radius-xl);
          padding: 2rem;
          max-width: 400px;
          width: 90%;
          position: relative;
          box-shadow: var(--shadow-xl);
        }

        .close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--gray-500);
        }

        .modal-body h3 {
          color: var(--black);
          margin-bottom: 1rem;
        }

        .modal-body p {
          color: var(--gray-600);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .wrap {
            padding: 0 1rem;
          }

          .grid {
            grid-template-columns: 1fr;
          }

          .social-links {
            flex-direction: column;
            align-items: center;
          }

          .footer-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </>
  )
}