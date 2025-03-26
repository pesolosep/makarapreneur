// models/NetworkingEvent.ts

// Type definitions for membership status
export enum MembershipStatus {
  FUNGSIONARIS = 'FUNGSIONARIS',
  NON_FUNGSIONARIS = 'NON_FUNGSIONARIS'
}

// HIPMI PT Universities/Origins as predefined options
export enum HipmiPtOrigin {
  UI = 'UNIVERSITAS_INDONESIA',
  IPB = 'IPB_UNIVERSITY',
  UGM = 'UNIVERSITAS_GADJAH_MADA',
  TELKOM = 'TELKOM_UNIVERSITY_BANDUNG',
  TRISAKTI = 'UNIVERSITAS_TRISAKTI',
  UNPAD = 'UNIVERSITAS_PADJAJARAN',
  ITB = 'INSTITUT_TEKNOLOGI_BANDUNG',
  UNPAS = 'UNIVERSITAS_PASUNDAN',
  ESA_UNGGUL = 'UNIVERSITAS_ESA_UNGGUL',
  UPN_JAKARTA = 'UNIVERSITAS_PEMBANGUNAN_NASIONAL_VETERAN_JAKARTA',
  UPI = 'UNIVERSITAS_PENDIDIKAN_INDONESIA',
  UII = 'UNIVERSITAS_ISLAM_INDONESIA',
  UIN = 'UNIVERSITAS_ISLAM_NEGERI_SYARIF_HIDAYATULLAH',
  UNJ = 'UNIVERSITAS_NEGERI_JAKARTA',
  UPN_YOGYAKARTA = 'UNIVERSITAS_PEMBANGUNAN_NASIONAL_VETERAN_YOGYAKARTA',
  UNDIP = 'UNIVERSITAS_DIPONEGORO',
  UNISBA = 'UNIVERSITAS_ISLAM_BANDUNG',
  UNPAR = 'UNIVERSITAS_KATOLIK_PARAHYANGAN',
  OTHER = 'OTHER'
}

// Type for handling origin with custom input options
export type HipmiPtOriginType = HipmiPtOrigin | string;

// Position/Jabatan options as predefined values
export enum Position {
  PENGURUS_INTI = 'PENGURUS_INTI',
  KEPALA_WAKIL_BIDANG = 'KEPALA_WAKIL_KEPALA_BIDANG',
  STAF = 'STAF',
  ANGGOTA = 'ANGGOTA',
  OTHER = 'OTHER'
}

// Type for handling position with custom input options
export type PositionType = Position | string;

// Expectations from the event as predefined values
export enum NetworkingExpectation {
  INDUSTRY_INSIGHT = 'INSIGHT_TO_THE_INDUSTRY',
  NETWORKING = 'NETWORKING_OPPORTUNITIES',
  INTERNSHIP = 'INTERNSHIP_OPPORTUNITIES',
  MENTORSHIP = 'FINDING_A_MENTOR',
  PROMOTION = 'PROMOTING_MY_BUSINESS',
  OTHER = 'OTHER'
}

// Type for handling expectations with custom input options
export type NetworkingExpectationType = NetworkingExpectation | string;

// Business fields as predefined values
export enum BusinessField {
  TECHNOLOGY = 'TECHNOLOGY',
  FINANCE = 'FINANCE',
  CREATIVE_DESIGN = 'CREATIVE_AND_DESIGN',
  RETAIL_ECOMMERCE = 'RETAIL_AND_ECOMMERCE',
  EDUCATION = 'EDUCATION',
  HEALTH_WELLNESS = 'HEALTH_AND_WELLNESS',
  OTHER = 'OTHER'
}

// Type for handling business fields with custom input options
export type BusinessFieldType = BusinessField | string;

// Business information
export interface Business {
  name: string;
  field: BusinessFieldType; // Now can be enum or custom string
  description: string;
  socialMedia?: string; // URLs to social media accounts
}

// Main participant model
export interface NetworkingParticipant {
  id: string;
  userId?: string; // Optional reference to user account if applicable
  
  // Personal Information
  name: string;
  whatsappNumber: string;
  position: Position;
  
  // Membership Information
  membershipStatus: MembershipStatus;
  hipmiPtOrigin?: HipmiPtOriginType; // Required if NON_FUNGSIONARIS, can be enum or custom string
  
  // Event Expectations
  expectations: NetworkingExpectationType[]; // Can be enum values or custom strings
  
  // Business Information
  hasBusiness: boolean;
  business?: Business | null; // Present if hasBusiness is true
  
  // Payment Information
  paymentAmount: number; // 75000 for FUNGSIONARIS, 145000 for NON_FUNGSIONARIS
  paymentProofURL?: string; // URL to uploaded proof of payment
  paymentDate?: Date;
  
  // Administrative Information
  registrationDate: Date;
  
  // System fields
  createdAt: Date;
  updatedAt?: Date;
}

// Helper function to calculate payment amount based on membership status
export function calculatePaymentAmount(membershipStatus: MembershipStatus): number {
  return membershipStatus === MembershipStatus.FUNGSIONARIS ? 75000 : 145000;
}

