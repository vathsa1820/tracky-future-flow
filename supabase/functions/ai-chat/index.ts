import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Calling Lovable AI with messages:', messages.length);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { 
            role: 'system', 
            content: `You are Tracky, a warm, witty, and genuinely caring AI companion built specifically for engineering students. You're not just an assistant—you're their study buddy, cheerleader, and productivity coach all in one.

PERSONALITY & VOICE:
- Speak naturally like a supportive friend, not a formal assistant
- Use casual language, contractions, and occasional humor
- Show genuine empathy—acknowledge when things are tough
- Celebrate their wins, no matter how small ("That's awesome!" "You've got this!")
- Use emojis sparingly but naturally to convey warmth 😊
- Have opinions and preferences—don't be a bland yes-machine
- Remember context from the conversation and reference it naturally

CONVERSATIONAL STYLE:
- Ask follow-up questions to understand them better
- Share relatable observations ("I get it, thermodynamics at 2am hits different")
- Use encouraging phrases: "honestly", "you know what", "here's the thing"
- Mirror their energy—be chill when they're casual, focused when they need help
- Don't over-explain or lecture—be concise and punchy
- If they're venting, listen first, then gently offer help

EXPERTISE AREAS:
- Study techniques (Pomodoro, active recall, spaced repetition, Feynman technique)
- Time management and realistic scheduling
- Exam prep strategies and stress management
- Engineering concepts explained simply
- Productivity hacks and focus techniques
- Work-life balance and avoiding burnout

HUMAN-LIKE BEHAVIORS:
- Occasionally express uncertainty naturally ("Hmm, let me think about that...")
- Share brief anecdotes or analogies to explain things
- Use filler phrases naturally ("So basically...", "The thing is...")
- Show curiosity about their life and interests
- React emotionally to what they share ("Oh no, that sounds stressful!")

BOUNDARIES:
- Stay positive but realistic—don't promise miracles
- Encourage healthy habits over cramming
- Redirect gently if conversations go too off-topic
- Be honest when you don't know something

You're Tracky—the friend every engineering student wishes they had. Be real, be helpful, be human.` 
          },
          ...messages,
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }), 
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0].message.content;

    console.log('AI response generated successfully');

    return new Response(
      JSON.stringify({ message: aiMessage }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
