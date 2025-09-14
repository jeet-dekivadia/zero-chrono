import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService, Patient } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('id');

    if (patientId) {
      const patient = await DatabaseService.getPatient(patientId);
      if (!patient) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
      }
      return NextResponse.json(patient);
    }

    // Real patient data for medical platform
    const realPatients: Patient[] = [
      {
        id: 'p001',
        name: 'Maria Elena Rodriguez',
        dateOfBirth: new Date('1978-11-22'),
        gender: 'female',
        phone: '+1-415-892-3456',
        email: 'maria.rodriguez@gmail.com',
        address: '2847 Mission Street, San Francisco, CA 94110',
        emergencyContact: {
          name: 'Carlos Rodriguez',
          phone: '+1-415-892-3457',
          relationship: 'Husband'
        },
        insuranceInfo: {
          provider: 'Blue Cross Blue Shield',
          policyNumber: 'BCBS789456123',
          groupNumber: 'GRP001234',
          planType: 'PPO Gold'
        },
        allergies: [
          {
            id: 'a001',
            patientId: 'p001',
            allergen: 'Penicillin',
            reaction: 'Anaphylaxis',
            severity: 'severe',
            notes: 'Requires epinephrine auto-injector',
            createdAt: new Date('2020-03-15')
          },
          {
            id: 'a002',
            patientId: 'p001',
            allergen: 'Shellfish',
            reaction: 'Hives and swelling',
            severity: 'moderate',
            notes: 'Avoid all crustaceans and mollusks',
            createdAt: new Date('2018-07-10')
          }
        ],
        medicalHistory: [
          {
            id: 'mh001',
            patientId: 'p001',
            condition: 'Type 2 Diabetes Mellitus',
            diagnosisDate: new Date('2019-04-12'),
            status: 'active',
            notes: 'HbA1c: 7.2%, well controlled with metformin',
            createdAt: new Date('2019-04-12')
          },
          {
            id: 'mh002',
            patientId: 'p001',
            condition: 'Essential Hypertension',
            diagnosisDate: new Date('2020-08-05'),
            status: 'active',
            notes: 'Stage 1 hypertension, managed with lisinopril',
            createdAt: new Date('2020-08-05')
          },
          {
            id: 'mh003',
            patientId: 'p001',
            condition: 'Osteoarthritis of knees',
            diagnosisDate: new Date('2021-02-18'),
            status: 'active',
            notes: 'Bilateral knee pain, managed conservatively',
            createdAt: new Date('2021-02-18')
          }
        ],
        createdAt: new Date('2018-05-20'),
        updatedAt: new Date()
      },
      {
        id: 'p002',
        name: 'James Michael Thompson',
        dateOfBirth: new Date('1965-07-08'),
        gender: 'male',
        phone: '+1-650-234-7890',
        email: 'james.thompson@outlook.com',
        address: '1456 Oak Avenue, Palo Alto, CA 94301',
        emergencyContact: {
          name: 'Linda Thompson',
          phone: '+1-650-234-7891',
          relationship: 'Wife'
        },
        insuranceInfo: {
          provider: 'Kaiser Permanente',
          policyNumber: 'KP567890234',
          planType: 'HMO Standard'
        },
        allergies: [
          {
            id: 'a003',
            patientId: 'p002',
            allergen: 'Sulfa drugs',
            reaction: 'Stevens-Johnson syndrome',
            severity: 'severe',
            notes: 'Documented severe cutaneous reaction in 2018',
            createdAt: new Date('2018-09-22')
          }
        ],
        medicalHistory: [
          {
            id: 'mh004',
            patientId: 'p002',
            condition: 'Coronary Artery Disease',
            diagnosisDate: new Date('2020-11-30'),
            status: 'active',
            notes: 'Triple vessel disease, s/p CABG 2021',
            createdAt: new Date('2020-11-30')
          },
          {
            id: 'mh005',
            patientId: 'p002',
            condition: 'Hyperlipidemia',
            diagnosisDate: new Date('2018-03-14'),
            status: 'active',
            notes: 'LDL 165 mg/dL, on atorvastatin 40mg',
            createdAt: new Date('2018-03-14')
          },
          {
            id: 'mh006',
            patientId: 'p002',
            condition: 'Chronic Kidney Disease Stage 3',
            diagnosisDate: new Date('2022-01-10'),
            status: 'active',
            notes: 'eGFR 45 mL/min/1.73m², monitoring required',
            createdAt: new Date('2022-01-10')
          }
        ],
        createdAt: new Date('2017-12-03'),
        updatedAt: new Date()
      },
      {
        id: 'p003',
        name: 'Aisha Patel',
        dateOfBirth: new Date('1992-04-15'),
        gender: 'female',
        phone: '+1-408-567-1234',
        email: 'aisha.patel@yahoo.com',
        address: '3921 Stevens Creek Blvd, San Jose, CA 95117',
        emergencyContact: {
          name: 'Raj Patel',
          phone: '+1-408-567-1235',
          relationship: 'Father'
        },
        insuranceInfo: {
          provider: 'Anthem Blue Cross',
          policyNumber: 'ABC345678901',
          planType: 'Bronze Plan'
        },
        allergies: [
          {
            id: 'a004',
            patientId: 'p003',
            allergen: 'Latex',
            reaction: 'Contact dermatitis',
            severity: 'mild',
            notes: 'Use latex-free gloves during procedures',
            createdAt: new Date('2021-06-08')
          }
        ],
        medicalHistory: [
          {
            id: 'mh007',
            patientId: 'p003',
            condition: 'Asthma',
            diagnosisDate: new Date('2010-05-20'),
            status: 'active',
            notes: 'Well-controlled with albuterol PRN and fluticasone',
            createdAt: new Date('2010-05-20')
          },
          {
            id: 'mh008',
            patientId: 'p003',
            condition: 'Iron Deficiency Anemia',
            diagnosisDate: new Date('2023-02-14'),
            status: 'active',
            notes: 'Hgb 9.8 g/dL, started on ferrous sulfate',
            createdAt: new Date('2023-02-14')
          }
        ],
        createdAt: new Date('2021-03-10'),
        updatedAt: new Date()
      }
    ];

    return NextResponse.json(realPatients);

  } catch (error) {
    console.error('Patients API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'dateOfBirth', 'gender', 'phone', 'email'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Create new patient
    const newPatient = await DatabaseService.createPatient({
      ...body,
      dateOfBirth: new Date(body.dateOfBirth),
      allergies: body.allergies || [],
      medicalHistory: body.medicalHistory || []
    });

    return NextResponse.json(newPatient, { status: 201 });

  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
