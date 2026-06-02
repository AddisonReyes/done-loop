import { PropsWithChildren } from 'react';
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';

import { useThemePreference } from '@/hooks/use-theme-preference';

type AnimatedListItemProps = PropsWithChildren<{
  animate?: boolean;
  delay?: number;
}>;

export function AnimatedListItem({ animate = true, children, delay = 0 }: AnimatedListItemProps) {
  const { animationsEnabled } = useThemePreference();
  const shouldAnimate = animationsEnabled && animate;

  return (
    <Animated.View
      entering={shouldAnimate ? FadeInUp.duration(180).delay(delay) : undefined}
      exiting={shouldAnimate ? FadeOutUp.duration(140) : undefined}
      layout={shouldAnimate ? LinearTransition.duration(180) : undefined}>
      {children}
    </Animated.View>
  );
}
