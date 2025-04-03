import { prisma } from './prisma';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product?: {
    id: string;
    name: string;
    price: number;
    images: string[];
    isNew?: boolean;
    isBestseller?: boolean;
    isOnSale?: boolean;
    discountPercentage?: number;
  };
}

export interface Cart {
  id: string;
  items: CartItem[];
}

// Get cart from database if user is logged in, otherwise from local storage
export async function getCart(userId?: string): Promise<Cart | null> {
  // If user is logged in, get cart from database
  if (userId) {
    const dbCart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                isNew: true,
                isBestseller: true,
                isOnSale: true,
                discountPercentage: true,
              },
            },
          },
        },
      },
    });

    if (dbCart) {
      return dbCart;
    }

    // If no cart exists, create one
    const newCart = await prisma.cart.create({
      data: {
        userId,
      },
      include: {
        items: true,
      },
    });

    return newCart;
  }

  // If user is not logged in, get cart from local storage
  if (typeof window !== 'undefined') {
    const localCart = localStorage.getItem('cart');
    if (localCart) {
      return JSON.parse(localCart);
    }
  }

  return null;
}

// Add item to cart
export async function addToCart(
  productId: string,
  quantity: number = 1,
  userId?: string
): Promise<Cart> {
  // If user is logged in, add to database
  if (userId) {
    // Get user's cart or create if it doesn't exist
    let cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: true,
        },
      });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find((item) => item.productId === productId);

    if (existingItem) {
      // Update quantity
      await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });
    }

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                isNew: true,
                isBestseller: true,
                isOnSale: true,
                discountPercentage: true,
              },
            },
          },
        },
      },
    });

    return updatedCart!;
  }

  // If user is not logged in, add to local storage
  if (typeof window !== 'undefined') {
    let cart: Cart;
    const localCart = localStorage.getItem('cart');

    if (localCart) {
      cart = JSON.parse(localCart);
      const existingItemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );

      if (existingItemIndex !== -1) {
        // Update quantity
        cart.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        cart.items.push({
          id: `local-${Date.now()}`,
          productId,
          quantity,
        });
      }
    } else {
      // Create new cart
      cart = {
        id: `local-${Date.now()}`,
        items: [
          {
            id: `local-${Date.now()}-item`,
            productId,
            quantity,
          },
        ],
      };
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  }

  throw new Error('Failed to add item to cart');
}

// Update cart item quantity
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number,
  userId?: string
): Promise<Cart> {
  // If user is logged in, update in database
  if (userId) {
    // Verify the item belongs to the user's cart
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: itemId,
      },
      include: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      throw new Error('Cart item not found');
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      await prisma.cartItem.delete({
        where: {
          id: itemId,
        },
      });
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: {
          id: itemId,
        },
        data: {
          quantity,
        },
      });
    }

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
                isNew: true,
                isBestseller: true,
                isOnSale: true,
                discountPercentage: true,
              },
            },
          },
        },
      },
    });

    return updatedCart!;
  }

  // If user is not logged in, update in local storage
  if (typeof window !== 'undefined') {
    const localCart = localStorage.getItem('cart');

    if (!localCart) {
      throw new Error('Cart not found');
    }

    const cart: Cart = JSON.parse(localCart);
    const itemIndex = cart.items.findIndex((item) => item.id === itemId);

    if (itemIndex === -1) {
      throw new Error('Cart item not found');
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0