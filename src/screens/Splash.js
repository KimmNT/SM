import React, {useEffect, useState} from 'react';
import {View, Image, Animated, StyleSheet, Text} from 'react-native';

//LOGO
import player from '../../assets/images/player.png';
import field from '../../assets/images/field.png';
import ball from '../../assets/images/flying_ball.png';
import background from '../../assets/images/background.png';
import brand from '../../assets/images/brand_name.png';
import Logo from '../../assets/images/logo.png';

const SplashScreen = ({navigation}) => {
  const playerMove = new Animated.Value(0);
  const ballMove = new Animated.Value(0);
  const fieldMove = new Animated.Value(0);
  const logoOpacity = new Animated.Value(0);

  useEffect(() => {
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
  }, [logoOpacity, playerMove, ballMove, fieldMove]);

  return (
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
    </View>
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
    // top: 70,
    right: -50,
    width: 210,
    height: 250,
    zIndex: 2,
  },
  ball: {
    position: 'absolute',
    // top: 240,
    left: -40,
    width: 131,
    height: 40,
    resizeMode: 'cover',
  },
  field: {
    position: 'absolute',
    bottom: 150,
    width: 200,
    height: 100,
    resizeMode: 'cover',
  },
  logo__container: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo__image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
  logo__name: {
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: 30,
    color: '#FFF',
  },
});

export default SplashScreen;
