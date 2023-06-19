import React, {useEffect, useState} from 'react';
import {View, Image, Animated, StyleSheet, Text} from 'react-native';

export default function NewSplash() {
  const textBoxMoveTop = new Animated.Value(0);
  const textBoxMoveLeft = new Animated.Value(0);
  const textBoxShadowMoveBottom = new Animated.Value(0);
  const textBoxShadowMoveRight = new Animated.Value(0);

  useEffect(() => {
    //TEXT BOX MOVE TOP
    Animated.timing(textBoxMoveTop, {
      toValue: -10,
      delay: 1000,
      useNativeDriver: true,
    }).start();
    //TEXT BOX MOVE LEFT
    Animated.timing(textBoxMoveLeft, {
      toValue: -10,
      delay: 1000,
      useNativeDriver: true,
    }).start();
    //SHADOW MOVE BOTTOM
    Animated.timing(textBoxShadowMoveBottom, {
      toValue: 10,
      delay: 1000,
      useNativeDriver: true,
    }).start();
    //SHADOW MOVE RIGHT
    Animated.timing(textBoxShadowMoveRight, {
      toValue: 10,
      delay: 1000,
      useNativeDriver: true,
    }).start();
  }, [textBoxMoveTop]);
  return (
    <View style={styles.splash__container}>
      <View style={styles.splash__text_box}>
        <Animated.View
          style={[
            styles.text__box,
            {
              transform: [
                {translateY: textBoxMoveTop},
                {translateX: textBoxMoveLeft},
              ],
            },
          ]}>
          <Text style={styles.text__box_text}>smart coach</Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.text__box_shadow,
            {
              transform: [
                {translateY: textBoxShadowMoveBottom},
                {translateX: textBoxShadowMoveRight},
              ],
            },
          ]}></Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splash__container: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#E9E9E9',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splash__text_box: {
    width: 200,
    height: 70,
  },
  text__box: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#15212D',
    borderWidth: 2,
  },
  text__box_text: {
    color: '#15212D',
    fontSize: 25,
  },
  text__box_shadow: {
    position: 'absolute',
    // bottom: -5,
    // right: -5,
    width: '100%',
    height: '100%',
    backgroundColor: '#15212D',
    zIndex: -1,
  },
});
