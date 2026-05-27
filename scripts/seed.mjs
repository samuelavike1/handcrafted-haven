import { randomBytes, scryptSync } from "crypto"
import { existsSync, readFileSync } from "fs"
import { MongoClient } from "mongodb"


if (existsSync(".env")) {
  for (const line of readFileSync(".env", "utf8").split(/\r?\n/)) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2]
  }
}

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017"
const dbName = process.env.MONGODB_DB ?? "handcrafted_haven"
const demoPassword = "Password123!"

const sellers = [
  {
    id: "seller-earth-ember",
    name: "Avery Stone",
    email: "seller@haven.test",
    role: "seller",
    studioName: "Earth & Ember Ceramics",
    location: "Sedona, Arizona",
    specialties: ["Ceramics", "Stoneware", "Tableware"],
    rating: 4.9,
    reviews: 318,
    story:
      "Earth & Ember creates small-batch ceramic objects from desert clay, slow firing, and functional forms designed for everyday rituals.",
  },
  {
    id: "seller-heritage-weaves",
    name: "Mina Park",
    email: "weaves@haven.test",
    role: "seller",
    studioName: "Heritage Weaves Co.",
    location: "Portland, Oregon",
    specialties: ["Textiles", "Natural dyes", "Home linens"],
    rating: 4.8,
    reviews: 246,
    story:
      "Heritage Weaves Co. produces soft goods from organic cotton, linen, wool, and low-impact dyes with a focus on practical heirloom pieces.",
  },
  {
    id: "seller-roots-relic",
    name: "Jon Bell",
    email: "woodshop@haven.test",
    role: "seller",
    studioName: "Roots & Relic Studio",
    location: "Bend, Oregon",
    specialties: ["Woodwork", "Jewelry", "Reclaimed materials"],
    rating: 4.9,
    reviews: 201,
    story:
      "Roots & Relic Studio turns reclaimed hardwood, recycled metals, and natural stone into useful objects, keepsakes, and small-batch accessories.",
  },
]

const users = [
  {
    id: "buyer-demo",
    name: "Maya Collector",
    email: "buyer@haven.test",
    role: "buyer",
    savedProductIds: ["desert-moon-mug", "organic-cloud-throw"],
    shippingAddress: {
      city: "Boise",
      state: "Idaho",
      country: "United States",
    },
  },
  ...sellers,
  {
    id: "admin-demo",
    name: "Admin User",
    email: "admin@haven.test",
    role: "admin",
  },
]

const reviewAuthors = [
  "Maya C.",
  "Elliot R.",
  "Priya S.",
  "Noah W.",
  "Grace L.",
  "Sam T.",
]

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex")
  return {
    passwordSalt: salt,
    passwordHash: scryptSync(password, salt, 64).toString("hex"),
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function imageUrl(keywords, lock) {
  return `https://loremflickr.com/900/700/${encodeURIComponent(keywords)}?lock=${lock}`
}

function reviewsFor(productName, rating, seed) {
  return Array.from({ length: 3 }).map((_, index) => ({
    id: `${slugify(productName)}-review-${index + 1}`,
    author: reviewAuthors[(seed + index) % reviewAuthors.length],
    rating: Math.max(4, Math.min(5, Number((rating - index * 0.1).toFixed(1)))),
    title: ["Beautifully made", "Exactly as described", "Worth the wait"][
      index
    ],
    comment: [
      "The materials feel thoughtful and the finish looks even better in person.",
      "Careful packaging, clear craftsmanship, and a piece that feels personal.",
      "A useful handmade object with the kind of detail mass-produced goods miss.",
    ][index],
    createdAt: new Date(Date.UTC(2026, 3, 8 + seed + index)).toISOString(),
  }))
}

function product({
  name,
  seller,
  price,
  category,
  keywords,
  lock,
  materials,
  description,
  rating,
  reviews,
  stock,
  badge = "",
  status = "Active",
}) {
  return {
    id: slugify(name),
    name,
    seller: seller.studioName,
    sellerId: seller.id,
    sellerLocation: seller.location,
    price,
    rating,
    reviews,
    reviewItems: reviewsFor(name, rating, lock % 12),
    category,
    image: imageUrl(keywords, lock, category),
    imageSource: "LoremFlickr keyword image search",
    badge,
    materials,
    description,
    stock,
    status,
  }
}

const [earthEmber, heritageWeaves, rootsRelic] = sellers

const products = [
  product({
    name: "Desert Moon Mug",
    seller: earthEmber,
    price: 42,
    category: "Ceramics",
    keywords: "handmade,ceramic,mug",
    lock: 101,
    materials: ["Stoneware", "Lead-free glaze", "Local clay"],
    description:
      "A wheel-thrown stoneware mug with a satin desert glaze and comfortable handle for daily coffee or tea.",
    rating: 4.9,
    reviews: 86,
    stock: 14,
    badge: "Best seller",
  }),
  product({
    name: "Speckled Breakfast Bowl",
    seller: earthEmber,
    price: 38,
    category: "Ceramics",
    keywords: "handmade,ceramic,bowl",
    lock: 102,
    materials: ["Stoneware", "Iron-rich glaze"],
    description:
      "A shallow breakfast bowl with iron speckles, made for oatmeal, fruit, rice bowls, and everyday meals.",
    rating: 4.8,
    reviews: 74,
    stock: 18,
  }),
  product({
    name: "Moonlight Speckled Vase",
    seller: earthEmber,
    price: 124,
    category: "Ceramics",
    keywords: "handmade,ceramic,vase",
    lock: 103,
    materials: ["Stoneware", "Lead-free glaze", "Local clay"],
    description:
      "A tactile stoneware vase with iron-rich speckling and a satin glaze, made in small batches for collectors.",
    rating: 4.9,
    reviews: 124,
    stock: 7,
    badge: "Editor pick",
  }),
  product({
    name: "Sage Pour-Over Dripper",
    seller: earthEmber,
    price: 58,
    category: "Ceramics",
    keywords: "ceramic,coffee,dripper",
    lock: 104,
    materials: ["Porcelain", "Matte glaze"],
    description:
      "A handmade ceramic pour-over dripper with clean drainage and a soft sage glaze.",
    rating: 4.7,
    reviews: 52,
    stock: 9,
  }),
  product({
    name: "Handbuilt Incense Holder",
    seller: earthEmber,
    price: 32,
    category: "Ceramics",
    keywords: "ceramic,incense,holder",
    lock: 105,
    materials: ["Stoneware", "Ash glaze"],
    description:
      "A compact ceramic incense holder with a carved channel and quiet glazed finish.",
    rating: 4.6,
    reviews: 39,
    stock: 22,
  }),
  product({
    name: "Ochre Serving Platter",
    seller: earthEmber,
    price: 96,
    category: "Ceramics",
    keywords: "ceramic,serving,plate",
    lock: 106,
    materials: ["Stoneware", "Food-safe glaze"],
    description:
      "A wide handmade serving platter glazed in warm ochre tones for bread, fruit, and shared meals.",
    rating: 4.8,
    reviews: 61,
    stock: 6,
  }),
  product({
    name: "Tiny Bud Vase Trio",
    seller: earthEmber,
    price: 64,
    category: "Ceramics",
    keywords: "ceramic,bud,vase",
    lock: 107,
    materials: ["Porcelain", "Clear glaze"],
    description:
      "Three miniature bud vases made for clippings, dried stems, and small shelf arrangements.",
    rating: 4.9,
    reviews: 48,
    stock: 12,
  }),
  product({
    name: "Nordic Drip Teapot",
    seller: earthEmber,
    price: 85,
    category: "Ceramics",
    keywords: "ceramic,teapot,handmade",
    lock: 108,
    materials: ["Porcelain", "Bamboo handle"],
    description:
      "A luminous glazed teapot with a woven bamboo handle and a compact profile for daily rituals.",
    rating: 4.9,
    reviews: 78,
    stock: 2,
    badge: "Low stock",
    status: "Low stock",
  }),
  product({
    name: "Matte Clay Spoon Rest",
    seller: earthEmber,
    price: 28,
    category: "Ceramics",
    keywords: "ceramic,spoon,rest",
    lock: 109,
    materials: ["Stoneware", "Matte glaze"],
    description:
      "A small kitchen spoon rest with a low profile, hand-shaped edge, and easy-clean glaze.",
    rating: 4.7,
    reviews: 35,
    stock: 20,
  }),
  product({
    name: "Ritual Candle Cup",
    seller: earthEmber,
    price: 46,
    category: "Ceramics",
    keywords: "ceramic,candle,cup",
    lock: 110,
    materials: ["Stoneware", "Soy wax", "Cotton wick"],
    description:
      "A reusable ceramic candle cup poured with clean soy wax and designed to become a small vessel afterward.",
    rating: 4.8,
    reviews: 57,
    stock: 13,
  }),
  product({
    name: "Organic Cloud Throw",
    seller: heritageWeaves,
    price: 185,
    category: "Textiles",
    keywords: "handwoven,blanket,textile",
    lock: 201,
    materials: ["Organic cotton", "Low-impact dye"],
    description:
      "A handwoven throw with generous texture, made from organic cotton and finished by a family-run textile studio.",
    rating: 4.8,
    reviews: 91,
    stock: 10,
    badge: "Best seller",
  }),
  product({
    name: "Plant-Dyed Linen Napkins",
    seller: heritageWeaves,
    price: 52,
    category: "Textiles",
    keywords: "linen,napkins,handmade",
    lock: 202,
    materials: ["European flax linen", "Plant dye"],
    description:
      "A set of four linen napkins dyed in small batches with soft botanical color variation.",
    rating: 4.9,
    reviews: 44,
    stock: 18,
  }),
  product({
    name: "Waffle Cotton Hand Towel",
    seller: heritageWeaves,
    price: 34,
    category: "Textiles",
    keywords: "cotton,towel,handwoven",
    lock: 203,
    materials: ["Organic cotton", "Natural thread"],
    description:
      "A textured hand towel woven in absorbent cotton for kitchens, baths, and guest spaces.",
    rating: 4.7,
    reviews: 38,
    stock: 24,
  }),
  product({
    name: "Indigo Loom Pillow",
    seller: heritageWeaves,
    price: 76,
    category: "Textiles",
    keywords: "indigo,pillow,textile",
    lock: 204,
    materials: ["Cotton", "Natural indigo", "Down alternative insert"],
    description:
      "A structured pillow cover with natural indigo variation and a removable insert.",
    rating: 4.8,
    reviews: 63,
    stock: 11,
  }),
  product({
    name: "Hearth Runner",
    seller: heritageWeaves,
    price: 118,
    category: "Textiles",
    keywords: "woven,table,runner",
    lock: 205,
    materials: ["Linen", "Cotton warp"],
    description:
      "A long woven table runner with warm neutral striping for shared meals and seasonal tables.",
    rating: 4.8,
    reviews: 56,
    stock: 8,
  }),
  product({
    name: "Felted Wool Coasters",
    seller: heritageWeaves,
    price: 29,
    category: "Textiles",
    keywords: "wool,coasters,handmade",
    lock: 206,
    materials: ["Felted wool", "Natural dye"],
    description:
      "A set of six felted wool coasters with dense texture and subtle natural dye shifts.",
    rating: 4.6,
    reviews: 31,
    stock: 30,
  }),
  product({
    name: "Market Tote in Heavy Canvas",
    seller: heritageWeaves,
    price: 68,
    category: "Textiles",
    keywords: "canvas,tote,handmade",
    lock: 207,
    materials: ["Heavy cotton canvas", "Vegetable-tanned leather"],
    description:
      "A durable canvas market tote with reinforced handles and interior pocketing.",
    rating: 4.9,
    reviews: 72,
    stock: 15,
  }),
  product({
    name: "Checked Linen Apron",
    seller: heritageWeaves,
    price: 84,
    category: "Textiles",
    keywords: "linen,apron,handmade",
    lock: 208,
    materials: ["Washed linen", "Cotton ties"],
    description:
      "A cross-back linen apron cut for studio work, cooking, gardening, and daily utility.",
    rating: 4.8,
    reviews: 67,
    stock: 9,
  }),
  product({
    name: "Patchwork Quilt Panel",
    seller: heritageWeaves,
    price: 210,
    category: "Textiles",
    keywords: "patchwork,quilt,handmade",
    lock: 209,
    materials: ["Cotton remnants", "Linen backing"],
    description:
      "A wall-ready quilt panel composed from studio remnants and backed with sturdy linen.",
    rating: 4.9,
    reviews: 28,
    stock: 4,
    badge: "Limited run",
  }),
  product({
    name: "Soft Stripe Baby Blanket",
    seller: heritageWeaves,
    price: 92,
    category: "Textiles",
    keywords: "baby,blanket,textile",
    lock: 210,
    materials: ["Organic cotton", "Low-impact dye"],
    description:
      "A soft cotton baby blanket with gentle stripes and a washable woven finish.",
    rating: 4.9,
    reviews: 49,
    stock: 12,
  }),
  product({
    name: "Live-Edge Walnut Board",
    seller: rootsRelic,
    price: 78,
    category: "Woodwork",
    keywords: "wood,cutting,board",
    lock: 301,
    materials: ["Reclaimed walnut", "Food-safe oil"],
    description:
      "A polished live-edge serving board shaped from reclaimed walnut and finished with food-safe oil.",
    rating: 4.7,
    reviews: 63,
    stock: 8,
    badge: "Limited run",
  }),
  product({
    name: "Maple Coffee Scoop",
    seller: rootsRelic,
    price: 36,
    category: "Woodwork",
    keywords: "wooden,spoon,handmade",
    lock: 302,
    materials: ["Maple", "Beeswax finish"],
    description:
      "A carved maple scoop sized for coffee, tea, bath salts, or dry pantry goods.",
    rating: 4.8,
    reviews: 41,
    stock: 17,
  }),
  product({
    name: "Oak Entry Catchall",
    seller: rootsRelic,
    price: 64,
    category: "Woodwork",
    keywords: "wood,tray,handmade",
    lock: 303,
    materials: ["White oak", "Natural oil"],
    description:
      "A low oak tray for keys, watches, coins, and the everyday pieces that collect by the door.",
    rating: 4.8,
    reviews: 46,
    stock: 12,
  }),
  product({
    name: "Carved Salt Cellar",
    seller: rootsRelic,
    price: 48,
    category: "Woodwork",
    keywords: "wood,salt,cellar",
    lock: 304,
    materials: ["Cherry wood", "Brass pin"],
    description:
      "A small lidded salt cellar carved from cherry and finished with food-safe oil.",
    rating: 4.7,
    reviews: 37,
    stock: 16,
  }),
  product({
    name: "Walnut Book Stand",
    seller: rootsRelic,
    price: 88,
    category: "Woodwork",
    keywords: "wood,book,stand",
    lock: 305,
    materials: ["Walnut", "Brass hinge"],
    description:
      "A folding walnut book stand for cookbooks, tablets, sheet music, and display shelves.",
    rating: 4.9,
    reviews: 59,
    stock: 7,
  }),
  product({
    name: "Reclaimed Cedar Planter",
    seller: rootsRelic,
    price: 72,
    category: "Woodwork",
    keywords: "wood,planter,handmade",
    lock: 306,
    materials: ["Reclaimed cedar", "Outdoor-safe finish"],
    description:
      "A compact cedar planter made from reclaimed boards and sealed for balcony herbs or small greens.",
    rating: 4.6,
    reviews: 29,
    stock: 10,
  }),
  product({
    name: "Cherry Serving Spoons",
    seller: rootsRelic,
    price: 58,
    category: "Woodwork",
    keywords: "wooden,serving,spoons",
    lock: 307,
    materials: ["Cherry wood", "Beeswax"],
    description:
      "A pair of hand-shaped cherry serving spoons with smooth bowls and warm natural finish.",
    rating: 4.8,
    reviews: 50,
    stock: 14,
  }),
  product({
    name: "Minimal Wall Peg Rail",
    seller: rootsRelic,
    price: 116,
    category: "Woodwork",
    keywords: "wood,wall,peg,rail",
    lock: 308,
    materials: ["Ash", "Hidden mounting hardware"],
    description:
      "A simple ash peg rail for entryways, kitchens, studios, and flexible wall storage.",
    rating: 4.9,
    reviews: 33,
    stock: 6,
  }),
  product({
    name: "Turned Tealight Holders",
    seller: rootsRelic,
    price: 44,
    category: "Woodwork",
    keywords: "wood,candle,holder",
    lock: 309,
    materials: ["Mixed hardwood", "Natural oil"],
    description:
      "A set of three turned hardwood tealight holders with slight variations in tone and grain.",
    rating: 4.7,
    reviews: 42,
    stock: 19,
  }),
  product({
    name: "Small Walnut Keepsake Box",
    seller: rootsRelic,
    price: 132,
    category: "Woodwork",
    keywords: "wood,jewelry,box",
    lock: 310,
    materials: ["Walnut", "Maple lining"],
    description:
      "A small keepsake box with a fitted lid, maple lining, and room for jewelry or letters.",
    rating: 4.9,
    reviews: 26,
    stock: 5,
    badge: "Giftable",
  }),
  product({
    name: "Hammered Copper Cuff",
    seller: rootsRelic,
    price: 55,
    category: "Jewelry",
    keywords: "handmade,copper,bracelet",
    lock: 401,
    materials: ["Recycled copper", "Natural patina"],
    description:
      "A hand-hammered copper cuff with an organic edge and warm patina that deepens over time.",
    rating: 5,
    reviews: 42,
    stock: 6,
    badge: "Giftable",
  }),
  product({
    name: "River Stone Pendant",
    seller: rootsRelic,
    price: 74,
    category: "Jewelry",
    keywords: "stone,pendant,jewelry",
    lock: 402,
    materials: ["River stone", "Sterling silver"],
    description:
      "A smooth river stone pendant set in sterling silver with a simple everyday chain.",
    rating: 4.8,
    reviews: 31,
    stock: 9,
  }),
  product({
    name: "Forged Silver Stacking Ring",
    seller: rootsRelic,
    price: 68,
    category: "Jewelry",
    keywords: "silver,ring,handmade",
    lock: 403,
    materials: ["Sterling silver"],
    description:
      "A lightly forged sterling silver stacking ring with visible hammer texture.",
    rating: 4.9,
    reviews: 53,
    stock: 20,
  }),
  product({
    name: "Brass Arc Earrings",
    seller: rootsRelic,
    price: 49,
    category: "Jewelry",
    keywords: "brass,earrings,handmade",
    lock: 404,
    materials: ["Brass", "Sterling silver posts"],
    description:
      "Minimal brass arc earrings with brushed texture and sterling posts for comfortable wear.",
    rating: 4.7,
    reviews: 45,
    stock: 16,
  }),
  product({
    name: "Lapis Bead Bracelet",
    seller: rootsRelic,
    price: 62,
    category: "Jewelry",
    keywords: "beaded,bracelet,lapis",
    lock: 405,
    materials: ["Lapis lazuli", "Recycled silver"],
    description:
      "A lapis bead bracelet finished with recycled silver details and a secure clasp.",
    rating: 4.8,
    reviews: 38,
    stock: 11,
  }),
  product({
    name: "Tiny Pearl Threaders",
    seller: rootsRelic,
    price: 72,
    category: "Jewelry",
    keywords: "pearl,earrings,jewelry",
    lock: 406,
    materials: ["Freshwater pearl", "Gold fill"],
    description:
      "Lightweight pearl threader earrings with delicate movement and a refined handmade finish.",
    rating: 4.9,
    reviews: 47,
    stock: 13,
  }),
  product({
    name: "Turquoise Signet Ring",
    seller: rootsRelic,
    price: 118,
    category: "Jewelry",
    keywords: "turquoise,ring,jewelry",
    lock: 407,
    materials: ["Turquoise", "Sterling silver"],
    description:
      "A small turquoise signet ring set by hand in sterling silver with a softly brushed band.",
    rating: 4.8,
    reviews: 22,
    stock: 4,
    badge: "Limited run",
  }),
  product({
    name: "Mixed Metal Collar Necklace",
    seller: rootsRelic,
    price: 96,
    category: "Jewelry",
    keywords: "metal,necklace,handmade",
    lock: 408,
    materials: ["Brass", "Copper", "Sterling silver"],
    description:
      "A mixed metal collar necklace with layered warm tones and a hammered focal bar.",
    rating: 4.7,
    reviews: 34,
    stock: 7,
  }),
  product({
    name: "Enamel Dot Studs",
    seller: rootsRelic,
    price: 36,
    category: "Jewelry",
    keywords: "enamel,stud,earrings",
    lock: 409,
    materials: ["Copper enamel", "Sterling posts"],
    description:
      "Small enamel dot studs fired in jewel-tone colors and set on sterling posts.",
    rating: 4.6,
    reviews: 40,
    stock: 24,
  }),
  product({
    name: "Raw Quartz Charm",
    seller: rootsRelic,
    price: 58,
    category: "Jewelry",
    keywords: "quartz,charm,jewelry",
    lock: 410,
    materials: ["Raw quartz", "Gold fill"],
    description:
      "A raw quartz charm wrapped by hand and finished on a gold-filled jump ring.",
    rating: 4.8,
    reviews: 36,
    stock: 15,
  }),
]

const client = new MongoClient(uri)

try {
  await client.connect()
  const db = client.db(dbName)
  const now = new Date().toISOString()

  console.log(`Seeding MongoDB database: ${db.databaseName}`)

  await db.collection("sessions").deleteMany({})
  await db.collection("users").deleteMany({})
  await db.collection("products").deleteMany({})
  await db.collection("orders").deleteMany({})

  await db.collection("users").createIndex({ email: 1 }, { unique: true })
  await db.collection("products").createIndex({ id: 1 }, { unique: true })
  await db.collection("orders").createIndex({ id: 1 }, { unique: true })

  await db.collection("users").insertMany(
    users.map((user) => ({
      ...user,
      ...hashPassword(demoPassword),
      createdAt: now,
      updatedAt: now,
    }))
  )

  await db.collection("products").insertMany(
    products.map((seedProduct, index) => ({
      ...seedProduct,
      createdAt: new Date(Date.UTC(2026, 2, 1 + index)).toISOString(),
      updatedAt: now,
    }))
  )

  await db.collection("orders").insertOne({
    id: "order-demo-1001",
    buyerId: "buyer-demo",
    buyerEmail: "buyer@haven.test",
    status: "Processing",
    total: 227,
    items: [
      { productId: "desert-moon-mug", quantity: 1, price: 42 },
      { productId: "organic-cloud-throw", quantity: 1, price: 185 },
    ],
    createdAt: now,
    updatedAt: now,
  })

  const [userCount, productCount, orderCount] = await Promise.all([
    db.collection("users").countDocuments({}),
    db.collection("products").countDocuments({}),
    db.collection("orders").countDocuments({}),
  ])

  console.log(
    `Seeded ${users.length} users, ${products.length} products, and 1 order.`
  )
  console.log(
    `Verified counts in ${db.databaseName}: users=${userCount}, products=${productCount}, orders=${orderCount}.`
  )
  console.log("Demo password for all users: Password123!")
  console.log("Buyer: buyer@haven.test")
  console.log("Sellers: seller@haven.test, weaves@haven.test, woodshop@haven.test")
  console.log("Admin: admin@haven.test")
} finally {
  await client.close()
}
