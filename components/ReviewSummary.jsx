'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';

export default function ReviewSummary({ reviews, salonName }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      generateSummary();
    }
  }, [reviews]);

  const generateSummary = async () => {
    setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salonName: salonName,
          reviews: reviews.map((r) => `${r.name} (${r.rating}/5): ${r.text}`).join('\n'),
        }),
      });

      const data = await res.json();

      if (data.summary) {
        setSummary(data.summary);
      } else if (data.choices && data.choices[0]) {
        const text = data.choices[0].message.content;
        setSummary(text);
      } else {
        // Fallback summary
        generateFallbackSummary();
      }
    } catch (err) {
      generateFallbackSummary();
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackSummary = () => {
    const avgRating = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
    const positiveKeywords = extractKeywords(reviews.filter(r => r.rating >= 4));
    const negativeKeywords = extractKeywords(reviews.filter(r => r.rating < 4));

    setSummary(
      `Rated ${avgRating.toFixed(1)}/5 across ${reviews.length} reviews. Customers consistently praise ${positiveKeywords.slice(0, 2).join(' and ') || 'the quality of service'}. ${negativeKeywords.length > 0 ? `Some mention ${negativeKeywords[0]} as an area for improvement.` : 'High satisfaction across all aspects.'}`
    );
  };

  const extractKeywords = (reviewList) => {
    const keywords = [];
    const text = reviewList.map(r => r.text).join(' ').toLowerCase();
    const patterns = [
      { word: 'bridal', label: 'bridal expertise' },
      { word: 'makeup', label: 'makeup quality' },
      { word: 'hair', label: 'hair styling skills' },
      { word: 'clean', label: 'cleanliness' },
      { word: 'friendly', label: 'friendly staff' },
      { word: 'professional', label: 'professionalism' },
      { word: 'affordable', label: 'affordability' },
      { word: 'quick', label: 'quick service' },
      { word: 'wait', label: 'wait times' },
      { word: 'parking', label: 'parking' },
      { word: 'crowded', label: 'weekend crowds' },
    ];

    patterns.forEach(({ word, label }) => {
      if (text.includes(word)) keywords.push(label);
    });

    return keywords;
  };

  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-blush/60 to-champagne-light/60 border border-rose-gold/15">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-rose-gold to-gold flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <h4 className="text-sm font-bold text-gray-800">AI Review Summary</h4>
        <span className="text-xs text-gray-400">• {reviews.length} reviews analyzed</span>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin text-rose-gold" />
          <span>Analyzing reviews...</span>
        </div>
      ) : summary ? (
        <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
      ) : null}
    </div>
  );
}
