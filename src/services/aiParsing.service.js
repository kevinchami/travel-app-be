// This is a dummy AI parsing service, replace with your real LLM call.
// It normalizes the free text into a structured intent used by the search layer.

export async function aiParseQuery(freeText) {
    // TODO: integrate your LLM here. Keep output schema stable.
    // Minimal heuristic fallback for now.
    const lower = freeText.toLowerCase();
    const intent = {
      category: 'restaurant',          // inferred default
      cuisines: [],                    // e.g., ['pizza', 'meat', 'sushi']
      diet: [],                        // e.g., ['kosher', 'vegan']
      city: null,
      country: null,
      neighborhood: null,
    };
  
    // Very naive extraction just to keep the contract
    if (lower.includes('pizza')) intent.cuisines.push('pizza');
    if (lower.includes('meat')) intent.cuisines.push('meat');
    if (lower.includes('kosher')) intent.diet.push('kosher');
  
    // Cities quick demo
    if (lower.includes('paris')) { intent.city = 'Paris'; intent.country = 'France'; }
    if (lower.includes('miami')) { intent.city = 'Miami'; intent.country = 'United States'; }
  
    return intent;
  }
  