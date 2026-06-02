import { PropsWithChildren } from 'react';
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';

import { useThemePreference } from '@/hooks/use-theme-preference';

type AnimatedListItemProps = PropsWithChildren<{
  delay?: number;
}>;

export function AnimatedListItem({ children, delay = 0 }: AnimatedListItemProps) {
  const { animationsEnabled } = useThemePreference();

  return (
    <Animated.View
      entering={animationsEnabled ? FadeInUp.duration(180).delay(delay) : undefined}
      exiting={animationsEnabled ? FadeOutUp.duration(140) : undefined}
      layout={animationsEnabled ? LinearTransition.duration(180) : undefined}>
      {children}
    </Animated.View>
  );
}
