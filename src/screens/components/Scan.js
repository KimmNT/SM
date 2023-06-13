import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import ScanArea from './ScanArea';
import BackArrow from './BackArrow';

export default function Scan({navigation}) {
  const [qrcode, setQRCode] = useState('');

  const handleScanning = () => {
    if (qrcode === '') {
      Alert.alert('Missing some thing!', "You haven't scan the QR code!");
    } else {
      navigation.navigate('Submit');
    }
  };

  return (
    <QRCodeScanner
      onRead={({data}) => setQRCode(data)}
      // flashMode={RNCamera.Constants.FlashMode.torch}
      // reactivate={true}
      // reactivateTimeout={500}
      fadeIn={true}
      showMarker={true}
      customMarker={
        <View style={styles.camera__scan}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackArrow />
          </TouchableOpacity>
          <ScanArea />
        </View>
      }
      cameraStyle={{
        position: 'relative',
        height: '40%',
      }}
      bottomContent={
        <View style={styles.desc}>
          <Text style={styles.desc__text}>Move your camera to the QR code</Text>
          <View>
            <Text style={[styles.desc__text, styles.highlight]}>
              Device name:
            </Text>
            <Text style={styles.qrcode}>{qrcode}</Text>
          </View>
          <TouchableOpacity style={styles.desc__btn} onPress={handleScanning}>
            <Text style={styles.desc__btn_text}>connect</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  camera__scan: {
    gap: 30,
  },
  desc: {
    height: '100%',
    width: '70%',
    gap: 20,
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  desc__text: {
    color: '#27292B',
  },
  highlight: {
    fontSize: 20,
    fontWeight: 600,
  },
  qrcode: {
    color: '#27292B',
    textAlign: 'center',
    fontSize: 20,
  },
  desc__btn: {
    backgroundColor: '#E79C25',
    width: '70%',
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  desc__btn_text: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: 20,
  },
});
