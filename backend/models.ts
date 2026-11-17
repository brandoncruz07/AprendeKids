import mongoose, { Document, Model, Schema, Types } from 'mongoose'
import { Activity, WorldId } from './companion.js'

export interface AttemptRecord {
  t: number
  w: WorldId
  ok: boolean
  ms: number
  l: number
}

export interface KidRecord {
  id: string
  name: string
  age: number
  char: string
  stars: number
  coins: number
  acc: string[]
  bgs: string[]
  eqAcc: string
  bg: string
  attempts: AttemptRecord[]
  completedLevels: string[]
  aiEnabled: boolean
  voiceEnabled: boolean
  speechRate: number
}

export interface ParentAccountDocument extends Document {
  name: string
  email: string
  passwordHash: string
  kids: KidRecord[]
  legacyImported: boolean
  guardianConsentAt: Date
}

export interface SessionDocument extends Document {
  accountId: Types.ObjectId
  tokenHash: string
  expiresAt: Date
  reauthUntil?: Date
}

const AttemptSchema = new Schema<AttemptRecord>({
  t: { type: Number, required: true },
  w: { type: String, enum: ['letters', 'reading', 'numbers', 'dinosaurs', 'thinking'], required: true },
  ok: { type: Boolean, required: true },
  ms: { type: Number, min: 0, max: 3_600_000, required: true },
  l: { type: Number, min: 1, max: 10, required: true }
}, { _id: false })

const KidSchema = new Schema<KidRecord>({
  id: { type: String, required: true, maxlength: 64 },
  name: { type: String, required: true, trim: true, maxlength: 32 },
  age: { type: Number, min: 3, max: 8, required: true },
  char: { type: String, required: true, maxlength: 24 },
  stars: { type: Number, min: 0, max: 100_000, default: 0 },
  coins: { type: Number, min: 0, max: 100_000, default: 20 },
  acc: { type: [String], default: [] },
  bgs: { type: [String], default: [] },
  eqAcc: { type: String, default: '', maxlength: 24 },
  bg: { type: String, default: '', maxlength: 24 },
  attempts: { type: [AttemptSchema], default: [] },
  completedLevels: { type: [String], default: [] },
  aiEnabled: { type: Boolean, default: false },
  voiceEnabled: { type: Boolean, default: true },
  speechRate: { type: Number, min: 0.8, max: 1.2, default: 1 }
}, { _id: false, strict: true })

const ParentAccountSchema = new Schema<ParentAccountDocument>({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true, index: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  kids: { type: [KidSchema], default: [] },
  legacyImported: { type: Boolean, default: false },
  guardianConsentAt: { type: Date, required: true }
}, { timestamps: true })

const SessionSchema = new Schema<SessionDocument>({
  accountId: { type: Schema.Types.ObjectId, ref: 'ParentAccount', required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
  reauthUntil: { type: Date }
})
SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const ParentAccount = (mongoose.models.ParentAccount as Model<ParentAccountDocument> | undefined)
  ?? mongoose.model<ParentAccountDocument>('ParentAccount', ParentAccountSchema)
export const Session = (mongoose.models.Session as Model<SessionDocument> | undefined)
  ?? mongoose.model<SessionDocument>('Session', SessionSchema)

export type AllowedActivity = Activity
