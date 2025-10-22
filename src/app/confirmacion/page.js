'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Confirmacion() {
  const [orderData, setOrderData] = useState(null)
  const [customerData, setCustomerData] = useState(null)
  const [deliveryData, setDeliveryData] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Constantes
  const WAIT_TIME_PICKUP = '15 minutos' // Tiempo para retiro por sucursal

  useEffect(() => {
    loadOrderData()
    renderConfirmationContent()
  }, [])

  // Cargar datos del pedido desde localStorage (EXACTAMENTE como el original)
  const loadOrderData = () => {
    try {
      // Cargar datos del último pedido
      const lastOrder = localStorage.getItem('lastOrder')
      if (lastOrder) {
        setOrderData(JSON.parse(lastOrder))
      }

      // Cargar datos del cliente y entrega (por si acaso)
      const customer = localStorage.getItem('customerData')
      const delivery = localStorage.getItem('deliveryData')
      const payment = localStorage.getItem('paymentMethod')

      if (customer) setCustomerData(JSON.parse(customer))
      if (delivery) setDeliveryData(JSON.parse(delivery))
      if (payment) setPaymentMethod(payment)

      // Si no hay datos del pedido, redirigir al inicio
      if (!lastOrder) {
        console.warn('No se encontraron datos del pedido. Redirigiendo al inicio...')
        router.push('/')
        return
      }

      console.log('Datos del pedido cargados:', JSON.parse(lastOrder))
      setLoading(false)
    } catch (error) {
      console.error('Error al cargar datos del pedido:', error)
      router.push('/')
    }
  }

  // Renderizar contenido de confirmación según el tipo de pago y entrega (EXACTAMENTE como el original)
  const renderConfirmationContent = () => {
    // Esta función se ejecutará cuando los datos estén cargados
  }

  // Formatear precio (EXACTAMENTE como el original)
  const formatPrice = (price) => {
    return price.replace('$', '').replace('.', '')
  }

  // Calcular subtotal (sin envío) (EXACTAMENTE como el original)
  const calculateSubtotal = () => {
    let subtotal = 0
    
    // Agrupar items para calcular correctamente las promociones
    const groupedItems = groupOrderItems()
    
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

  // Calcular costo de envío (EXACTAMENTE como el original)
  const calculateDeliveryFee = () => {
    if (!orderData) return 0
    const isDelivery = orderData.delivery.deliveryType === 'delivery'
    return isDelivery ? 500 : 0
  }

  // Agrupar items del pedido para manejar promociones (EXACTAMENTE como el original)
  const groupOrderItems = () => {
    if (!orderData || !orderData.items) return []
    
    const groupedItems = {}
    
    orderData.items.forEach(item => {
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

  // Renderizar confirmación para retiro por sucursal (EXACTAMENTE como el original)
  const renderPickupConfirmation = () => {
    return (
      <>
        <div className="confirmation-message">
          <span className="confirmation-icon">✅</span>
          <h2>¡Gracias por tu pedido!</h2>
          <p>Tu pedido ha sido confirmado y está siendo preparado.</p>
        </div>

        <div className="confirmation-details">
          <h3>🛒 Resumen del Pedido</h3>
          {renderOrderItems()}
        </div>

        <div className="confirmation-details">
          <h3>📋 Detalles del Pedido</h3>
          <div className="detail-item">
            <span className="detail-label">Tipo de entrega:</span>
            <span className="detail-value">Retiro por sucursal</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Dirección de retiro:</span>
            <span className="detail-value">Av. Paysandú 4265, Corrientes</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Método de pago:</span>
            <span className="detail-value">Efectivo al momento de la entrega</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Total:</span>
            <span className="detail-value">${orderData.total.toLocaleString()}</span>
          </div>
          {orderData.delivery.specialInstructions && (
            <div className="detail-item">
              <span className="detail-label">Indicaciones especiales:</span>
              <span className="detail-value">{orderData.delivery.specialInstructions}</span>
            </div>
          )}
        </div>

        <div className="pickup-info">
          <p><strong>⏰ Tiempo estimado de preparación:</strong></p>
          <div className="pickup-time">{WAIT_TIME_PICKUP}</div>
          <p><em>Te enviaremos un mensaje cuando esté listo para retirar.</em></p>
        </div>
      </>
    )
  }

  // Renderizar confirmación para envío a domicilio (EXACTAMENTE como el original)
  const renderDeliveryConfirmation = () => {
    return (
      <>
        <div className="confirmation-message">
          <span className="confirmation-icon">✅</span>
          <h2>¡Gracias por tu pedido!</h2>
          <p>Tu pedido ha sido confirmado y será enviado a tu domicilio.</p>
        </div>

        <div className="confirmation-details">
          <h3>🛒 Resumen del Pedido</h3>
          {renderOrderItems()}
        </div>

        <div className="confirmation-details">
          <h3>📋 Detalles del Pedido</h3>
          <div className="detail-item">
            <span className="detail-label">Tipo de entrega:</span>
            <span className="detail-value">Envío a domicilio</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Dirección de entrega:</span>
            <span className="detail-value">{orderData.delivery.address}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Método de pago:</span>
            <span className="detail-value">Efectivo al momento de la entrega</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Subtotal:</span>
            <span className="detail-value">${calculateSubtotal().toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Envío:</span>
            <span className="detail-value">${calculateDeliveryFee().toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Total:</span>
            <span className="detail-value">${orderData.total.toLocaleString()}</span>
          </div>
          {orderData.delivery.specialInstructions && (
            <div className="detail-item">
              <span className="detail-label">Indicaciones especiales:</span>
              <span className="detail-value">{orderData.delivery.specialInstructions}</span>
            </div>
          )}
        </div>

        <div className="delivery-info">
          <p><strong>🚚 Información de envío:</strong></p>
          <p>Te enviaremos tu pedido apenas esté listo. Cualquier consulta o problema nos comunicaremos contigo por WhatsApp.</p>
          
          <a href="https://api.whatsapp.com/send/?phone=5493794003987&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="whatsapp-info">
            <h4>📱 Contacto WhatsApp</h4>
            <p>Para cualquier consulta sobre tu pedido, escribinos al WhatsApp de MOKETA</p>
          </a>
        </div>
      </>
    )
  }

  // Renderizar confirmación para Mercado Pago (placeholder para futuro) (EXACTAMENTE como el original)
  const renderMercadoPagoConfirmation = () => {
    return (
      <>
        <div className="confirmation-message">
          <span className="confirmation-icon">✅</span>
          <h2>¡Gracias por tu pedido!</h2>
          <p>Tu pago ha sido procesado exitosamente.</p>
        </div>

        <div className="confirmation-details">
          <h3>📋 Detalles del Pedido</h3>
          <div className="detail-item">
            <span className="detail-label">Método de pago:</span>
            <span className="detail-value">Mercado Pago</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Subtotal:</span>
            <span className="detail-value">${calculateSubtotal().toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Envío:</span>
            <span className="detail-value">${calculateDeliveryFee().toLocaleString()}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Total:</span>
            <span className="detail-value">${orderData.total.toLocaleString()}</span>
          </div>
          {orderData.delivery.specialInstructions && (
            <div className="detail-item">
              <span className="detail-label">Indicaciones especiales:</span>
              <span className="detail-value">{orderData.delivery.specialInstructions}</span>
            </div>
          )}
        </div>

        <div className="mercado-pago-info">
          <p><em>Esta funcionalidad estará disponible próximamente.</em></p>
        </div>
      </>
    )
  }

  // Renderizar items del pedido (EXACTAMENTE como el original)
  const renderOrderItems = () => {
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return <p>No hay items en el pedido.</p>
    }

    // Agrupar items para manejar promociones correctamente
    const groupedItems = groupOrderItems()

    return groupedItems.map((item, index) => {
      if (item.isFromPromo && item.promoName) {
        // Es una promoción
        const quantityText = item.promoQuantity > 1 ? ` x${item.promoQuantity}` : ''
        const promoName = `${item.promoName}${quantityText}`
        
        // Calcular precio total para múltiples promociones
        const promoPrice = parseInt(formatPrice(item.promoPrice))
        const totalPrice = promoPrice * item.promoQuantity
        const displayPrice = `$${totalPrice.toLocaleString()}`
        
        // Agregar detalles de hamburguesas seleccionadas con cantidad
        const burgerCounts = {}
        item.selectedBurgers.forEach(burger => {
          burgerCounts[burger] = (burgerCounts[burger] || 0) + 1
        })
        
        const burgersText = Object.entries(burgerCounts).map(([burger, count]) => {
          return count > 1 ? `${burger} x${count}` : burger
        }).join(', ')
        
        const burgersDisplay = burgersText ? 
          <><br /><small style={{ color: '#666', fontSize: '0.9em' }}>{burgersText}</small></> : ''
        
        return (
          <div key={index} className="ordered-item">
            <span className="detail-label">{promoName}{burgersDisplay}</span>
            <span className="detail-value">{displayPrice}</span>
          </div>
        )
      } else {
        // Es un producto individual
        const quantityText = item.quantity > 1 ? ` x${item.quantity}` : ''
        const itemPrice = parseInt(formatPrice(item.price))
        const totalPrice = itemPrice * item.quantity
        
        return (
          <div key={index} className="ordered-item">
            <span className="detail-label">{item.name}{quantityText}</span>
            <span className="detail-value">${totalPrice.toLocaleString()}</span>
          </div>
        )
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    )
  }

  if (!orderData) {
    return null // Ya se redirigió en loadOrderData
  }

  // Determinar el tipo de pago y entrega
  const isPickup = orderData.delivery.deliveryType === 'pickup'
  const isCashPayment = orderData.paymentMethod === 'efectivo'

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

        /* Header de confirmación */
        .confirmation-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .confirmation-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--white);
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .confirmation-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          font-weight: 500;
        }

        /* Contenido de confirmación */
        .confirmation-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: var(--radius-xl);
          padding: 2rem;
          box-shadow: var(--shadow-xl);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 2rem;
        }

        .confirmation-message {
          text-align: center;
          margin-bottom: 2rem;
        }

        .confirmation-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          display: block;
        }

        .confirmation-message h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--success-solid);
          margin-bottom: 1rem;
        }

        .confirmation-message p {
          font-size: 1.125rem;
          color: var(--gray-700);
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .confirmation-details {
          background: var(--gray-50);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .confirmation-details h3 {
          color: var(--gray-800);
          font-size: 1.25rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--gray-200);
        }

        .detail-item:last-child {
          border-bottom: none;
        }

        .detail-label {
          font-weight: 500;
          color: var(--gray-700);
        }

        .detail-value {
          font-weight: 600;
          color: var(--gray-800);
          text-align: right;
        }

        .ordered-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--gray-200);
        }

        .ordered-item:last-child {
          border-bottom: none;
        }

        .pickup-time {
          background: var(--secondary);
          color: var(--black);
          padding: 0.75rem 1.5rem;
          border-radius: var(--radius);
          font-weight: bold;
          display: inline-block;
          margin: 1rem 0;
          box-shadow: var(--shadow-md);
        }

        .pickup-info {
          background: var(--gray-50);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          margin-top: 1.5rem;
          text-align: center;
        }

        .pickup-info p {
          color: var(--gray-700);
          margin-bottom: 1rem;
        }

        .delivery-info {
          background: var(--gray-50);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .delivery-info p {
          color: var(--gray-700);
          margin-bottom: 1rem;
          text-align: center;
        }

        .whatsapp-info {
          background: #25D366;
          color: var(--white);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          margin-top: 1.5rem;
          text-decoration: none;
          display: block;
          transition: background-color 0.3s ease;
          cursor: pointer;
          text-align: center;
          box-shadow: var(--shadow-md);
        }

        .whatsapp-info:hover {
          background: #128C7E;
        }

        .whatsapp-info h4 {
          margin-bottom: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
        }

        .whatsapp-info p {
          margin: 0;
          opacity: 0.9;
        }

        /* Acciones de confirmación */
        .confirmation-actions {
          text-align: center;
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
          
          .confirmation-content {
            padding: 1.5rem;
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
          <div className="confirmation-header">
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
              <div className="progress-step completed">
                <div className="step-circle">3</div>
                <span className="step-label">Pago</span>
              </div>
              <div className="progress-line completed"></div>
              <div className="progress-step active">
                <div className="step-circle">✓</div>
                <span className="step-label">✓</span>
              </div>
            </div>
            <h1 className="confirmation-title">¡Pedido Confirmado!</h1>
            <p className="confirmation-subtitle">Tu pedido ha sido recibido exitosamente</p>
          </div>

          <div className="confirmation-content">
            {isCashPayment && isPickup ? (
              renderPickupConfirmation()
            ) : isCashPayment && !isPickup ? (
              renderDeliveryConfirmation()
            ) : (
              renderMercadoPagoConfirmation()
            )}
          </div>

          <div className="confirmation-actions">
            <button className="btn btn-primary" onClick={() => router.push('/')}>
              Volver al Inicio
            </button>
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

