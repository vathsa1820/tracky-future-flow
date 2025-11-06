import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const studyGoals = formData.get('studyGoals') as string || '';
    const examDates = formData.get('examDates') as string || '';

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Received file:', file.name, 'type:', file.type, 'size:', file.size);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Upload file to storage
    const fileName = `${Date.now()}-${file.name}`;
    const fileBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('timetables')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      
      let errorMessage = 'Failed to upload file';
      if (uploadError.message?.includes('exceeded') || uploadError.statusCode === '413') {
        errorMessage = 'File is too large. Please upload a file smaller than 25MB.';
      } else if (uploadError.message?.includes('mime')) {
        errorMessage = 'Invalid file type. Please upload a PDF or image file.';
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('File uploaded successfully:', uploadData.path);

    // Get the file URL for AI analysis
    const { data: { publicUrl } } = supabase.storage
      .from('timetables')
      .getPublicUrl(fileName);

    // Convert file to base64 for AI analysis
    const base64File = btoa(
      new Uint8Array(fileBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    const mimeType = file.type;

    // Call Lovable AI to analyze the timetable
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `You are an AI study planner assistant for engineering students. Analyze the provided timetable image and create a comprehensive, realistic daily study plan.

Your task:
1. Extract class schedules, subjects, and times from the timetable
2. Identify free time slots between classes
3. Create a balanced study plan that includes:
   - Study sessions for each subject (1-2 hours)
   - Short breaks (10-15 minutes)
   - Longer breaks for meals and exercise (30-60 minutes)
   - Review and practice time
   - Evening planning/journaling time

Important guidelines:
- Space out study sessions with breaks
- Don't schedule back-to-back intensive study sessions
- Include physical activity breaks
- Prioritize subjects based on difficulty and upcoming exams
- Keep study sessions realistic (1-2 hours max)
- Include time for rest and recovery`;

    const userPrompt = `Please analyze this timetable and create a personalized study plan.
${studyGoals ? `\nStudy Goals: ${studyGoals}` : ''}
${examDates ? `\nUpcoming Exams: ${examDates}` : ''}

Return a JSON array of study sessions with this structure:
[
  {
    "subject": "Subject name or activity type",
    "timeSlot": "HH:MM - HH:MM",
    "duration": "X hours/minutes",
    "activity": "Brief activity description",
    "priority": "high/medium/low",
    "description": "Detailed description of what to do"
  }
]

Create 6-8 sessions covering the full day from morning to evening.`;

    console.log('Calling Lovable AI for analysis...');

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64File}`
                }
              },
              {
                type: 'text',
                text: userPrompt
              }
            ]
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to analyze timetable with AI' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    console.log('AI response received');

    const aiMessage = aiData.choices[0].message.content;
    
    // Extract JSON from the response
    let studyPlan;
    try {
      // Try to find JSON array in the response
      const jsonMatch = aiMessage.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        studyPlan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return a fallback plan
      studyPlan = [
        {
          subject: 'Study Planning',
          timeSlot: '08:00 - 09:00',
          duration: '1 hour',
          activity: 'Morning Study Session',
          priority: 'high',
          description: 'Start your day with focused studying. Review your notes and plan your day.'
        }
      ];
    }

    return new Response(
      JSON.stringify({ 
        studyPlan,
        fileUrl: publicUrl,
        fileName: file.name
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in analyze-timetable:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});