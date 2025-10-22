'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Pago() {
  const [cart, setCart] = useState([])
  const [customerData, setCustomerData] = useState({})
  const [deliveryData, setDeliveryData] = useState({})
  const [paymentMethod, setPaymentMethod] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Configuración de Mercado Pago (variables de entorno)
  const MERCADO_PAGO_PUBLIC_KEY = 'TEST-12345678-1234-1234-1234-123456789012' // Reemplazar con tu clave pública
  const BACKEND_URL = 'http://localhost:3000' // URL de tu backend

  // Configuración de tiempos de espera (temporal - después vendrá del CMS)
  const WAIT_TIME_PICKUP = '15 minutos' // Tiempo para retiro por sucursal

  useEffect(() => {
    loadOrderData()
    renderOrderSummary()
    setupEventListeners()
    updateProgressBar(2) // Paso 3 (Pago)
  }, [])

  // Cargar datos de la orden desde localStorage (EXACTAMENTE como el original)
  const loadOrderData = () => {
    // Cargar carrito
    const savedCart = JSON.parse(localStorage.getItem('moketaCart')) || []
    setCart(savedCart)
    
    // Cargar datos del cliente
    const savedCustomerData = JSON.parse(localStorage.getItem('customerData')) || {}
    setCustomerData(savedCustomerData)
    
    // Cargar datos de entrega
    const savedDeliveryData = JSON.parse(localStorage.getItem('deliveryData')) || {}
    setDeliveryData(savedDeliveryData)
    
    // Cargar método de pago
    const savedPaymentMethod = localStorage.getItem('paymentMethod') || ''
    setPaymentMethod(savedPaymentMethod)
    
    // Validar que tenemos todos los datos necesarios
    if (!savedCart.length || !Object.keys(savedCustomerData).length || !savedPaymentMethod) {
      // Si faltan datos, redirigir al checkout
      router.push('/checkout')
      return
    }
    
    setLoading(false)
  }

  // Renderizar resumen de la orden (EXACTAMENTE como el original)
  const renderOrderSummary = () => {
    // Esta función se ejecutará cuando los datos estén cargados
  }

  // Formatear precio - maneja formato $X.XXX
  const formatPrice = (price) => {
    if (!price) return '0'
    // Remover el símbolo $, puntos (separadores de miles) y espacios en blanco
    const cleanPrice = price.toString().replace(/[$.\s]/g, '')
    return cleanPrice
  }

  // Calcular subtotal - corregido
  const calculateSubtotal = () => {
    let subtotal = 0
    cart.forEach(item => {
      const price = parseInt(formatPrice(item.price))
      subtotal += price
    })
    return subtotal
  }

  // Calcular total (EXACTAMENTE como el original)
  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const deliveryFee = deliveryData.deliveryType === 'delivery' ? 500 : 0
    return subtotal + deliveryFee
  }

  // Configurar event listeners (EXACTAMENTE como el original)
  const setupEventListeners = () => {
    // Los event listeners se manejan en los botones JSX
  }

  // Actualizar barra de progreso (EXACTAMENTE como el original)
  const updateProgressBar = (step) => {
    // Esta función se ejecuta automáticamente en el useEffect
  }

  // Manejar confirmación de pago (EXACTAMENTE como el original)
  const handlePaymentConfirmation = async () => {
    try {
      if (paymentMethod === 'efectivo') {
        await processCashPayment()
      } else if (paymentMethod === 'mercadopago') {
        await processMercadoPagoPayment()
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error)
      alert('Hubo un error al procesar tu pago. Por favor, inténtalo de nuevo.')
    }
  }

  // Procesar pago en efectivo (EXACTAMENTE como el original)
  const processCashPayment = async () => {
    // Crear objeto de pedido
    const order = {
      items: cart,
      customer: customerData,
      delivery: deliveryData,
      paymentMethod: paymentMethod,
      total: calculateTotal(),
      status: 'confirmed',
      createdAt: new Date().toISOString()
    }
    
    // Guardar pedido en localStorage (simulando envío al servidor)
    const orders = JSON.parse(localStorage.getItem('orders')) || []
    orders.push(order)
    localStorage.setItem('orders', JSON.stringify(orders))
    
    // Guardar datos para la página de confirmación
    localStorage.setItem('lastOrder', JSON.stringify(order))
    
    // Limpiar carrito
    localStorage.removeItem('moketaCart')
    localStorage.removeItem('customerData')
    localStorage.removeItem('deliveryData')
    localStorage.removeItem('paymentMethod')
    
    // Redirigir a página de confirmación
    router.push('/confirmacion')
  }

  // Procesar pago con Mercado Pago (EXACTAMENTE como el original)
  const processMercadoPagoPayment = async () => {
    try {
      // Crear preferencia de pago en el backend
      const preference = await createMercadoPagoPreference()
      
      // Redirigir a Mercado Pago
      if (preference && preference.init_point) {
        window.location.href = preference.init_point
      } else {
        throw new Error('No se pudo crear la preferencia de pago')
      }
    } catch (error) {
      console.error('Error al crear preferencia de Mercado Pago:', error)
      throw error
    }
  }

  // Crear preferencia de Mercado Pago - corregido para manejar formato $X.XXX
  const createMercadoPagoPreference = async () => {
    const orderData = {
      items: cart.map(item => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: parseFloat(formatPrice(item.price))
      })),
      customer: customerData,
      delivery: deliveryData,
      total: calculateTotal()
    }
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/create-preference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error al comunicarse con el backend:', error)
      // Fallback: crear preferencia básica (solo para desarrollo)
      return createFallbackPreference(orderData)
    }
  }

  // Crear preferencia de fallback (solo para desarrollo) - corregido
  const createFallbackPreference = (orderData) => {
    // Esta es una implementación básica solo para desarrollo
    // En producción, esto debe hacerse en el backend
    const items = orderData.items.map(item => ({
      title: item.title,
      quantity: item.quantity,
      unit_price: item.unit_price
    }))
    
    // Simular URL de pago (en desarrollo real, esto vendría del backend)
    const initPoint = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=TEST-123456`
    
    return { init_point: initPoint }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

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

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
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
          margin: 0;
          align-self: center;
          bottom: 13px;
        }

        .progress-line.completed {
          background: var(--success-solid);
        }

        /* Header del pago */
        .pago-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .pago-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .pago-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          font-weight: 500;
        }

        /* Contenido del pago */
        .pago-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        /* Secciones de resumen */
        .resumen-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: var(--radius-xl);
          padding: 2rem;
          box-shadow: var(--shadow-xl);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--gray-800);
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--primary-solid);
        }

        /* Items del carrito */
        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--gray-50);
          border-radius: var(--radius-md);
          border: 1px solid var(--gray-200);
        }

        .item-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .item-image {
          width: 4rem;
          height: 4rem;
          object-fit: cover;
          border-radius: var(--radius-md);
        }

        .item-details h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--gray-800);
          margin-bottom: 0.25rem;
        }

        .item-details p {
          font-size: 0.875rem;
          color: var(--gray-600);
        }

        .item-price {
          font-size: 1.125rem;
          font-weight: 700;
          color: var(--primary-solid);
        }

        /* Estilos para promociones */
        .promo-item {
          border-left: 4px solid var(--secondary-solid);
        }

        .promo-details {
          margin-top: 0.5rem;
        }

        .promo-details p {
          font-size: 0.875rem;
          color: var(--gray-600);
          margin-bottom: 0.25rem;
          font-weight: 600;
        }

        .burger-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .burger-list li {
          font-size: 0.875rem;
          color: var(--gray-700);
          margin-bottom: 0.125rem;
          padding-left: 0.5rem;
        }

        /* Resumen de la orden */
        .order-summary {
          background: var(--gray-50);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          border: 1px solid var(--gray-200);
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .summary-row:last-child {
          margin-bottom: 0;
          padding-top: 0.75rem;
          border-top: 2px solid var(--gray-200);
          font-weight: 700;
          font-size: 1.125rem;
          color: var(--gray-800);
        }

        .summary-label {
          color: var(--gray-600);
        }

        .summary-value {
          font-weight: 600;
          color: var(--gray-800);
        }

        .total-value {
          color: var(--primary-solid);
        }

        /* Información del cliente y entrega */
        .customer-info,
        .delivery-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .info-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-600);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .info-value {
          font-size: 1rem;
          color: var(--gray-800);
          font-weight: 500;
        }

        /* Método de pago */
        .payment-method {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--gray-50);
          border-radius: var(--radius-md);
          border: 1px solid var(--gray-200);
        }

        .payment-icon {
          width: 3rem;
          height: 3rem;
          object-fit: contain;
          border-radius: var(--radius-md);
        }

        .payment-info h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--gray-800);
          margin-bottom: 0.25rem;
        }

        .payment-info p {
          font-size: 0.875rem;
          color: var(--gray-600);
        }

        /* Área de pago */
        .payment-area {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: var(--radius-xl);
          padding: 2rem;
          box-shadow: var(--shadow-xl);
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: center;
        }

        .payment-success {
          color: var(--success-solid);
        }

        .payment-success .success-icon {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1rem;
          background: var(--success);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
          font-size: 1.5rem;
        }

        .payment-success h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: var(--gray-800);
        }

        .payment-success p {
          color: var(--gray-600);
          margin-bottom: 1.5rem;
        }

        /* Botones de acción */
        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: var(--radius-lg);
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          min-width: 140px;
          justify-content: center;
        }

        .btn-primary {
          background: var(--primary);
          color: var(--white);
          box-shadow: var(--shadow-md);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .btn-secondary {
          background: var(--gray-100);
          color: var(--gray-700);
          border: 1px solid var(--gray-300);
        }

        .btn-secondary:hover {
          background: var(--gray-200);
          transform: translateY(-1px);
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

        /* Responsive */
        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }
          
          .pago-content {
            gap: 1.5rem;
          }
          
          .resumen-section {
            padding: 1.5rem;
          }
          
          .customer-info,
          .delivery-info {
            grid-template-columns: 1fr;
          }
          
          .action-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .btn {
            width: 100%;
            max-width: 300px;
          }
          
          .progress-bar {
            padding: 1rem 1.5rem;
          }
          
          .step-circle {
            width: 2.5rem;
            height: 2.5rem;
            font-size: 0.875rem;
          }
          
          .step-label {
            font-size: 0.75rem;
          }
        }
      `}</style>

      <header>
        <div className="wrap">
          <Link href="/" className="brand" aria-label="Marca">
            <div className="name">MOKETA</div>
            <img className="brand__img" src="/logo-moketa.png" alt="Logo MOKETA" />
          </Link>
          <Link className="cart" href="/carrito" aria-label="Volver al carrito">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden="true">
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
            <div className="progress-step completed">
              <div className="step-circle">2</div>
              <span className="step-label">Datos</span>
            </div>
            <div className="progress-line completed"></div>
            <div className="progress-step active">
              <div className="step-circle">3</div>
              <span className="step-label">Pago</span>
            </div>
            <div className="progress-line"></div>
            <div className="progress-step">
              <div className="step-circle">4</div>
              <span className="step-label">✓</span>
            </div>
          </div>

          <div className="pago-header">
            <h1 className="pago-title">Resumen del Pedido</h1>
            <p className="pago-subtitle">Confirma tu pedido antes de proceder al pago</p>
          </div>

          <div className="pago-content">
            {/* Resumen del Carrito */}
            <div className="resumen-section">
              <h2 className="section-title">Tu Pedido</h2>
              <div className="cart-items" id="cartItems">
                {cart.length ? (
                  // Agrupar items por promoción o individualmente
                  (() => {
                    const promoGroups = {}
                    const individualItems = {}
                    
                    cart.forEach(item => {
                      if (item.isFromPromo) {
                        // Es un item de promoción
                        const promoKey = item.promoName
                        if (!promoGroups[promoKey]) {
                          promoGroups[promoKey] = {
                            promoName: item.promoName,
                            promoPrice: item.promoPrice,
                            burgers: [],
                            totalPrice: 0
                          }
                        }
                        promoGroups[promoKey].burgers.push(item.name)
                        promoGroups[promoKey].totalPrice += parseInt(formatPrice(item.price))
                      } else {
                        // Es un item individual
                        const key = `${item.name}-${item.price}`
                        if (individualItems[key]) {
                          individualItems[key].quantity += 1
                        } else {
                          individualItems[key] = {
                            name: item.name,
                            price: item.price,
                            quantity: 1
                          }
                        }
                      }
                    })
                    
                    const promoItems = Object.values(promoGroups)
                    const uniqueItems = Object.values(individualItems)
                    
                    return (
                      <>
                        {/* Mostrar promociones */}
                        {promoItems.map((promo, index) => (
                          <div key={`promo-${index}`} className="cart-item promo-item">
                            <div className="item-info">
                              <div className="item-details">
                                <h3>{promo.promoName}</h3>
                                <div className="promo-details">
                                  <p>Hamburguesas incluidas:</p>
                                  <ul className="burger-list">
                                    {promo.burgers.map((burger, burgerIndex) => (
                                      <li key={burgerIndex}>• {burger}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="item-price">${promo.totalPrice.toLocaleString()}</div>
                          </div>
                        ))}
                        
                        {/* Mostrar items individuales */}
                        {uniqueItems.map((item, index) => (
                          <div key={`item-${index}`} className="cart-item">
                            <div className="item-info">
                              <div className="item-details">
                                <h3>{item.name}</h3>
                                <p>Cantidad: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="item-price">${(parseInt(formatPrice(item.price)) * item.quantity).toLocaleString()}</div>
                          </div>
                        ))}
                      </>
                    )
                  })()
                ) : (
                  <p>No hay items en el carrito</p>
                )}
              </div>
              <div className="order-summary" id="orderSummary">
                <div className="summary-row">
                  <span className="summary-label">Subtotal:</span>
                  <span className="summary-value">${calculateSubtotal().toLocaleString()}</span>
                </div>
                {deliveryData.deliveryType === 'delivery' && (
                  <div className="summary-row">
                    <span className="summary-label">Envío:</span>
                    <span className="summary-value">$500</span>
                  </div>
                )}
                <div className="summary-row">
                  <span className="summary-label">Total:</span>
                  <span className="summary-value total-value">${calculateTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div className="resumen-section">
              <h2 className="section-title">Datos del Cliente</h2>
              <div className="customer-info" id="customerInfo">
                <div className="info-item">
                  <span className="info-label">Nombre</span>
                  <span className="info-value">{customerData.firstName} {customerData.lastName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{customerData.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Teléfono</span>
                  <span className="info-value">{customerData.phone}</span>
                </div>
              </div>
            </div>

            {/* Datos de Entrega */}
            <div className="resumen-section">
              <h2 className="section-title">Datos de Entrega</h2>
              <div className="delivery-info" id="deliveryInfo">
                <div className="info-item">
                  <span className="info-label">Tipo de entrega</span>
                  <span className="info-value">
                    {deliveryData.deliveryType === 'delivery' ? 'Envío a domicilio' : 'Retiro por sucursal'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Dirección</span>
                  <span className="info-value">
                    {deliveryData.deliveryType === 'delivery' 
                      ? deliveryData.address 
                      : 'Av. Paysandú 4265, Corrientes'
                    }
                  </span>
                </div>
                {deliveryData.deliveryType === 'delivery' && deliveryData.deliveryTime && (
                  <div className="info-item">
                    <span className="info-label">Horario preferido</span>
                    <span className="info-value">{deliveryData.deliveryTime}</span>
                  </div>
                )}
                {deliveryData.specialInstructions && (
                  <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                    <span className="info-label">Instrucciones especiales</span>
                    <span className="info-value">{deliveryData.specialInstructions}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Método de Pago */}
            <div className="resumen-section">
              <h2 className="section-title">Método de Pago</h2>
              <div className="payment-method" id="paymentMethod">
                <img 
                  src={paymentMethod === 'efectivo' ? '/assets/dinero-en-efectivo.png' : 'https://getlogovector.com/wp-content/uploads/2023/12/mercado-pago-logo-vector-2023.png'} 
                  alt={paymentMethod === 'efectivo' ? 'Efectivo' : 'Mercado Pago'} 
                  className="payment-icon"
                />
                <div className="payment-info">
                  <h3>{paymentMethod === 'efectivo' ? 'Efectivo' : 'Mercado Pago'}</h3>
                  <p>
                    {paymentMethod === 'efectivo' 
                      ? (deliveryData.deliveryType === 'pickup' 
                          ? 'Pago al momento del retiro' 
                          : 'Pago al momento de la entrega')
                      : 'Pago seguro con tarjeta o transferencia'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Área de Pago */}
            <div className="payment-area" id="paymentArea">
              {paymentMethod === 'efectivo' ? (
                deliveryData.deliveryType === 'pickup' ? (
                  <div className="payment-area-content">
                    <h2>Pago en Efectivo</h2>
                    <p>Pagarás al momento de retirar tu pedido.</p>
                    <p><strong>Total a pagar:</strong> ${calculateTotal().toLocaleString()}</p>
                    <p>Podes pasar a buscar tu pedido en <strong>{WAIT_TIME_PICKUP}</strong></p>
                  </div>
                ) : (
                  <div className="payment-area-content">
                    <h2>Pago en Efectivo</h2>
                    <p>Pagarás al momento de recibir tu pedido.</p>
                    <p><strong>Total a pagar:</strong> ${calculateTotal().toLocaleString()}</p>
                    <p><em>Te contactaremos para coordinar la entrega y el pago.</em></p>
                  </div>
                )
              ) : (
                <div className="payment-area-content">
                  <h2>Proceder al Pago</h2>
                  <p>Serás redirigido a Mercado Pago para completar tu pago de forma segura.</p>
                  <p><strong>Total a pagar:</strong> ${calculateTotal().toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Botones de Acción */}
            <div className="action-buttons">
              <button className="btn btn-secondary" onClick={() => router.push('/checkout')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Volver
              </button>
              <button className="btn btn-primary" onClick={handlePaymentConfirmation}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{paymentMethod === 'efectivo' ? 'Confirmar Pedido' : 'Ir a Pagar'}</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Sección de redes sociales */}
      <section className="social-section">
        <div className="social-container">
          <h2 className="social-title">Síguenos</h2>
          <div className="social-buttons">
            <a href="https://www.instagram.com/moketaoficial/" className="social-btn" target="_blank" rel="noopener noreferrer"
              aria-label="Síguenos en Instagram">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
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


