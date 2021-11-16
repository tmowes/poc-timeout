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

const CIRCLE_LENGTH = 1000
const R = CIRCLE_LENGTH / (2 * Math.PI)

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const svgViewBox = circleSize + 64

export default function ProgressCircle() {
  const progress = useSharedValue(0)
  const loop = useSharedValue(0)
  const whiteBorder = useSharedValue(0)
  const innerBorder = useSharedValue(0)
  const innerWhiteDashes = useSharedValue(0)

  const [isActive, setIsActive] = useState(false)
  const [count, setCount] = useState(0)

  const updateCount = useCallback(() => {
    setIsActive(false)
  }, [])

  const runTimeout = useCallback(() => {
    setIsActive(true)
    progress.value = withTiming(0, { duration: 10000 }, (isFinished: boolean) => {
      if (isFinished) {
        // console.log('end => runTimeout', isFinished, count)
        runOnJS(updateCount)()
      }
    })
  }, [progress, updateCount])

  const runProgress = useCallback(() => {
    if (isActive) {
      progress.value = withTiming(0, { duration: 200 }, (isFinished: boolean) => {
        if (isFinished) {
          // console.log('init => updateCount', isFinished, count)
          runOnJS(updateCount)()
        }
      })
    } else {
      progress.value = withTiming(0.5, { duration: 200 }, (isFinished: boolean) => {
        if (isFinished) {
          // console.log('init => runTimeout', isFinished, count)
          runOnJS(runTimeout)()
        }
      })
    }
  }, [isActive, progress, runTimeout, updateCount])

  const decrementCount = () => setCount((prev) => prev - 1)

  const incrementCount = () => setCount((prev) => prev + 1)

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
    borderColor: interpolateColor(whiteBorder.value, [1, 0], ['#ffffffff', '#ffffff00']),
    borderWidth: 1,
    transform: [{ rotateZ: `${90 + loop.value * 360}deg` }],
  }))

  // console.log('count =>', count)

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

  return (
    <>
      {isActive && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Contador Alvo</Text>
          <Text style={styles.text}>{count}</Text>
        </View>
      )}
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
            stroke="white"
            strokeWidth={10}
            strokeDasharray={CIRCLE_LENGTH / 1000}
            animatedProps={animatedWhiteDashes}
          />
        </Svg>
      </Animated.View>

      <Animated.View style={[styles.svgContainer, animatedRotation]}>
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
            stroke="#ffffff"
            strokeWidth={16}
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
      {isActive && (
        <View style={styles.countContainer}>
          <RectButton
            style={styles.countButton}
            onPress={decrementCount}
            rippleColor="#DF3B0D60"
          >
            <Text style={styles.buttonText}>-</Text>
          </RectButton>
          <RectButton
            style={styles.countButton}
            onPress={incrementCount}
            rippleColor="#DF3B0D60"
          >
            <Text style={styles.buttonText}>+</Text>
          </RectButton>
        </View>
      )}
    </>
  )
}
