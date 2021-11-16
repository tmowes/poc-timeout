import { View } from 'react-native'

import ProgressCircle from '../../components/ProgressCircle'
import { styles } from './styles'

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* <ToggleProgress /> */}
        <ProgressCircle />

        {/* <ProgressPath /> */}
      </View>
    </View>
  )
}
