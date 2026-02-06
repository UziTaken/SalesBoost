/**
 * Service Worker for PWA
 *
 * 提供离线支持、缓存策略和推送通知
 *
 * Author: Claude (Anthropic)
 * Date: 2026-02-05
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `salesboost-${CACHE_VERSION}`;

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/css/main.css',
  '/static/js/main.js',
];

// 需要缓存的API端点（用于离线访问）
const API_CACHE_ENDPOINTS = [
  '/api/user/profile',
  '/api/practice/history',
];

// 安装事件 - 缓存静态资源
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );

  // 立即激活新的Service Worker
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // 立即控制所有页面
  self.clients.claim();
});

// Fetch事件 - 缓存策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非GET请求
  if (request.method !== 'GET') {
    return;
  }

  // API请求：网络优先，失败时使用缓存
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // 静态资源：缓存优先，失败时使用网络
  event.respondWith(cacheFirstStrategy(request));
});

/**
 * 缓存优先策略
 * 适用于：静态资源（CSS, JS, 图片）
 */
async function cacheFirstStrategy(request) {
  try {
    // 1. 尝试从缓存获取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 2. 缓存未命中，从网络获取
    const networkResponse = await fetch(request);

    // 3. 缓存网络响应
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Cache-first strategy failed:', error);

    // 返回离线页面
    return caches.match('/offline.html');
  }
}

/**
 * 网络优先策略
 * 适用于：API请求（需要最新数据）
 */
async function networkFirstStrategy(request) {
  try {
    // 1. 尝试从网络获取
    const networkResponse = await fetch(request);

    // 2. 缓存成功的响应
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Network-first strategy failed:', error);

    // 3. 网络失败，尝试从缓存获取
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // 4. 返回离线响应
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: '当前处于离线状态，请稍后重试',
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * 推送通知事件
 */
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');

  const data = event.data ? event.data.json() : {};
  const title = data.title || 'SalesBoost';
  const options = {
    body: data.body || '您有新的消息',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: data.actions || [
      {
        action: 'open',
        title: '查看',
      },
      {
        action: 'close',
        title: '关闭',
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/**
 * 通知点击事件
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'open') {
    // 打开应用
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

/**
 * 后台同步事件
 */
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);

  if (event.tag === 'sync-practice-data') {
    event.waitUntil(syncPracticeData());
  }
});

/**
 * 同步练习数据
 */
async function syncPracticeData() {
  try {
    // 从IndexedDB获取待同步的数据
    const db = await openIndexedDB();
    const pendingData = await getPendingData(db);

    // 同步到服务器
    for (const data of pendingData) {
      await fetch('/api/practice/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // 标记为已同步
      await markAsSynced(db, data.id);
    }

    console.log('[Service Worker] Practice data synced successfully');
  } catch (error) {
    console.error('[Service Worker] Failed to sync practice data:', error);
    throw error; // 重新抛出错误，触发重试
  }
}

/**
 * 打开IndexedDB
 */
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SalesBoostDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 创建对象存储
      if (!db.objectStoreNames.contains('pendingSync')) {
        db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

/**
 * 获取待同步数据
 */
function getPendingData(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingSync'], 'readonly');
    const store = transaction.objectStore('pendingSync');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

/**
 * 标记为已同步
 */
function markAsSynced(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pendingSync'], 'readwrite');
    const store = transaction.objectStore('pendingSync');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

/**
 * 消息事件 - 与主线程通信
 */
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('[Service Worker] Loaded successfully');
