// Database schemas and types for 0chrono medical platform

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
    planType: string;
  };
  allergies: Allergy[];
  medicalHistory: MedicalHistory[];
  createdAt: Date;
  updatedAt: Date;
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

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  licenseNumber: string;
  phone: string;
  email: string;
  department: string;
  isOnDuty: boolean;
  emergencyContact: boolean; // available for emergency calls
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
  static async createPatient(patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
    // Implementation would connect to actual database
    throw new Error('Database implementation required');
  }

  static async getPatient(id: string): Promise<Patient | null> {
    throw new Error('Database implementation required');
  }

  static async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    throw new Error('Database implementation required');
  }

  // OPD Summary operations
  static async createOPDSummary(summary: Omit<OPDSummary, 'id' | 'createdAt' | 'updatedAt'>): Promise<OPDSummary> {
    throw new Error('Database implementation required');
  }

  static async getOPDSummariesByPatient(patientId: string): Promise<OPDSummary[]> {
    throw new Error('Database implementation required');
  }

  static async updateOPDSummary(id: string, updates: Partial<OPDSummary>): Promise<OPDSummary> {
    throw new Error('Database implementation required');
  }

  // Prescription operations
  static async createPrescription(prescription: Omit<Prescription, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prescription> {
    throw new Error('Database implementation required');
  }

  static async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    throw new Error('Database implementation required');
  }

  // Appointment operations
  static async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> {
    throw new Error('Database implementation required');
  }

  static async getAppointmentsByDoctor(doctorId: string, date?: Date): Promise<Appointment[]> {
    throw new Error('Database implementation required');
  }

  // Emergency service operations
  static async createEmergencyRequest(request: Omit<EmergencyService, 'id' | 'requestedAt'>): Promise<EmergencyService> {
    throw new Error('Database implementation required');
  }

  static async getAvailableDoctors(serviceType: string): Promise<Doctor[]> {
    throw new Error('Database implementation required');
  }

  // Insurance operations
  static async createInsuranceClaim(claim: Omit<InsuranceClaim, 'id' | 'createdAt' | 'updatedAt'>): Promise<InsuranceClaim> {
    throw new Error('Database implementation required');
  }

  static async getInsuranceClaimsByPatient(patientId: string): Promise<InsuranceClaim[]> {
    throw new Error('Database implementation required');
  }

  // Voice command operations
  static async createVoiceCommand(command: Omit<VoiceCommand, 'id' | 'createdAt'>): Promise<VoiceCommand> {
    throw new Error('Database implementation required');
  }

  static async getVoiceCommandsByDoctor(doctorId: string): Promise<VoiceCommand[]> {
    throw new Error('Database implementation required');
  }
}
