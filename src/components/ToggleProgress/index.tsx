import { useEffect, useMemo, useState } from 'react'
import { Button, Text, View } from 'react-native'

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { styles } from './styles'

export default function ToggleProgress() {
  const [isUpdatingTarget, setIsUpdatingTarget] = useState(false)
  const [targetTemp, setTargetTemp] = useState('-2.1')

  const randomWidth = useSharedValue(10)

  const config = useMemo(
    () => ({
      duration: 500,
      easing: Easing.bezier(0.5, 0.01, 0, 1),
    }),
    [],
  )

  const chooseRandom = () => {
    if (isUpdatingTarget) {
      const randomNumber = Math.random() * 350
      setTargetTemp(String(randomNumber.toFixed(1)))
      randomWidth.value = randomNumber
      setIsUpdatingTarget(false)
    } else {
      setIsUpdatingTarget(true)
    }
  }

  const animatedBar = useAnimatedStyle(() => ({
    width: withTiming(randomWidth.value, config),
  }))

  useEffect(() => {
    console.log('animatedBar')
    const timeHandler = setTimeout(() => {
      if (isUpdatingTarget) {
        randomWidth.value = withTiming(targetTemp, config)
        setIsUpdatingTarget(false)
      }
    }, 2000)
    return () => {
      clearTimeout(timeHandler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdatingTarget])
  return (
    <>
      {isUpdatingTarget && (
        <View style={styles.status}>
          <Text style={styles.text}>{JSON.stringify(targetTemp)}</Text>
          <Text style={styles.text}>isActive</Text>
        </View>
      )}
      <Animated.View style={[styles.bar, animatedBar]} />
      <Button title="toggle" onPress={chooseRandom} />
    </>
  )
}
