'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Carrito() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar carrito desde localStorage
    const savedCart = localStorage.getItem('moketaCart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    setLoading(false)
  }, [])

  // Función para formatear precio (EXACTAMENTE como el original)
  const formatPrice = (price) => {
    return price.replace('$', '').replace('.', '')
  }

  // Función para agrupar productos duplicados (EXACTAMENTE como el original)
  const groupCartItems = () => {
    const groupedItems = {}
    
    cart.forEach(item => {
      let key
      
      // Si es de una promoción, agrupar por promoción
      if (item.isFromPromo && item.promoName) {
        key = `promo_${item.promoName}_${item.promoPrice}`
      } else {
        key = `${item.name}_${item.price}`
      }
      
      if (groupedItems[key]) {
        if (item.isFromPromo) {
          // Para promociones, agregar la hamburguesa a la lista
          groupedItems[key].selectedBurgers.push(item.name)
          // Si ya tenemos 2 hamburguesas de esta promoción, incrementar la cantidad de promociones
          if (groupedItems[key].selectedBurgers.length % 2 === 0) {
            groupedItems[key].promoQuantity = Math.floor(groupedItems[key].selectedBurgers.length / 2)
          }
        } else {
          groupedItems[key].quantity += 1
        }
      } else {
        groupedItems[key] = {
          ...item,
          quantity: 1,
          promoQuantity: item.isFromPromo ? 1 : 1,
          selectedBurgers: item.isFromPromo ? [item.name] : []
        }
      }
    })
    
    return Object.values(groupedItems)
  }

  // Función para calcular total (EXACTAMENTE como el original)
  const calculateTotal = () => {
    let subtotal = 0
    
    // Agrupar items para calcular correctamente las promociones
    const groupedItems = groupCartItems()
    
    groupedItems.forEach(item => {
      if (item.isFromPromo && item.promoName) {
        // Para promociones, usar el precio promocional multiplicado por la cantidad de promociones
        const promoPrice = parseInt(formatPrice(item.promoPrice))
        subtotal += promoPrice * item.promoQuantity
      } else {
        // Para productos individuales, usar el precio normal
        const price = parseInt(formatPrice(item.price))
        subtotal += price * item.quantity
      }
    })
    
    return subtotal
  }

  // Función para eliminar un grupo de items
  const removeItemGroup = (name, price) => {
    const newCart = cart.filter(item => !(item.name === name && item.price === price))
    setCart(newCart)
    localStorage.setItem('moketaCart', JSON.stringify(newCart))
  }

  // Función para eliminar un grupo de promociones
  const removePromoGroup = (promoName, promoPrice) => {
    const newCart = cart.filter(item => !(item.isFromPromo && item.promoName === promoName && item.promoPrice === promoPrice))
    setCart(newCart)
    localStorage.setItem('moketaCart', JSON.stringify(newCart))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  const groupedItems = groupCartItems()
  const subtotal = calculateTotal()
  const total = subtotal

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
          font-weight: 700;
          letter-spacing: -0.025em;
          text-decoration: none;
          color: inherit;
          transition: transform 0.3s ease;
        }

        .brand:hover {
          transform: scale(1.02);
        }

        .brand .name {
          font-size: clamp(1.5rem, 4vw, 2rem);
          color: #fbbf24;
          font-weight: 700;
        }

        .brand__img {
          width: 3rem;
          height: 3rem;
          object-fit: cover;
          border-radius: 50%;
          transition: transform 0.3s ease;
        }

        .brand__img:hover {
          transform: scale(1.05);
        }

        .cart {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: #333;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          font-weight: 600;
          font-size: 0.875rem;
        }

        .cart:hover {
          transform: translateY(-2px);
          background: rgba(248, 250, 252, 1);
          border-color: rgba(0, 0, 0, 0.2);
          box-shadow: var(--shadow-lg);
        }

        .cart:focus-visible {
          outline: 2px solid #333;
          outline-offset: 2px;
        }

        .cart svg {
          width: 1.25rem;
          height: 1.25rem;
          transition: transform 0.3s ease;
        }

        .cart:hover svg {
          transform: scale(1.1);
        }

        /* Main con diseño moderno */
        main {
          padding: 2rem 1.5rem 3rem;
          flex: 1;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Footer común */
        .social-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          color: var(--white);
          padding: 3rem 1.5rem 4rem;
          margin-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
        }

        .social-container {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .social-title {
          margin: 0 0 2rem;
          font-size: clamp(1.5rem, 4vw, 2rem);
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .social-buttons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .social-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius-lg);
          background: var(--primary);
          color: var(--white);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--shadow-md);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .address {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 1.5rem;
        }

        .footer-credits {
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
          text-align: center;
        }

        .devby {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
        }

        /* Estilos específicos del carrito */

        /* Barra de progreso */
        .progress-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding: 1.5rem 3rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          z-index: 2;
        }

        .step-circle {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.3s ease;
        }

        .progress-step.active .step-circle {
          background: var(--primary);
          border-color: var(--primary-solid);
          color: var(--white);
          box-shadow: 0 0 0 4px rgba(106, 13, 173, 0.2);
        }

        .progress-step.completed .step-circle {
          background: var(--success-solid);
          border-color: var(--success-solid);
          color: var(--white);
        }

        .step-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          transition: color 0.3s ease;
        }

        .progress-step.active .step-label {
          color: var(--white);
          font-weight: 700;
        }

        .progress-step.completed .step-label {
          color: var(--success-solid);
        }

        .progress-line {
          flex: 1;
          height: 2px;
          background: rgba(255, 255, 255, 0.2);
          position: relative;
          transition: background 0.3s ease;
          align-self: center;
          bottom: 13px;
        }

        .progress-line.completed {
          background: var(--success-solid);
        }

        .cart-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .cart-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .cart-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          font-weight: 500;
        }

        .cart-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          border: 1px solid #f0f0f0;
        }

        .item-info {
          flex: 1;
        }

        .item-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin: 0 0 0.5rem 0;
        }

        .item-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ff6b6b;
          margin: 0;
        }

        .item-actions {
          display: flex;
          gap: 0.5rem;
        }

        .remove-btn {
          background: #ff4757;
          border: none;
          border-radius: 8px;
          padding: 0.5rem;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .remove-btn:hover {
          background: #ff3742;
          transform: scale(1.05);
        }

        .remove-btn svg {
          width: 20px;
          height: 20px;
        }

        .cart-summary {
          position: sticky;
          top: 2rem;
          margin-top: 2rem;
        }

        .summary-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #f0f0f0;
        }

        .summary-card h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          margin: 0 0 1.5rem 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-row.total {
          font-size: 1.2rem;
          font-weight: 700;
          color: #333;
          border-top: 2px solid #ff6b6b;
          margin-top: 1rem;
          padding-top: 1rem;
        }

        .checkout-btn {
          width: 100%;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .checkout-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #ee5a24, #ff6b6b);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }

        .checkout-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .checkout-btn svg {
          width: 20px;
          height: 20px;
        }

        .empty-cart {
          text-align: center;
          padding: 4rem 2rem;
        }

        .empty-cart-content {
          max-width: 400px;
          margin: 0 auto;
        }

        .empty-cart-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-cart h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .empty-cart p {
          color: #333;
          margin-bottom: 2rem;
        }

        .btn-primary {
          display: inline-block;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          text-decoration: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #ee5a24, #ff6b6b);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .cart-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .cart-summary {
            position: static;
          }

          .cart-item {
            padding: 1rem;
          }

          .item-name {
            font-size: 1.1rem;
          }

          .summary-card {
            padding: 1.5rem;
          }

          .cart-title {
            font-size: 2rem;
          }
        }
      `}</style>

      <header>
        <div className="wrap">
          <Link href="/" className="brand">
            <div className="name">MOKETA</div>
            <img className="brand__img" src="/logo-moketa.png" alt="Logo MOKETA" />
          </Link>
          <Link className="cart" href="/">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9,22 9,12 15,12 15,22"></polyline>
            </svg>
            <span>Menú</span>
          </Link>
        </div>
      </header>

      <main>
        <div className="container">
          <div className="cart-header">
            <div className="progress-bar">
              <div className="progress-step active">
                <div className="step-circle">1</div>
                <span className="step-label">Carrito</span>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <div className="step-circle">2</div>
                <span className="step-label">Datos</span>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <div className="step-circle">3</div>
                <span className="step-label">Pago</span>
              </div>
              <div className="progress-line"></div>
              <div className="progress-step">
                <div className="step-circle">4</div>
                <span className="step-label">✓</span>
              </div>
            </div>
            <h1 className="cart-title">Tu Carrito</h1>
            <p className="cart-subtitle">Revisa tu pedido antes de confirmar</p>
          </div>

          {groupedItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-content">
                <div className="empty-cart-icon">🛒</div>
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos deliciosos de nuestro menú</p>
                <Link href="/" className="btn-primary">Ver Menú</Link>
              </div>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                {groupedItems.map((item, index) => {
                  let displayName, displayPrice
                  
                  if (item.isFromPromo && item.promoName) {
                    // Es una promoción
                    const quantityText = item.promoQuantity > 1 ? ` x${item.promoQuantity}` : ''
                    displayName = `${item.promoName}${quantityText}`
                    
                    // Calcular precio total para múltiples promociones
                    const promoPrice = parseInt(formatPrice(item.promoPrice))
                    const totalPrice = promoPrice * item.promoQuantity
                    displayPrice = `$${totalPrice.toLocaleString()}`
                    
                    // Agregar detalles de hamburguesas seleccionadas con cantidad
                    const burgerCounts = {}
                    item.selectedBurgers.forEach(burger => {
                      burgerCounts[burger] = (burgerCounts[burger] || 0) + 1
                    })
                    
                    const burgersText = Object.entries(burgerCounts).map(([burger, count]) => {
                      return count > 1 ? `${burger} x${count}` : burger
                    }).join(', ')
                    
                    return (
                      <div key={index} className="cart-item">
                        <div className="item-info">
                          <h4 className="item-name">
                            {displayName}
                            {burgersText && (
                              <>
                                <br />
                                <small style={{ color: '#666', fontSize: '0.9em' }}>
                                  {burgersText}
                                </small>
                              </>
                            )}
                          </h4>
                          <p className="item-price">{displayPrice}</p>
                        </div>
                        <div className="item-actions">
                          <button 
                            className="remove-btn" 
                            onClick={() => removePromoGroup(item.promoName, item.promoPrice)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6L6 18"></path>
                              <path d="M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  } else {
                    // Es un producto individual
                    const quantityText = item.quantity > 1 ? ` x${item.quantity}` : ''
                    const itemPrice = parseInt(formatPrice(item.price))
                    const totalPrice = itemPrice * item.quantity
                    displayName = `${item.name}${quantityText}`
                    displayPrice = `$${totalPrice.toLocaleString()}`
                    
                    return (
                      <div key={index} className="cart-item">
                        <div className="item-info">
                          <h4 className="item-name">{displayName}</h4>
                          <p className="item-price">{displayPrice}</p>
                        </div>
                        <div className="item-actions">
                          <button 
                            className="remove-btn" 
                            onClick={() => removeItemGroup(item.name, item.price)}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M18 6L6 18"></path>
                              <path d="M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  }
                })}
              </div>

              <div className="cart-summary">
                <div className="summary-card">
                  <h3>Resumen del Pedido</h3>
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                  <Link href="/checkout">
                    <button className="checkout-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 12l2 2 4-4"></path>
                        <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                        <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                        <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"></path>
                        <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"></path>
                      </svg>
                      Confirmar Pedido
                    </button>
                  </Link>
                </div>
              </div>
            </div>
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
    </>
  )
}
