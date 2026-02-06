/**
 * Optimistic UI Hook
 *
 * 乐观更新Hook - 立即反馈用户操作
 *
 * Author: Claude (Anthropic)
 * Date: 2026-02-05
 */

import { useState, useCallback } from 'react';

interface OptimisticOptions<T> {
  /** 实际的API调用函数 */
  mutationFn: (data: T) => Promise<any>;
  /** 成功回调 */
  onSuccess?: (result: any) => void;
  /** 失败回调 */
  onError?: (error: Error) => void;
  /** 回滚回调 */
  onRollback?: () => void;
}

/**
 * 乐观更新Hook
 *
 * 使用方法：
 * ```tsx
 * const { mutate, isLoading, error } = useOptimisticUpdate({
 *   mutationFn: async (data) => {
 *     return await api.updateProfile(data);
 *   },
 *   onSuccess: (result) => {
 *     console.log('Success:', result);
 *   },
 * });
 *
 * // 立即更新UI，后台同步
 * mutate(newData);
 * ```
 */
export function useOptimisticUpdate<T>({
  mutationFn,
  onSuccess,
  onError,
  onRollback,
}: OptimisticOptions<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(
    async (data: T) => {
      setIsLoading(true);
      setError(null);

      try {
        // 执行实际的API调用
        const result = await mutationFn(data);

        // 成功
        setIsLoading(false);
        onSuccess?.(result);

        return result;
      } catch (err) {
        // 失败 - 回滚
        setIsLoading(false);
        const error = err instanceof Error ? err : new Error('Unknown error');
        setError(error);

        onRollback?.();
        onError?.(error);

        throw error;
      }
    },
    [mutationFn, onSuccess, onError, onRollback]
  );

  return {
    mutate,
    isLoading,
    error,
  };
}

/**
 * 列表乐观更新Hook
 *
 * 用于列表的增删改操作
 */
export function useOptimisticList<T extends { id: string | number }>(
  initialData: T[]
) {
  const [data, setData] = useState<T[]>(initialData);
  const [pendingOperations, setPendingOperations] = useState<Set<string | number>>(
    new Set()
  );

  // 添加项目（乐观）
  const addItem = useCallback(
    async (item: T, mutationFn: (item: T) => Promise<T>) => {
      // 立即添加到列表
      setData((prev) => [item, ...prev]);
      setPendingOperations((prev) => new Set(prev).add(item.id));

      try {
        // 后台同步
        const result = await mutationFn(item);

        // 更新为服务器返回的数据
        setData((prev) =>
          prev.map((i) => (i.id === item.id ? result : i))
        );
        setPendingOperations((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });

        return result;
      } catch (error) {
        // 失败 - 回滚
        setData((prev) => prev.filter((i) => i.id !== item.id));
        setPendingOperations((prev) => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });

        throw error;
      }
    },
    []
  );

  // 更新项目（乐观）
  const updateItem = useCallback(
    async (
      id: string | number,
      updates: Partial<T>,
      mutationFn: (id: string | number, updates: Partial<T>) => Promise<T>
    ) => {
      // 保存旧数据（用于回滚）
      const oldData = data.find((item) => item.id === id);
      if (!oldData) return;

      // 立即更新UI
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
      setPendingOperations((prev) => new Set(prev).add(id));

      try {
        // 后台同步
        const result = await mutationFn(id, updates);

        // 更新为服务器返回的数据
        setData((prev) =>
          prev.map((item) => (item.id === id ? result : item))
        );
        setPendingOperations((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });

        return result;
      } catch (error) {
        // 失败 - 回滚
        setData((prev) =>
          prev.map((item) => (item.id === id ? oldData : item))
        );
        setPendingOperations((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });

        throw error;
      }
    },
    [data]
  );

  // 删除项目（乐观）
  const deleteItem = useCallback(
    async (
      id: string | number,
      mutationFn: (id: string | number) => Promise<void>
    ) => {
      // 保存旧数据（用于回滚）
      const oldData = data.find((item) => item.id === id);
      if (!oldData) return;

      // 立即从列表移除
      setData((prev) => prev.filter((item) => item.id !== id));
      setPendingOperations((prev) => new Set(prev).add(id));

      try {
        // 后台同步
        await mutationFn(id);

        setPendingOperations((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      } catch (error) {
        // 失败 - 回滚
        setData((prev) => [...prev, oldData]);
        setPendingOperations((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });

        throw error;
      }
    },
    [data]
  );

  // 检查项目是否正在同步
  const isPending = useCallback(
    (id: string | number) => {
      return pendingOperations.has(id);
    },
    [pendingOperations]
  );

  return {
    data,
    setData,
    addItem,
    updateItem,
    deleteItem,
    isPending,
    hasPendingOperations: pendingOperations.size > 0,
  };
}

/**
 * 表单乐观更新Hook
 *
 * 用于表单提交的乐观更新
 */
export function useOptimisticForm<T>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [savedValues, setSavedValues] = useState<T>(initialValues);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // 更新字段值
  const updateField = useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        setHasUnsavedChanges(
          JSON.stringify(next) !== JSON.stringify(savedValues)
        );
        return next;
      });
    },
    [savedValues]
  );

  // 提交表单（乐观）
  const submit = useCallback(
    async (mutationFn: (data: T) => Promise<T>) => {
      setIsSaving(true);

      try {
        // 后台保存
        const result = await mutationFn(values);

        // 更新已保存的值
        setSavedValues(result);
        setValues(result);
        setHasUnsavedChanges(false);
        setIsSaving(false);

        return result;
      } catch (error) {
        // 失败 - 保持当前值，显示错误
        setIsSaving(false);
        throw error;
      }
    },
    [values]
  );

  // 重置表单
  const reset = useCallback(() => {
    setValues(savedValues);
    setHasUnsavedChanges(false);
  }, [savedValues]);

  return {
    values,
    savedValues,
    updateField,
    submit,
    reset,
    isSaving,
    hasUnsavedChanges,
  };
}

/**
 * 点赞/收藏乐观更新Hook
 *
 * 用于点赞、收藏等即时反馈操作
 */
export function useOptimisticToggle(
  initialState: boolean,
  mutationFn: (newState: boolean) => Promise<void>
) {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const toggle = useCallback(async () => {
    // 立即切换状态
    const newState = !state;
    setState(newState);
    setIsLoading(true);

    try {
      // 后台同步
      await mutationFn(newState);
      setIsLoading(false);
    } catch (error) {
      // 失败 - 回滚
      setState(state);
      setIsLoading(false);
      throw error;
    }
  }, [state, mutationFn]);

  return {
    state,
    toggle,
    isLoading,
  };
}

export default useOptimisticUpdate;
