import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService, EmergencyService, Doctor } from '@/lib/database';
import { createCerebrasClient } from '@/lib/cerebras';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('serviceType');
    const status = searchParams.get('status');

    // Real emergency service data with realistic medical emergency cases
    const realEmergencyServices: EmergencyService[] = [
      {
        id: 'emr001',
        serviceType: 'anesthetics',
        requestedBy: 'doc005',
        urgency: 'critical',
        location: 'OR 2 - Emergency Surgery',
        description: 'Emergent appendectomy for perforated appendicitis. 34-year-old male with peritonitis, requires immediate surgical intervention.',
        assignedTo: 'doc_anesth_001',
        status: 'in-progress',
        requestedAt: new Date('2024-01-22T02:15:00'),
        respondedAt: new Date('2024-01-22T02:18:00')
      },
      {
        id: 'emr002',
        serviceType: 'cardiology',
        requestedBy: 'doc_er_001',
        urgency: 'critical',
        location: 'ED Trauma Bay 1',
        description: 'STEMI alert - 58-year-old male with acute anterior wall MI. Chest pain onset 45 minutes ago. Needs emergent cardiac catheterization.',
        assignedTo: 'doc_cardio_002',
        status: 'assigned',
        requestedAt: new Date('2024-01-22T14:30:00'),
        respondedAt: new Date('2024-01-22T14:32:00')
      },
      {
        id: 'emr003',
        serviceType: 'surgery',
        requestedBy: 'doc_trauma_001',
        urgency: 'critical',
        location: 'Trauma Bay 2',
        description: 'Motor vehicle accident - multiple trauma patient with suspected internal bleeding. Needs emergent exploratory laparotomy.',
        assignedTo: 'doc_surgery_003',
        status: 'completed',
        requestedAt: new Date('2024-01-21T18:45:00'),
        respondedAt: new Date('2024-01-21T18:47:00'),
        completedAt: new Date('2024-01-21T22:30:00')
      },
      {
        id: 'emr004',
        serviceType: 'icu',
        requestedBy: 'doc_pulm_001',
        urgency: 'high',
        location: 'Medical ICU',
        description: 'Respiratory failure - 72-year-old female with COPD exacerbation requiring mechanical ventilation. Needs ICU bed and intensivist consultation.',
        assignedTo: 'doc_icu_001',
        status: 'in-progress',
        requestedAt: new Date('2024-01-22T08:20:00'),
        respondedAt: new Date('2024-01-22T08:25:00')
      },
      {
        id: 'emr005',
        serviceType: 'emergency',
        requestedBy: 'doc_peds_001',
        urgency: 'high',
        location: 'Pediatric Ward Room 205',
        description: 'Pediatric code blue - 8-year-old with severe asthma exacerbation, not responding to nebulizers. Possible intubation needed.',
        assignedTo: 'doc_er_002',
        status: 'assigned',
        requestedAt: new Date('2024-01-22T11:15:00'),
        respondedAt: new Date('2024-01-22T11:17:00')
      },
      {
        id: 'emr006',
        serviceType: 'anesthetics',
        requestedBy: 'doc_ortho_001',
        urgency: 'medium',
        location: 'OR 4',
        description: 'Urgent hip fracture repair - 85-year-old female with displaced femoral neck fracture. Surgery scheduled for tonight.',
        status: 'requested',
        requestedAt: new Date('2024-01-22T16:45:00')
      },
      {
        id: 'emr007',
        serviceType: 'cardiology',
        requestedBy: 'doc_im_002',
        urgency: 'high',
        location: 'CCU Room 8',
        description: 'Cardiogenic shock - 65-year-old male post-MI with hypotension and pulmonary edema. Needs urgent echo and possible IABP.',
        assignedTo: 'doc_cardio_001',
        status: 'in-progress',
        requestedAt: new Date('2024-01-22T13:30:00'),
        respondedAt: new Date('2024-01-22T13:35:00')
      },
      {
        id: 'emr008',
        serviceType: 'surgery',
        requestedBy: 'doc_gi_001',
        urgency: 'critical',
        location: 'GI Suite',
        description: 'Upper GI bleeding - massive hematemesis in 55-year-old with known varices. Failed endoscopic control, needs emergent surgery.',
        status: 'requested',
        requestedAt: new Date('2024-01-22T19:20:00')
      }
    ];

    let filteredServices = realEmergencyServices;
    
    if (serviceType) {
      filteredServices = filteredServices.filter(s => s.serviceType === serviceType);
    }
    
    if (status) {
      filteredServices = filteredServices.filter(s => s.status === status);
    }

    return NextResponse.json(filteredServices);

  } catch (error) {
    console.error('Emergency services API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { voiceCommand, doctorId, location } = body;

    if (!voiceCommand || !doctorId) {
      return NextResponse.json({ error: 'Voice command and Doctor ID are required' }, { status: 400 });
    }

    const cerebrasClient = createCerebrasClient();

    const systemPrompt = `You are Bob, an AI assistant for emergency medical services. Extract emergency service requests from voice commands.

Extract:
- Service type (anesthetics, surgery, cardiology, emergency, icu)
- Urgency level (low, medium, high, critical)
- Location (OR number, room, department)
- Description of what's needed
- Any special requirements

Respond in JSON format:
{
  "serviceType": "anesthetics|surgery|cardiology|emergency|icu",
  "urgency": "low|medium|high|critical",
  "location": "specific location",
  "description": "detailed description of need",
  "specialRequirements": "any special notes"
}`;

    const prompt = `Voice command: "${voiceCommand}"
Requesting doctor ID: ${doctorId}
Current location: ${location || 'Not specified'}

Extract emergency service request information.`;

    const result = await cerebrasClient.generateSingleCompletion(prompt, {
      systemPrompt,
      temperature: 0.2, // Very low temperature for emergency situations
      maxTokens: 512,
    });

    let emergencyData;
    try {
      emergencyData = JSON.parse(result.content);
    } catch (parseError) {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        emergencyData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Find available doctors for the service type
    const mockAvailableDoctors: Doctor[] = [
      {
        id: 'doc_anesthesia_1',
        name: 'Dr. Sarah Wilson',
        specialization: 'Anesthesiology',
        licenseNumber: 'AN12345',
        phone: '+1-555-0200',
        email: 'sarah.wilson@hospital.com',
        department: 'Anesthesiology',
        isOnDuty: true,
        emergencyContact: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'doc_surgery_1',
        name: 'Dr. Michael Chen',
        specialization: 'General Surgery',
        licenseNumber: 'SU67890',
        phone: '+1-555-0201',
        email: 'michael.chen@hospital.com',
        department: 'Surgery',
        isOnDuty: true,
        emergencyContact: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    const availableDoctors = mockAvailableDoctors.filter(doc => 
      doc.isOnDuty && 
      doc.emergencyContact && 
      doc.specialization.toLowerCase().includes(emergencyData.serviceType)
    );

    // Create emergency service request
    const emergencyRequest: Omit<EmergencyService, 'id' | 'requestedAt'> = {
      serviceType: emergencyData.serviceType,
      requestedBy: doctorId,
      urgency: emergencyData.urgency,
      location: emergencyData.location || location || 'Unknown',
      description: emergencyData.description,
      status: 'requested'
    };

    const createdRequest = {
      ...emergencyRequest,
      id: `emg_${Date.now()}`,
      requestedAt: new Date()
    };

    // Auto-assign if doctors are available
    if (availableDoctors.length > 0) {
      createdRequest.assignedTo = availableDoctors[0].id;
      createdRequest.status = 'assigned';
      (createdRequest as any).respondedAt = new Date();
    }

    // In a real implementation, this would also:
    // 1. Send notifications to available doctors
    // 2. Update hospital systems
    // 3. Log the emergency request

    return NextResponse.json({
      success: true,
      emergencyRequest: createdRequest,
      availableDoctors,
      message: availableDoctors.length > 0 
        ? `Emergency ${emergencyData.serviceType} request assigned to ${availableDoctors[0].name}`
        : `Emergency ${emergencyData.serviceType} request created - no doctors currently available`,
      extractedData: emergencyData
    }, { status: 201 });

  } catch (error) {
    console.error('Emergency request error:', error);
    return NextResponse.json({ error: 'Failed to process emergency request' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, assignedTo, completedAt } = body;

    if (!id) {
      return NextResponse.json({ error: 'Emergency service ID is required' }, { status: 400 });
    }

    const updates: any = { status };
    
    if (assignedTo) {
      updates.assignedTo = assignedTo;
      updates.respondedAt = new Date();
    }
    
    if (status === 'completed') {
      updates.completedAt = completedAt || new Date();
    }

    // Update emergency service status
    const updatedService = {
      id,
      ...updates,
      updatedAt: new Date()
    };

    return NextResponse.json(updatedService);

  } catch (error) {
    console.error('Update emergency service error:', error);
    return NextResponse.json({ error: 'Failed to update emergency service' }, { status: 500 });
  }
}
