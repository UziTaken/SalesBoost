/**
 * PWA Utilities
 *
 * PWA相关工具函数：注册Service Worker、推送通知、离线检测
 *
 * Author: Claude (Anthropic)
 * Date: 2026-02-05
 */

/**
 * 注册Service Worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    console.log('Service Worker registered:', registration);

    // 监听更新
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 新版本可用
            showUpdateNotification();
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * 显示更新通知
 */
function showUpdateNotification() {
  const shouldUpdate = confirm(
    '发现新版本！点击确定刷新页面以获取最新功能。'
  );

  if (shouldUpdate) {
    // 通知Service Worker跳过等待
    navigator.serviceWorker.controller?.postMessage({ type: 'SKIP_WAITING' });

    // 刷新页面
    window.location.reload();
  }
}

/**
 * 请求推送通知权限
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

/**
 * 订阅推送通知
 */
export async function subscribeToPushNotifications(
  registration: ServiceWorkerRegistration,
  vapidPublicKey: string
): Promise<PushSubscription | null> {
  try {
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }

    // 订阅推送
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    console.log('Push subscription:', subscription);

    // 发送订阅信息到服务器
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription),
    });

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}

/**
 * 转换VAPID密钥格式
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

/**
 * 检测是否离线
 */
export function isOffline(): boolean {
  return !navigator.onLine;
}

/**
 * 监听在线/离线状态
 */
export function watchOnlineStatus(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  // 返回清理函数
  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

/**
 * 检测是否为PWA模式
 */
export function isPWA(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * 显示安装提示
 */
export function showInstallPrompt(): void {
  let deferredPrompt: any = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    // 阻止默认提示
    e.preventDefault();
    deferredPrompt = e;

    // 显示自定义安装按钮
    const installButton = document.getElementById('install-button');
    if (installButton) {
      installButton.style.display = 'block';

      installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
          // 显示安装提示
          deferredPrompt.prompt();

          // 等待用户响应
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User response: ${outcome}`);

          // 清理
          deferredPrompt = null;
          installButton.style.display = 'none';
        }
      });
    }
  });

  // 监听安装成功
  window.addEventListener('appinstalled', () => {
    console.log('PWA installed successfully');
    deferredPrompt = null;
  });
}

/**
 * 后台同步
 */
export async function registerBackgroundSync(
  registration: ServiceWorkerRegistration,
  tag: string
): Promise<void> {
  if (!('sync' in registration)) {
    console.warn('Background Sync not supported');
    return;
  }

  try {
    // Type assertion for sync API
    const syncManager = (registration as any).sync;
    await syncManager.register(tag);
    console.log(`Background sync registered: ${tag}`);
  } catch (error) {
    console.error('Failed to register background sync:', error);
  }
}

/**
 * 保存数据到IndexedDB（用于离线支持）
 */
export async function saveToIndexedDB(
  storeName: string,
  data: any
): Promise<void> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SalesBoostDB', 1);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const addRequest = store.add(data);

      addRequest.onerror = () => reject(addRequest.error);
      addRequest.onsuccess = () => resolve();
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

/**
 * 从IndexedDB读取数据
 */
export async function readFromIndexedDB(storeName: string): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SalesBoostDB', 1);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();

      getAllRequest.onerror = () => reject(getAllRequest.error);
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
    };
  });
}

/**
 * 清空缓存
 */
export async function clearCache(): Promise<void> {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
  }

  // 清空IndexedDB
  const dbs = await indexedDB.databases();
  for (const db of dbs) {
    if (db.name) {
      indexedDB.deleteDatabase(db.name);
    }
  }

  console.log('Cache cleared');
}

/**
 * 获取缓存大小
 */
export async function getCacheSize(): Promise<number> {
  if (!('storage' in navigator && 'estimate' in navigator.storage)) {
    return 0;
  }

  const estimate = await navigator.storage.estimate();
  return estimate.usage || 0;
}

/**
 * 检查存储配额
 */
export async function checkStorageQuota(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
}> {
  if (!('storage' in navigator && 'estimate' in navigator.storage)) {
    return { usage: 0, quota: 0, percentage: 0 };
  }

  const estimate = await navigator.storage.estimate();
  const usage = estimate.usage || 0;
  const quota = estimate.quota || 0;
  const percentage = quota > 0 ? (usage / quota) * 100 : 0;

  return { usage, quota, percentage };
}

export default {
  registerServiceWorker,
  requestNotificationPermission,
  subscribeToPushNotifications,
  isOffline,
  watchOnlineStatus,
  isPWA,
  showInstallPrompt,
  registerBackgroundSync,
  saveToIndexedDB,
  readFromIndexedDB,
  clearCache,
  getCacheSize,
  checkStorageQuota,
};
