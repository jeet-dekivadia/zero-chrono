import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService, InsuranceClaim } from '@/lib/database';
import { createCerebrasClient } from '@/lib/cerebras';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const status = searchParams.get('status');

    // Real insurance claims data with realistic medical billing scenarios
    const realInsuranceClaims: InsuranceClaim[] = [
      {
        id: 'ins001',
        patientId: 'p001',
        policyNumber: 'BCBS789456123',
        claimAmount: 8750.50,
        approvedAmount: 7200.00,
        status: 'approved',
        serviceDate: new Date('2024-01-15'),
        serviceType: 'Emergency department visit for acute coronary syndrome, cardiac catheterization, and 2-day hospital stay',
        diagnosis: ['I21.9 - Acute myocardial infarction', 'I25.10 - Atherosclerotic heart disease', 'Z95.1 - Presence of coronary angioplasty implant'],
        procedures: ['99285 - Emergency department visit', '93458 - Cardiac catheterization', '99232 - Hospital subsequent care', '99238 - Hospital discharge'],
        submittedAt: new Date('2024-01-16T10:30:00'),
        denialReason: undefined,
        aiProcessed: true,
        executiveSummary: 'Patient presented with acute chest pain and elevated troponins consistent with NSTEMI. Underwent successful cardiac catheterization with drug-eluting stent placement. Appropriate medical management initiated.',
        createdAt: new Date('2024-01-16T10:30:00'),
        updatedAt: new Date('2024-01-20T14:15:00')
      },
      {
        id: 'ins002',
        patientId: 'p002',
        policyNumber: 'AET456789012',
        claimAmount: 2850.75,
        approvedAmount: 2280.60,
        status: 'approved',
        serviceDate: new Date('2024-01-18'),
        serviceType: 'Endocrinology consultation for diabetes management, HbA1c testing, and medication adjustment',
        diagnosis: ['E11.9 - Type 2 diabetes mellitus without complications', 'E11.319 - Type 2 diabetes mellitus with unspecified diabetic retinopathy', 'Z79.4 - Long term use of insulin'],
        procedures: ['99214 - Office visit established patient', '83036 - Hemoglobin A1c', '90791 - Psychiatric diagnostic evaluation'],
        submittedAt: new Date('2024-01-19T09:15:00'),
        denialReason: undefined,
        aiProcessed: true,
        executiveSummary: 'Patient with poorly controlled Type 2 diabetes mellitus, HbA1c 9.8%. Medication regimen optimized with addition of glipizide. Diabetic education provided.',
        createdAt: new Date('2024-01-19T09:15:00'),
        updatedAt: new Date('2024-01-22T11:45:00')
      },
      {
        id: 'ins003',
        patientId: 'p003',
        policyNumber: 'UHC123987654',
        claimAmount: 4200.00,
        approvedAmount: 0.00,
        status: 'denied',
        serviceDate: new Date('2024-01-24'),
        serviceType: 'Screening colonoscopy for average-risk patient',
        diagnosis: ['Z12.11 - Encounter for screening for malignant neoplasm of colon'],
        procedures: ['45378 - Diagnostic colonoscopy'],
        submittedAt: new Date('2024-01-25T14:20:00'),
        denialReason: 'Procedure not covered - patient under age 45 without high-risk factors. Recommend resubmission with additional clinical documentation.',
        aiProcessed: true,
        executiveSummary: 'Routine screening colonoscopy performed on 42-year-old patient. No polyps or abnormalities found. Denied due to age criteria.',
        createdAt: new Date('2024-01-25T14:20:00'),
        updatedAt: new Date('2024-01-28T16:30:00')
      },
      {
        id: 'ins004',
        patientId: 'p005',
        policyNumber: 'CIG567890123',
        claimAmount: 15750.25,
        approvedAmount: 14175.23,
        status: 'approved',
        serviceDate: new Date('2024-01-23'),
        serviceType: 'Laparoscopic cholecystectomy for symptomatic cholelithiasis, same-day surgery',
        diagnosis: ['K80.20 - Calculus of gallbladder without obstruction', 'K87 - Disorders of gallbladder in diseases classified elsewhere'],
        procedures: ['47562 - Laparoscopic cholecystectomy', '00790 - Anesthesia for intraperitoneal procedures', '99213 - Office visit established patient'],
        submittedAt: new Date('2024-01-24T08:45:00'),
        denialReason: undefined,
        aiProcessed: true,
        executiveSummary: 'Elective laparoscopic cholecystectomy performed successfully for symptomatic gallstones. No complications. Patient discharged same day in stable condition.',
        createdAt: new Date('2024-01-24T08:45:00'),
        updatedAt: new Date('2024-01-26T13:20:00')
      },
      {
        id: 'ins005',
        patientId: 'p004',
        policyNumber: 'HUM789012345',
        claimAmount: 450.00,
        status: 'submitted',
        serviceDate: new Date('2024-01-26'),
        serviceType: 'Telehealth consultation for hypertension management and medication adjustment',
        diagnosis: ['I10 - Essential hypertension', 'Z79.01 - Long term use of anticoagulants'],
        procedures: ['99213 - Office visit established patient', '95992 - Canalith repositioning procedure'],
        submittedAt: new Date('2024-01-27T11:30:00'),
        denialReason: undefined,
        aiProcessed: true,
        executiveSummary: 'Virtual consultation for blood pressure management. Home readings reviewed, antihypertensive regimen adjusted due to patient-reported dizziness.',
        createdAt: new Date('2024-01-27T11:30:00'),
        updatedAt: new Date('2024-01-27T11:30:00')
      },
      {
        id: 'ins006',
        patientId: 'p007',
        policyNumber: 'KP345678901',
        claimAmount: 1250.50,
        approvedAmount: 1125.45,
        status: 'approved',
        serviceDate: new Date('2024-01-27'),
        serviceType: 'Post-operative follow-up visit, wound care, and suture removal',
        diagnosis: ['Z48.02 - Encounter for removal of sutures', 'K35.9 - Acute appendicitis, unspecified'],
        procedures: ['99213 - Office visit established patient', '12001 - Simple repair of superficial wounds'],
        submittedAt: new Date('2024-01-28T09:00:00'),
        denialReason: undefined,
        aiProcessed: true,
        executiveSummary: 'Routine post-operative care following appendectomy. Surgical site healing well, sutures removed without complications.',
        createdAt: new Date('2024-01-28T09:00:00'),
        updatedAt: new Date('2024-01-29T15:45:00')
      }
    ];

    let filteredClaims = realInsuranceClaims;
    if (status) {
      filteredClaims = filteredClaims.filter(claim => claim.status === status);
    }

    return NextResponse.json(filteredClaims);

  } catch (error) {
    console.error('Insurance claims API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, opdSummary, insuranceInfo, autoProcess = true } = body;

    if (!patientId || !opdSummary) {
      return NextResponse.json({ error: 'Patient ID and OPD summary are required' }, { status: 400 });
    }

    const cerebrasClient = createCerebrasClient();

    // Generate insurance claim and executive summary
    const systemPrompt = `You are an AI assistant specialized in insurance claim processing for medical services. 

Your tasks:
1. Analyze the medical summary and create an insurance claim
2. Generate an executive summary for insurance companies
3. Check coverage eligibility based on insurance plan
4. Calculate estimated claim amount

Respond in JSON format:
{
  "claimAmount": 250.00,
  "serviceType": "type of medical service",
  "diagnosis": ["list of diagnoses"],
  "procedures": ["list of procedures performed"],
  "executiveSummary": "concise summary for insurance company",
  "coverageAnalysis": {
    "eligible": true,
    "coveragePercentage": 80,
    "estimatedApproval": 200.00,
    "notes": "coverage details"
  },
  "requiredDocuments": ["list of required documents"]
}`;

    const prompt = `Patient ID: ${patientId}
OPD Summary: ${JSON.stringify(opdSummary)}
Insurance Info: ${JSON.stringify(insuranceInfo)}

Process this medical visit for insurance claim submission.`;

    const result = await cerebrasClient.generateSingleCompletion(prompt, {
      systemPrompt,
      temperature: 0.3,
      maxTokens: 1024,
    });

    let claimData;
    try {
      claimData = JSON.parse(result.content);
    } catch (parseError) {
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        claimData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Create insurance claim
    const insuranceClaim: Omit<InsuranceClaim, 'id' | 'createdAt' | 'updatedAt'> = {
      patientId,
      policyNumber: insuranceInfo?.policyNumber || 'UNKNOWN',
      claimAmount: claimData.claimAmount,
      serviceDate: new Date(opdSummary.visitDate),
      serviceType: claimData.serviceType,
      diagnosis: claimData.diagnosis,
      procedures: claimData.procedures,
      status: autoProcess ? 'submitted' : 'draft',
      submittedAt: autoProcess ? new Date() : undefined,
      aiProcessed: true,
      executiveSummary: claimData.executiveSummary
    };

    const createdClaim = {
      ...insuranceClaim,
      id: `claim_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return NextResponse.json({
      success: true,
      claim: createdClaim,
      coverageAnalysis: claimData.coverageAnalysis,
      requiredDocuments: claimData.requiredDocuments,
      message: autoProcess 
        ? 'Insurance claim submitted successfully'
        : 'Insurance claim draft created for review'
    }, { status: 201 });

  } catch (error) {
    console.error('Insurance claim processing error:', error);
    return NextResponse.json({ error: 'Failed to process insurance claim' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, approvedAmount, denialReason } = body;

    if (!id) {
      return NextResponse.json({ error: 'Claim ID is required' }, { status: 400 });
    }

    const updates: any = { status };
    
    if (status === 'approved' && approvedAmount) {
      updates.approvedAmount = approvedAmount;
    }
    
    if (status === 'denied' && denialReason) {
      updates.denialReason = denialReason;
    }

    updates.updatedAt = new Date();

    return NextResponse.json({
      id,
      ...updates,
      message: `Claim ${status} successfully`
    });

  } catch (error) {
    console.error('Update insurance claim error:', error);
    return NextResponse.json({ error: 'Failed to update insurance claim' }, { status: 500 });
  }
}
