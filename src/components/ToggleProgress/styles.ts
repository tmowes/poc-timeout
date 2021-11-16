import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121018',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  bar: {
    width: 100,
    height: 80,
    backgroundColor: 'orangered',
    margin: 30,
  },
  status: {
    position: 'absolute',
    top: 512,
  },
  text: {
    color: 'whitesmoke',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
