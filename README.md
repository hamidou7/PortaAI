# 🚀 Portfolio Generator with AI

Générez automatiquement un portfolio professionnel en quelques clics grâce à l'IA ! Cette application utilise **Next.js 15**, **Supabase**, et **OpenAI** pour récupérer vos données (GitHub, LinkedIn, CV) et générer un portfolio personnalisé.

## 🌟 Fonctionnalités
- **Authentification OAuth** via GitHub et LinkedIn
- **Récupération de données** de votre profil GitHub et LinkedIn
- **Génération automatique de contenu** (biographie, description de projets) avec OpenAI
- **Export en PDF** pour un partage facile
- **Hébergement sur Vercel** avec des liens de portfolio personnalisés
- **Mode sombre et personnalisation du thème**

---

## 🛠️ Stack Technique

| Composant     | Technologie |
|--------------|------------|
| **Framework** | Next.js 15 |
| **UI** | Tailwind CSS + Shadcn/ui |
| **Base de données** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (OAuth GitHub, LinkedIn) |
| **AI** | OpenAI (GPT-4-Turbo) |
| **PDF** | React-PDF ou Puppeteer |
| **Hébergement** | Vercel |

---

## 🚀 Installation & Démarrage

### 1️⃣ Cloner le repo
```bash
 git clone https://github.com/votre-repo/portfolio-generator-ai.git
 cd portfolio-generator-ai
```

### 2️⃣ Installer les dépendances
```bash
npm install
```

### 3️⃣ Configurer les variables d'environnement
Créez un fichier `.env.local` et ajoutez :
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id
NEXT_PUBLIC_GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 4️⃣ Lancer le projet en local
```bash
npm run dev
```

---

## 📌 Fonctionnement

1. **Connexion** : L'utilisateur s'authentifie via GitHub ou LinkedIn.
2. **Récupération des données** : 
   - GitHub API : Récupération des repos, stars, contributions.
   - LinkedIn API : Import des infos professionnelles (ou parsing de CV en alternative).
3. **Génération du contenu** : OpenAI optimise la biographie et la description des projets.
4. **Affichage et personnalisation** : L'utilisateur peut modifier le contenu.
5. **Export PDF** : Possibilité de télécharger le portfolio en PDF.
6. **Déploiement et partage** : Portfolio accessible via un lien unique.

---

## 📖 Exemples de Code

### 🔹 Récupération des données GitHub
```javascript
const fetchGitHubData = async (username) => {
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  return res.json();
};
```

### 🔹 Génération automatique de bio avec OpenAI
```javascript
const generateBio = async (bio) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [{
      role: "user",
      content: `Améliore cette bio : ${bio}. Style : professionnel et concis.`
    }]
  });
  return response.choices[0].message.content;
};
```

### 🔹 Page de Portfolio Dynamique (Next.js)
```javascript
export default async function Page({ params }) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single();

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
    </div>
  );
}
```

---

## 🚀 Déploiement

L'application est optimisée pour Vercel.

### 1️⃣ Build et déploiement
```bash
npm run build
vercel
```

### 2️⃣ Variables d'environnement sur Vercel
Ajoutez les clés API dans **Vercel > Settings > Environment Variables**.

---

## 📌 Roadmap & Améliorations futures
- [ ] Ajout de l'export en Markdown/HTML
- [ ] Intégration de GraphQL pour GitHub API
- [ ] Gestion avancée des templates de portfolio
- [ ] Ajout d'un système de notes et recommandations

---

## 🤝 Contribution
Les contributions sont les bienvenues ! Forkez le repo et proposez vos améliorations.

---

## 📜 Licence
MIT License - Vous êtes libre d'utiliser et de modifier ce projet.

---

## ⭐ Créateurs & Contact
**Votre Nom** - [LinkedIn](https://linkedin.com/in/votreprofil) - [GitHub](https://github.com/votreprofil)

#   P o r t a A I  
 