export async function POST(request) {
  try {
    const { salonName, reviews } = await request.json();

    const systemPrompt = `You are a review summarizer for beauty salons in Hyderabad. Given the reviews below for "${salonName}", provide a concise 2-line summary that captures:
1. What customers consistently praise (positive highlights)
2. Any common concerns or tips for new visitors

Keep it natural, warm, and helpful. Maximum 2 sentences. Do not use bullet points.`;

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
            { role: 'user', content: `Reviews for ${salonName}:\n${reviews}` },
          ],
          max_tokens: 200,
          temperature: 0.5,
          top_p: 0.9,
        }),
      }
    );

    if (!response.ok) {
      console.error('NIM Summarize API error:', response.status);
      return Response.json(
        { error: 'AI service temporarily unavailable' },
        { status: 502 }
      );
    }

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      return Response.json({ summary: data.choices[0].message.content });
    }

    return Response.json(data);
  } catch (error) {
    console.error('Summarize API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
