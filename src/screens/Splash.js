import React, {useEffect, useState} from 'react';
import {View, Image, Animated, StyleSheet, Text} from 'react-native';

//LOGO
import player from '../../assets/images/player.png';
import field from '../../assets/images/field.png';
import ball from '../../assets/images/flying_ball.png';
import background from '../../assets/images/background.png';
import brand from '../../assets/images/brand_name.png';

const SplashScreen = ({navigation}) => {
  const [isOpacity, setIsOpactiy] = useState(true);
  const playerMove = new Animated.Value(0);
  const ballMove = new Animated.Value(0);
  const fieldMove = new Animated.Value(0);
  const brandMove = new Animated.Value(0);
  const logoOpacity = new Animated.Value(0);
  const textUpMove = new Animated.Value(0);
  const textDownMove = new Animated.Value(0);

  useEffect(() => {
    setTimeout(() => {
      setIsOpactiy(false);
    }, 2000);
  });

  useEffect(() => {
    //BRAND NAME
    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    //PLAYER
    Animated.timing(playerMove, {
      toValue: -60,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    //BALL
    Animated.timing(ballMove, {
      toValue: 50,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    //FIELD
    Animated.timing(fieldMove, {
      toValue: -50,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    //BRAND UP
    Animated.timing(textUpMove, {
      toValue: -80,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    //BRAND DOWN
    Animated.timing(textDownMove, {
      toValue: -75,
      duration: 1000,
      delay: 100,
      useNativeDriver: true,
    }).start();
  }, [logoOpacity, playerMove, ballMove, fieldMove, brandMove]);

  return (
    <>
      {isOpacity ? (
        <View style={styles.layer}>
          <Image source={background} style={{width: '100%', height: '100%'}} />
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.content}>
            <Animated.Image
              source={player}
              style={[styles.player, {transform: [{translateX: playerMove}]}]}
            />

            <Animated.Image
              source={ball}
              style={[styles.ball, {transform: [{translateX: ballMove}]}]}
            />
            <Animated.Image
              source={field}
              style={[styles.field, {transform: [{translateY: fieldMove}]}]}
            />
          </View>
          <View style={styles.brand__container}>
            <Animated.Text
              style={[
                styles.brand__name,
                styles.up,
                {transform: [{translateY: textUpMove}]},
              ]}>
              Smart
            </Animated.Text>
            <Animated.Text
              style={[
                styles.brand__name,
                styles.down,
                {transform: [{translateY: textDownMove}]},
              ]}>
              Coach
            </Animated.Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  layer: {
    width: '100%',
    height: '100%',
  },
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 50,
  },
  player: {
    position: 'absolute',
    top: 70,
    right: -50,
    width: 210,
    height: 250,
    zIndex: 2,
  },
  ball: {
    position: 'absolute',
    top: 240,
    left: -40,
    width: 131,
    height: 40,
    resizeMode: 'cover',
  },
  field: {
    position: 'absolute',
    top: 330,
    width: 200,
    height: 100,
    resizeMode: 'cover',
  },
  brand__container: {
    marginBottom: 60,
    // backgroundColor: 'red',
    marginHorizontal: 50,
  },
  brand__name: {
    fontSize: 50,
    fontWeight: 800,
    color: '#FFF',
  },
  up: {},
  down: {
    textAlign: 'right',
  },
  // brand: {
  //   width: 200,
  //   height: 100,
  // },
});

export default SplashScreen;
