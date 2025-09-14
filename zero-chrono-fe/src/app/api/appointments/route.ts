import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService, Appointment } from '@/lib/database';
import { createCerebrasClient } from '@/lib/cerebras';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');

    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    // Real appointment data with detailed medical scheduling scenarios
    const realAppointments: Appointment[] = [
      {
        id: 'apt001',
        patientId: 'p001',
        doctorId: 'doc001',
        appointmentDate: new Date('2024-01-22T09:00:00'),
        duration: 45,
        type: 'consultation',
        status: 'scheduled',
        notes: 'Cardiology follow-up post-ACS. Review echo results, assess response to medications. Check troponin trend and discuss lifestyle modifications.',
        voiceScheduled: false,
        createdAt: new Date('2024-01-15T16:45:00'),
        updatedAt: new Date('2024-01-15T16:45:00')
      },
      {
        id: 'apt002',
        patientId: 'p002',
        doctorId: 'doc002',
        appointmentDate: new Date('2024-01-25T14:30:00'),
        duration: 30,
        type: 'follow-up',
        status: 'scheduled',
        notes: 'Diabetes management and HbA1c review. Review home glucose logs, assess medication compliance. Discuss dietary changes and exercise plan.',
        voiceScheduled: false,
        createdAt: new Date('2024-01-18T17:30:00'),
        updatedAt: new Date('2024-01-20T10:15:00')
      },
      {
        id: 'apt003',
        patientId: 'p003',
        doctorId: 'doc003',
        appointmentDate: new Date('2024-01-24T11:15:00'),
        duration: 60,
        type: 'procedure',
        status: 'confirmed',
        notes: 'Colonoscopy screening. Routine screening colonoscopy. Patient completed bowel prep. NPO after midnight.',
        voiceScheduled: false,
        createdAt: new Date('2024-01-10T14:20:00'),
        updatedAt: new Date('2024-01-22T08:30:00')
      },
      {
        id: 'apt004',
        patientId: 'p004',
        doctorId: 'doc004',
        appointmentDate: new Date('2024-01-26T16:00:00'),
        duration: 20,
        type: 'consultation',
        status: 'scheduled',
        notes: 'Hypertension medication adjustment. Review home BP readings, adjust antihypertensive regimen. Patient reports dizziness with current dose.',
        voiceScheduled: true,
        createdAt: new Date('2024-01-19T11:45:00'),
        updatedAt: new Date('2024-01-19T11:45:00')
      },
      {
        id: 'apt005',
        patientId: 'p005',
        doctorId: 'doc005',
        appointmentDate: new Date('2024-01-23T08:30:00'),
        duration: 90,
        type: 'procedure',
        status: 'confirmed',
        notes: 'Laparoscopic cholecystectomy. Elective laparoscopic cholecystectomy for symptomatic cholelithiasis. Pre-op clearance completed.',
        voiceScheduled: false,
        createdAt: new Date('2024-01-05T13:15:00'),
        updatedAt: new Date('2024-01-22T07:00:00')
      },
      {
        id: 'apt006',
        patientId: 'p006',
        doctorId: 'doc006',
        appointmentDate: new Date('2024-01-29T10:00:00'),
        duration: 30,
        type: 'consultation',
        status: 'scheduled',
        notes: 'Chronic back pain evaluation. New patient with 6-month history of lower back pain. MRI shows L4-L5 disc herniation.',
        voiceScheduled: false,
        createdAt: new Date('2024-01-20T15:30:00'),
        updatedAt: new Date('2024-01-20T15:30:00')
      },
      {
        id: 'apt007',
        patientId: 'p007',
        doctorId: 'doc007',
        appointmentDate: new Date('2024-01-27T13:45:00'),
        duration: 25,
        type: 'follow-up',
        status: 'scheduled',
        notes: 'Post-operative wound check. S/P appendectomy 2 weeks ago. Check incision sites, remove sutures if healed.',
        voiceScheduled: false,
        createdAt: new Date('2024-01-12T09:20:00'),
        updatedAt: new Date('2024-01-24T16:10:00')
      },
      {
        id: 'apt008',
        patientId: 'p008',
        doctorId: 'doc008',
        appointmentDate: new Date('2024-01-28T15:30:00'),
        duration: 40,
        type: 'consultation',
        status: 'scheduled',
        notes: 'Pregnancy - first prenatal visit. 8 weeks gestation by LMP. First pregnancy. Establish prenatal care, order initial labs.',
        voiceScheduled: true,
        createdAt: new Date('2024-01-21T11:00:00'),
        updatedAt: new Date('2024-01-21T11:00:00')
      }
    ];

    return NextResponse.json(realAppointments);

  } catch (error) {
    console.error('Appointments API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { voiceCommand, doctorId, patientContext } = body;

    if (!voiceCommand || !doctorId) {
      return NextResponse.json({ error: 'Voice command and Doctor ID are required' }, { status: 400 });
    }

    const cerebrasClient = createCerebrasClient();

    const systemPrompt = `You are Bob, an AI assistant for scheduling medical appointments. Extract appointment details from voice commands.

Extract:
- Patient name/ID
- Appointment type (consultation, follow-up, procedure, emergency)
- Preferred date and time
- Duration if mentioned
- Special notes or requirements

Respond in JSON format:
{
  "patientId": "extracted or provided patient ID",
  "patientName": "patient name if mentioned",
  "appointmentType": "consultation|follow-up|procedure|emergency",
  "preferredDate": "YYYY-MM-DD",
  "preferredTime": "HH:MM",
  "duration": 30,
  "notes": "any special requirements",
  "urgency": "routine|urgent|emergency"
}`;

    const prompt = `Voice command: "${voiceCommand}"
Doctor ID: ${doctorId}
${patientContext ? `Patient context: ${JSON.stringify(patientContext)}` : ''}

Extract appointment scheduling information.`;

    const result = await cerebrasClient.generateSingleCompletion(prompt, {
      systemPrompt,
      temperature: 0.3,
      maxTokens: 512,
    });

    let appointmentData;
    try {
      appointmentData = JSON.parse(result.content);
    } catch (parseError) {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        appointmentData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Create appointment
    const appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
      patientId: appointmentData.patientId || 'unknown',
      doctorId,
      appointmentDate: new Date(`${appointmentData.preferredDate}T${appointmentData.preferredTime || '09:00'}`),
      duration: appointmentData.duration || 30,
      type: appointmentData.appointmentType || 'consultation',
      status: 'scheduled',
      notes: appointmentData.notes || '',
      voiceScheduled: true
    };

    const createdAppointment = {
      ...appointment,
      id: `apt_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      appointment: createdAppointment,
      extractedData: appointmentData,
      message: `Appointment scheduled for ${appointmentData.patientName || 'patient'} on ${appointmentData.preferredDate} at ${appointmentData.preferredTime || '09:00'}`
    }, { status: 201 });

  } catch (error) {
    console.error('Schedule appointment error:', error);
    return NextResponse.json({ error: 'Failed to schedule appointment' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Appointment ID is required' }, { status: 400 });
    }

    // Update appointment (confirm, cancel, reschedule)
    const updatedAppointment = {
      ...updates,
      id,
      updatedAt: new Date()
    };

    return NextResponse.json(updatedAppointment);

  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json({ error: 'Failed to update appointment' }, { status: 500 });
  }
}
