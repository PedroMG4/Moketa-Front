'use client'

export default function ProductCard({ product, onAddToCart }) {
  const handleAddToCart = (variant = null) => {
    const productName = variant ? `${product.name} ${variant}` : product.name
    const productPrice = product.displayPrice
    
    onAddToCart(productName, productPrice)
  }

  const renderVariants = () => {
    if (product.category === 'burgers' && product.variant) {
      // Para hamburguesas con variantes (simple/doble)
      return (
        <div className="burger-options">
          <button 
            className="btn-add" 
            onClick={() => handleAddToCart('Simple')}
          >
            Simple
          </button>
          <button 
            className="btn-add" 
            onClick={() => handleAddToCart('Doble')}
          >
            Doble
          </button>
        </div>
      )
    }
    
    // Para productos sin variantes
    return (
      <button 
        className="btn-add" 
        onClick={() => handleAddToCart()}
      >
        Agregar al carrito
      </button>
    )
  }

  return (
    <article className="card">
      {product.imageUrl && (
        <img 
          className="card__img" 
          src={product.imageUrl} 
          alt={product.name}
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      )}
      <div className="card__body">
        <h3 className="card__title">{product.name}</h3>
        {product.description && (
          <p className="card__desc">{product.description}</p>
        )}
        <div className="card__row">
          <div className="card__price">{product.displayPrice}</div>
          <div className="add-to-cart-container">
            <span className="add-to-cart-label">Agregar al carrito</span>
            {renderVariants()}
          </div>
        </div>
      </div>
    </article>
  )
}

