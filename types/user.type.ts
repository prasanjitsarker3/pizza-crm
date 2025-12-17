export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type Role = 'ADMIN' | 'STUDENT' | 'TEACHER'

export interface IUser {
  id: string
  name: string
  email: string
  phone: string | null
  password: string
  address: string | null
  birthDate: string // ISO date string
  gender: Gender
  emergencyContact: string | null
  bio: string | null
  avatar: string | null
  role: Role
  isPhoneVerify: boolean
  isEmailVerify: boolean
  isVerify: boolean
  isActive: boolean
  isBlock: boolean
  isDelete: boolean
  lastLogin: string | null
  totalLogin: number
  createdAt: string
  updatedAt: string
}
