import mongoose from 'mongoose'

let connection: Promise<typeof mongoose> | null = null

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MongoDB is not configured')
  if (mongoose.connection.readyState === 1) return mongoose
  if (!connection) {
    connection = mongoose.connect(uri, { serverSelectionTimeoutMS: 8000, maxPoolSize: 10 })
      .catch((error: unknown) => {
        connection = null
        throw error
      })
  }
  return connection
}

export function databaseConnected() {
  return mongoose.connection.readyState === 1
}
