
import { useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const navigationState = useRootNavigationState(); // Hook to get root navigation state

  useEffect(() => {
    if (!navigationState?.key) {
      // If the navigation state is not ready, do nothing
      return;
    }

    // Redirect to the login screen when the app starts
    router.replace('/auth/login');
  }, [navigationState, router]);

  return null; // No UI needed here as it's just for redirection
}
