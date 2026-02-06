/**
 * Interactive Onboarding Wizard
 *
 * 交互式新手引导系统
 *
 * 功能：
 * 1. 5步引导流程
 * 2. 实时提示和帮助
 * 3. 可跳过但可重新启动
 * 4. 进度追踪
 *
 * Author: Claude (Anthropic)
 * Date: 2026-02-05
 */

import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useOnboarding } from '../../hooks/useOnboarding';

interface OnboardingWizardProps {
  /** 是否自动启动 */
  autoStart?: boolean;
  /** 完成回调 */
  onComplete?: () => void;
}

/**
 * 新手引导向导组件
 */
export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  autoStart = true,
  onComplete,
}) => {
  const {
    isOnboardingComplete,
    currentStep,
    markStepComplete,
    markOnboardingComplete,
    resetOnboarding,
  } = useOnboarding();

  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // 引导步骤定义
  const steps: Step[] = [
    {
      target: '.dashboard-welcome',
      content: (
        <div>
          <h3>👋 欢迎来到 SalesBoost！</h3>
          <p>
            我是你的AI销售教练，接下来用30秒带你快速了解如何使用这个系统。
          </p>
          <p className="text-sm text-gray-600">
            提示：你可以随时按 ESC 跳过引导，之后可以在设置中重新启动。
          </p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '.practice-button',
      content: (
        <div>
          <h3>🎯 第一步：开始练习</h3>
          <p>
            点击"开始练习"按钮，你将进入一个真实的销售场景。
          </p>
          <p>
            系统会模拟一个客户，你需要像真实销售一样与TA对话。
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>✓ 安全环境，不用担心犯错</li>
            <li>✓ AI客户会有真实的情绪和反应</li>
            <li>✓ 每次练习都不一样</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '.ai-coach-panel',
      content: (
        <div>
          <h3>🤖 第二步：实时AI教练</h3>
          <p>
            在对话过程中，右侧的AI教练会实时给你反馈：
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>🟢 <strong>做得好：</strong>哪些话术有效</li>
            <li>🟡 <strong>可以改进：</strong>哪里可以优化</li>
            <li>🔴 <strong>需要注意：</strong>可能的风险点</li>
          </ul>
          <p className="text-sm text-gray-600 mt-2">
            这就像有一个资深销售在旁边指导你！
          </p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '.skill-radar',
      content: (
        <div>
          <h3>📊 第三步：技能雷达图</h3>
          <p>
            每次练习后，系统会分析你的表现，生成技能雷达图：
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>• <strong>需求挖掘：</strong>是否准确识别客户需求</li>
            <li>• <strong>异议处理：</strong>如何应对客户质疑</li>
            <li>• <strong>情绪管理：</strong>是否保持专业和热情</li>
            <li>• <strong>成交技巧：</strong>促成交易的能力</li>
          </ul>
          <p className="text-sm text-blue-600 mt-2">
            💡 持续练习，看着自己的技能不断提升！
          </p>
        </div>
      ),
      placement: 'top',
    },
    {
      target: '.history-button',
      content: (
        <div>
          <h3>📚 第四步：历史记录</h3>
          <p>
            所有的练习记录都会保存，你可以随时回顾：
          </p>
          <ul className="text-sm mt-2 space-y-1">
            <li>• 查看完整对话记录</li>
            <li>• 重听录音（如果开启）</li>
            <li>• 对比不同时期的表现</li>
            <li>• 导出数据做深度分析</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '.dashboard-welcome',
      content: (
        <div>
          <h3>🎉 准备好了吗？</h3>
          <p>
            现在你已经了解了基本功能，可以开始你的第一次练习了！
          </p>
          <div className="bg-blue-50 p-3 rounded mt-3">
            <p className="text-sm font-medium text-blue-900">
              💪 小贴士：
            </p>
            <ul className="text-sm text-blue-800 mt-1 space-y-1">
              <li>• 第一次可能会紧张，这很正常</li>
              <li>• 把AI客户当成真实客户对待</li>
              <li>• 注意听取AI教练的建议</li>
              <li>• 多练习几次，你会看到明显进步</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            如需帮助，点击右下角的"帮助"按钮，或发送邮件到 support@salesboost.ai
          </p>
        </div>
      ),
      placement: 'center',
    },
  ];

  // 自动启动
  useEffect(() => {
    if (autoStart && !isOnboardingComplete) {
      setRun(true);
    }
  }, [autoStart, isOnboardingComplete]);

  // 处理引导回调
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;

    // 更新步骤索引
    if (type === 'step:after') {
      setStepIndex(index + 1);
      markStepComplete(index);
    }

    // 完成或跳过
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);

      if (status === STATUS.FINISHED) {
        markOnboardingComplete();
        onComplete?.();
      }
    }
  };

  // 手动启动引导
  const startTour = () => {
    setStepIndex(0);
    setRun(true);
  };

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        stepIndex={stepIndex}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#3b82f6',
            zIndex: 10000,
          },
          tooltip: {
            fontSize: 14,
            padding: 20,
          },
          tooltipContent: {
            padding: '10px 0',
          },
          buttonNext: {
            backgroundColor: '#3b82f6',
            fontSize: 14,
            padding: '8px 16px',
          },
          buttonBack: {
            color: '#6b7280',
            fontSize: 14,
          },
          buttonSkip: {
            color: '#9ca3af',
            fontSize: 13,
          },
        }}
        locale={{
          back: '上一步',
          close: '关闭',
          last: '完成',
          next: '下一步',
          skip: '跳过引导',
        }}
      />

      {/* 重新启动按钮（在设置页面显示） */}
      {isOnboardingComplete && (
        <button
          onClick={startTour}
          className="text-sm text-blue-600 hover:text-blue-700 underline"
        >
          重新观看新手引导
        </button>
      )}
    </>
  );
};

/**
 * 引导进度指示器
 */
export const OnboardingProgress: React.FC = () => {
  const { currentStep, totalSteps, isOnboardingComplete } = useOnboarding();

  if (isOnboardingComplete) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            新手引导进行中
          </p>
          <p className="text-xs text-gray-500">
            第 {currentStep + 1} / {totalSteps} 步
          </p>
        </div>
      </div>
      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

/**
 * 快速提示气泡
 */
interface QuickTipProps {
  /** 提示内容 */
  content: string;
  /** 目标元素选择器 */
  target: string;
  /** 是否显示 */
  show: boolean;
  /** 关闭回调 */
  onClose: () => void;
}

export const QuickTip: React.FC<QuickTipProps> = ({
  content,
  target,
  show,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 shadow-lg pointer-events-auto">
        <div className="flex items-start space-x-2">
          <span className="text-yellow-600 text-xl">💡</span>
          <div className="flex-1">
            <p className="text-sm text-gray-800">{content}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
