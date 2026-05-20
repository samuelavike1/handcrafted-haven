import { images } from "@/lib/images"

export const categories = [
  {
    name: "Ceramics",
    slug: "ceramics",
    count: "1,240 pieces",
    image: images.categoryPottery,
    description: "Wheel-thrown vessels, tableware, and sculptural clay.",
  },
  {
    name: "Textiles",
    slug: "textiles",
    count: "614 pieces",
    image: images.categoryTextiles,
    description: "Woven throws, linen goods, natural dyes, and heirloom cloth.",
  },
  {
    name: "Woodwork",
    slug: "woodwork",
    count: "832 pieces",
    image: images.categoryWoodworking,
    description: "Live-edge boards, carved objects, furniture, and home goods.",
  },
  {
    name: "Jewelry",
    slug: "jewelry",
    count: "480 pieces",
    image: images.categoryJewelry,
    description: "Small-batch metalwork, gemstones, and wearable keepsakes.",
  },
]

export const products = [
  {
    id: "moonlight-vase",
    name: "Moonlight Speckled Vase",
    seller: "Studio Elara",
    sellerLocation: "Tuscany, Italy",
    price: 124,
    rating: 4.9,
    reviews: 124,
    category: "Ceramics",
    image: images.productVase,
    badge: "Editor pick",
    materials: ["Stoneware", "Lead-free glaze", "Local clay"],
    description:
      "A tactile stoneware vase with iron-rich speckling and a satin glaze, made in small batches for collectors who value quiet, sculptural forms.",
  },
  {
    id: "organic-cloud-throw",
    name: "Organic Cloud Throw",
    seller: "Heritage Weaves",
    sellerLocation: "Portland, Oregon",
    price: 185,
    rating: 4.8,
    reviews: 91,
    category: "Textiles",
    image: images.categoryTextiles,
    badge: "Best seller",
    materials: ["Organic cotton", "Low-impact dye"],
    description:
      "A handwoven throw with generous texture, made from organic cotton and finished by a family-run textile studio.",
  },
  {
    id: "walnut-board",
    name: "Live-Edge Walnut Board",
    seller: "Roots Woodshop",
    sellerLocation: "Bend, Oregon",
    price: 78,
    rating: 4.7,
    reviews: 63,
    category: "Woodwork",
    image: images.productWalnutTray,
    badge: "Limited run",
    materials: ["Reclaimed walnut", "Food-safe oil"],
    description:
      "A polished live-edge serving board shaped from reclaimed walnut and finished with food-safe oil.",
  },
  {
    id: "nordic-teapot",
    name: "Nordic Drip Teapot",
    seller: "Elena Volkov",
    sellerLocation: "Helsinki, Finland",
    price: 85,
    rating: 4.9,
    reviews: 78,
    category: "Ceramics",
    image: images.productTeapot,
    badge: "New",
    materials: ["Porcelain", "Bamboo handle"],
    description:
      "A luminous glazed teapot with a woven bamboo handle and a compact profile for daily rituals.",
  },
  {
    id: "hammered-cuff",
    name: "Hammered Copper Cuff",
    seller: "Fire & Forge",
    sellerLocation: "Santa Fe, New Mexico",
    price: 55,
    rating: 5.0,
    reviews: 42,
    category: "Jewelry",
    image: images.categoryJewelry,
    badge: "Giftable",
    materials: ["Recycled copper", "Natural patina"],
    description:
      "A hand-hammered copper cuff with an organic edge and warm patina that deepens over time.",
  },
  {
    id: "linen-napkin-set",
    name: "Pure Linen Napkin Set",
    seller: "Earth Bound",
    sellerLocation: "Asheville, North Carolina",
    price: 42,
    rating: 4.9,
    reviews: 36,
    category: "Textiles",
    image: images.categoryTextiles,
    badge: "Sustainable",
    materials: ["European flax linen", "Plant dye"],
    description:
      "A set of four soft linen napkins, cut and sewn in-house with a hand-dyed sage finish.",
  },
]

export const featuredSeller = {
  name: "Earth & Ember Ceramics",
  location: "Sedona, Arizona",
  rating: 4.9,
  reviews: 128,
  cover: images.categoryPottery,
  avatar: images.categoryWoodworking,
  story:
    "Founded in the heart of the red rocks, Earth & Ember is a celebration of desert clay, patient hands, and functional objects that carry a sense of place.",
}

export const storyPosts = [
  {
    id: "elena-rossi-studio",
    title: "Elena Rossi on the Poetry of Clay",
    excerpt:
      "Inside a hillside studio where clay, mineral glazes, and old-world firing traditions become everyday vessels.",
    category: "Maker Story",
    readTime: "6 min read",
    date: "Nov 12, 2024",
    image: images.categoryPottery,
  },
  {
    id: "arlo-finch-woodworking",
    title: "Where Trees Become Tables",
    excerpt:
      "A Vermont woodworker explains how salvaged walnut becomes heirloom boards and furniture with visible history.",
    category: "Behind the Craft",
    readTime: "8 min read",
    date: "Oct 28, 2024",
    image: images.categoryWoodworking,
  },
  {
    id: "heritage-weaves-story",
    title: "The Slow Textile Movement",
    excerpt:
      "Heritage Weaves is proving that soft goods can be luxurious, traceable, and responsibly made.",
    category: "Sustainability",
    readTime: "5 min read",
    date: "Oct 10, 2024",
    image: images.categoryTextiles,
  },
]
