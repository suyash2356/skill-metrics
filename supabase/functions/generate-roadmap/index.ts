import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoadmapRequest {
  title: string;
  description: string;
  skillLevel: string;
  timeCommitment: string;
  learningStyle: string;
  focusAreas: string[];
  category?: string;
  learningDuration?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth check (defense-in-depth) ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid Authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase configuration is missing');
    }

    // Verify the JWT by creating a client with the user's token
    const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: authUser }, error: authError } = await authClient.auth.getUser();
    if (authError || !authUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: invalid or expired token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.log(`Authenticated user: ${authUser.id}`);
    // --- End auth check ---

    const { title, description, skillLevel, timeCommitment, learningStyle, focusAreas, category, learningDuration }: RoadmapRequest = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }
    
    // The AI produces learning guidance only. Resource links are selected client-side
    // from the active admin catalog after this response is validated.
    const prompt = `You are a senior curriculum architect and experienced practitioner. Design a practical, personalized learning roadmap that a learner can follow month by month.

Title: ${title}
Description: ${description}
Category: ${category || 'General'}
Skill Level: ${skillLevel}
Time Commitment: ${timeCommitment}
Total Learning Duration: ${learningDuration || 'Flexible'}
Learning Style: ${learningStyle}
Focus Areas: ${focusAreas.join(', ')}

Create a month-by-month roadmap that fits within ${learningDuration || 'a flexible timeframe'}. Return 4-12 ordered monthly steps (one step per month; combine or split topics when needed). Each month must have a clear theme, a small number of tightly related concepts, a learning method, a reason the month matters, measurable practice, and a concrete outcome. The sequence should resemble a text version of a roadmap diagram: foundations first, then core concepts, applied work, specialization, and a capstone or exam-ready outcome. Do not pad the roadmap with generic phases or unrelated topics.

${category === 'Exam Prep' ? 'IMPORTANT: This is for exam preparation. Focus on exam-specific study strategies, syllabus coverage, mock tests, previous year questions, time management techniques, and revision schedules. Include specific exam patterns and scoring strategies.' : ''}
${category === 'Non-Tech' || ['visual-arts', 'graphic-design', 'music', 'film-photography', 'writing', 'fashion', 'performing-arts', 'finance', 'marketing', 'psychology', 'education-teaching', 'law', 'languages', 'philosophy-history', 'fitness-wellness', 'culinary'].includes(category || '') ? `IMPORTANT: This is a non-technical/creative/professional skill. Tailor the roadmap to this specific domain:
- For ARTS & CREATIVE fields: Focus on technique development, portfolio building, exhibitions/showcases, finding mentorship, building an online presence (Behance, Instagram, DeviantArt), art communities, critique sessions, and selling/commissioning work.
- For FINANCE & BUSINESS fields: Focus on certifications (CFA, CPA), case studies, market analysis projects, financial modeling, networking, and industry-specific tools (Bloomberg, Excel, Tally).
- For HUMANITIES & SOCIAL SCIENCES: Focus on research methods, writing papers, critical thinking, fieldwork, reading lists, and academic/professional conferences.
- For HEALTH & WELLNESS: Focus on certifications, practical training, client management, evidence-based approaches, and continuing education.
- For LANGUAGES: Focus on immersion techniques, conversation practice, grammar drills, cultural context, and proficiency tests (TOEFL, DELF, JLPT).
Include community building, showcase opportunities, and real-world application throughout.` : ''}
${category === 'Tech' || ['software-development', 'data-science', 'cybersecurity', 'cloud-devops', 'web-mobile'].includes(category || '') ? 'IMPORTANT: This is a technical skill. Focus on hands-on coding projects, documentation reading, debugging skills, and building a technical portfolio. Include specific tools, frameworks, and best practices.' : ''}

CRITICAL RESOURCE RULE: Do not recommend, invent, name, or include any URLs, books, courses, videos, websites, providers, or resources field. A separate application process will attach matching resources only from the active admin catalog after generation. The whereToLearn field must be an empty array.

Return your response as a valid JSON object with this EXACT structure:
{
  "steps": [
    {
      "month": 1,
      "title": "Month 1: Specific learning theme",
      "description": "A concise explanation of what this month delivers and how it connects to the next month.",
      "duration": "1 month",
      "estimatedHours": 40,
      "whatToLearn": ["Specific concept", "Specific technique", "Specific vocabulary or tool"],
      "howToLearn": ["A sequenced study method with concrete practice", "A deliberate practice or review routine"],
      "whyToLearn": "The practical reason these concepts matter for the stated goal.",
      "whereToLearn": [],
      "topics": ["Specific concept", "Specific technique", "Specific application"],
      "learningObjectives": ["A measurable outcome the learner can demonstrate", "A second measurable outcome"],
      "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
      "milestones": [
        {
          "title": "Week 1: Specific checkpoint",
          "description": "What to complete and how it will be checked.",
          "estimatedHours": 10
        },
        {
          "title": "Week 4: Monthly deliverable",
          "description": "A concrete artifact or score that proves progress.",
          "estimatedHours": 15
        }
      ],
      "tasks": [
        {
          "title": "Monthly practice project",
          "description": "Build or solve something specific. Include acceptance criteria and an expected deliverable.",
          "difficulty": "beginner"
        },
        {
          "title": "Retrieval or exam practice",
          "description": "Use deliberate recall, timed practice, critique, or debugging to verify the month’s skills.",
          "difficulty": "intermediate"
        }
      ],
      "commonPitfalls": [
        "Specific mistake beginners make: [problem] - Solution: [how to avoid/fix it]",
        "Challenge with [specific concept]: [issue] - Tip: [actionable advice]"
      ],
      "assessmentCriteria": [
        "Can build [specific project] independently",
        "Can explain [concept] with examples",
        "Successfully implement [feature] without errors"
      ],
      "realWorldExamples": [
        "How [Company/Industry] uses this: [specific example]",
        "Real project example: [description of actual use case]"
      ]
    }
  ]
}

DETAILED GUIDELINES:
1. MONTHLY STRUCTURE: Use one ordered step per month and make the title begin with "Month N:".
2. WHAT: Keep whatToLearn and topics specific to ${focusAreas.join(', ')}; name concepts, techniques, standards, and tools only when genuinely relevant.
3. HOW: Explain a repeatable study sequence, practice method, feedback loop, and revision routine in howToLearn and tasks.
4. WHY: Tie every month to the learner’s goal in whyToLearn; avoid generic motivation.
5. MILESTONES: Include 2-4 weekly checkpoints with measurable deliverables.
6. PRACTICE: Include 2-3 tasks with acceptance criteria; tailor these to ${learningStyle} learning.
7. ASSESSMENT: Include 2-4 observable assessment criteria and specific common pitfalls with fixes.
8. RESOURCE SEPARATION: whereToLearn must be [] and there must be no resources, URL, provider, or named learning source anywhere in the response.
9. ESTIMATED HOURS: Keep each month realistic for ${timeCommitment}; the whole plan must fit ${learningDuration || 'the available timeframe'}.

QUALITY STANDARDS:
✓ Every sentence should add concrete value
✓ No generic advice - be specific about WHAT, HOW, and WHY
✓ Include actual numbers, names, tools, and techniques
✓ Make it immediately actionable
✓ Focus heavily on: ${focusAreas.join(', ')}
✓ Tailor to ${learningStyle} learning style
✓ Ensure total hours align with ${learningDuration || 'flexible timeline'}

Return ONLY the JSON object, no additional text or markdown formatting.`;

    console.log('Calling Lovable AI (Google Gemini)...');
    
    // Using Lovable AI with Google Gemini Pro for better detailed content
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI usage limit reached. Please contact support.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`Lovable AI error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Lovable AI response received');
    
    // Extract the generated text from chat completion format
    const generatedText = data.choices?.[0]?.message?.content;
    
    if (!generatedText) {
      console.error('Unexpected response format:', JSON.stringify(data));
      throw new Error('No content generated by AI');
    }

    // Parse the JSON response
    let roadmapData;
    try {
      // Remove markdown code blocks if present
      let cleanedText = generatedText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/```\n?/g, '');
      }
      
      // Find JSON object in the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      roadmapData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse AI response:', generatedText);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate the structure
    if (!roadmapData.steps || !Array.isArray(roadmapData.steps)) {
      throw new Error('Invalid roadmap structure from AI');
    }

    // Resource selection is intentionally not performed here. This function only
    // returns curriculum content; the client matches active admin resources after
    // generation so AI output can never introduce an external recommendation.
    roadmapData.steps = roadmapData.steps.map((step: Record<string, unknown>, index: number) => ({
      ...step,
      month: typeof step.month === 'number' ? step.month : index + 1,
      whereToLearn: [],
    }));
    console.log(`AI generated ${roadmapData.steps.length} curriculum months without resources`);

    return new Response(JSON.stringify(roadmapData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-roadmap function:', error);
    return new Response(
      JSON.stringify({ error: 'An error occurred generating the roadmap.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
