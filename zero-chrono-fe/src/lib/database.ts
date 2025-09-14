// Database schemas and types for 0chrono medical platform
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create client with service role for server-side operations (bypasses RLS)
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Supabase schema interfaces matching the provided schema
export interface Patient {
  id: number;
  name: string | null;
  diagnosis: string | null;
  lab: string | null;
  medications: string[] | null;
  conditions: string[] | null;
  age: number | null;
}

export interface Doctor {
  id: number;
  created_at: string;
  name: string | null;
  phone: number | null;
  email: string | null;
  department: string | null;
  isOnDuty: boolean | null;
  emergencyContact: string | null;
  updatedAt: string | null;
}

export interface Allergy {
  id: string;
  patientId: string;
  allergen: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
  createdAt: Date;
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  condition: string;
  diagnosisDate: Date;
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
  createdAt: Date;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedAt: Date;
  status: 'active' | 'completed' | 'discontinued';
  refillsRemaining: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OPDSummary {
  id: string;
  patientId: string;
  doctorId: string;
  visitDate: Date;
  chiefComplaint: string;
  symptoms: string[];
  examination: string;
  diagnosis: string[];
  prescriptions: Prescription[];
  labOrders: LabOrder[];
  followUpInstructions: string;
  nextAppointment?: Date;
  voiceTranscript?: string;
  aiSummary: string;
  status: 'draft' | 'reviewed' | 'sent';
  createdAt: Date;
  updatedAt: Date;
}

export interface LabOrder {
  id: string;
  patientId: string;
  doctorId: string;
  testName: string;
  testCode: string;
  urgency: 'routine' | 'urgent' | 'stat';
  instructions?: string;
  orderedAt: Date;
  status: 'ordered' | 'collected' | 'processing' | 'completed';
  results?: LabResult[];
}

export interface LabResult {
  id: string;
  labOrderId: string;
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'abnormal' | 'critical';
  notes?: string;
  resultDate: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: Date;
  duration: number; // in minutes
  type: 'consultation' | 'follow-up' | 'procedure' | 'emergency';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  voiceScheduled: boolean; // true if scheduled via Bob
  createdAt: Date;
  updatedAt: Date;
}


export interface EmergencyService {
  id: string;
  serviceType: 'anesthetics' | 'surgery' | 'cardiology' | 'emergency' | 'icu';
  requestedBy: string; // doctor ID
  urgency: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  description: string;
  assignedTo?: string; // doctor ID
  status: 'requested' | 'assigned' | 'in-progress' | 'completed';
  requestedAt: Date;
  respondedAt?: Date;
  completedAt?: Date;
}

export interface InsuranceClaim {
  id: string;
  patientId: string;
  policyNumber: string;
  claimAmount: number;
  serviceDate: Date;
  serviceType: string;
  diagnosis: string[];
  procedures: string[];
  status: 'draft' | 'submitted' | 'under-review' | 'approved' | 'denied' | 'paid';
  submittedAt?: Date;
  approvedAmount?: number;
  denialReason?: string;
  aiProcessed: boolean;
  executiveSummary: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoiceCommand {
  id: string;
  doctorId: string;
  transcript: string;
  processedAction: any; // JSON object with extracted information
  confidence: number;
  status: 'processed' | 'pending-review' | 'approved' | 'rejected';
  relatedRecords: {
    type: 'patient' | 'prescription' | 'appointment' | 'emergency';
    id: string;
  }[];
  createdAt: Date;
  reviewedAt?: Date;
}

export interface ConversationSummary {
  id: string;
  patientId: string;
  doctorId: string;
  sessionDate: Date;
  fullTranscript: string;
  aiSummary: string;
  keyPoints: string[];
  actionItems: string[];
  insuranceRelevant: boolean;
  executiveSummary?: string; // for insurance companies
  privacyProcessed: boolean; // processed locally for privacy
  createdAt: Date;
}

// Database utility functions
export class DatabaseService {
  // Patient operations
  static async createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
    const { data, error } = await supabase
      .from('Patient')
      .insert([patient])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating patient:', error);
      throw new Error(`Failed to create patient: ${error.message}`);
    }
    
    return data;
  }

  static async getPatient(id: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from('Patient')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Patient not found
      }
      console.error('Error fetching patient:', error);
      throw new Error(`Failed to fetch patient: ${error.message}`);
    }
    
    return data;
  }

  static async getAllPatients(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('Patient')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching patients:', error);
      throw new Error(`Failed to fetch patients: ${error.message}`);
    }
    
    return data || [];
  }

  static async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    const { data, error } = await supabase
      .from('Patient')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating patient:', error);
      throw new Error(`Failed to update patient: ${error.message}`);
    }
    
    return data;
  }

  // Doctor operations
  static async createDoctor(doctor: Omit<Doctor, 'id' | 'created_at'>): Promise<Doctor> {
    const { data, error } = await supabase
      .from('Doctor')
      .insert([doctor])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating doctor:', error);
      throw new Error(`Failed to create doctor: ${error.message}`);
    }
    
    return data;
  }

  static async getDoctor(id: string): Promise<Doctor | null> {
    const { data, error } = await supabase
      .from('Doctor')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Doctor not found
      }
      console.error('Error fetching doctor:', error);
      throw new Error(`Failed to fetch doctor: ${error.message}`);
    }
    
    return data;
  }

  static async getAllDoctors(): Promise<Doctor[]> {
    const { data, error } = await supabase
      .from('Doctor')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error fetching doctors:', error);
      throw new Error(`Failed to fetch doctors: ${error.message}`);
    }
    
    return data || [];
  }

  static async getAvailableDoctors(serviceType?: string): Promise<Doctor[]> {
    let query = supabase
      .from('Doctor')
      .select('*')
      .eq('isOnDuty', true);
    
    if (serviceType) {
      query = query.eq('department', serviceType);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching available doctors:', error);
      throw new Error(`Failed to fetch available doctors: ${error.message}`);
    }
    
    return data || [];
  }

  // Note: The following methods are placeholders for future implementation
  // as they require additional tables not defined in the current schema
  
  // OPD Summary operations (requires OPDSummary table)
  static async createOPDSummary(summary: Omit<OPDSummary, 'id' | 'createdAt' | 'updatedAt'>): Promise<OPDSummary> {
    throw new Error('OPDSummary table not implemented in current schema');
  }

  static async getOPDSummariesByPatient(patientId: string): Promise<OPDSummary[]> {
    throw new Error('OPDSummary table not implemented in current schema');
  }

  static async updateOPDSummary(id: string, updates: Partial<OPDSummary>): Promise<OPDSummary> {
    throw new Error('OPDSummary table not implemented in current schema');
  }

  // Prescription operations (requires Prescription table)
  static async createPrescription(prescription: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prescription> {
    throw new Error('Prescription table not implemented in current schema');
  }

  static async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    throw new Error('Prescription table not implemented in current schema');
  }

  // Appointment operations (requires Appointment table)
  static async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    throw new Error('Appointment table not implemented in current schema');
  }

  static async getAppointmentsByDoctor(doctorId: string, date?: Date): Promise<Appointment[]> {
    throw new Error('Appointment table not implemented in current schema');
  }

  // Emergency service operations (requires EmergencyService table)
  static async createEmergencyRequest(request: Omit<EmergencyService, 'id' | 'requestedAt'>): Promise<EmergencyService> {
    throw new Error('EmergencyService table not implemented in current schema');
  }

  // Insurance operations (requires InsuranceClaim table)
  static async createInsuranceClaim(claim: Omit<InsuranceClaim, 'id' | 'createdAt' | 'updatedAt'>): Promise<InsuranceClaim> {
    throw new Error('InsuranceClaim table not implemented in current schema');
  }

  static async getInsuranceClaimsByPatient(patientId: string): Promise<InsuranceClaim[]> {
    throw new Error('InsuranceClaim table not implemented in current schema');
  }

  // Voice command operations (requires VoiceCommand table)
  static async createVoiceCommand(command: Omit<VoiceCommand, 'id' | 'createdAt'>): Promise<VoiceCommand> {
    throw new Error('VoiceCommand table not implemented in current schema');
  }

  static async getVoiceCommandsByDoctor(doctorId: string): Promise<VoiceCommand[]> {
    throw new Error('VoiceCommand table not implemented in current schema');
  }
}
