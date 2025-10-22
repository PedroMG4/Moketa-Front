'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Checkout() {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [retiroSucursal, setRetiroSucursal] = useState(false)
  const router = useRouter()

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
    let total = 0
    
    // Agrupar items para calcular correctamente las promociones
    const groupedItems = groupCartItems()
    
    groupedItems.forEach(item => {
      if (item.isFromPromo && item.promoName) {
        // Para promociones, usar el precio promocional multiplicado por la cantidad de promociones
        const promoPrice = parseInt(formatPrice(item.promoPrice))
        total += promoPrice * item.promoQuantity
      } else {
        // Para productos individuales, usar el precio normal
        const price = parseInt(formatPrice(item.price))
        total += price * item.quantity
      }
    })
    
    return total
  }

  // Función para manejar checkbox de retiro por sucursal (EXACTAMENTE como el original)
  const handleRetiroSucursal = (checked) => {
    setRetiroSucursal(checked)
  }

  // Función para procesar el pedido (EXACTAMENTE como el original)
  const processOrder = (event) => {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    
    // Validar datos requeridos
    const nombre = formData.get('nombre')
    const telefono = formData.get('telefono')
    const email = formData.get('email')
    const pago = formData.get('pago')
    
    if (!nombre || !telefono || !pago) {
      alert('Por favor, completa todos los campos obligatorios.')
      return
    }
    
    // Validar email solo si se ingresó
    if (email && email.trim() !== '') {
      // Regex simplificado: debe tener @ y al menos un punto con extensión
      const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(email.trim())) {
        alert('Por favor, ingresa un email válido (ejemplo@email.com) o déjalo vacío.')
        return
      }
    }
    
    if (!retiroSucursal) {
      const direccion = formData.get('direccion')
      if (!direccion) {
        alert('Por favor, ingresa la dirección de entrega.')
        return
      }
    }
    
    // Preparar datos del cliente
    const customerData = {
      firstName: nombre.split(' ')[0] || nombre,
      lastName: nombre.split(' ').slice(1).join(' ') || '',
      phone: telefono,
      email: email
    }
    
    // Preparar datos de entrega
    const deliveryData = {
      deliveryType: retiroSucursal ? 'pickup' : 'delivery',
      address: retiroSucursal ? '' : formData.get('direccion'),
      city: 'Buenos Aires',
      specialInstructions: formData.get('referencias') || '',
      deliveryTime: formData.get('horario') || ''
    }
    
    // Guardar datos en localStorage para la página de pago
    localStorage.setItem('customerData', JSON.stringify(customerData))
    localStorage.setItem('deliveryData', JSON.stringify(deliveryData))
    localStorage.setItem('paymentMethod', pago)
    
    // Redirigir a la página de pago
    router.push('/pago')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  if (cart.length === 0) {
    router.push('/carrito')
    return null
  }

  const groupedItems = groupCartItems()
  const total = calculateTotal()

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

        /* Estilos específicos del checkout */

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

        .progress-step.completed个月前 .step-label {
          color: var(--success-solid);
        }

        .progress-line {
          flex: 1;
          height: 2px;
          background: rgba(255, 255, 255, 0.2);
          position: relative;
          transition: background 0.3s ease;
          margin: 0;
          align-self: center;
          bottom: 13px;
        }

        .progress-line.completed {
          background: var(--success-solid);
        }

        .checkout-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .checkout-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .checkout-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          font-weight: 500;
        }

        .checkout-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .checkout-form-container {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border: 1px solid #f0f0f0;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 1rem;
          border-bottom: 2px solid #ff6b6b;
          padding-bottom: 0.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #ff6b6b;
        }

        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-weight: 600;
          color: #333;
          padding: 1rem 2rem 1rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background-color: #fafafa;
          transition: all 0.3s ease;
          min-height: 60px;
          width: 100%;
          box-sizing: border-box;
          overflow: visible;
          position: relative;
        }

        .checkbox-label:hover {
          border-color: #ff6b6b;
          background-color: #fff5f5;
        }

        .checkbox-label input[type="checkbox"] {
          display: none;
        }

        .checkmark {
          width: 32px;
          height: 32px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          margin-right: 15px;
          position: absolute;
          top: 13px;
          left: 5;
          transition: all 0.3s ease;
          flex-shrink: 0;
          min-width: 32px;
          min-height: 32px;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkmark {
          background-color: #ff6b6b;
          border-color: #ff6b6b;
        }

        .checkbox-label input[type="checkbox"]:checked + .checkmark:after {
          content: "✓";
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          font-weight: bold;
          font-size: 16px;
        }

        .checkbox-text {
          margin-left: 50px;
          flex: 1;
          text-align: right;
        }

        .payment-options {
          display: flex;
          gap: 1rem;
        }

        .payment-option {
          flex: 1;
          cursor: pointer;
        }

        .payment-option input[type="radio"] {
          display: none;
        }

        .payment-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          transition: all 0.3s ease;
          text-align: center;
          height: 90px;
          box-sizing: border-box;
        }

        .payment-option input[type="radio"]:checked + .payment-label {
          border-color: #ff6b6b;
          background-color: #fff5f5;
        }

        .payment-icon {
          font-size: 2.5rem;
          margin-bottom: 0.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
        }

        .mercado-pago-logo {
          width: 110px;
          height: 100px;
          object-fit: contain;
          margin-bottom: 0.1rem;
          display: block;
        }

        .efectivo-icon {
          width: 70px;
          height: 50px;
          object-fit: contain;
          display: block;
        }

        .submit-btn {
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
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover {
          background: linear-gradient(135deg, #ee5a24, #ff6b6b);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }

        .submit-btn svg {
          width: 20px;
          height: 20px;
        }

        .order-summary {
          width: 100%;
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

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .order-item:last-of-type {
          border-bottom: none;
        }

        .item-name {
          font-weight: 500;
          color: #333;
        }

        .item-price {
          font-weight: 600;
          color: #ff6b6b;
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

        /* Responsive */
        @media (max-width: 768px) {
          .checkout-content {
            gap: 1.5rem;
          }

          .checkout-form-container {
            padding: 1.5rem;
          }

          .payment-options {
            flex-direction: column;
          }

          .checkout-title {
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
          <Link className="cart" href="/carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 12.39A2 2 0 0 0 9.61 15H19a2 2 0 0 0 2-1.61l1.38-7.39H6"></path>
            </svg>
            <span>Carrito</span>
          </Link>
        </div>
      </header>

      <main>
        <div className="container">
          <div className="progress-bar">
            <div className="progress-step completed">
              <div className="step-circle">1</div>
              <span className="step-label">Carrito</span>
            </div>
            <div className="progress-line completed"></div>
            <div className="progress-step active">
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

          <div className="checkout-header">
            <h1 className="checkout-title">Confirmar Pedido</h1>
            <p className="checkout-subtitle">Completa tus datos para finalizar tu pedido</p>
          </div>

          <div className="checkout-content">
            <div className="order-summary">
              <div className="summary-card">
                <h3>Resumen del Pedido</h3>
                <div id="orderItems">
                  {groupedItems.map((item, index) => {
                    if (item.isFromPromo && item.promoName) {
                      // Es una promoción
                      const quantityText = item.promoQuantity > 1 ? ` x${item.promoQuantity}` : ''
                      const promoName = `${item.promoName}${quantityText}`
                      
                      // Calcular precio total para múltiples promociones
                      const promoPrice = parseInt(formatPrice(item.promoPrice))
                      const totalPrice = promoPrice * item.promoQuantity
                      const displayPrice = `$${totalPrice.toLocaleString()}`
                      
                      const burgerCounts = {}
                      item.selectedBurgers.forEach(burger => {
                        burgerCounts[burger] = (burgerCounts[burger] || 0) + 1
                      })
                      
                      const burgersText = Object.entries(burgerCounts).map(([burger, count]) => {
                        return count > 1 ? `${burger} x${count}` : burger
                      }).join(', ')
                      
                      return (
                        <div key={index} className="order-item">
                          <span className="item-name">
                            {promoName}
                            {burgersText && (
                              <>
                                <br />
                                <small style={{ color: '#666', fontSize: '0.9em' }}>
                                  {burgersText}
                                </small>
                              </>
                            )}
                          </span>
                          <span className="item-price">{displayPrice}</span>
                        </div>
                      )
                    } else {
                      // Es un producto individual
                      const quantityText = item.quantity > 1 ? ` x${item.quantity}` : ''
                      const itemPrice = parseInt(formatPrice(item.price))
                      const totalPrice = itemPrice * item.quantity
                      
                      return (
                        <div key={index} className="order-item">
                          <span className="item-name">{item.name}{quantityText}</span>
                          <span className="item-price">${totalPrice.toLocaleString()}</span>
                        </div>
                      )
                    }
                  })}
                </div>
                <div className="summary-row剩下的total">
                  <span>Total:</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="checkout-form-container">
              <form className="checkout-form" onSubmit={processOrder}>
                <div className="form-section">
                  <h3>Información Personal</h3>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre completo *</label>
                    <input type="text" id="nombre" name="nombre" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono *</label>
                    <input type="tel" id="telefono" name="telefono" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email (opcional)</label>
                    <input type="email" id="email" name="email" placeholder="ejemplo@email.com" />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Dirección de Entrega</h3>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        id="retiroSucursal" 
                        name="retiroSucursal"
                        checked={retiroSucursal}
                        onChange={(e) => handleRetiroSucursal(e.target.checked)}
                      />
                      <span className="checkmark"></span>
                      <span className="checkbox-text">Retiro por sucursal</span>
                    </label>
                  </div>
                  <div className="form-group" style={{ display: retiroSucursal ? 'none' : 'block' }}>
                    <label htmlFor="direccion">Dirección *</label>
                    <input 
                      type="text" 
                      id="direccion" 
                      name="direccion" 
                      required={!retiroSucursal}
                      placeholder="Calle, número, barrio" 
                    />
                  </div>
                  <div className="form-group" style={{ display: retiroSucursal ? 'none' : 'block' }}>
                    <label htmlFor="referencias">Referencias (opcional)</label>
                    <textarea 
                      id="referencias" 
                      name="referencias" 
                      rows="3" 
                      placeholder="Ej: Casa blanca, portón azul, etc."
                    ></textarea>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Método de Pago</h3>
                  <div className="payment-options">
                    <label className="payment-option">
                      <input type="radio" name="pago" value="efectivo" defaultChecked />
                      <span className="payment-label">
                        <img src="/assets/dinero-en-efectivo.png" alt="Efectivo" className="payment-icon efectivo-icon" />
                        <span>Efectivo</span>
                      </span>
                    </label>
                    <label className="payment-option">
                      <input type="radio" name="pago" value="mercadopago" />
                      <span className="payment-label">
                        <img src="/assets/LogoMercadopago.png" alt="Mercado Pago" className="payment-icon mercado-pago-logo" />
                        <span>Billetera virtual</span>
                      </span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="submit-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12l2 2 4-4"></path>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
                    <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"></path>
                    <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"></path>
                  </svg>
                  Finalizar Pedido
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Sección de redes sociales */}
      <section className="social-section">
        <div className="social-container">
          <h2 className="social-title">Síguenos</h2>
          <div className="social-buttons">
            <a href="https://www.instagram.com/moketaoficial/" className="social-btn" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 493-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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

