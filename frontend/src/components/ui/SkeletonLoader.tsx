/**
 * Skeleton Loader Components
 *
 * 骨架屏加载组件 - 提升感知速度
 *
 * Author: Claude (Anthropic)
 * Date: 2026-02-05
 */

import React from 'react';

/**
 * 基础骨架屏组件
 */
export const Skeleton: React.FC<{
  width?: string;
  height?: string;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}> = ({ width = '100%', height = '20px', className = '', variant = 'text' }) => {
  const baseClass = 'animate-pulse bg-gray-200';

  const variantClass = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }[variant];

  return (
    <div
      className={`${baseClass} ${variantClass} ${className}`}
      style={{ width, height }}
    />
  );
};

/**
 * 对话卡片骨架屏
 */
export const ConversationCardSkeleton: React.FC = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      {/* 头部 */}
      <div className="flex items-center space-x-3">
        <Skeleton variant="circular" width="40px" height="40px" />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height="16px" />
          <Skeleton width="40%" height="14px" />
        </div>
      </div>

      {/* 内容 */}
      <div className="space-y-2">
        <Skeleton width="100%" height="14px" />
        <Skeleton width="90%" height="14px" />
        <Skeleton width="95%" height="14px" />
      </div>

      {/* 底部 */}
      <div className="flex justify-between items-center pt-2">
        <Skeleton width="80px" height="24px" variant="rectangular" />
        <Skeleton width="60px" height="24px" variant="rectangular" />
      </div>
    </div>
  );
};

/**
 * 技能雷达图骨架屏
 */
export const SkillRadarSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      <Skeleton width="150px" height="24px" />
      <div className="flex justify-center">
        <Skeleton variant="circular" width="300px" height="300px" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton width="80px" height="14px" />
            <Skeleton width="100%" height="8px" variant="rectangular" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 仪表板骨架屏
 */
export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6">
        <Skeleton width="200px" height="32px" className="bg-white/20" />
        <Skeleton width="300px" height="20px" className="bg-white/20 mt-2" />
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 space-y-3">
            <Skeleton width="60px" height="14px" />
            <Skeleton width="80px" height="32px" />
            <Skeleton width="100px" height="12px" />
          </div>
        ))}
      </div>

      {/* 主要内容区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧 - 最近练习 */}
        <div className="lg:col-span-2 space-y-4">
          <Skeleton width="150px" height="24px" />
          {[1, 2, 3].map((i) => (
            <ConversationCardSkeleton key={i} />
          ))}
        </div>

        {/* 右侧 - 技能雷达 */}
        <div>
          <SkillRadarSkeleton />
        </div>
      </div>
    </div>
  );
};

/**
 * 列表骨架屏
 */
export const ListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4 bg-white rounded-lg">
          <Skeleton variant="circular" width="48px" height="48px" />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height="16px" />
            <Skeleton width="50%" height="14px" />
          </div>
          <Skeleton width="80px" height="32px" variant="rectangular" />
        </div>
      ))}
    </div>
  );
};

/**
 * 表格骨架屏
 */
export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 4,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* 表头 */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} width="80px" height="16px" />
          ))}
        </div>
      </div>

      {/* 表体 */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {Array.from({ length: cols }).map((_, colIndex) => (
                <Skeleton key={colIndex} width="100%" height="14px" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 聊天消息骨架屏
 */
export const ChatMessageSkeleton: React.FC<{ isUser?: boolean }> = ({ isUser = false }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start space-x-2 max-w-[70%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <Skeleton variant="circular" width="32px" height="32px" />
        <div className={`space-y-2 ${isUser ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg p-3`}>
          <Skeleton width="200px" height="14px" />
          <Skeleton width="150px" height="14px" />
        </div>
      </div>
    </div>
  );
};

/**
 * 个人资料骨架屏
 */
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 space-y-6">
      {/* 头像和基本信息 */}
      <div className="flex items-center space-x-4">
        <Skeleton variant="circular" width="80px" height="80px" />
        <div className="flex-1 space-y-2">
          <Skeleton width="150px" height="24px" />
          <Skeleton width="200px" height="16px" />
          <Skeleton width="180px" height="14px" />
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center space-y-2">
            <Skeleton width="60px" height="32px" className="mx-auto" />
            <Skeleton width="80px" height="14px" className="mx-auto" />
          </div>
        ))}
      </div>

      {/* 详细信息 */}
      <div className="space-y-4 pt-4 border-t">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <Skeleton width="100px" height="14px" />
            <Skeleton width="150px" height="14px" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skeleton;
