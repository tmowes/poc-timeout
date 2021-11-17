import { Dimensions, StyleSheet } from 'react-native'

const { width: wScreen, height: hScreen } = Dimensions.get('screen')

export const circleSize = Math.min(Math.min(wScreen * 0.887, hScreen * 0.42), 320)

export const styles = StyleSheet.create({
  animatedCircle: {
    position: 'absolute',
    width: circleSize - 30,
    height: circleSize - 30,
    borderRadius: circleSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  labelContainer: {
    position: 'absolute',

    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 64,
    color: 'whitesmoke',
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  label: {
    fontSize: 16,
    color: 'whitesmoke',
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 64,
    width: '70%',
    backgroundColor: 'orangered',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
  },
  buttonText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'whitesmoke',
    textTransform: 'uppercase',
  },
  countContainer: {
    position: 'absolute',
    top: 64,
    borderRadius: 32,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countButton: {
    height: 64,
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
})
