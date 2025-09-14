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

    // Fetch all patients from Supabase
    const patients = await DatabaseService.getAllPatients();
    return NextResponse.json(patients);

  } catch (error) {
    console.error('Patients API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields based on the Supabase schema
    const requiredFields = ['name'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Create new patient with schema-compliant data
    const patientData: Omit<Patient, 'id'> = {
      name: body.name,
      age: body.age || null,
      diagnosis: body.diagnosis || null,
      lab: body.lab || null,
      medications: body.medications || null,
      conditions: body.conditions || null
    };

    const newPatient = await DatabaseService.createPatient(patientData);

    return NextResponse.json(newPatient, { status: 201 });

  } catch (error) {
    console.error('Create patient error:', error);
    return NextResponse.json({ error: 'Failed to create patient' }, { status: 500 });
  }
}
