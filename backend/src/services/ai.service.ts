import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateLesson = async (
  category: string,
  subCategory: string,
  userPrompt: string
): Promise<string> => {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-openai-api-key-here') {
    return getMockResponse(category, subCategory, userPrompt);
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert teacher. The student is learning about "${category}" specifically in the sub-topic "${subCategory}". Provide a clear, structured, educational lesson-like response. Use examples where helpful. Keep it concise but thorough.`,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return (
      completion.choices[0]?.message?.content ||
      'No response generated. Please try again.'
    );
  } catch (error: any) {
    console.error('OpenAI API error:', error.message);
    return getMockResponse(category, subCategory, userPrompt);  }
};

function getMockResponse(
  category: string,
  subCategory: string,
  prompt: string
): string {
  return ` **Lesson: ${category} — ${subCategory}**\n\nGreat question! You asked: "${prompt}"\n\nHere is a structured lesson on this topic:\n\n**1. Introduction**\nThis topic falls under ${category}, specifically in ${subCategory}. It is a fundamental area of study with practical applications.\n\n**2. Key Concepts**\n- Concept A: Core principle related to your question\n- Concept B: Supporting theory and context\n- Concept C: Real-world application\n\n**3. Example**\nConsider a scenario where this knowledge is applied in practice...\n\n**4. Summary**\nUnderstanding ${subCategory} within ${category} gives you a solid foundation to build upon.\n\n---\n*This is a mock response. Connect your OpenAI API key in .env for real AI-generated lessons.*`;
}
