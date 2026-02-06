/**
 * Task Service - Real API Integration
 *
 * Replaces mock data with real backend API calls
 */

import { api } from './api';
import { Task, Statistics } from '@/types/dashboard';

// API endpoints
const TASKS_ENDPOINT = '/api/v1/tasks';
const STATISTICS_ENDPOINT = '/api/v1/statistics';

/**
 * Get all tasks for the current user
 */
export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<{ items: any[]; total: number }>(TASKS_ENDPOINT);

    // Transform backend response to frontend Task format
    return response.items.map((item: any) => ({
      id: item.id.toString(),
      courseName: item.title,
      courseSubtitle: item.description || '',
      taskInfo: item.instructions || '',
      taskTag: item.task_type,
      status: mapTaskStatus(item.status),
      timeRange: {
        start: item.created_at,
        end: item.updated_at
      },
      progress: {
        completed: Math.floor((item.completion_rate || 0) / 100 * (item.points || 100)),
        total: item.points || 100,
        bestScore: item.average_score || 0
      }
    }));
  } catch (error) {
    console.error('[TaskService] Failed to fetch tasks:', error);
    // Return empty array on error to prevent UI crash
    return [];
  }
};

/**
 * Get statistics for the current user
 */
export const getStatistics = async (): Promise<Statistics> => {
  try {
    const response = await api.get<Statistics>(STATISTICS_ENDPOINT);
    return response;
  } catch (error) {
    console.error('[TaskService] Failed to fetch statistics:', error);
    // Return default statistics on error
    return {
      totalTasks: 0,
      inProgress: 0,
      completed: 0,
      averageScore: 0,
      lockedItems: 0
    };
  }
};

/**
 * Start a task (create a new training session)
 */
export const startTask = async (taskId: string): Promise<{ session_id: string; message: string }> => {
  try {
    const response = await api.post<{ session_id: string; task_id: number; message: string }>(
      `${TASKS_ENDPOINT}/${taskId}/start`
    );
    return {
      session_id: response.session_id,
      message: response.message
    };
  } catch (error) {
    console.error('[TaskService] Failed to start task:', error);
    throw error;
  }
};

/**
 * Get task details by ID
 */
export const getTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const response = await api.get<any>(`${TASKS_ENDPOINT}/${taskId}`);

    return {
      id: response.id.toString(),
      courseName: response.title,
      courseSubtitle: response.description || '',
      taskInfo: response.instructions || '',
      taskTag: response.task_type,
      status: mapTaskStatus(response.status),
      timeRange: {
        start: response.created_at,
        end: response.updated_at
      },
      progress: {
        completed: Math.floor((response.completion_rate || 0) / 100 * (response.points || 100)),
        total: response.points || 100,
        bestScore: response.average_score || 0
      }
    };
  } catch (error) {
    console.error('[TaskService] Failed to fetch task:', error);
    return null;
  }
};

/**
 * Map backend task status to frontend status
 */
function mapTaskStatus(backendStatus: string): 'pending' | 'in-progress' | 'completed' {
  switch (backendStatus.toLowerCase()) {
    case 'locked':
      return 'pending';
    case 'available':
      return 'pending';
    case 'in_progress':
    case 'active':
      return 'in-progress';
    case 'completed':
      return 'completed';
    default:
      return 'pending';
  }
}

export default {
  getTasks,
  getStatistics,
  startTask,
  getTaskById
};
