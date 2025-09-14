import { NextRequest, NextResponse } from 'next/server';
import { createCerebrasClient } from '@/lib/cerebras';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transcript, patientContext, action } = body;

    if (!transcript) {
      return NextResponse.json({ error: "Missing 'transcript' in request body" }, { status: 400 });
    }

    const cerebrasClient = createCerebrasClient();
    
    // Bob's system prompt for medical voice commands
    const systemPrompt = `You are Bob, an AI medical assistant. Your role is to help doctors and medical professionals by processing voice commands and updating patient records accordingly.

When a doctor gives you a voice command, analyze it and extract:
1. Patient information (name, ID if mentioned)
2. Medical action (prescription, diagnosis, scheduling, etc.)
3. Specific details (medication name, dosage, frequency, etc.)
4. Any additional context or notes

Always respond in JSON format with the following structure:
{
  "action": "prescription|diagnosis|schedule|emergency|note",
  "patient": {
    "name": "patient name",
    "id": "patient ID if available"
  },
  "details": {
    // specific details based on action type
  },
  "summary": "human readable summary of what was processed",
  "confidence": 0.95 // confidence score 0-1
}

For prescriptions, include: medication, dosage, frequency, duration, notes
For diagnoses, include: condition, severity, notes
For scheduling, include: appointment_type, date, time, duration
For emergencies, include: service_type, urgency, location
For notes, include: content, category

Be precise and only extract information that is clearly stated in the voice command.`;

    const prompt = `Voice command: "${transcript}"
${patientContext ? `Patient context: ${JSON.stringify(patientContext)}` : ''}
${action ? `Expected action type: ${action}` : ''}

Process this voice command and respond with the appropriate JSON structure.`;

    const result = await cerebrasClient.generateSingleCompletion(prompt, {
      systemPrompt,
      temperature: 0.3, // Lower temperature for more consistent structured output
      maxTokens: 1024,
    });

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(result.content);
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = result.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    return NextResponse.json({
      success: true,
      data: parsedResponse,
      model: result.model,
      originalTranscript: transcript,
    });

  } catch (error) {
    console.error('Voice API error:', error);
    return NextResponse.json({ 
      error: 'Failed to process voice command',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
