export async function POST(request) {
  try {
    const { role, weddingDate, budget, areas, notes, salonContext } = await request.json();

    const systemPrompt = `You are a wedding beauty planner AI for Hyderabad, India. Create a detailed day-by-day beauty schedule for a ${role} with a wedding on ${weddingDate} and a budget of ₹${budget?.toLocaleString()}.

${areas?.length > 0 ? `Preferred areas: ${areas.join(', ')}` : 'Cover all Hyderabad areas.'}
${notes ? `Additional notes: ${notes}` : ''}

Available salons in Hyderabad:
${salonContext || 'Use your knowledge of Hyderabad salons.'}

Create a timeline with:
- Pre-wedding skincare sessions (starting 4-6 weeks before)
- Hair treatments and trials
- Mehndi session
- Final grooming
- Wedding day makeup and styling

For each item include: date/timing relative to wedding, service name, recommended salon name and area, estimated cost.
Keep the total within the budget of ₹${budget?.toLocaleString()}.
Be specific to Hyderabad's wedding culture (Telugu, Muslim, and North Indian traditions).
Format clearly with dates and details.`;

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
            { role: 'user', content: `Please create my complete wedding beauty plan. I am the ${role}, wedding date is ${weddingDate}, budget is ₹${budget?.toLocaleString()}.${notes ? ` ${notes}` : ''}` },
          ],
          max_tokens: 1500,
          temperature: 0.7,
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
    return Response.json(data);
  } catch (error) {
    console.error('Planner API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
