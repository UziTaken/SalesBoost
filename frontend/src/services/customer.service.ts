import api from '@/lib/api';

export interface CustomerCreate {
  name: string;
  age: number;
  job: string;
  traits: string[];
  description: string;
  avatar_color?: string;
}

export interface CustomerUpdate extends Partial<CustomerCreate> {
  id: string;
}

export interface CustomerPersona {
  id: string;
  name: string;
  age: number;
  job: string;
  traits: string[];
  description: string;
  creator: string;
  rehearsalCount: number;
  lastRehearsalTime: string;
  avatarColor: string;
}

export const customerService = {
  createCustomer: async (data: CustomerCreate) => {
    const response = await api.post<CustomerPersona>('/customers', data);
    return response.data;
  },

  getCustomers: async () => {
    const response = await api.get<CustomerPersona[]>('/customers');
    return response.data;
  },

  getCustomer: async (customerId: string) => {
    const response = await api.get<CustomerPersona>(`/customers/${customerId}`);
    return response.data;
  },

  updateCustomer: async (customerId: string, data: Partial<CustomerCreate>) => {
    const response = await api.patch<CustomerPersona>(`/customers/${customerId}`, data);
    return response.data;
  },

  deleteCustomer: async (customerId: string) => {
    const response = await api.delete<{ message: string }>(`/customers/${customerId}`);
    return response.data;
  }
};

// Mock data fallback
export const mockCustomers: CustomerPersona[] = [
  {
    id: '1',
    name: '刁元仁',
    age: 27,
    job: '电商/货品采购',
    traits: ['已婚/怀孕1胎预产前'],
    description: '27岁 · 已婚/怀孕1胎预产前 · 电商/货品采购',
    creator: '张刚',
    rehearsalCount: 0,
    lastRehearsalTime: '今天 17:29',
    avatarColor: 'from-blue-200 to-blue-400'
  },
  {
    id: '2',
    name: '上女士',
    age: 35,
    job: '金融/理财',
    traits: ['有车', '公益爱好者'],
    description: '35岁 · 金融/理财 · 有车 · 公益爱好者',
    creator: '上芳',
    rehearsalCount: 0,
    lastRehearsalTime: '今天 15:20',
    avatarColor: 'from-purple-200 to-purple-400'
  },
  {
    id: '3',
    name: '于宅',
    age: 47,
    job: '企业管理',
    traits: ['经常在直播平台购物'],
    description: '47岁 · 企业管理 · 经常在直播平台购物',
    creator: '士芳',
    rehearsalCount: 0,
    lastRehearsalTime: '昨天 23:16',
    avatarColor: 'from-pink-200 to-pink-400'
  },
  {
    id: '4',
    name: '张小姐',
    age: 29,
    job: '设计师',
    traits: ['注重生活品质和物欲'],
    description: '29岁 · 设计师 · 注重生活品质和物欲',
    creator: '王邦',
    rehearsalCount: 0,
    lastRehearsalTime: '12月15日 10:31',
    avatarColor: 'from-orange-200 to-orange-400'
  },
  {
    id: '5',
    name: '樊理想',
    age: 28,
    job: '新媒体运营',
    traits: ['经常熬夜', '追求效率'],
    description: '28岁 · 新媒体运营 · 经常熬夜 · 追求效率',
    creator: '李鹏',
    rehearsalCount: 0,
    lastRehearsalTime: '12月14日 15:36',
    avatarColor: 'from-teal-200 to-teal-400'
  },
  {
    id: '6',
    name: '周女士',
    age: 45,
    job: '保险行业',
    traits: ['注重子女教育和家庭理财'],
    description: '45岁 · 保险行业 · 注重子女教育和家庭理财',
    creator: '沈鹏',
    rehearsalCount: 0,
    lastRehearsalTime: '12月14日 15:36',
    avatarColor: 'from-indigo-200 to-indigo-400'
  }
];

// Fallback function using mock data
export const getCustomersMock = async (): Promise<CustomerPersona[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCustomers);
    }, 600);
  });
};
