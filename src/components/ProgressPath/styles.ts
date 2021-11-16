import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  text: {
    fontSize: 64,
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
  button2: {
    position: 'absolute',
    top: 64,
    width: '70%',
    backgroundColor: 'orangered',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 32,
  },
})
