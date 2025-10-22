'use client'

export default function PromotionCard({ promotion, onAddToCart }) {
  const handleAddToCart = () => {
    // Para promociones, necesitamos abrir el modal de selección
    onAddToCart(promotion.name, promotion.displayPrice, promotion.productType, promotion.quantity)
  }

  return (
    <article className="card">
      {promotion.imageUrl && (
        <img 
          className="card__img" 
          src={promotion.imageUrl} 
          alt={promotion.name}
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      )}
      <div className="card__body">
        <h3 className="card__title">{promotion.name}</h3>
        {promotion.description && (
          <p className="card__desc">{promotion.description}</p>
        )}
        <div className="card__row">
          <div className="card__price">{promotion.displayPrice}</div>
          <button 
            className="btn-add btn-promo" 
            onClick={handleAddToCart}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  )
}
