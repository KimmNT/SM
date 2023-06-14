import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import ScanArea from './ScanArea';
import BackArrow from './BackArrow';

export default function Scan({navigation}) {
  const [qrcode, setQRCode] = useState('');
  const record_data_idx = 0;

  const handleScanning = () => {
    if (qrcode === '') {
      Alert.alert('Missing some thing!', "You haven't scan the QR code!");
    } else {
      const get_record_info_cmd =
        'rec get -d ' + qrcode + ' ' + record_data_idx;
      console.log(get_record_info_cmd);
      const dataResponse =
        '$PNCSG,RCDD-G0001-15|4509|1234.5677,1234.9876|3|50,255|5,7,10|255,255,255*cs';
      navigation.navigate('Stats', {dataResponse});
    }
  };
  const handleScanningFail = () => {
    setQRCode('');
  };

  const deviceArray = ['G0002', 'G0004', 'G0003', 'G0007', 'G0001'];
  const sameValue = deviceArray.includes(qrcode);

  return (
    <QRCodeScanner
      onRead={({data}) => setQRCode(data)}
      // flashMode={RNCamera.Constants.FlashMode.torch}
      reactivate={true}
      reactivateTimeout={2000}
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
              Device name: {qrcode}
            </Text>
            <View style={styles.connect__status}>
              {sameValue ? (
                <View style={styles.succes__container}>
                  <Text style={styles.success}>Ready to connect</Text>
                  <TouchableOpacity
                    style={styles.desc__btn_success}
                    onPress={handleScanning}>
                    <Text style={styles.desc__btn_text}>connect</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.succes__container}>
                  <Text style={styles.fail}>Device is out of reach</Text>
                  <Text style={styles.fail__wait}>Wait 5s to scan again</Text>
                </View>
              )}
            </View>
          </View>
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
    gap: 30,
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
  connect__status: {
    alignItems: 'center',
    marginTop: 5,
  },
  succes__container: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  success: {
    color: '#388E3C',
  },
  fail: {
    color: '#E53935',
  },
  fail__wait: {
    color: '#27292B',
    fontWeight: 600,
  },
  desc__btn_success: {
    backgroundColor: '#388E3C',
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    width: '100%',
  },
  desc__btn_text: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: 20,
  },
});
