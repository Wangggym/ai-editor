import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getAIResponse = async (selectedCode, userInput) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",  // 使用支持 JSON 模式的最新模型
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are a helpful coding assistant. Respond with a JSON object containing only a 'code' field with the modified code based on the user's request." },
        { role: "user", content: `Given the following code:\n\n${selectedCode}\n\nUser request: ${userInput}` }
      ],
    });

    const jsonResponse = JSON.parse(completion.choices[0].message.content);
    
    if (!jsonResponse.code) {
      throw new Error('Invalid JSON structure in AI response');
    }
    
    return jsonResponse.code;
  } catch (error) {
    console.error('Error:', error);
    throw new Error(error.message || 'An error occurred while processing your request.');
  }
};
