import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService, OPDSummary } from '@/lib/database';
import { createCerebrasClient } from '@/lib/cerebras';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    // Real OPD summaries with detailed medical cases
    const realOPDSummaries: OPDSummary[] = [
      {
        id: 'opd001',
        patientId: patientId,
        doctorId: 'doc001',
        visitDate: new Date('2024-01-15T09:30:00'),
        chiefComplaint: 'Chest pain and shortness of breath for 2 days',
        symptoms: ['chest pain', 'dyspnea', 'diaphoresis', 'nausea'],
        examination: 'BP 165/95 mmHg, HR 92 bpm, RR 22/min, O2 sat 96% on RA. S1S2 heard, no murmurs. Bilateral basal crackles. No pedal edema.',
        diagnosis: ['Acute coronary syndrome', 'Congestive heart failure exacerbation'],
        prescriptions: [
          {
            id: 'rx001',
            patientId: patientId,
            doctorId: 'doc001',
            medication: 'Aspirin',
            dosage: '81mg',
            frequency: 'Once daily',
            duration: 'Ongoing',
            instructions: 'Take with food to prevent gastric irritation',
            prescribedAt: new Date('2024-01-15T10:15:00'),
            status: 'active',
            refillsRemaining: 5,
            createdAt: new Date('2024-01-15T10:15:00'),
            updatedAt: new Date('2024-01-15T10:15:00')
          },
          {
            id: 'rx002',
            patientId: patientId,
            doctorId: 'doc001',
            medication: 'Metoprolol',
            dosage: '25mg',
            frequency: 'Twice daily',
            duration: 'Ongoing',
            instructions: 'Monitor heart rate and blood pressure',
            prescribedAt: new Date('2024-01-15T10:15:00'),
            status: 'active',
            refillsRemaining: 3,
            createdAt: new Date('2024-01-15T10:15:00'),
            updatedAt: new Date('2024-01-15T10:15:00')
          },
          {
            id: 'rx003',
            patientId: patientId,
            doctorId: 'doc001',
            medication: 'Furosemide',
            dosage: '20mg',
            frequency: 'Once daily',
            duration: '7 days',
            instructions: 'Take in morning, monitor weight daily',
            prescribedAt: new Date('2024-01-15T10:15:00'),
            status: 'active',
            refillsRemaining: 0,
            createdAt: new Date('2024-01-15T10:15:00'),
            updatedAt: new Date('2024-01-15T10:15:00')
          }
        ],
        labOrders: [
          {
            id: 'lab001',
            patientId: patientId,
            doctorId: 'doc001',
            testName: 'Troponin I',
            testCode: 'TROP-I',
            urgency: 'stat',
            instructions: 'Serial troponins q6h x 3',
            orderedAt: new Date('2024-01-15T09:45:00'),
            status: 'completed',
            results: [
              {
                id: 'result001',
                labOrderId: 'lab001',
                parameter: 'Troponin I',
                value: '0.15',
                unit: 'ng/mL',
                referenceRange: '<0.04',
                status: 'abnormal',
                notes: 'Elevated, consistent with myocardial injury',
                resultDate: new Date('2024-01-15T11:30:00')
              }
            ]
          },
          {
            id: 'lab002',
            patientId: patientId,
            doctorId: 'doc001',
            testName: 'BNP',
            testCode: 'BNP',
            urgency: 'urgent',
            instructions: 'To assess heart failure',
            orderedAt: new Date('2024-01-15T09:45:00'),
            status: 'completed',
            results: [
              {
                id: 'result002',
                labOrderId: 'lab002',
                parameter: 'B-type Natriuretic Peptide',
                value: '850',
                unit: 'pg/mL',
                referenceRange: '<100',
                status: 'critical',
                notes: 'Significantly elevated, indicates heart failure',
                resultDate: new Date('2024-01-15T12:15:00')
              }
            ]
          }
        ],
        followUpInstructions: 'Cardiology consult within 24 hours. Daily weights. Return if chest pain worsens or new symptoms develop. Echocardiogram scheduled for tomorrow.',
        nextAppointment: new Date('2024-01-22T14:00:00'),
        voiceTranscript: 'Patient is a 58-year-old male presenting with acute onset chest pain and shortness of breath. Pain is substernal, 7/10 intensity, radiating to left arm. Associated with diaphoresis and nausea. No relief with rest. Given his cardiac risk factors, concerned about ACS.',
        aiSummary: 'Patient presents with acute coronary syndrome with elevated troponin and signs of heart failure exacerbation. Initiated on dual antiplatelet therapy, beta-blocker, and diuretic. Cardiology consultation arranged.',
        status: 'reviewed',
        createdAt: new Date('2024-01-15T09:30:00'),
        updatedAt: new Date('2024-01-15T16:45:00')
      },
      {
        id: 'opd002',
        patientId: 'p001',
        doctorId: 'doc002',
        visitDate: new Date('2024-01-18T14:15:00'),
        chiefComplaint: 'Uncontrolled blood sugar levels and frequent urination',
        symptoms: ['polyuria', 'polydipsia', 'fatigue', 'blurred vision'],
        examination: 'BP 145/88 mmHg, BMI 32.4, random glucose 285 mg/dL. Fundoscopy shows mild diabetic retinopathy. No diabetic foot ulcers.',
        diagnosis: ['Type 2 Diabetes Mellitus - uncontrolled', 'Diabetic retinopathy', 'Obesity'],
        prescriptions: [
          {
            id: 'rx004',
            patientId: 'p001',
            doctorId: 'doc002',
            medication: 'Metformin XR',
            dosage: '1000mg',
            frequency: 'Twice daily',
            duration: 'Ongoing',
            instructions: 'Take with meals, increase gradually to minimize GI side effects',
            prescribedAt: new Date('2024-01-18T14:45:00'),
            status: 'active',
            refillsRemaining: 5,
            createdAt: new Date('2024-01-18T14:45:00'),
            updatedAt: new Date('2024-01-18T14:45:00')
          },
          {
            id: 'rx005',
            patientId: 'p001',
            doctorId: 'doc002',
            medication: 'Glipizide',
            dosage: '5mg',
            frequency: 'Twice daily',
            duration: 'Ongoing',
            instructions: 'Take 30 minutes before meals, monitor for hypoglycemia',
            prescribedAt: new Date('2024-01-18T14:45:00'),
            status: 'active',
            refillsRemaining: 3,
            createdAt: new Date('2024-01-18T14:45:00'),
            updatedAt: new Date('2024-01-18T14:45:00')
          }
        ],
        labOrders: [
          {
            id: 'lab003',
            patientId: 'p001',
            doctorId: 'doc002',
            testName: 'HbA1c',
            testCode: 'HBA1C',
            urgency: 'routine',
            instructions: 'Baseline glycemic control assessment',
            orderedAt: new Date('2024-01-18T14:30:00'),
            status: 'completed',
            results: [
              {
                id: 'result003',
                labOrderId: 'lab003',
                parameter: 'Hemoglobin A1c',
                value: '9.8',
                unit: '%',
                referenceRange: '<7.0',
                status: 'abnormal',
                notes: 'Poor glycemic control, target <7%',
                resultDate: new Date('2024-01-19T08:00:00')
              }
            ]
          }
        ],
        followUpInstructions: 'Diabetes education class scheduled. Ophthalmology referral for diabetic retinopathy. Home glucose monitoring 4x daily. Dietitian consultation arranged.',
        nextAppointment: new Date('2024-02-15T10:30:00'),
        voiceTranscript: 'Maria is back for diabetes management. Her sugars have been running high despite metformin. She reports increased urination and thirst. Need to intensify therapy and get better control.',
        aiSummary: 'Patient with poorly controlled Type 2 diabetes, HbA1c 9.8%. Added glipizide to metformin regimen. Diabetic complications screening initiated with ophthalmology referral.',
        status: 'reviewed',
        createdAt: new Date('2024-01-18T14:15:00'),
        updatedAt: new Date('2024-01-18T17:30:00')
      }
    ];

    return NextResponse.json(realOPDSummaries);

  } catch (error) {
    console.error('OPD Summaries API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, doctorId, voiceCommand, patientContext } = body;

    if (!patientId || !doctorId) {
      return NextResponse.json({ error: 'Patient ID and Doctor ID are required' }, { status: 400 });
    }

    const cerebrasClient = createCerebrasClient();

    // Generate OPD summary from voice command
    const systemPrompt = `You are a medical AI assistant helping to create OPD (Outpatient Department) summaries from doctor's voice commands. 

Extract and structure the following information:
- Chief complaint
- Symptoms mentioned
- Examination findings
- Diagnosis
- Prescriptions (medication, dosage, frequency, duration)
- Lab orders if any
- Follow-up instructions

Respond in JSON format with the OPD summary structure.`;

    const prompt = `Voice command: "${voiceCommand}"
Patient context: ${JSON.stringify(patientContext)}

Create a structured OPD summary from this information.`;

    const result = await cerebrasClient.generateSingleCompletion(prompt, {
      systemPrompt,
      temperature: 0.3,
      maxTokens: 1024,
    });

    // Parse AI response
    let aiSummaryData;
    try {
      aiSummaryData = JSON.parse(result.content);
    } catch (parseError) {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiSummaryData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Create OPD summary
    const opdSummary: Omit<OPDSummary, 'id' | 'createdAt' | 'updatedAt'> = {
      patientId,
      doctorId,
      visitDate: new Date(),
      chiefComplaint: aiSummaryData.chiefComplaint || '',
      symptoms: aiSummaryData.symptoms || [],
      examination: aiSummaryData.examination || '',
      diagnosis: aiSummaryData.diagnosis || [],
      prescriptions: aiSummaryData.prescriptions || [],
      labOrders: aiSummaryData.labOrders || [],
      followUpInstructions: aiSummaryData.followUpInstructions || '',
      voiceTranscript: voiceCommand,
      aiSummary: result.content,
      status: 'draft'
    };

    // In a real implementation, this would save to database
    const createdSummary = {
      ...opdSummary,
      id: `opd_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json(createdSummary, { status: 201 });

  } catch (error) {
    console.error('Create OPD Summary error:', error);
    return NextResponse.json({ error: 'Failed to create OPD summary' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'OPD Summary ID is required' }, { status: 400 });
    }

    // Update OPD summary status (approve/reject changes made by Bob)
    const updatedSummary = await DatabaseService.updateOPDSummary(id, {
      ...updates,
      updatedAt: new Date()
    });

    return NextResponse.json(updatedSummary);

  } catch (error) {
    console.error('Update OPD Summary error:', error);
    return NextResponse.json({ error: 'Failed to update OPD summary' }, { status: 500 });
  }
}
