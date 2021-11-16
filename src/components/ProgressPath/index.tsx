import { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, Text } from 'react-native'

import { RectButton } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedProps,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { ReText } from 'react-native-redash'
import Svg, { Path } from 'react-native-svg'

import { styles } from './styles'

const { width, height } = Dimensions.get('window')

const AnimatedPath = Animated.createAnimatedComponent(Path)

export default function ProgressPath() {
  const [length, setLength] = useState(0)
  const pathRef = useRef<typeof AnimatedPath>()
  // const pathRef = useAnimatedRef<typeof AnimatedPath>()
  const progress = useSharedValue(0)
  const vWidth = 245
  const d =
    'M237 122.5C237 185.737 185.737 237 122.5 237C59.2634 237 8 185.737 8 122.5C8 59.2634 59.2634 8 122.5 8C185.737 8 237 59.2634 237 122.5Z'

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: -(length - length * progress.value * 2),
  }))

  const animatedRotation = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${90 + progress.value * 360}deg` }],
  }))

  const progressText = useDerivedValue(() => `${Math.floor(progress.value * 200)}`)

  const runProgress = useCallback(() => {
    progress.value = withTiming(progress.value > 0 ? 0 : 0.5, { duration: 2200 })
  }, [progress])

  useEffect(() => {
    progress.value = withTiming(0.5, { duration: 2200 })
  }, [progress])

  return (
    <>
      <ReText text={progressText} style={styles.text} />
      <Animated.View style={[{ position: 'absolute' }, animatedRotation]}>
        <Svg
          width={width - 32}
          height={height - 32}
          viewBox={[0, 0, vWidth, vWidth].join(' ')}
        >
          <AnimatedPath
            onLayout={() => setLength(pathRef?.current?.getTotalLength())}
            ref={pathRef}
            d={d}
            stroke="white"
            strokeWidth={16}
            strokeLinecap="round"
            strokeDasharray={length}
            animatedProps={animatedProps}
          />
        </Svg>
      </Animated.View>
      <RectButton style={styles.button} onPress={runProgress}>
        <Text style={styles.buttonText}>Run</Text>
      </RectButton>
      <RectButton style={styles.button2} onPress={runProgress}>
        <Text style={styles.buttonText}>Run</Text>
      </RectButton>
    </>
  )
}
