import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { title, description, skillLevel, timeCommitment, learningStyle, focusAreas, category, learningDuration }: RoadmapRequest = await req.json();
    
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Construct the prompt
    const prompt = `You are an expert learning path designer. Create a detailed, personalized learning roadmap based on the following requirements:

Title: ${title}
Description: ${description}
Category: ${category || 'General'}
Skill Level: ${skillLevel}
Time Commitment: ${timeCommitment}
Total Learning Duration: ${learningDuration || 'Flexible'}
Learning Style: ${learningStyle}
Focus Areas: ${focusAreas.join(', ')}

Create a comprehensive learning roadmap with 6-10 progressive steps that fits within the ${learningDuration || 'flexible'} timeframe. Each step should build upon the previous one.

${category === 'Exam Prep' ? 'IMPORTANT: This is for exam preparation. Focus on exam-specific study strategies, syllabus coverage, mock tests, previous year questions, time management techniques, and revision schedules.' : ''}
${category === 'Non-Tech' ? 'IMPORTANT: This is a non-technical skill. Focus on practical applications, real-world scenarios, portfolio building, and soft skills development.' : ''}
${category === 'Tech' ? 'IMPORTANT: This is a technical skill. Focus on hands-on coding projects, documentation reading, debugging skills, and building a technical portfolio.' : ''}

Return your response as a valid JSON object with this EXACT structure:
{
  "steps": [
    {
      "title": "Step title (concise, clear)",
      "description": "Detailed description of what will be learned (2-3 sentences)",
      "duration": "Time estimate (e.g., '2 weeks', '1 month') - ensure total adds up to approximately ${learningDuration || 'flexible timeline'}",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "task": "A practical hands-on task or project to complete for this step",
      "resources": [
        {
          "title": "Resource title",
          "url": "https://example.com",
          "type": "article|video|course|documentation|book"
        }
      ]
    }
  ]
}

Guidelines:
1. Make the roadmap progressive - start with fundamentals and build up
2. Include 4-6 topics per step that are specific and actionable
3. Each task should be practical and help reinforce the learning
4. Provide 3-5 high-quality, real resources per step (real URLs from popular platforms like MDN, freeCodeCamp, Coursera, YouTube, official docs, Khan Academy, edX, etc.)
5. Adjust complexity based on the skill level (${skillLevel})
6. Consider the time commitment (${timeCommitment}) and total duration (${learningDuration || 'flexible'}) when estimating durations
7. Tailor the content to the learning style (${learningStyle})
8. Focus heavily on: ${focusAreas.join(', ')}
9. Make it engaging and motivating
10. Ensure all step durations combined align with the total learning duration of ${learningDuration || 'flexible timeline'}

Return ONLY the JSON object, no additional text or markdown formatting.`;

    console.log('Calling Gemini API...');
    console.log('Request payload:', JSON.stringify({
      title,
      skillLevel,
      timeCommitment,
      learningStyle,
      focusAreas,
      category,
      learningDuration
    }));
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      console.error('Full error response:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');
    
    // Extract the generated text
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      console.error('No text in Gemini response:', JSON.stringify(data));
      throw new Error('No content generated by Gemini');
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
      
      roadmapData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', generatedText);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Validate the structure
    if (!roadmapData.steps || !Array.isArray(roadmapData.steps)) {
      throw new Error('Invalid roadmap structure from AI');
    }

    console.log(`Generated roadmap with ${roadmapData.steps.length} steps`);

    return new Response(JSON.stringify(roadmapData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-roadmap function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error instanceof Error ? error.stack : undefined
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
