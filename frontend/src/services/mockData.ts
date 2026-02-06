import { Task, Statistics } from '@/types/dashboard';
import { CustomerPersona, HistoryRecord, HistoryStats } from '@/types/business';

export const mockStatistics: Statistics = {
  totalTasks: 5,
  inProgress: 3,
  completed: 1,
  averageScore: 84,
  lockedItems: 0
};

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

export const mockHistoryStats: HistoryStats = {
  totalRehearsals: 8,
  averageScore: 82,
  bestScore: 92,
  totalDurationMinutes: 120
};

export const mockHistoryRecords: HistoryRecord[] = [
  {
    id: '1',
    dateTime: '2024-12-21 14:30',
    courseName: '新客户开干上场专项训练',
    customerName: '刘小牛',
    customerRole: '27岁 · 电商采购',
    category: '新客户开干',
    duration: '15分32秒',
    score: 85,
    scoreLevel: 'good'
  },
  {
    id: '2',
    dateTime: '2024-12-20 10:15',
    courseName: '异议处理专项',
    customerName: '王女士',
    customerRole: '35岁 · 金融/理财',
    category: '异议处理',
    duration: '18分20秒',
    score: 78,
    scoreLevel: 'average'
  },
  {
    id: '3',
    dateTime: '2024-12-19 16:45',
    courseName: '权益海报专项',
    customerName: '赵某',
    customerRole: '42岁 · 企业高管',
    category: '权益海报',
    duration: '12分08秒',
    score: 92,
    scoreLevel: 'excellent'
  },
  {
    id: '4',
    dateTime: '2024-12-18 09:30',
    courseName: '合同签署专项',
    customerName: '陈女士',
    customerRole: '30岁 · 法务',
    category: '合同签署',
    duration: '14分15秒',
    score: 82,
    scoreLevel: 'good'
  }
];

export const getCustomers = async (): Promise<CustomerPersona[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCustomers);
    }, 600);
  });
};

export const getHistory = async (): Promise<{ stats: HistoryStats; records: HistoryRecord[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: mockHistoryStats,
        records: mockHistoryRecords
      });
    }, 700);
  });
};

export const mockTasks: Task[] = [
  {
    id: '1',
    courseName: '斯睿客户上场专项训练',
    courseSubtitle: '2/17 片段 | 课程打点',
    taskInfo: '第一季客户训练计划',
    taskTag: '新人培训',
    status: 'in-progress',
    timeRange: {
      start: '2024-12-01',
      end: '2024-12-31'
    },
    progress: {
      completed: 3,
      total: 5,
      bestScore: 85
    }
  },
  {
    id: '2',
    courseName: '异议处理训练',
    courseSubtitle: '35分钟 | 多主题 | 重点练习',
    taskInfo: '销售策略专项复盘',
    taskTag: '技能提升',
    status: 'pending',
    timeRange: {
      start: '2024-12-10',
      end: '2024-12-15'
    },
    progress: {
      completed: 0,
      total: 3
    }
  },
  {
    id: '3',
    courseName: '权益海报场景',
    courseSubtitle: '42分钟 | 多场景',
    taskInfo: '客诉客户实战训练',
    taskTag: '高端客户',
    status: 'completed',
    timeRange: {
      start: '2024-11-15',
      end: '2024-11-30'
    },
    progress: {
      completed: 5,
      total: 5,
      bestScore: 92
    }
  },
  {
    id: '4',
    courseName: '合同签署训练',
    courseSubtitle: '38分钟 | 重点练习',
    taskInfo: '合同洽谈和签约流程',
    taskTag: '合规',
    status: 'in-progress',
    timeRange: {
      start: '2024-12-05',
      end: '2024-12-20'
    },
    progress: {
      completed: 2,
      total: 4,
      bestScore: 78
    }
  },
  {
    id: '5',
    courseName: '客户需求挖掘',
    courseSubtitle: '26分钟 | 引导技巧',
    taskInfo: '高效问询与倾听',
    taskTag: '产品知识',
    status: 'in-progress',
    timeRange: {
      start: '2024-12-10',
      end: '2024-12-22'
    },
    progress: {
      completed: 1,
      total: 3,
      bestScore: 80
    }
  }
];

export const getTasks = async (): Promise<Task[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTasks);
    }, 500);
  });
};

export const getStatistics = async (): Promise<Statistics> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockStatistics);
    }, 500);
  });
};
