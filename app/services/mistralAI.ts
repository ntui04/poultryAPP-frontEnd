class MistralAIService {
  private readonly API_KEY = 'jTfupkTQAIECvDMBdAiPAd4Y4xZGpbFJ';
  private readonly API_URL = 'https://api.mistral.ai/v1/chat/completions';

  // Keywords for validation
  private readonly POULTRY_KEYWORDS = {
    en: ['chicken', 'poultry', 'egg', 'hen', 'rooster', 'farm', 'bird', 'feed', 'disease', 'vaccine', 'broiler', 'layer'],
    sw: ['kuku', 'mayai', 'mfugo', 'chakula', 'ugonjwa', 'chanjo', 'kifaranga', 'mtambo', 'shamba', 'ndege']
  };

  private readonly SYSTEM_PROMPT = (language: 'en' | 'sw') => `
    You are a strict poultry farming assistant with these rules:
    1. ONLY answer questions about poultry farming, chicken health, egg production, and poultry business
    2. Respond in ${language === 'en' ? 'English' : 'Swahili'}
    3. If a question is not about poultry, ALWAYS respond with:
       ${language === 'en' 
         ? '"I can only help with poultry farming related questions. Please ask about chickens, eggs, or poultry farming."' 
         : '"Ninaweza kusaidia tu na maswali yanayohusiana na ufugaji wa kuku. Tafadhali uliza kuhusu kuku, mayai, au ufugaji wa kuku."'}
    4. Keep responses focused on practical poultry farming advice
    5. Never provide information about non-poultry topics
  `;

  private isPoultryRelated(message: string, language: 'en' | 'sw'): boolean {
    const keywords = [...this.POULTRY_KEYWORDS.en, ...this.POULTRY_KEYWORDS.sw];
    const normalizedMessage = message.toLowerCase();
    return keywords.some(keyword => normalizedMessage.includes(keyword));
  }

  async generateResponse(message: string, language: 'en' | 'sw' = 'en') {
    try {
      if (!message.trim()) {
        throw new Error('Message cannot be empty');
      }

      // Force non-poultry questions to return standard response
      if (!this.isPoultryRelated(message, language)) {
        return language === 'en'
          ? "I can only help with poultry farming related questions. Please ask about chickens, eggs, or poultry farming."
          : "Ninaweza kusaidia tu na maswali yanayohusiana na ufugaji wa kuku. Tafadhali uliza kuhusu kuku, mayai, au ufugaji wa kuku.";
      }

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-small',
          messages: [
            { 
              role: 'system', 
              content: this.SYSTEM_PROMPT(language) 
            },
            { 
              role: 'user', 
              content: message 
            }
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response generated');
      }

      return data.choices[0].message.content;

    } catch (error) {
      if (error instanceof TypeError && error.message === 'Network request failed') {
        console.error('Network Error:', error);
        throw new Error('Unable to connect to Mistral AI. Please check your internet connection.');
      }

      console.error('Mistral AI Error:', error);
      throw error;
    }
  }
}

export default new MistralAIService();