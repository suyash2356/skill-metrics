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
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Construct the enhanced detailed prompt
    const prompt = `You are an expert learning path designer with deep industry experience. Create an exceptionally detailed, actionable, and personalized learning roadmap based on the following requirements:

Title: ${title}
Description: ${description}
Category: ${category || 'General'}
Skill Level: ${skillLevel}
Time Commitment: ${timeCommitment}
Total Learning Duration: ${learningDuration || 'Flexible'}
Learning Style: ${learningStyle}
Focus Areas: ${focusAreas.join(', ')}

Create a comprehensive learning roadmap with 6-10 progressive steps that fits within the ${learningDuration || 'flexible'} timeframe. Each step should build upon the previous one with MAXIMUM DETAIL AND PRACTICAL VALUE.

${category === 'Exam Prep' ? 'IMPORTANT: This is for exam preparation. Focus on exam-specific study strategies, syllabus coverage, mock tests, previous year questions, time management techniques, and revision schedules. Include specific exam patterns and scoring strategies.' : ''}
${category === 'Non-Tech' ? 'IMPORTANT: This is a non-technical skill. Focus on practical applications, real-world scenarios, portfolio building, and soft skills development. Include case studies and industry examples.' : ''}
${category === 'Tech' ? 'IMPORTANT: This is a technical skill. Focus on hands-on coding projects, documentation reading, debugging skills, and building a technical portfolio. Include specific tools, frameworks, and best practices.' : ''}

CRITICAL REQUIREMENTS FOR DETAILED CONTENT:
- BE EXTREMELY SPECIFIC: No vague advice like "learn the basics" - specify exactly what concepts, tools, or techniques
- INCLUDE CONCRETE EXAMPLES: Real projects, real code patterns, real industry scenarios
- BREAK DOWN COMPLEX CONCEPTS: Provide substeps and milestones within each major step
- ANTICIPATE CHALLENGES: List common mistakes and how to avoid them
- PROVIDE CLEAR SUCCESS CRITERIA: How to know when you've mastered each step
- USE REAL NUMBERS: Specific time estimates, page numbers, project sizes

Return your response as a valid JSON object with this EXACT structure:
{
  "steps": [
    {
      "title": "Specific, actionable step title",
      "description": "Comprehensive 4-5 sentence description explaining what will be learned, why it matters, and how it connects to the bigger picture. Be extremely specific about outcomes.",
      "duration": "X weeks",
      "estimatedHours": 40,
      "topics": [
        "Specific Topic 1 with concrete examples",
        "Specific Topic 2 with real-world application",
        "Specific Topic 3 with tools/frameworks",
        "Topic 4", "Topic 5", "Topic 6", "Topic 7", "Topic 8"
      ],
      "learningObjectives": [
        "Understand [specific concept] and apply it to [real scenario]",
        "Be able to implement [specific feature/project]",
        "Master [specific technique] including [details]",
        "Explain [concept] to others clearly"
      ],
      "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
      "milestones": [
        {
          "title": "Milestone 1: Specific substep",
          "description": "What to achieve in this substep with measurable outcome",
          "estimatedHours": 10
        },
        {
          "title": "Milestone 2: Next substep",
          "description": "Concrete achievement with clear deliverable",
          "estimatedHours": 15
        }
      ],
      "tasks": [
        {
          "title": "Hands-on Project 1",
          "description": "Build [specific thing] using [specific tools]. Include [specific features]. Expected outcome: [concrete deliverable]",
          "difficulty": "beginner"
        },
        {
          "title": "Practical Exercise 2",
          "description": "Create [specific implementation] that demonstrates [specific skill]",
          "difficulty": "intermediate"
        }
      ],
      "resources": [
        {
          "title": "Specific resource title",
          "url": "https://actual-real-url.com",
          "type": "article|video|course|documentation|book",
          "duration": "2 hours",
          "difficulty": "beginner"
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
1. PROGRESSIVE LEARNING: Each step builds directly on previous ones with clear connections
2. TOPICS (6-10 per step): Be ultra-specific - mention exact tools, frameworks, patterns, not just general concepts
3. LEARNING OBJECTIVES (3-5): Concrete, measurable goals with real-world applications
4. PREREQUISITES (1-3): What must be known before starting this step
5. MILESTONES (2-4 per step): Break each step into digestible substeps with time estimates
6. TASKS (2-3 per step): Hands-on projects with specific requirements and expected outcomes
7. RESOURCES (5-8 per step): ONLY use real, high-quality URLs from:
   - Official documentation (MDN, React docs, etc.)
   - Popular learning platforms (freeCodeCamp, Coursera, edX, Udemy)
   - Quality YouTube channels (Traversy Media, Fireship, etc.)
   - Authoritative books and articles
   - GitHub repositories with good stars
8. COMMON PITFALLS (2-4): Specific mistakes with actionable solutions
9. ASSESSMENT CRITERIA (2-4): How to self-evaluate mastery
10. REAL-WORLD EXAMPLES (2-3): Concrete industry applications or case studies
11. ESTIMATED HOURS: Realistic based on ${timeCommitment} commitment
12. DIFFICULTY LEVELS: Match to ${skillLevel} and progress appropriately

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
    console.log('Request payload:', JSON.stringify({
      title,
      skillLevel,
      timeCommitment,
      learningStyle,
      focusAreas,
      category,
      learningDuration
    }));
    
    // Using Lovable AI with Google Gemini Pro for better detailed content
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-pro',
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
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('AI usage limit reached. Please contact support.');
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
