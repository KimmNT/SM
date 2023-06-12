import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import ScanArea from './ScanArea';

export default function Scan() {
  const [qrcode, setQRCode] = useState('');

  return (
    <QRCodeScanner
      onRead={({data}) => setQRCode(data)}
      // flashMode={RNCamera.Constants.FlashMode.torch}
      reactivate={true}
      reactivateTimeout={500}
      fadeIn={true}
      showMarker={true}
      customMarker={<ScanArea />}
      // markerStyle={{
      //   borderColor: '#FFF',
      // }}
      cameraStyle={{
        position: 'relative',
        height: '50%',
      }}
    />
  );
}

const styles = StyleSheet.create({});
