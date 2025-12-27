import { Product, Category, Service } from './types';

export const CATEGORIES: Category[] = [
  { id: 'ai', name: 'AI & Нейросети', icon: 'brain' },
  { id: 'devtools', name: 'Инструменты разработки', icon: 'code' },
  { id: 'design', name: 'Дизайн & Контент', icon: 'palette' },
  { id: 'gaming', name: 'Игры', icon: 'gamepad' },
  { id: 'office', name: 'Офис & Продуктивность', icon: 'briefcase' },
  { id: 'payments', name: 'Платежи & Услуги', icon: 'credit-card' },
];

export const SERVICES: Service[] = [
  { id: 'google_antigravity', name: 'Google Antigravity' },
  { id: 'xbox', name: 'Xbox' },
  { id: 'bolt', name: 'Bolt New' },
  { id: 'google_ai', name: 'Google AI' },
  { id: 'canva', name: 'Canva' },
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'gemini', name: 'Gemini' },
  { id: 'warp', name: 'Warp' },
  { id: 'cursor', name: 'Cursor' },
  { id: 'freepik', name: 'Freepik' },
  { id: 'github_copilot', name: 'GitHub Copilot' },
  { id: 'perplexity', name: 'Perplexity' },
  { id: 'microsoft', name: 'Microsoft' },
  { id: 'replit', name: 'Replit' },
  { id: 'lovable', name: 'Lovable' },
];

export const PRODUCTS: Product[] = [
  // AI & Нейросети
  {
    id: 'chatgpt-plus',
    title: 'ChatGPT Plus',
    description: 'Расширенные возможности ChatGPT для личного использования. Доступ к GPT-4, быстрые ответы, приоритетный доступ к новым функциям.',
    category: 'ai',
    service: 'chatgpt',
    tags: ['popular', 'ai'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'chatgpt-plus-1m', name: '1 месяц' },
      { id: 'chatgpt-plus-3m', name: '3 месяца' },
      { id: 'chatgpt-plus-6m', name: '6 месяцев' },
      { id: 'chatgpt-plus-12m', name: '12 месяцев' }
    ],
    requirements: {}
  },
  {
    id: 'chatgpt-team',
    title: 'ChatGPT Team',
    description: 'Расширенные возможности ChatGPT для командного использования. Совместная работа, административная панель, повышенные лимиты.',
    category: 'ai',
    service: 'chatgpt',
    tags: ['team', 'ai'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1676299081847-5c466c7f5ddf?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'chatgpt-team-1m', name: '1 месяц' },
      { id: 'chatgpt-team-3m', name: '3 месяца' },
      { id: 'chatgpt-team-6m', name: '6 месяцев' },
      { id: 'chatgpt-team-12m', name: '12 месяцев' }
    ],
    requirements: {}
  },
  {
    id: 'gemini-ultimate',
    title: 'Gemini Ultimate',
    description: 'Продвинутые функции Gemini от Google. Доступ к Ultra 1.0, расширенные возможности AI, 2TB хранилища.',
    category: 'ai',
    service: 'gemini',
    tags: ['popular', 'ai'],
    imageUrl: 'https://images.unsplash.com/photo-1697577418970-95d99b5a55cf?auto=format&fit=crop&w=800&q=80',
    flow: 'telegram_redirect',
    variants: [
      { id: 'gemini-1m', name: '1 месяц' }
    ],
    requirements: {}
  },
  {
    id: 'google-ai-pro',
    title: 'Google AI Pro',
    description: 'Доступ к продвинутым AI-инструментам Google. Полный пакет возможностей для работы с искусственным интеллектом.',
    category: 'ai',
    service: 'google_ai',
    tags: ['popular', 'ai'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'google-ai-12m', name: '12 месяцев' }
    ],
    requirements: {}
  },
  {
    id: 'perplexity-pro',
    title: 'Perplexity Pro',
    description: 'Интеллектуальные ответы Perplexity. Продвинутый AI-поиск с доступом к актуальной информации.',
    category: 'ai',
    service: 'perplexity',
    tags: ['ai'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'perplexity-12m', name: '12 месяцев' }
    ],
    requirements: {}
  },

  // Инструменты разработки
  {
    id: 'google-antigravity',
    title: 'Google Antigravity',
    description: 'IDE для разработки с продвинутыми функциями. Интеллектуальные подсказки, автодополнение, интеграция с AI.',
    category: 'devtools',
    service: 'google_antigravity',
    tags: ['new', 'devtools', 'popular'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'antigravity-1m', name: '1 месяц' },
      { id: 'antigravity-12m', name: '12 месяцев' }
    ],
    requirements: {}
  },
  {
    id: 'bolt-new',
    title: 'Bolt New',
    description: 'Сервис создания приложений с помощью AI. Генерация кода, быстрый прототипинг, автоматизация разработки.',
    category: 'devtools',
    service: 'bolt',
    tags: ['new', 'devtools'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'bolt-1m', name: '1 месяц' },
      { id: 'bolt-12m', name: '12 месяцев' }
    ],
    requirements: {}
  },
  {
    id: 'github-copilot',
    title: 'GitHub Copilot Pro',
    description: 'Помощник для программистов. AI-подсказки прямо в вашем редакторе кода, автодополнение целых функций.',
    category: 'devtools',
    service: 'github_copilot',
    tags: ['popular', 'devtools'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'copilot-12m', name: '12 месяцев' },
      { id: 'copilot-24m', name: '24 месяца' }
    ],
    requirements: { needsAccountEmail: true }
  },
  {
    id: 'cursor-ai',
    title: 'Cursor AI Pro',
    description: 'Интеллектуальная помощь в программировании. AI-powered редактор кода нового поколения.',
    category: 'devtools',
    service: 'cursor',
    tags: ['devtools'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'cursor-12m', name: '12 месяцев' }
    ],
    requirements: {}
  },
  {
    id: 'warp-ai',
    title: 'Warp AI Pro',
    description: 'AI-инструменты Warp. Продвинутый терминал с интеллектуальными функциями и AI-помощником.',
    category: 'devtools',
    service: 'warp',
    tags: ['devtools'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'warp-12m', name: '12 месяцев' }
    ],
    requirements: {}
  },
  {
    id: 'replit-core',
    title: 'Replit Core',
    description: 'Платформа для разработки онлайн. Полноценная IDE в браузере с совместной работой и деплоем.',
    category: 'devtools',
    service: 'replit',
    tags: ['devtools'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1607705703571-c5a8695f18f6?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'replit-12m', name: '12 месяцев' }
    ],
    requirements: {}
  },
  {
    id: 'lovable-dev',
    title: 'Lovable.dev',
    description: 'AI-технологии Lovable.dev. Создание приложений с помощью искусственного интеллекта.',
    category: 'devtools',
    service: 'lovable',
    tags: ['new', 'devtools'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1581472723648-909f4851d4ae?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'lovable-12m', name: '12 месяцев' }
    ],
    requirements: {}
  },

  // Дизайн & Контент
  {
    id: 'canva-pro',
    title: 'Canva Pro',
    description: 'Инструменты дизайна и графики. Премиум шаблоны, неограниченные стоковые изображения, продвинутые функции.',
    category: 'design',
    service: 'canva',
    tags: ['popular', 'design'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'canva-12m', name: '12 месяцев' }
    ],
    requirements: {}
  },
  {
    id: 'freepik-premium',
    title: 'Freepik Premium',
    description: 'Премиум-ресурсы Freepik. Неограниченные скачивания векторов, фото, PSD, иконок и шаблонов.',
    category: 'design',
    service: 'freepik',
    tags: ['design'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'freepik-12m', name: '12 месяцев' }
    ],
    requirements: {}
  },

  // Игры
  {
    id: 'xbox-gamepass',
    title: 'Xbox Game Pass Ultimate',
    description: 'Доступ к библиотеке игр Xbox. Сотни игр для консоли и ПК, EA Play, облачный гейминг.',
    category: 'gaming',
    service: 'xbox',
    tags: ['popular', 'gaming'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'xbox-12m', name: '12 месяцев' }
    ],
    requirements: { needsRegion: true }
  },

  // Офис & Продуктивность
  {
    id: 'office-365',
    title: 'Microsoft Office 365',
    description: 'Офисные приложения Microsoft. Word, Excel, PowerPoint, Outlook и другие программы с облачным хранилищем.',
    category: 'office',
    service: 'microsoft',
    tags: ['popular', 'office'],
    flow: 'telegram_redirect',
    imageUrl: 'https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'office-1m', name: '1 месяц' },
      { id: 'office-12m', name: '12 месяцев' }
    ],
    requirements: {}
  },

  // Платежи & Услуги
  {
    id: 'foreign-cards',
    title: 'Оформление зарубежных карт',
    description: 'Оформление/содействие в получении иностранных платёжных карт. Помощь с оплатой международных сервисов.',
    category: 'payments',
    service: 'cards_service',
    tags: ['service'],
    flow: 'site_request',
    imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'card-issue', name: 'Оформление карты' }
    ],
    requirements: { needsRegion: true, needsAdditionalComment: true }
  },
  {
    id: 'custom-payment',
    title: 'Оплата других сервисов',
    description: 'Гибкие условия по договорённости. Оплата любых международных сервисов, которых нет в каталоге.',
    category: 'payments',
    service: 'custom_pay',
    tags: ['service'],
    flow: 'site_request',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=800&q=80',
    variants: [
      { id: 'custom-amount', name: 'Индивидуальный расчёт' }
    ],
    requirements: { needsAdditionalComment: true }
  }
];