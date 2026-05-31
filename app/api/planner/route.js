export async function POST(request) {
  try {
    const { 
      role, 
      weddingDate, 
      budget, 
      areas, 
      notes, 
      salonContext,
      stylePreset,
      homeService,
      entourage,
      faceAnalysis
    } = await request.json();

    // Construct Entourage text representation
    let entourageText = '';
    if (entourage) {
      const parts = [];
      if (entourage.bridesmaids && entourage.bridesmaids > 0) {
        parts.push(`${entourage.bridesmaids} Bridesmaid(s)`);
      }
      if (entourage.mother) {
        parts.push(`Mother of the Bride`);
      }
      if (entourage.groom) {
        parts.push(`Groom`);
      }
      entourageText = parts.join(', ');
    }

    const systemPrompt = `You are an elite wedding beauty planner and luxury bridal coordinator for Hyderabad, India. Create a detailed wedding beauty schedule in strict JSON format.

Aesthetics style preset: ${stylePreset || 'Traditional Indian Bride'}
${faceAnalysis ? `User Face Analysis: Shape is ${faceAnalysis.faceShape}, Skin Tone is ${faceAnalysis.skinTone}, Features: ${faceAnalysis.features}` : ''}
${homeService ? 'NOTE: The user requested premium home-services/on-venue styling. Include a travel surcharge (+₹2,000 to ₹5,000 depending on budget) to costs, prioritize mobile services, and set "homeService": true on items.' : ''}
${entourageText ? `Include side-by-side or coordinated milestones for the Entourage: ${entourageText}. Add them in the same timeline. Set "forWho" to "Bride", "Entourage", or "Both". If it includes entourage, specify "entourageService" (what they will get) and "entourageCost".` : ''}

Create a beautiful timeline tailored for a ${role} with a wedding on ${weddingDate} and a total target budget of ₹${budget?.toLocaleString()}.
${areas?.length > 0 ? `Preferred Hyderabad areas: ${areas.join(', ')}` : 'Available across all Hyderabad.'}
${notes ? `Additional requirements: ${notes}` : ''}

Available salons context in Hyderabad:
${salonContext || 'Use major top-rated salons like Bubbles Hair & Beauty, Oasis Spa, Page 3, Mirrors Salon.'}

You MUST output ONLY a valid JSON object matching the following structure (no markdown wrapper, no extra text):
{
  "plan": {
    "totalCost": 35000,
    "items": [
      {
        "date": "20 Jun",
        "daysLeft": "6 weeks before",
        "title": "Start Pre-Bridal Skincare",
        "desc": "Detail exactly what skincare/hair treatment they should get, customized for their aesthetic style preset and skin tone/face shape.",
        "salon": "Name of recommended salon from context",
        "area": "Salon area",
        "service": "Service name",
        "cost": 3000,
        "category": "skin",
        "forWho": "Bride",
        "entourageService": "Optional entourage service name",
        "entourageCost": 0,
        "homeService": ${homeService ? 'true' : 'false'},
        "styleTip": "Elite makeup/skin tips tailored for this milestone and their style preset."
      }
    ]
  }
}

Timeline requirements:
1. Skincare/facial starts 6 weeks before.
2. Hair prep/spa starts 4 weeks before.
3. Makeup trial/consultation 2 weeks before.
4. Mehndi application 2-3 days before.
5. Final groomings 1 day before.
6. The Big Day makeup, styling, draping.
All items MUST fit within the budget of ₹${budget?.toLocaleString()}. Return ONLY valid JSON.`;

    const response = await fetch(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NIM_API_KEY_TEXT}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta/llama-3.3-70b-instruct',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Generate my premium JSON wedding beauty plan for: Role: ${role}, Date: ${weddingDate}, Budget: ₹${budget?.toLocaleString()}, Preset: ${stylePreset || 'Default'}.` },
          ],
          max_tokens: 2000,
          temperature: 0.5,
          top_p: 0.9,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NIM Planner API error:', response.status, errorText);
      return Response.json(
        { error: 'AI service temporarily unavailable' },
        { status: 502 }
      );
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      const content = data.choices[0].message.content;
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return Response.json(parsed);
        }
      } catch (parseError) {
        console.error('JSON parse error in route:', parseError, content);
      }
    }

    return Response.json({ error: 'Failed to generate structured plan' }, { status: 500 });
  } catch (error) {
    console.error('Planner API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
