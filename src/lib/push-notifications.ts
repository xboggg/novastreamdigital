// Push notification utilities for PWA

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const isPushSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return 'denied';
  }
  
  const permission = await Notification.requestPermission();
  return permission;
};

export const subscribeToPush = async (): Promise<PushSubscriptionData | null> => {
  if (!isPushSupported()) {
    console.warn('Push notifications not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check for existing subscription
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription && VAPID_PUBLIC_KEY) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: VAPID_PUBLIC_KEY,
      });
    }

    if (!subscription) return null;

    const json = subscription.toJSON();
    return {
      endpoint: json.endpoint!,
      keys: {
        p256dh: json.keys!.p256dh!,
        auth: json.keys!.auth!,
      },
    };
  } catch (error) {
    console.error('Failed to subscribe to push:', error);
    return null;
  }
};

export const unsubscribeFromPush = async (): Promise<boolean> => {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to unsubscribe from push:', error);
    return false;
  }
};

