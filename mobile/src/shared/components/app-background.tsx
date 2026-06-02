import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import type { UserAppBackgroundPreference } from '@/features/settings/types';

export type AppBackgroundSnapshot = {
  accent: string;
  background: string;
  preference: UserAppBackgroundPreference;
  resolvedTheme: 'light' | 'dark';
};

type AppBackgroundProps = AppBackgroundSnapshot & {
  style?: StyleProp<ViewStyle>;
};

export function AppBackground({ accent, background, preference, resolvedTheme, style }: AppBackgroundProps) {
  const { height, width } = useWindowDimensions();
  const gridLineColor = resolvedTheme === 'dark' ? 'rgba(255, 255, 255, 0.075)' : 'rgba(0, 0, 0, 0.075)';

  if (preference === 'gradient') {
    return (
      <LinearGradient
        colors={[hexToRgba(accent, 0.22), hexToRgba(accent, 0.08), background]}
        end={{ x: 1, y: 1 }}
        pointerEvents="none"
        start={{ x: 0, y: 0 }}
        style={[styles.backgroundLayer, style]}
      />
    );
  }

  if (preference === 'grid') {
    const columns = Math.ceil(width / GridSize) + 1;
    const rows = Math.ceil(height / GridSize) + 1;

    return (
      <View pointerEvents="none" style={[styles.backgroundLayer, style]}>
        <CircularGlow
          color={accent}
          opacity={resolvedTheme === 'dark' ? 0.095 : 0.07}
          style={styles.topRightGlow}
        />
        <CircularGlow
          color={accent}
          opacity={resolvedTheme === 'dark' ? 0.085 : 0.062}
          style={styles.bottomLeftGlow}
        />
        {Array.from({ length: columns }).map((_, index) => (
          <View
            key={`vertical-${index}`}
            style={[styles.gridVerticalLine, { backgroundColor: gridLineColor, left: index * GridSize }]}
          />
        ))}
        {Array.from({ length: rows }).map((_, index) => (
          <View
            key={`horizontal-${index}`}
            style={[styles.gridHorizontalLine, { backgroundColor: gridLineColor, top: index * GridSize }]}
          />
        ))}
      </View>
    );
  }

  return <View pointerEvents="none" style={[styles.backgroundLayer, { backgroundColor: background }, style]} />;
}

function CircularGlow({
  color,
  opacity,
  style,
}: {
  color: string;
  opacity: number;
  style: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.glowRoot, style]}>
      {GlowRings.map((ring) => (
        <View
          key={ring.size}
          style={[
            styles.glowRing,
            {
              backgroundColor: hexToRgba(color, opacity * ring.opacity),
              borderRadius: ring.size / 2,
              height: ring.size,
              left: (GlowSize - ring.size) / 2,
              top: (GlowSize - ring.size) / 2,
              width: ring.size,
            },
          ]}
        />
      ))}
    </View>
  );
}

const GridSize = 32;
const GlowSize = 520;
const GlowRingCount = 32;
const GlowRings = Array.from({ length: GlowRingCount }, (_, index) => {
  const progress = index / (GlowRingCount - 1);

  return {
    opacity: 0.036 + progress * 0.032,
    size: GlowSize - progress * 460,
  };
});

function hexToRgba(hex: string, alpha: number) {
  const normalizedHex = hex.replace('#', '');
  const red = parseInt(normalizedHex.slice(0, 2), 16);
  const green = parseInt(normalizedHex.slice(2, 4), 16);
  const blue = parseInt(normalizedHex.slice(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

const styles = StyleSheet.create({
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  gridVerticalLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
  },
  gridHorizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  glowRoot: {
    position: 'absolute',
    height: GlowSize,
    width: GlowSize,
  },
  glowRing: {
    position: 'absolute',
  },
  topRightGlow: {
    right: -230,
    top: -220,
  },
  bottomLeftGlow: {
    bottom: -230,
    left: -240,
  },
});
