/**
 * Onboarding Hook
 *
 * 新手引导状态管理
 *
 * Author: Claude (Anthropic)
 * Date: 2026-02-05
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface OnboardingState {
  /** 是否完成引导 */
  isComplete: boolean;
  /** 当前步骤 */
  currentStep: number;
  /** 已完成的步骤 */
  completedSteps: number[];
  /** 跳过时间 */
  skippedAt?: string;
}

const TOTAL_STEPS = 5;
const STORAGE_KEY = 'salesboost_onboarding';

/**
 * 新手引导Hook
 */
export const useOnboarding = () => {
  const { user } = useAuth();
  const [state, setState] = useState<OnboardingState>({
    isComplete: false,
    currentStep: 0,
    completedSteps: [],
  });

  // 从本地存储加载状态
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${user.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setState(parsed);
        } catch (error) {
          console.error('Failed to parse onboarding state:', error);
        }
      }
    }
  }, [user]);

  // 保存状态到本地存储
  const saveState = useCallback(
    (newState: OnboardingState) => {
      if (user) {
        localStorage.setItem(
          `${STORAGE_KEY}_${user.id}`,
          JSON.stringify(newState)
        );
        setState(newState);
      }
    },
    [user]
  );

  // 标记步骤完成
  const markStepComplete = useCallback(
    (step: number) => {
      const newCompletedSteps = [...state.completedSteps];
      if (!newCompletedSteps.includes(step)) {
        newCompletedSteps.push(step);
      }

      const newState: OnboardingState = {
        ...state,
        currentStep: step + 1,
        completedSteps: newCompletedSteps,
      };

      saveState(newState);
    },
    [state, saveState]
  );

  // 标记引导完成
  const markOnboardingComplete = useCallback(() => {
    const newState: OnboardingState = {
      ...state,
      isComplete: true,
      currentStep: TOTAL_STEPS,
      completedSteps: Array.from({ length: TOTAL_STEPS }, (_, i) => i),
    };

    saveState(newState);

    // 发送完成事件到后端
    if (user) {
      // Note: In production, get token from session
      fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          completedAt: new Date().toISOString(),
        }),
      }).catch((error) => {
        console.error('Failed to report onboarding completion:', error);
      });
    }
  }, [state, saveState, user]);

  // 跳过引导
  const skipOnboarding = useCallback(() => {
    const newState: OnboardingState = {
      ...state,
      isComplete: true,
      skippedAt: new Date().toISOString(),
    };

    saveState(newState);

    // 发送跳过事件到后端
    if (user) {
      // Note: In production, get token from session
      fetch('/api/onboarding/skip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          skippedAt: newState.skippedAt,
          currentStep: state.currentStep,
        }),
      }).catch((error) => {
        console.error('Failed to report onboarding skip:', error);
      });
    }
  }, [state, saveState, user]);

  // 重置引导
  const resetOnboarding = useCallback(() => {
    const newState: OnboardingState = {
      isComplete: false,
      currentStep: 0,
      completedSteps: [],
    };

    saveState(newState);
  }, [saveState]);

  // 获取进度百分比
  const getProgress = useCallback(() => {
    return (state.completedSteps.length / TOTAL_STEPS) * 100;
  }, [state.completedSteps]);

  return {
    // 状态
    isOnboardingComplete: state.isComplete,
    currentStep: state.currentStep,
    completedSteps: state.completedSteps,
    totalSteps: TOTAL_STEPS,
    progress: getProgress(),

    // 操作
    markStepComplete,
    markOnboardingComplete,
    skipOnboarding,
    resetOnboarding,
  };
};

/**
 * 检查是否应该显示引导
 */
export const useShouldShowOnboarding = (): boolean => {
  const { user } = useAuth();
  const { isOnboardingComplete } = useOnboarding();

  // 新用户且未完成引导
  return !!user && !isOnboardingComplete;
};

export default useOnboarding;
