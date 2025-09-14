// Test script to verify Supabase connection and add sample data
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('Patient').select('count', { count: 'exact' });
    
    if (error) {
      console.error('Connection error:', error);
      return;
    }
    
    console.log('✅ Connection successful!');
    console.log(`Current patient count: ${data.length}`);
    
    // Try to add a sample patient
    console.log('\nTrying to add sample patient...');
    const { data: newPatient, error: insertError } = await supabase
      .from('Patient')
      .insert([{
        name: 'John Doe',
        age: 35,
        diagnosis: 'Hypertension',
        medications: ['Lisinopril', 'Metformin'],
        conditions: ['Diabetes', 'High Blood Pressure']
      }])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      if (insertError.code === '42501') {
        console.log('💡 This is likely due to Row Level Security (RLS) policies.');
        console.log('   You may need to:');
        console.log('   1. Use the service_role key instead of anon key');
        console.log('   2. Or disable RLS on the tables');
        console.log('   3. Or configure proper RLS policies');
      }
    } else {
      console.log('✅ Sample patient added:', newPatient);
    }
    
    // Try to add a sample doctor
    console.log('\nTrying to add sample doctor...');
    const { data: newDoctor, error: doctorError } = await supabase
      .from('Doctor')
      .insert([{
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@hospital.com',
        department: 'Cardiology',
        isOnDuty: true,
        phone: 1234567890
      }])
      .select()
      .single();
    
    if (doctorError) {
      console.error('❌ Doctor insert failed:', doctorError.message);
    } else {
      console.log('✅ Sample doctor added:', newDoctor);
    }
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
