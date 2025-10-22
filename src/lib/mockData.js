// Datos de prueba para desarrollo local
export const mockProducts = [
  {
    _id: 'mock-product-1',
    name: 'Tilin Simple',
    category: 'burgers',
    variant: 'simple',
    price: 5000,
    description: 'Pan, salsa moketa, carne, queso cheddar x2, chimichurri',
    available: true,
    image: null,
    imageUrl: null,
    displayPrice: '$5.000'
  },
  {
    _id: 'mock-product-2',
    name: 'Tilin Doble',
    category: 'burgers',
    variant: 'double',
    price: 7000,
    description: 'Pan, salsa moketa, doble carne, queso cheddar x2, chimichurri',
    available: true,
    image: null,
    imageUrl: null,
    displayPrice: '$7.000'
  },
  {
    _id: 'mock-product-3',
    name: 'Pizza Margherita',
    category: 'pizzas',
    price: 12000,
    description: 'Salsa de tomate, mozzarella, albahaca fresca',
    available: true,
    image: null,
    imageUrl: null,
    displayPrice: '$12.000'
  }
]

export const mockPromotions = [
  {
    _id: 'mock-promotion-1',
    name: 'Promo 2 Hamburguesas Simples',
    price: 8000,
    quantity: 2,
    productType: 'burgers',
    description: 'Dos hamburguesas simples por el precio especial',
    active: true,
    image: null,
    imageUrl: null,
    displayPrice: '$8.000'
  },
  {
    _id: 'mock-promotion-2',
    name: 'Promo 2 Hamburguesas Dobles',
    price: 14000,
    quantity: 2,
    productType: 'burgers',
    description: 'Dos hamburguesas dobles por el precio especial',
    active: true,
    image: null,
    imageUrl: null,
    displayPrice: '$14.000'
  }
]
