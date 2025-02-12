import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // À remplacer par un endpoint backend en production
});

export const generatePortfolioContent = async (userData: any) => {
  const prompt = `
    Génère un portfolio professionnel en français avec ces données :
    - Nom: ${userData.name}
    - Bio: ${userData.bio || 'Non renseignée'}
    - Expérience GitHub: ${userData.githubData?.repos?.length || 0} repositories
    - Expérience LinkedIn: ${userData.linkedinData?.position || 'Non renseignée'}
    
    Tonnes:
    - Style professionnel
    - Maximum 3 paragraphes
    - Mettre en valeur les réalisations techniques
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500
  });

  return completion.choices[0].message.content;
};