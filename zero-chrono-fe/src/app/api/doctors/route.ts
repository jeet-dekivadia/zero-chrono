import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService, Doctor } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('id');
    const onDutyOnly = searchParams.get('onDuty') === 'true';
    const department = searchParams.get('department');

    if (doctorId) {
      const doctor = await DatabaseService.getDoctor(doctorId);
      if (!doctor) {
        return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
      }
      return NextResponse.json(doctor);
    }

    if (onDutyOnly || department) {
      const availableDoctors = await DatabaseService.getAvailableDoctors(department || undefined);
      return NextResponse.json(availableDoctors);
    }

    // Fetch all doctors from Supabase
    const doctors = await DatabaseService.getAllDoctors();
    return NextResponse.json(doctors);

  } catch (error) {
    console.error('Doctors API error:', error);
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

    // Create new doctor with schema-compliant data
    const doctorData: Omit<Doctor, 'id' | 'created_at'> = {
      name: body.name,
      phone: body.phone || null,
      email: body.email || null,
      department: body.department || null,
      isOnDuty: body.isOnDuty || false,
      emergencyContact: body.emergencyContact || null,
      updatedAt: new Date().toISOString()
    };

    const newDoctor = await DatabaseService.createDoctor(doctorData);

    return NextResponse.json(newDoctor, { status: 201 });

  } catch (error) {
    console.error('Create doctor error:', error);
    return NextResponse.json({ error: 'Failed to create doctor' }, { status: 500 });
  }
}
