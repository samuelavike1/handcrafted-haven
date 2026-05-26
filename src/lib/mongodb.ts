import { attachDatabasePool } from "@vercel/functions"
import { MongoClient, type Db, type MongoClientOptions } from "mongodb"

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017"
const dbName = process.env.MONGODB_DB ?? "handcrafted_haven"
const options: MongoClientOptions = {
  appName: "handcrafted-haven",
  maxIdleTimeMS: 5000,
}

type MongoCache = {
  client?: MongoClient
  promise?: Promise<MongoClient>
}

const globalForMongo = globalThis as typeof globalThis & {
  mongoCache?: MongoCache
}

const cache = globalForMongo.mongoCache ?? {}
globalForMongo.mongoCache = cache

export async function getMongoClient() {
  if (cache.client) return cache.client

  if (!cache.promise) {
    const client = new MongoClient(uri, options)
    attachDatabasePool(client)
    cache.promise = client.connect()
  }

  cache.client = await cache.promise
  return cache.client
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient()
  return client.db(dbName)
}
