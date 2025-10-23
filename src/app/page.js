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
          background: rgba(255, 255, 255, 1);
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
          object-fit: contain;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          transition: transform 0.3s ease;
        }

        .brand__img:hover {
          transform: scale(1.05);
        }

        /* Botón carrito moderno */
        .cart {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: #333;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-lg);
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
          outline: 2px solid var(--white);
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

        .category {
          margin-bottom: 3rem;
        }

        .category__title {
          margin: 0 0 1.5rem;
          font-size: clamp(1.5rem, 4vw, 2.25rem);
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-align: center;
          position: relative;
        }

        .category__title::after {
          content: '';
          position: absolute;
          bottom: -0.5rem;
          left: 50%;
          transform: translateX(-50%);
          width: 4rem;
          height: 0.25rem;
          background: linear-gradient(90deg, var(--violeta) 0%, var(--amarillo) 100%);
          border-radius: var(--radius);
        }

        /* Grid moderno */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 0 0.5rem;
        }

        /* Cards modernas con glassmorphism */
        .card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-2xl);
          overflow: hidden;
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        }

        .card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border-color: rgba(255, 255, 255, 0.3);
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          }
        }

        /* Imagen de la card */
        .card__img {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: transform 0.4s ease;
        }

        .card:hover .card__img {
          transform: scale(1.05);
        }

        /* Contenido de la card */
        .card__body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
        }

        .card__title {
          margin: 0;
          font-weight: 700;
          font-size: 1.125rem;
          color: var(--white);
          line-height: 1.4;
        }

        .card__desc {
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .card__row {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          padding-top: 0.5rem;
        }

        .card__price {
          font-weight: 800;
          font-size: 1.25rem;
          background: linear-gradient(135deg, var(--amarillo) 0%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Botón moderno con gradiente corporativo */
        .btn-add {
          appearance: none;
          border: none;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--amarillo) 0%, #FFD700 100%);
          color: var(--white);
          padding: 0.75rem 1.25rem;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: var(--shadow-md);
          position: relative;
          overflow: hidden;
        }

        .btn-add::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .btn-add:hover::before {
          left: 100%;
        }

        .btn-add:active {
          transform: translateY(0);
          box-shadow: var(--shadow);
        }

        .btn-add:focus-visible {
          outline: 2px solid var(--white);
          outline-offset: 2px;
        }

        /* Estilos del modal */
        .modal {
          display: none;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          animation: fadeIn 0.3s ease-in-out;
        }

        .modal-content {
          background-color: #fff;
          margin: 15% auto;
          padding: 0;
          border-radius: 12px;
          width: 90%;
          max-width: 400px;
          position: relative;
          animation: slideIn 0.3s ease-out;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;
          position: absolute;
          top: 10px;
          right: 15px;
          cursor: pointer;
          z-index: 1001;
        }

        .close:hover,
        .close:focus {
          color: #000;
          text-decoration: none;
        }

        .modal-body {
          padding: 30px 20px;
          text-align: center;
        }

        .modal-icon {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .modal-body h3 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 24px;
        }

        .modal-body p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { 
            transform: translateY(-50px);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Estilos para contenedor de agregar al carrito */
        .add-to-cart-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 10px;
        }

        .add-to-cart-label {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          text-align: center;
        }

        .burger-options {
          display: flex;
          gap: 8px;
        }

        .burger-options .btn-add {
          flex: 1;
          padding: 8px 12px;
          font-size: 14px;
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          border: none;
          border-radius: 6px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .burger-options .btn-add:hover {
          background: linear-gradient(135deg, #ee5a24, #ff6b6b);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
        }

        .burger-options .btn-add:active {
          transform: translateY(0);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .modal-content {
            width: 95%;
            margin: 20% auto;
          }
          
          .modal-body {
            padding: 25px 15px;
          }
          
          .modal-icon {
            font-size: 40px;
          }
          
          .modal-body h3 {
            font-size: 20px;
          }

          .burger-options {
            flex-direction: row;
            gap: 6px;
          }

          .burger-options .btn-add {
            padding: 10px 12px;
            font-size: 16px;
          }
        }

        /* Estilos para modal de promociones */
        .promo-modal-content {
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
        }

        /* Asegurar que el modal de promociones se muestre correctamente */
        #promoModal {
          display: none;
          position: fixed;
          z-index: 1001;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          animation: fadeIn 0.3s ease-in-out;
        }

        #promoModal.show {
          display: block;
        }

        .burger-selection {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 10px;
          margin: 20px 0;
        }

        .burger-option {
          padding: 10px;
          border: 2px solid #ddd;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: white;
        }

        .burger-option:hover {
          border-color: #ff6b6b;
          background: #fff5f5;
        }

        .burger-option.selected {
          border-color: #ff6b6b;
          background: #ff6b6b;
          color: white;
        }

        .burger-option.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .selected-burgers {
          margin: 20px 0;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }

        .selected-burgers h4 {
          margin: 0 0 10px 0;
          color: #333;
          font-size: 16px;
        }

        .selected-burgers ul {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .selected-burgers li {
          padding: 5px 0;
          color: #555;
          font-size: 14px;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 20px;
        }

        .btn-confirm-promo {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-confirm-promo:hover:not(:disabled) {
          background: linear-gradient(135deg, #ee5a24, #ff6b6b);
          transform: translateY(-2px);
        }

        .btn-confirm-promo:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
        }

        .btn-cancel {
          background: #6c757d;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel:hover {
          background: #5a6268;
          transform: translateY(-1px);
        }

        /* Sección de redes sociales moderna */
        .social-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          color: var(--white);
          padding: 3rem 1.5rem;
          margin-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
        }

        .social-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
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
          flex-direction: row;
          gap: 1rem;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .social-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.25rem;
          border-radius: var(--radius-xl);
          text-decoration: none;
          color: var(--white);
          font-weight: 700;
          font-size: 0.875rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .social-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s;
        }

        .social-btn:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          box-shadow: var(--shadow-lg);
        }

        .social-btn:hover::before {
          left: 100%;
        }

        .social-btn:focus-visible {
          outline: 2px solid var(--white);
          outline-offset: 2px;
        }

        .social-btn svg {
          width: 1.25rem;
          height: 1.25rem;
          transition: transform 0.3s ease;
        }

        .social-btn:hover svg {
          transform: scale(1.1);
        }

        .address {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
          margin: 0;
          font-weight: 500;
        }

        /* Footer moderno */
        footer {
          margin-top: auto;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          color: var(--white);
          text-align: center;
          padding: 2rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.875rem;
          position: relative;
        }

        footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        }

        .footer-credits {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-credits .devby {
          color: rgba(255, 255, 255, 0.6);
          font-weight: 500;
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
          .promo-modal-content {
            max-width: 95%;
            margin: 20px auto;
          }
          
          .burger-selection {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
            gap: 8px;
          }
          
          .modal-actions {
            flex-direction: column;
          }
          
          .btn-confirm-promo,
          .btn-cancel {
            width: 100%;
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