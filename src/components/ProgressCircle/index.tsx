/* eslint-disable radar/no-identical-functions */
import { useCallback, useEffect, useState } from 'react'
import { View, Text } from 'react-native'

import { RectButton } from 'react-native-gesture-handler'
import Animated, {
  cancelAnimation,
  Easing,
  interpolateColor,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import Svg, { Circle } from 'react-native-svg'

import { circleSize, styles } from './styles'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const CIRCLE_LENGTH = 1000
const R = CIRCLE_LENGTH / (2 * Math.PI)
const svgViewBox = circleSize + 64

export default function ProgressCircle() {
  const [count, setCount] = useState(0)
  const progress = useSharedValue(0)
  const loop = useSharedValue(0)
  const whiteBorder = useSharedValue(0)
  const innerBorder = useSharedValue(0)
  const innerWhiteDashes = useSharedValue(0)

  const onStart = useSharedValue(false)
  const onActive = useSharedValue(false)
  const onCancel = useSharedValue(true)
  const onEnd = useSharedValue(true)

  const updateCount = useCallback(() => {
    console.log('updateCount', count)
    onCancel.value = false
  }, [count, onCancel])

  const runTimeout = useCallback(() => {
    // onCancel.value = true
    progress.value = withTiming(0, { duration: 2000 }, (isFinished: boolean) => {
      if (isFinished) {
        console.log('end => runTimeout', count)
        onCancel.value = true
        onStart.value = false
        onActive.value = false
        // runOnJS(updateCount)()
      }
    })
  }, [count, onActive, onCancel, onStart, progress])

  const runProgress = useCallback(() => {
    console.log('runProgress')
    if (onEnd.value || onCancel.value) {
      onEnd.value = false
      console.log('onEnd.value || onCancel.value')
      if (onActive.value) {
        console.log('onActive.value')
      }
      if (!onStart.value) {
        onStart.value = true
        onActive.value = true
        progress.value = withTiming(0.5, { duration: 200 }, () => runOnJS(runTimeout)())
        console.log('onStart.value')
      }
    }
  }, [onActive, onCancel.value, onEnd, onStart, progress, runTimeout])

  const updateCountTarget = (step = 1) => {
    setCount((prev) => prev + step)
    progress.value = withTiming(0.5, { duration: 200 }, (isFinished: boolean) => {
      if (isFinished) {
        runOnJS(runTimeout)()
      }
    })
  }

  useEffect(() => {
    whiteBorder.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1000,
          easing: Easing.linear,
        }),

        withTiming(0, {
          duration: 3000,
          easing: Easing.ease,
        }),
      ),
      -1,
      true,
    )
    return () => cancelAnimation(whiteBorder)
  }, [whiteBorder])

  useEffect(() => {
    innerBorder.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 3000,
          easing: Easing.bounce,
        }),
        withTiming(0, {
          duration: 1000,
          easing: Easing.elastic(2),
        }),
        withTiming(1, {
          duration: 1000,
          easing: Easing.bounce,
        }),
      ),
      -1,
      true,
    )
    return () => cancelAnimation(innerBorder)
  }, [innerBorder])

  useEffect(() => {
    innerWhiteDashes.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 2000,
          easing: Easing.bounce,
        }),
        withTiming(0, {
          duration: 1500,
          easing: Easing.elastic(2),
        }),
        withTiming(1, {
          duration: 1000,
          easing: Easing.bounce,
        }),
      ),
      -1,
      true,
    )
    return () => cancelAnimation(innerWhiteDashes)
  }, [innerWhiteDashes])

  useEffect(() => {
    loop.value = withRepeat(
      withSequence(
        withTiming(0.85, {
          duration: 7500,
          easing: Easing.linear,
        }),
        withTiming(0, {
          duration: 2600,
          easing: Easing.ease,
        }),
      ),
      -1,
      true,
    )
    return () => cancelAnimation(loop)
  }, [loop])

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: -(CIRCLE_LENGTH - CIRCLE_LENGTH * progress.value * 2),
  }))

  const animatedRotation = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${90 + progress.value * 360}deg` }],
  }))

  const animatedOrangeDashes = useAnimatedProps(() => ({
    strokeDashoffset: -(CIRCLE_LENGTH - CIRCLE_LENGTH * progress.value * 2),
    strokeOpacity: innerBorder.value,
  }))

  const animatedWhiteDashes = useAnimatedProps(() => ({
    strokeOpacity: innerWhiteDashes.value,
  }))

  const animatedOutter = useAnimatedStyle(() => ({
    borderWidth: 1,
    transform: [{ rotateZ: `${90 + loop.value * 360}deg` }],
    borderColor: interpolateColor(whiteBorder.value, [1, 0], ['#ffffffff', '#ffffff00']),
  }))

  const centerContainer1 = useAnimatedStyle(() => ({
    opacity: onStart.value ? 1 : 0,
  }))

  const centerContainer = useAnimatedStyle(() => ({
    opacity: onStart.value ? 1 : 0,
  }))

  return (
    <>
      <Animated.View style={[styles.labelContainer, centerContainer1]}>
        <Text style={styles.label}>Contador Alvo</Text>
        <Text style={styles.text}>{count}</Text>
      </Animated.View>
      <Animated.View style={[styles.animatedCircle, animatedOutter]}>
        <Svg
          width={circleSize + 10}
          height={circleSize + 10}
          viewBox={[0, 0, svgViewBox, svgViewBox].join(' ')}
        >
          <AnimatedCircle
            cx={svgViewBox / 2}
            cy={svgViewBox / 2}
            r={R}
            stroke="orange"
            strokeWidth={10}
            strokeDasharray={CIRCLE_LENGTH / 6}
            strokeDashoffset={8}
            animatedProps={animatedOrangeDashes}
          />
          <AnimatedCircle
            scale={0.93}
            cx={svgViewBox / (2 * 0.93)}
            cy={svgViewBox / (2 * 0.93)}
            r={R}
            stroke="aliceblue"
            strokeWidth={10}
            strokeDasharray={CIRCLE_LENGTH / 400}
            strokeDashoffset={90}
            animatedProps={animatedWhiteDashes}
          />
        </Svg>
      </Animated.View>

      <Animated.View style={[animatedRotation]}>
        <Svg
          width={circleSize}
          height={circleSize}
          viewBox={[0, 0, svgViewBox, svgViewBox].join(' ')}
        >
          <AnimatedCircle
            scale={0.9}
            cx={svgViewBox / (2 * 0.9)}
            cy={svgViewBox / (2 * 0.9)}
            r={R}
            stroke="orange"
            strokeWidth={8}
            strokeDasharray={CIRCLE_LENGTH}
            strokeLinecap="round"
            strokeLinejoin="bevel"
            animatedProps={animatedProps}
          />
        </Svg>
      </Animated.View>
      <RectButton style={styles.button} onPress={runProgress}>
        <Text style={styles.buttonText}>Run</Text>
      </RectButton>
      <Animated.View style={[styles.countContainer, centerContainer]}>
        <RectButton
          style={styles.countButton}
          onPress={() => updateCountTarget(-1)}
          rippleColor="#DF3B0D60"
        >
          <Text style={styles.buttonText}>-</Text>
        </RectButton>
        <RectButton
          style={styles.countButton}
          onPress={() => updateCountTarget(1)}
          rippleColor="#DF3B0D60"
        >
          <Text style={styles.buttonText}>+</Text>
        </RectButton>
      </Animated.View>
    </>
  )
}
