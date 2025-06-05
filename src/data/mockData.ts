import { Client, Post, PostTemplate } from '../types';

export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Aesthetic Cafe',
    industry: 'Food & Beverage',
    logo: 'https://images.pexels.com/photos/1855214/pexels-photo-1855214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    color: '#F97316',
    socialAccounts: [
      {
        id: '101',
        platform: 'telegram',
        handle: '@aestheticcafe',
        connected: true,
        accountName: 'Aesthetic Cafe'
      },
      {
        id: '102',
        platform: 'instagram',
        handle: '@aesthetic.cafe',
        connected: true,
        accountName: 'Aesthetic Cafe'
      }
    ]
  },
  {
    id: '2',
    name: 'Urban Clothing',
    industry: 'Fashion',
    logo: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    color: '#0EA5E9',
    socialAccounts: [
      {
        id: '201',
        platform: 'vk',
        handle: 'urbanclothing',
        connected: true,
        accountName: 'Urban Clothing Co.'
      },
      {
        id: '202',
        platform: 'instagram',
        handle: '@urban.clothing',
        connected: true,
        accountName: 'Urban Clothing'
      }
    ]
  },
  {
    id: '3',
    name: 'Mindful Space',
    industry: 'Wellness',
    logo: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    color: '#14B8A6',
    socialAccounts: [
      {
        id: '301',
        platform: 'telegram',
        handle: '@mindfulspace',
        connected: true,
        accountName: 'Mindful Space'
      },
      {
        id: '302',
        platform: 'vk',
        handle: 'mindfulspace',
        connected: false
      },
      {
        id: '303',
        platform: 'instagram',
        handle: '@mindful.space',
        connected: true,
        accountName: 'Mindful Space'
      }
    ]
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    clientId: '1',
    content: 'Сегодня в нашем кафе новое сезонное меню! Приходите попробовать наши фирменные десерты с тыквой и специями 🍂',
    media: ['https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    platforms: ['telegram', 'instagram'],
    scheduledFor: '2025-10-01T12:00:00+03:00',
    status: 'scheduled',
    createdAt: '2025-09-25T10:30:00Z',
    updatedAt: '2025-09-25T11:45:00Z'
  },
  {
    id: '2',
    clientId: '2',
    content: 'Новая коллекция уже в магазинах! Используйте промокод URBAN25 для скидки 15% на все товары до конца недели 👕',
    media: ['https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    platforms: ['vk', 'instagram'],
    scheduledFor: '2025-10-02T15:00:00+03:00',
    status: 'draft',
    createdAt: '2025-09-26T09:15:00Z',
    updatedAt: '2025-09-26T09:15:00Z'
  },
  {
    id: '3',
    clientId: '3',
    content: '5 простых медитаций, которые можно делать прямо на рабочем месте. Сохраняйте, чтобы не потерять 🧘‍♀️',
    media: ['https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'],
    platforms: ['telegram', 'vk', 'instagram'],
    scheduledFor: '2025-10-03T08:00:00+03:00',
    status: 'scheduled',
    createdAt: '2025-09-27T14:20:00Z',
    updatedAt: '2025-09-27T16:35:00Z'
  }
];

export const mockTemplates: PostTemplate[] = [
  {
    id: '1',
    title: 'Новинка',
    description: 'Анонс нового продукта или услуги',
    content: 'Мы рады представить вам нашу новинку — [НАЗВАНИЕ]! [ОПИСАНИЕ ПРОДУКТА/УСЛУГИ]. Доступно уже сейчас по цене [ЦЕНА]. Успейте попробовать первыми!',
    industry: 'all'
  },
  {
    id: '2',
    title: 'Совет эксперта',
    description: 'Профессиональный совет по теме',
    content: '[ЧИСЛО] [СОВЕТОВ/РЕКОМЕНДАЦИЙ] от наших экспертов, как [ДЕЙСТВИЕ/РЕЗУЛЬТАТ]. [КРАТКОЕ ОПИСАНИЕ]. Сохраняйте этот пост, чтобы не потерять!',
    industry: 'all'
  },
  {
    id: '3',
    title: 'Закулисье',
    description: 'Показ процесса работы',
    content: 'А вы знали, как мы [ПРОЦЕСС]? Сегодня приоткрываем завесу тайны и показываем, что происходит за кулисами. [ОПИСАНИЕ ПРОЦЕССА]',
    industry: 'all'
  }
];