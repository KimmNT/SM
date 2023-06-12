import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';

//STYLE
import share from '../../assets/global/share';

//IMAGE
import welcomeBG from '../../assets/images/welcome_bg.png';

//ICON
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function HomeScreen({navigation}) {
  const time = new Date();
  const h = time.getHours();
  const m = time.getMinutes();
  let dayPeriod = '';
  if (h > 24 || h < 12) {
    dayPeriod = 'AM';
  } else dayPeriod = 'PM';
  let minute = '';
  if (m < 10) {
    minute = '0' + m;
  } else minute = m;

  const currentTime = h + ':' + minute;

  return (
    <View style={styles.container}>
      <Image source={welcomeBG} style={styles.welcome__bg} />
      <View style={styles.content}>
        <View style={styles.welcome__container}>
          <Animated.View style={[styles.welcome__time]}>
            <Text style={[styles.time, styles.highlight]}>{currentTime}</Text>
            <Text style={styles.time}>{dayPeriod}</Text>
          </Animated.View>
          <View style={styles.welcome__brand}>
            <Animated.Text style={[styles.brand__name, styles.up]}>
              Smart
            </Animated.Text>
            <Animated.Text style={[styles.brand__name, styles.down]}>
              Coach
            </Animated.Text>
          </View>
          <View style={styles.welcome__scan}>
            <Text style={styles.scan__text}>Scan your device</Text>
            <TouchableOpacity
              style={styles.scan__box}
              onPress={() => navigation.navigate('Scan')}>
              <Icon name="chevron-right" style={styles.scan__icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  welcome__bg: {
    position: 'absolute',
    width: '100%',
    height: '100%',

    // resizeMode: 'cover',
  },
  welcome__container: {
    position: 'relative',
    padding: 20,
    // backgroundColor: 'red',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome__time: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#E79C25',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  time: {
    fontSize: 15,
    color: '#FFF',
  },
  highlight: {
    fontWeight: 700,
    fontSize: 20,
  },
  welcome__brand: {
    width: '80%',
  },
  brand__name: {
    fontSize: 60,
    // backgroundColor: 'red',
    color: '#FFF',
    fontWeight: 700,
  },
  up: {},
  down: {
    textAlign: 'right',
  },
  welcome__scan: {
    position: 'absolute',
    bottom: 30,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scan__text: {
    fontSize: 20,
    color: '#FFF',
  },
  scan__box: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    backgroundColor: '#E79C25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scan__icon: {
    fontSize: 30,
  },
});
