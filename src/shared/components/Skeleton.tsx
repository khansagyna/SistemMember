import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp, View } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export default function Skeleton({
  width,
  height,
  borderRadius = 8,
  className,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.35)).current;
  const scaleX = useRef(new Animated.Value(0.97)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.75,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleX, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.35,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleX, {
            toValue: 0.97,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    shimmer.start();

    return () => shimmer.stop();
  }, [opacity, scaleX]);

  return (
    <Animated.View
      className={`bg-slate-200 ${className || ''}`}
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius,
          opacity,
          transform: [{ scaleX }],
        },
        style,
      ]}
    />
  );
}
