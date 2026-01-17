import { useState, useEffect, useCallback } from 'react';
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  type PushSubscriptionData,
} from '@/lib/push-notifications';

interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  subscribe: () => Promise<PushSubscriptionData | null>;
  unsubscribe: () => Promise<boolean>;
  requestPermission: () => Promise<NotificationPermission>;
}

export const usePushNotifications = (): UsePushNotificationsReturn => {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const supported = isPushSupported();
      setIsSupported(supported);

      if (supported) {
        setPermission(getNotificationPermission());

        // Check if already subscribed
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        } catch {
          // Service worker not ready yet
        }
      }

      setIsLoading(false);
    };

    init();
  }, []);

  const requestPermission = useCallback(async () => {
    const newPermission = await requestNotificationPermission();
    setPermission(newPermission);
    return newPermission;
  }, []);

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      // Request permission first if needed
      if (permission === 'default') {
        const newPermission = await requestPermission();
        if (newPermission !== 'granted') {
          setIsLoading(false);
          return null;
        }
      }

      const subscription = await subscribeToPush();
      if (subscription) {
        setIsSubscribed(true);
        // Here you would typically send the subscription to your backend
        console.log('Push subscription:', subscription);
      }
      return subscription;
    } finally {
      setIsLoading(false);
    }
  }, [permission, requestPermission]);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const success = await unsubscribeFromPush();
      if (success) {
        setIsSubscribed(false);
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
    requestPermission,
  };
};
