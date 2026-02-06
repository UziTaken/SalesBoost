/**
 * Advanced Settings Page
 *
 * 高级设置页面 - 支持全面的用户定制化
 *
 * Author: Claude (Anthropic)
 * Date: 2026-02-05
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface CustomerPersona {
  id?: string;
  industry: string;
  position: string;
  personality: string;
  budget_range: string;
  decision_style: string;
  pain_points: string[];
  needs: string[];
}

interface CoachStyle {
  strictness: 'strict' | 'balanced' | 'lenient';
  feedback_frequency: 'high' | 'normal' | 'low';
  focus_areas: string[];
  tone: 'professional' | 'friendly' | 'motivational';
}

interface TrainingDifficulty {
  mode: 'adaptive' | 'manual' | 'challenge';
  level: number;
  adaptive_speed: 'slow' | 'normal' | 'fast';
}

export const AdvancedSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'personas' | 'coach' | 'difficulty' | 'export'>('personas');

  // 自定义客户画像
  const [customPersonas, setCustomPersonas] = useState<CustomerPersona[]>([]);
  const [editingPersona, setEditingPersona] = useState<CustomerPersona | null>(null);

  // AI教练风格
  const [coachStyle, setCoachStyle] = useState<CoachStyle>({
    strictness: 'balanced',
    feedback_frequency: 'normal',
    focus_areas: [],
    tone: 'professional',
  });

  // 训练难度
  const [difficulty, setDifficulty] = useState<TrainingDifficulty>({
    mode: 'adaptive',
    level: 3,
    adaptive_speed: 'normal',
  });

  // 加载用户偏好
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      // Note: In production, get token from session
      const response = await fetch('/api/user/preferences', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomPersonas(data.custom_personas || []);
        setCoachStyle(data.coach_style || coachStyle);
        setDifficulty(data.training_difficulty || difficulty);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const savePreferences = async () => {
    try {
      // Note: In production, get token from session
      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          custom_personas: customPersonas,
          coach_style: coachStyle,
          training_difficulty: difficulty,
        }),
      });

      if (response.ok) {
        alert('设置已保存！');
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('保存失败，请重试');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">高级设置</h1>
        <p className="text-gray-600 mt-2">
          自定义你的训练体验，打造专属的AI销售教练
        </p>
      </div>

      {/* 标签页 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'personas', label: '客户画像', icon: '👤' },
            { id: 'coach', label: 'AI教练', icon: '🤖' },
            { id: 'difficulty', label: '训练难度', icon: '🎯' },
            { id: 'export', label: '数据导出', icon: '📊' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 客户画像设置 */}
      {activeTab === 'personas' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">💡 什么是自定义客户画像？</h3>
            <p className="text-sm text-blue-800">
              创建符合你实际工作场景的客户类型，让AI模拟更真实的销售对话。
              你可以设置客户的行业、职位、性格、预算等特征。
            </p>
          </div>

          {/* 预设画像 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">预设画像</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PersonaCard
                title="企业CTO"
                description="技术决策者，关注技术细节和ROI"
                tags={['技术型', '理性决策', '高预算']}
                onUse={() => {/* 使用预设 */}}
              />
              <PersonaCard
                title="中小企业主"
                description="务实决策者，关注性价比和快速见效"
                tags={['务实型', '直觉决策', '中等预算']}
                onUse={() => {/* 使用预设 */}}
              />
            </div>
          </div>

          {/* 自定义画像列表 */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">我的自定义画像</h3>
              <button
                onClick={() => setEditingPersona({
                  industry: '',
                  position: '',
                  personality: '',
                  budget_range: '',
                  decision_style: '',
                  pain_points: [],
                  needs: [],
                })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + 创建新画像
              </button>
            </div>

            {customPersonas.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">还没有自定义画像</p>
                <p className="text-sm text-gray-400 mt-1">点击上方按钮创建第一个</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customPersonas.map((persona, index) => (
                  <PersonaCard
                    key={index}
                    title={`${persona.industry} - ${persona.position}`}
                    description={`${persona.personality} | ${persona.decision_style}`}
                    tags={persona.pain_points.slice(0, 3)}
                    onEdit={() => setEditingPersona(persona)}
                    onDelete={() => {
                      setCustomPersonas(customPersonas.filter((_, i) => i !== index));
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI教练风格设置 */}
      {activeTab === 'coach' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">🤖 定制你的AI教练</h3>
            <p className="text-sm text-blue-800">
              调整AI教练的风格，让TA更符合你的学习习惯和需求。
            </p>
          </div>

          {/* 严格程度 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              严格程度
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'strict', label: '严格', desc: '高标准要求' },
                { value: 'balanced', label: '平衡', desc: '适度要求' },
                { value: 'lenient', label: '宽松', desc: '鼓励为主' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCoachStyle({ ...coachStyle, strictness: option.value as any })}
                  className={`
                    p-4 border-2 rounded-lg text-left transition-all
                    ${
                      coachStyle.strictness === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 反馈频率 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              反馈频率
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'high', label: '高频', desc: '每句话都反馈' },
                { value: 'normal', label: '正常', desc: '关键点反馈' },
                { value: 'low', label: '低频', desc: '总结性反馈' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCoachStyle({ ...coachStyle, feedback_frequency: option.value as any })}
                  className={`
                    p-4 border-2 rounded-lg text-left transition-all
                    ${
                      coachStyle.feedback_frequency === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 语气风格 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              语气风格
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'professional', label: '专业', desc: '正式严谨' },
                { value: 'friendly', label: '友好', desc: '亲切温和' },
                { value: 'motivational', label: '激励', desc: '充满激情' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setCoachStyle({ ...coachStyle, tone: option.value as any })}
                  className={`
                    p-4 border-2 rounded-lg text-left transition-all
                    ${
                      coachStyle.tone === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 训练难度设置 */}
      {activeTab === 'difficulty' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">🎯 调整训练难度</h3>
            <p className="text-sm text-blue-800">
              选择适合你当前水平的难度，系统会自动调整客户的挑战程度。
            </p>
          </div>

          {/* 难度模式 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              难度模式
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'adaptive', label: '自适应', desc: '根据表现自动调整' },
                { value: 'manual', label: '手动', desc: '固定难度等级' },
                { value: 'challenge', label: '挑战', desc: '始终保持高难度' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setDifficulty({ ...difficulty, mode: option.value as any })}
                  className={`
                    p-4 border-2 rounded-lg text-left transition-all
                    ${
                      difficulty.mode === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 难度等级 */}
          {difficulty.mode === 'manual' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                难度等级: {difficulty.level}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={difficulty.level}
                onChange={(e) => setDifficulty({ ...difficulty, level: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>1 - 入门</span>
                <span>3 - 中级</span>
                <span>5 - 专家</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 数据导出设置 */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">📊 导出你的数据</h3>
            <p className="text-sm text-blue-800">
              导出训练记录和分析报告，用于深度分析或团队分享。
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4">导出选项</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  导出格式
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-2">
                  <option value="csv">CSV (Excel兼容)</option>
                  <option value="excel">Excel (.xlsx)</option>
                  <option value="json">JSON (开发者)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">包含对话记录</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm">包含技能分析</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm">包含录音文件</span>
                </label>
              </div>

              <button className="w-full mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                导出数据
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 保存按钮 */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          取消
        </button>
        <button
          onClick={savePreferences}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          保存设置
        </button>
      </div>
    </div>
  );
};

// 画像卡片组件
const PersonaCard: React.FC<{
  title: string;
  description: string;
  tags: string[];
  onUse?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}> = ({ title, description, tags, onUse, onEdit, onDelete }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      <div className="flex flex-wrap gap-2 mt-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex space-x-2 mt-4">
        {onUse && (
          <button
            onClick={onUse}
            className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            使用
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-1.5 border border-gray-300 text-sm rounded hover:bg-gray-50"
          >
            编辑
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="px-3 py-1.5 text-red-600 text-sm rounded hover:bg-red-50"
          >
            删除
          </button>
        )}
      </div>
    </div>
  );
};

export default AdvancedSettings;
