export type CartItem = {
  id: string
  name: string
  image: string
  price: number
  quantity: number
  seller?: string
  category?: string
  description?: string
}

export const cartStorageKey = "hh-cart"
export const cartUpdatedEvent = "hh-cart-updated"

export function readCart() {
  if (typeof window === "undefined") return []

  const current = localStorage.getItem(cartStorageKey)
  if (current) {
    try {
      return JSON.parse(current) as CartItem[]
    } catch {
      localStorage.removeItem(cartStorageKey)
    }
  }

  const migrated = Array.from({ length: localStorage.length })
    .map((_, index) => localStorage.key(index))
    .filter((key): key is string => Boolean(key?.startsWith("hh-cart-")))
    .map((key) => localStorage.getItem(key))
    .filter((value): value is string => Boolean(value))
    .map((value) => {
      try {
        const item = JSON.parse(value) as CartItem
        return item.id ? item : null
      } catch {
        return null
      }
    })
    .filter((item) => item !== null)

  if (migrated.length) writeCart(migrated)
  return migrated
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem(cartStorageKey, JSON.stringify(items))
  window.dispatchEvent(new Event(cartUpdatedEvent))
}

export function addCartItem(item: CartItem) {
  const current = readCart()
  const existing = current.find((cartItem) => cartItem.id === item.id)
  const next = existing
    ? current.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
          : cartItem
      )
    : [...current, item]

  writeCart(next)
  return next
}

export function clearCart() {
  writeCart([])
}
