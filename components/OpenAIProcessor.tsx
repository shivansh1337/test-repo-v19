import OpenAI from 'openai';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY as string;
const openai = new OpenAI({ apiKey,  dangerouslyAllowBrowser: true });

const generationConfig = {
  temperature: 1,
  top_p: 0.95,
  max_tokens: 8192,
  model: "gpt-4o",
};

export async function processWithOpenAI({ content, prompt }: { content: string, prompt: string }) {
  try {
    const response = await openai.chat.completions.create({
      ...generationConfig,
      messages: [
        {
          role: "system",
          content: prompt
        },
        {
          role: "user",
          content: content
        }
      ],
    });

    return response.choices[0].message.content || 'No response generated';
  } catch (error) {
    console.error('Error processing with OpenAI:', error);
    return 'Error processing content with AI';
  }
}