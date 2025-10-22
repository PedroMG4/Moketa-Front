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

  // Función para agregar producto al carrito (EXACTAMENTE como el original)
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

  // Función para mostrar el modal (EXACTAMENTE como el original)
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
      const pricePerBurger = parseInt(currentPromo.price.replace(/[^0-9]/g, '')) / currentPromo.quantity
      const pricePerBurgerFormatted = `$${pricePerBurger.toLocaleString('es-ES').replace(/,/g, '.')}`
      
      // Crear productos para cada hamburguesa seleccionada
      const newProducts = selectedBurgers.map(burgerName => ({
        name: burgerName,
        price: pricePerBurgerFormatted,
        id: Date.now() + Math.random(), // ID único
        isFromPromo: true,
        promoName: currentPromo.name,
        promoPrice: currentPromo.price,
        originalPrice: pricePerBurgerFormatted
      }))
      
      // Agregar todos los productos al carrito de una vez
      const newCart = [...cart, ...newProducts]
      setCart(newCart)
      localStorage.setItem('moketaCart', JSON.stringify(newCart))
      
      setShowPromoModal(false)
      setCurrentPromo(null)
      setSelectedBurgers([])
      
      // Mostrar modal de confirmación
      showCartModalFunction(currentPromo.name)
    }
  }

  // Función para cerrar modal de promoción
  const closePromoModal = () => {
    setShowPromoModal(false)
    setCurrentPromo(null)
    setSelectedBurgers([])
  }

  // Lista de hamburguesas disponibles para promociones
  const availableBurgers = [
    'Tilin', 'Golosa', 'Pestoketa', 'Cabron', 'Chuchy', 'Pecadora', 
    'Filosa', 'Macanuda', 'Humita', 'Gaucha', 'Chimuelo', 'Barba Queen'
  ]

  return (
    <>
      <style jsx global>{`
        /* Variables CSS */
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

        /* Reset moderno */
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, var(--violeta) 0%, var(--amarillo) 100%);
          background-attachment: fixed;
          color: var(--black);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          font-weight: 400;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        img {
          display: block;
          max-width: 100%;
          height: auto;
        }

        /* Header moderno con glassmorphism */
        header {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          color: #333;
          padding: 1rem 1.5rem;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: var(--shadow-lg);
        }

        .wrap {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          color: inherit;
          font-weight: 800;
          font-size: 1.5rem;
          letter-spacing: -0.025em;
        }

        .brand__img {
          width: 2.5rem;
          height: 2.5rem;
          object-fit: contain;
        }

        .cart {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: var(--primary);
          color: white;
          text-decoration: none;
          border-radius: var(--radius-lg);
          font-weight: 600;
          transition: all 0.2s ease;
          box-shadow: var(--shadow-md);
        }

        .cart:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-lg);
        }

        .cart svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        main {
          flex: 1;
          padding: 2rem 1.5rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .category {
          margin-bottom: 3rem;
        }

        .category__title {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 2rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
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
          color: var(--black);
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
          font-weight: 600;
          color: var(--primary-solid);
          font-size: 1.1rem;
        }

        .add-to-cart-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .add-to-cart-label {
          font-size: 0.875rem;
          color: var(--gray-600);
          font-weight: 500;
        }

        .burger-options {
          display: flex;
          gap: 0.5rem;
        }

        .btn-add {
          padding: 0.5rem 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: var(--radius);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .btn-add:hover {
          background: var(--accent-solid);
          transform: translateY(-1px);
        }

        .btn-promo {
          background: var(--secondary);
          color: var(--black);
        }

        .btn-promo:hover {
          background: var(--secondary-solid);
        }

        .social-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 2rem 1.5rem;
          margin: 2rem 0;
          border-radius: var(--radius-xl);
          text-align: center;
        }

        .social-title {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .social-buttons {
          margin-bottom: 1rem;
        }

        .social-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: var(--primary);
          color: white;
          text-decoration: none;
          border-radius: var(--radius-lg);
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .social-btn:hover {
          background: var(--accent-solid);
          transform: translateY(-1px);
        }

        .social-btn svg {
          width: 1.25rem;
          height: 1.25rem;
        }

        .address {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
        }

        footer {
          background: rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          padding: 1.5rem;
          text-align: center;
          color: white;
        }

        .footer-credits {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .devby {
          font-size: 0.875rem;
          opacity: 0.8;
        }

        .modal {
          display: none;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
        }

        .modal.show {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-content {
          background: white;
          border-radius: var(--radius-xl);
          padding: 2rem;
          max-width: 500px;
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

        .close:hover {
          color: var(--black);
        }

        .modal-body {
          text-align: center;
        }

        .modal-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .modal-body h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--black);
        }

        .modal-body p {
          color: var(--gray-600);
          margin-bottom: 1.5rem;
        }

        .burger-selection {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.75rem;
          margin: 1.5rem 0;
        }

        .burger-option {
          padding: 0.75rem;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          font-weight: 600;
        }

        .burger-option:hover {
          border-color: var(--primary-solid);
          background: var(--gray-50);
        }

        .burger-option.selected {
          border-color: var(--primary-solid);
          background: var(--primary);
          color: white;
        }

        .selected-burgers {
          margin: 1.5rem 0;
          padding: 1rem;
          background: var(--gray-50);
          border-radius: var(--radius);
        }

        .selected-burgers h4 {
          margin-bottom: 0.5rem;
          color: var(--black);
        }

        .selected-burgers ul {
          list-style: none;
        }

        .selected-burgers li {
          padding: 0.25rem 0;
          color: var(--gray-700);
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1.5rem;
        }

        .btn-confirm-promo {
          padding: 0.75rem 1.5rem;
          background: var(--success);
          color: white;
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
          {/* Productos dinámicos desde Sanity */}
          {sanityLoading && (
            <section className="category">
              <h2 className="category__title">Cargando menú...</h2>
              <p style={{ color: 'white', textAlign: 'center' }}>Cargando productos desde Sanity CMS...</p>
            </section>
          )}
          
          {sanityError && (
            <section className="category">
              <h2 className="category__title">Error al cargar menú</h2>
              <p style={{ color: 'white', textAlign: 'center' }}>
                Error: {sanityError}. Mostrando menú estático...
              </p>
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

          {/* Hamburguesas (fallback estático) */}
          <section className="category">
            <h2 className="category__title">Hamburguesas</h2>
            <div className="grid">
              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop" alt="Hamburguesa Copetuda" />
                <div className="card__body">
                  <h3 className="card__title">Copetuda</h3>
                  <p className="card__desc">Pan, mayonesa, lechuga, tomate, carne, queso tybo x2, huevo, jamón</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $7.000 | Doble: $10.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Copetuda Simple', '$7.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Copetuda Doble', '$10.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop" alt="Hamburguesa Koketa" />
                <div className="card__body">
                  <h3 className="card__title">Koketa</h3>
                  <p className="card__desc">Pan, salsa moketa, carne, huevo, panceta, cebolla caramelizada, queso tybo, queso cheddar</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $7.000 | Doble: $10.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Koketa Simple', '$7.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Koketa Doble', '$10.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=800&h=600&fit=crop" alt="Hamburguesa Tilin" />
                <div className="card__body">
                  <h3 className="card__title">Tilin</h3>
                  <p className="card__desc">Pan, salsa moketa, carne, queso cheddar x2, chimichurri</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $5.000 | Doble: $8.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Tilin Simple', '$5.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Tilin Doble', '$8.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=800&h=600&fit=crop" alt="Hamburguesa Golosa" />
                <div className="card__body">
                  <h3 className="card__title">Golosa</h3>
                  <p className="card__desc">Pan, mayonesa, tomate, carne, queso cheddar x2, pepinos</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $5.000 | Doble: $8.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Golosa Simple', '$5.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Golosa Doble', '$8.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=600&fit=crop" alt="Hamburguesa Chuchy" />
                <div className="card__body">
                  <h3 className="card__title">Chuchy</h3>
                  <p className="card__desc">Pan, mayonesa, carne, queso cheddar x2</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $5.000 | Doble: $8.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Chuchy Simple', '$5.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Chuchy Doble', '$8.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1525059696034-4967a729002e?w=800&h=600&fit=crop" alt="Hamburguesa Pecadora" />
                <div className="card__body">
                  <h3 className="card__title">Pecadora</h3>
                  <p className="card__desc">Pan, salsa moketa, lechuga, tomate, carne, queso cheddar x2, panceta</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $5.000 | Doble: $8.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Pecadora Simple', '$5.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Pecadora Doble', '$8.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop" alt="Hamburguesa Chimuelo" />
                <div className="card__body">
                  <h3 className="card__title">Chimuelo</h3>
                  <p className="card__desc">Pan, mayonesa, carne, queso tybo x2</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $5.000 | Doble: $8.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Chimuelo Simple', '$5.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Chimuelo Doble', '$8.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=800&h=600&fit=crop" alt="Hamburguesa Barba Queen" />
                <div className="card__body">
                  <h3 className="card__title">Barba Queen</h3>
                  <p className="card__desc">Pan, mayonesa, carne, queso cheddar x2, salsa barbacoa</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $5.000 | Doble: $8.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Barba Queen Simple', '$5.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Barba Queen Doble', '$8.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop" alt="Hamburguesa Pestoketa" />
                <div className="card__body">
                  <h3 className="card__title">Pestoketa</h3>
                  <p className="card__desc">Pan, salsa moketa, tomate, carne, queso cheddar x2, pesto</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $5.000 | Doble: $8.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Pestoketa Simple', '$5.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Pestoketa Doble', '$8.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop" alt="Hamburguesa Cabron" />
                <div className="card__body">
                  <h3 className="card__title">Cabron</h3>
                  <p className="card__desc">Pan, mayonesa, carne, queso cheddar x2, panceta, huevo</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $5.000 | Doble: $8.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Cabron Simple', '$5.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Cabron Doble', '$8.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=800&h=600&fit=crop" alt="Hamburguesa Filosa" />
                <div className="card__body">
                  <h3 className="card__title">Filosa</h3>
                  <p className="card__desc">Pan, salsa moketa, carne, queso cheddar x2, chimichurri, cebolla caramelizada, panceta</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $5.000 | Doble: $8.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Filosa Simple', '$5.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Filosa Doble', '$8.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=800&h=600&fit=crop" alt="Hamburguesa Macanuda" />
                <div className="card__body">
                  <h3 className="card__title">Macanuda</h3>
                  <p className="card__desc">Pan, mayonesa, carne, queso cheddar x2, cebolla caramelizada</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $5.000 | Doble: $8.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Macanuda Simple', '$5.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Macanuda Doble', '$8.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&h=600&fit=crop" alt="Hamburguesa Humita" />
                <div className="card__body">
                  <h3 className="card__title">Humita</h3>
                  <p className="card__desc">Pan, salsa red, tomate, carne, queso tybo x2, choclo cremoso</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $5.000 | Doble: $8.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Humita Simple', '$5.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Humita Doble', '$8.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1525059696034-4967a729002e?w=800&h=600&fit=crop" alt="Hamburguesa Gaucha" />
                <div className="card__body">
                  <h3 className="card__title">Gaucha</h3>
                  <p className="card__desc">Pan, salsa red, carne, queso tybo x2, salsa criolla</p>
                  <div className="card__row">
                    <div className="card__price">Simple: $5.000 | Doble: $8.000</div>
                    <div className="add-to-cart-container">
                      <span className="add-to-cart-label">Agregar al carrito</span>
                      <div className="burger-options">
                        <button className="btn-add" onClick={() => addToCart('Gaucha Simple', '$5.000')}>Simple</button>
                        <button className="btn-add" onClick={() => addToCart('Gaucha Doble', '$8.000')}>Doble</button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Promos */}
          <section className="category">
            <h2 className="category__title">Promos</h2>
            <div className="grid">
              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop" alt="2 Pizzas Muzarella" />
                <div className="card__body">
                  <h3 className="card__title">2 Pizzas Muzarella</h3>
                  <p className="card__desc">Prepizza casera, salsa casera, muzarella, aceitunas</p>
                  <div className="card__row">
                    <div className="card__price">$ 10.000</div>
                    <button className="btn-add" onClick={() => addToCart('2 Pizzas Muzarella', '$ 10.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop" alt="2 Hamburguesas Simples" />
                <div className="card__body">
                  <h3 className="card__title">2 Hamburguesas Simples</h3>
                  <p className="card__desc">Tilin, golosa, pestoketa, cabron, chuchy, pecadora, filosa, macanuda, humita, gaucha, chimuelo, barba queen</p>
                  <div className="card__row">
                    <div className="card__price">$ 8.000</div>
                    <button className="btn-add btn-promo" onClick={() => openPromoModal('2 Hamburguesas Simples', '$8.000', 'Simple', 2)}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop" alt="2 Hamburguesas Dobles" />
                <div className="card__body">
                  <h3 className="card__title">2 Hamburguesas Dobles</h3>
                  <p className="card__desc">Tilin, golosa, pestoketa, cabron, chuchy, pecadora, filosa, macanuda, humita, gaucha, chimuelo, barba queen</p>
                  <div className="card__row">
                    <div className="card__price">$ 14.000</div>
                    <button className="btn-add btn-promo" onClick={() => openPromoModal('2 Hamburguesas Dobles', '$14.000', 'Doble', 2)}>Agregar al carrito</button>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Pizzas */}
          <section className="category">
            <h2 className="category__title">Pizzas</h2>
            <div className="grid">
              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&h=600&fit=crop" alt="Pizza Muzarella" />
                <div className="card__body">
                  <h3 className="card__title">Muzarella</h3>
                  <p className="card__desc">Prepizza casera, salsa casera, muzarella, aceitunas</p>
                  <div className="card__row">
                    <div className="card__price">$ 7.000</div>
                    <button className="btn-add" onClick={() => addToCart('Muzarella', '$ 7.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop" alt="Pizza Jamón y Morrones" />
                <div className="card__body">
                  <h3 className="card__title">Jamón y Morrones</h3>
                  <p className="card__desc">Prepizza casera, salsa casera, jamón, muzarella, morrones, aceitunas</p>
                  <div className="card__row">
                    <div className="card__price">$ 10.000</div>
                    <button className="btn-add" onClick={() => addToCart('Jamón y Morrones', '$ 10.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop" alt="Pizza Calabresa" />
                <div className="card__body">
                  <h3 className="card__title">Calabresa</h3>
                  <p className="card__desc">Prepizza casera, salsa casera, muzarella, salame, aceitunas</p>
                  <div className="card__row">
                    <div className="card__price">$ 10.000</div>
                    <button className="btn-add" onClick={() => addToCart('Calabresa', '$ 10.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&h=600&fit=crop" alt="Pizza Fugazzeta" />
                <div className="card__body">
                  <h3 className="card__title">Fugazzeta</h3>
                  <p className="card__desc">Prepizza casera, salsa casera, cebolla asada, muzarella, aceitunas</p>
                  <div className="card__row">
                    <div className="card__price">$ 10.000</div>
                    <button className="btn-add" onClick={() => addToCart('Fugazzeta', '$ 10.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop" alt="Pizza A Caballo" />
                <div className="card__body">
                  <h3 className="card__title">A Caballo</h3>
                  <p className="card__desc">Prepizza casera, salsa casera, muzarella, huevos fritos x4, aceitunas</p>
                  <div className="card__row">
                    <div className="card__price">$ 10.000</div>
                    <button className="btn-add" onClick={() => addToCart('A Caballo', '$ 10.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Milanesas */}
          <section className="category">
            <h2 className="category__title">Milanesas (para 4 personas, pican 6, todas vienen con papas fritas)</h2>
            <div className="grid">
              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop" alt="Milanesa con Papas" />
                <div className="card__body">
                  <h3 className="card__title">Milanesa con Papas</h3>
                  <p className="card__desc">Milanesa de ternera, papas fritas, limones, salsa moketa</p>
                  <div className="card__row">
                    <div className="card__price">$ 15.000</div>
                    <button className="btn-add" onClick={() => addToCart('Milanesa con Papas', '$ 15.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop" alt="Mila Napo" />
                <div className="card__body">
                  <h3 className="card__title">Mila Napo</h3>
                  <p className="card__desc">Milanesa de ternera, jamón, muzarella, morrones, aceituna, papas fritas, salsa moketa</p>
                  <div className="card__row">
                    <div className="card__price">$ 20.000</div>
                    <button className="btn-add" onClick={() => addToCart('Mila Napo', '$ 20.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop" alt="Mila a Caballo" />
                <div className="card__body">
                  <h3 className="card__title">Mila a Caballo</h3>
                  <p className="card__desc">Milanesa de ternera, huevos fritos x4, papas fritas, salsa moketa</p>
                  <div className="card__row">
                    <div className="card__price">$ 18.000</div>
                    <button className="btn-add" onClick={() => addToCart('Mila a Caballo', '$ 18.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop" alt="Mila Fugazzeta" />
                <div className="card__body">
                  <h3 className="card__title">Mila Fugazzeta</h3>
                  <p className="card__desc">Milanesa de ternera, cebolla caramelizada, muzarella, papas fritas, salsa moketa</p>
                  <div className="card__row">
                    <div className="card__price">$ 18.000</div>
                    <button className="btn-add" onClick={() => addToCart('Mila Fugazzeta', '$ 18.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Papas Fritas */}
          <section className="category">
            <h2 className="category__title">Papas Fritas</h2>
            <div className="grid">
              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop" alt="Papas Fritas" />
                <div className="card__body">
                  <h3 className="card__title">Papas Fritas</h3>
                  <p className="card__desc">Papas fritas, ketchup, salsa moketa</p>
                  <div className="card__row">
                    <div className="card__price">$ 6.000</div>
                    <button className="btn-add" onClick={() => addToCart('Papas Fritas', '$ 6.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop" alt="Salchi Papas" />
                <div className="card__body">
                  <h3 className="card__title">Salchi Papas</h3>
                  <p className="card__desc">Papas fritas, cheddar, salchichas fritas, salsa moketa</p>
                  <div className="card__row">
                    <div className="card__price">$ 8.000</div>
                    <button className="btn-add" onClick={() => addToCart('Salchi Papas', '$ 8.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop" alt="Papas Doble Sol" />
                <div className="card__body">
                  <h3 className="card__title">Papas Doble Sol</h3>
                  <p className="card__desc">Papas fritas, 2 huevos</p>
                  <div className="card__row">
                    <div className="card__price">$ 8.000</div>
                    <button className="btn-add" onClick={() => addToCart('Papas Doble Sol', '$ 8.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop" alt="Papas Bravas" />
                <div className="card__body">
                  <h3 className="card__title">Papas Bravas</h3>
                  <p className="card__desc">Papas fritas, cheddar, panceta</p>
                  <div className="card__row">
                    <div className="card__price">$ 8.000</div>
                    <button className="btn-add" onClick={() => addToCart('Papas Bravas', '$ 8.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&h=600&fit=crop" alt="Papas Jam" />
                <div className="card__body">
                  <h3 className="card__title">Papas Jam</h3>
                  <p className="card__desc">Papas fritas, cheddar, jamon, queso, salsa moketa</p>
                  <div className="card__row">
                    <div className="card__price">$ 8.000</div>
                    <button className="btn-add" onClick={() => addToCart('Papas Jam', '$ 8.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Sandwiches */}
          <section className="category">
            <h2 className="category__title">Sandwiches (todos vienen con papas fritas)</h2>
            <div className="grid">
              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&h=600&fit=crop" alt="Sandwich de Milanesa Simple" />
                <div className="card__body">
                  <h3 className="card__title">Sandwich de Milanesa Simple</h3>
                  <p className="card__desc">Pan, salsa moketa, lechuga, tomate, milanesas</p>
                  <div className="card__row">
                    <div className="card__price">$ 7.000</div>
                    <button className="btn-add" onClick={() => addToCart('Sandwich de Milanesa Simple', '$ 7.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&h=600&fit=crop" alt="Sandwich de Milanesa Completo" />
                <div className="card__body">
                  <h3 className="card__title">Sandwich de Milanesa Completo</h3>
                  <p className="card__desc">Pan, salsa moketa, lechuga, tomate, milanesas, queso tybo, jamón, huevo x3</p>
                  <div className="card__row">
                    <div className="card__price">$ 10.000</div>
                    <button className="btn-add" onClick={() => addToCart('Sandwich de Milanesa Completo', '$ 10.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>

              <article className="card">
                <img className="card__img" src="https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&h=600&fit=crop" alt="Lomito Moketa" />
                <div className="card__body">
                  <h3 className="card__title">Lomito Moketa</h3>
                  <p className="card__desc">Pan, salsa moketa, lechuga, tomate, lomito ternera, queso tybo x4, jamón x2, huevo x2</p>
                  <div className="card__row">
                    <div className="card__price">$ 10.000</div>
                    <button className="btn-add" onClick={() => addToCart('Lomito Moketa', '$ 10.000')}>Agregar al carrito</button>
                  </div>
                </div>
              </article>
            </div>
          </section>
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

      {/* Modal de selección de promociones */}
      {showPromoModal && currentPromo && (
        <div className="modal show" onClick={closePromoModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closePromoModal}>&times;</span>
            <div className="modal-body">
              <h3>Selecciona tus hamburguesas</h3>
              <p>Elige {currentPromo.quantity} hamburguesas {currentPromo.burgerType.toLowerCase()}s</p>
              <div className="burger-selection">
                {availableBurgers.map((burger) => (
                  <div 
                    key={burger}
                    className={`burger-option ${selectedBurgers.includes(burger) ? 'selected' : ''}`}
                    onClick={() => selectBurger(burger)}
                  >
                    {burger}
                  </div>
                ))}
              </div>
              <div className="selected-burgers">
                <h4>Hamburguesas seleccionadas:</h4>
                <ul>
                  {selectedBurgers.map((burger, index) => (
                    <li key={index}>{burger}</li>
                  ))}
                </ul>
              </div>
              <div className="modal-actions">
                <button 
                  className="btn-confirm-promo"
                  onClick={confirmPromoSelection}
                  disabled={selectedBurgers.length !== currentPromo.quantity}
                >
                  Confirmar Promoción
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