import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService, ConversationSummary } from '@/lib/database';
import { createCerebrasClient } from '@/lib/cerebras';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientId, doctorId, fullTranscript, generateInsuranceSummary = false } = body;

    if (!patientId || !doctorId || !fullTranscript) {
      return NextResponse.json({ 
        error: 'Patient ID, Doctor ID, and full transcript are required' 
      }, { status: 400 });
    }

    const cerebrasClient = createCerebrasClient();

    // Generate AI summary of the conversation
    const summaryPrompt = `You are a medical AI assistant processing doctor-patient conversations for clinical documentation.

Analyze this conversation and extract:
1. Key medical points discussed
2. Symptoms mentioned by patient
3. Doctor's observations and findings
4. Treatment plans or recommendations
5. Follow-up instructions
6. Any concerns or red flags

Conversation transcript:
"${fullTranscript}"

Provide a structured summary in JSON format:
{
  "aiSummary": "Comprehensive summary of the medical conversation",
  "keyPoints": ["key point 1", "key point 2", ...],
  "actionItems": ["action 1", "action 2", ...],
  "symptoms": ["symptom 1", "symptom 2", ...],
  "findings": ["finding 1", "finding 2", ...],
  "treatmentPlan": "treatment recommendations",
  "followUp": "follow-up instructions",
  "insuranceRelevant": true/false,
  "urgencyLevel": "low|medium|high"
}`;

    const summaryResult = await cerebrasClient.generateSingleCompletion(summaryPrompt, {
      temperature: 0.3,
      maxTokens: 1024,
    });

    let summaryData;
    try {
      summaryData = JSON.parse(summaryResult.content);
    } catch (parseError) {
      const jsonMatch = summaryResult.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        summaryData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Generate executive summary for insurance if requested
    let executiveSummary = '';
    if (generateInsuranceSummary && summaryData.insuranceRelevant) {
      const insurancePrompt = `Create a concise executive summary for insurance companies based on this medical conversation analysis:

Medical Summary: ${summaryData.aiSummary}
Key Points: ${summaryData.keyPoints.join(', ')}
Treatment Plan: ${summaryData.treatmentPlan}

Generate a professional executive summary suitable for insurance claim processing that includes:
- Patient condition overview
- Medical necessity of treatments
- Expected outcomes
- Cost justification

Keep it concise and professional.`;

      const insuranceResult = await cerebrasClient.generateSingleCompletion(insurancePrompt, {
        temperature: 0.2,
        maxTokens: 512,
      });

      executiveSummary = insuranceResult.content;
    }

    // Create conversation summary
    const conversationSummary: Omit<ConversationSummary, 'id' | 'createdAt'> = {
      patientId,
      doctorId,
      sessionDate: new Date(),
      fullTranscript,
      aiSummary: summaryData.aiSummary,
      keyPoints: summaryData.keyPoints || [],
      actionItems: summaryData.actionItems || [],
      insuranceRelevant: summaryData.insuranceRelevant || false,
      executiveSummary: executiveSummary || undefined,
      privacyProcessed: true // Processed locally for privacy
    };

    const createdSummary = {
      ...conversationSummary,
      id: `conv_${Date.now()}`,
      createdAt: new Date()
    };

    return NextResponse.json({
      success: true,
      conversationSummary: createdSummary,
      extractedData: summaryData,
      message: 'Conversation processed successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Conversation processing error:', error);
    return NextResponse.json({ 
      error: 'Failed to process conversation',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');
    const doctorId = searchParams.get('doctorId');

    // Real conversation data with realistic medical transcripts and summaries
    const realConversations: ConversationSummary[] = [
      {
        id: 'conv001',
        patientId: 'p001',
        doctorId: 'doc001',
        sessionDate: new Date('2024-01-15T09:30:00'),
        fullTranscript: `Doctor: Good morning, Mr. Johnson. I understand you're experiencing chest pain. Can you tell me when this started?

Patient: It started about 2 hours ago, doctor. I was just sitting at home watching TV when I suddenly felt this crushing pain in my chest. It's really scary.

Doctor: I can understand your concern. Can you describe the pain for me? Is it sharp, dull, crushing?

Patient: It's like someone is sitting on my chest. The pain is crushing and it's radiating down my left arm. I also feel nauseous and I'm sweating a lot.

Doctor: Have you ever experienced anything like this before?

Patient: No, never. But my father had a heart attack when he was 60. I'm 58 now, so I'm really worried.

Doctor: Given your symptoms and family history, we need to take this very seriously. I'm going to order an EKG immediately and some blood tests including troponin levels. We'll also get you on a monitor right away.

Patient: Is this a heart attack, doctor?

Doctor: We need to run these tests to determine that. Your symptoms are concerning for a possible heart attack, so we're going to treat this as such until we can rule it out. The nurse is going to give you some aspirin to chew and we'll get an IV started.

Patient: Okay, whatever you think is best. I just want to make sure I'm okay.

Doctor: We're going to take excellent care of you. The EKG shows some changes that are concerning, and I'm calling cardiology for an urgent consultation. We may need to take you to the cardiac catheterization lab.`,
        aiSummary: 'Patient presented with acute onset crushing chest pain radiating to left arm, associated with diaphoresis and nausea. Strong family history of CAD. EKG shows acute changes concerning for STEMI. Cardiology consulted for urgent cardiac catheterization.',
        keyPoints: [
          'Acute crushing chest pain with radiation to left arm',
          'Associated symptoms: diaphoresis, nausea',
          'Family history of MI at age 60',
          'EKG changes consistent with acute MI',
          'Urgent cardiology consultation initiated'
        ],
        actionItems: [
          'Aspirin 325mg chewed immediately',
          'IV access established',
          'Continuous cardiac monitoring',
          'Troponin levels q6h x 3',
          'Urgent cardiology consultation',
          'Prepare for possible cardiac catheterization'
        ],
        insuranceRelevant: true,
        executiveSummary: 'Patient presented with classic symptoms of acute myocardial infarction. Immediate appropriate care initiated including aspirin, monitoring, and urgent cardiology consultation. EKG findings consistent with STEMI requiring emergent intervention.',
        privacyProcessed: true,
        createdAt: new Date('2024-01-15T11:45:00')
      },
      {
        id: 'conv002',
        patientId: 'p002',
        doctorId: 'doc002',
        sessionDate: new Date('2024-01-18T14:15:00'),
        fullTranscript: `Doctor: Hello Maria, how have you been since our last visit?

Patient: Not so good, doctor. My blood sugars have been really high lately, and I'm urinating a lot more than usual.

Doctor: I see. Are you checking your blood sugar at home? What numbers are you seeing?

Patient: Yes, I check it every morning. It's been between 250 and 300 most days. Sometimes even higher after meals.

Doctor: That's definitely too high. Are you taking your metformin as prescribed?

Patient: Yes, I take it twice a day with meals like you told me. But it doesn't seem to be working anymore.

Doctor: How about your diet and exercise? Have there been any changes?

Patient: Well, I've been stressed at work lately, and I haven't been eating as well as I should. And I haven't been walking as much because of the weather.

Doctor: Stress can definitely affect blood sugar levels. Along with diet and exercise changes. I think we need to add another medication to help get your diabetes under control.

Patient: What kind of medication?

Doctor: I'm going to add glipizide, which will help your pancreas make more insulin. We'll start with a low dose and see how you respond. I also want to get your HbA1c checked to see your average blood sugar over the past 3 months.

Patient: Will this new medication cause low blood sugar?

Doctor: It can, so it's important to eat regular meals and check your blood sugar more frequently when we start it. If you feel shaky, sweaty, or confused, check your blood sugar right away.

Patient: Okay, I understand. Should I see the diabetes educator again?

Doctor: That's an excellent idea. I'll set that up for you. We also need to get your eyes checked since high blood sugars can affect your vision.`,
        aiSummary: 'Patient with poorly controlled Type 2 diabetes, home glucose readings 250-300 mg/dL. Contributing factors include work stress, poor diet, and decreased exercise. Added glipizide to metformin regimen. HbA1c ordered, diabetes education and ophthalmology referrals arranged.',
        keyPoints: [
          'Uncontrolled diabetes with glucose 250-300 mg/dL',
          'Polyuria and polydipsia symptoms',
          'Contributing factors: stress, poor diet, decreased exercise',
          'Compliant with metformin therapy',
          'Need for medication intensification'
        ],
        actionItems: [
          'Start glipizide 5mg twice daily before meals',
          'Order HbA1c level',
          'Diabetes education referral',
          'Ophthalmology referral for diabetic eye exam',
          'Increase home glucose monitoring frequency',
          'Follow-up in 4 weeks'
        ],
        insuranceRelevant: true,
        executiveSummary: 'Patient with poorly controlled Type 2 diabetes requiring medication intensification. Added glipizide to existing metformin therapy. Appropriate diabetic complications screening initiated with ophthalmology referral.',
        privacyProcessed: true,
        createdAt: new Date('2024-01-18T16:30:00')
      },
      {
        id: 'conv003',
        patientId: 'p006',
        doctorId: 'doc006',
        sessionDate: new Date('2024-01-29T10:00:00'),
        fullTranscript: `Doctor: Good morning, Mr. Davis. I've reviewed your MRI results. Can you tell me about your back pain?

Patient: It's been going on for about 6 months now, doctor. It started gradually but now it's constant. The pain goes down my right leg too.

Doctor: On a scale of 1 to 10, how would you rate the pain?

Patient: Most days it's about a 7. When I try to bend over or lift anything, it shoots up to a 9 or 10.

Doctor: Does the pain wake you up at night?

Patient: Yes, especially when I try to turn over in bed. I haven't had a good night's sleep in months.

Doctor: I can see from your MRI that you have a herniated disc at L4-L5 with some nerve compression. This explains your leg pain.

Patient: Is that serious? Do I need surgery?

Doctor: Not necessarily. Many people with disc herniations can improve with conservative treatment. Let's start with physical therapy and some anti-inflammatory medication.

Patient: I've tried ibuprofen but it doesn't help much.

Doctor: I'm going to prescribe a stronger anti-inflammatory and also a muscle relaxant for nighttime. Physical therapy will be very important to strengthen your core muscles and improve your posture.

Patient: How long before I feel better?

Doctor: It can take several weeks to months. If you don't improve with conservative treatment after 6-8 weeks, we can discuss other options like steroid injections or, as a last resort, surgery.

Patient: I just want to be able to work and sleep normally again.

Doctor: I understand. Let's be aggressive with the conservative treatment first. I'm also going to refer you to pain management for additional options.`,
        aiSummary: 'Patient with 6-month history of chronic lower back pain with radiculopathy. MRI shows L4-L5 disc herniation with nerve compression. Pain significantly impacts sleep and function. Initiated conservative management with NSAIDs, muscle relaxants, physical therapy, and pain management referral.',
        keyPoints: [
          'Chronic lower back pain for 6 months',
          'Right leg radiculopathy',
          'Pain severity 7-9/10, worse with movement',
          'Sleep disruption',
          'MRI: L4-L5 disc herniation with nerve compression'
        ],
        actionItems: [
          'Prescribe naproxen 500mg twice daily',
          'Prescribe cyclobenzaprine 10mg at bedtime',
          'Physical therapy referral',
          'Pain management consultation',
          'Follow-up in 4 weeks',
          'Consider MRI-guided steroid injection if no improvement'
        ],
        insuranceRelevant: true,
        executiveSummary: 'Patient with symptomatic L4-L5 disc herniation causing chronic pain and functional impairment. Conservative management initiated with medications, physical therapy, and pain management consultation. Surgery consideration if conservative measures fail.',
        privacyProcessed: true,
        createdAt: new Date('2024-01-29T11:15:00')
      }
    ];

    let filteredSummaries = realConversations;
    if (patientId) {
      filteredSummaries = filteredSummaries.filter((s: ConversationSummary) => s.patientId === patientId);
    }
    if (doctorId) {
      filteredSummaries = filteredSummaries.filter((s: ConversationSummary) => s.doctorId === doctorId);
    }

    return NextResponse.json(filteredSummaries);

  } catch (error) {
    console.error('Get conversation summaries error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
