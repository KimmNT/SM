import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceModal from './DeviceConnectionModal';
// import PulseIndicator from './PulseIndicator';
import useBLE from './useBLE';
import {Device} from 'react-native-ble-plx';

const App = () => {
  const {
    requestPermissions,
    scanForDevices,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    heartRate,
    disconnectFromDevice,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const hideModal = () => {
    setIsModalVisible(false);
  };
  const openModal = async () => {
    requestPermissions(isGranted => {
      if (isGranted) {
        scanForDevices();
        setIsModalVisible(true);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.heartRateTitleWrapper}>
        {connectedDevice ? (
          <View>
            <Text style={{color: '#000'}}>the data is</Text>
            <Text style={{color: '#000'}}>{heartRate}</Text>
          </View>
        ) : (
          <Text style={styles.heartRateTitleText}>
            Please connect to an IOT device
          </Text>
        )}

        {/* {allDevices.map((device, index) => (
          <View key={index}>
            <Text style={styles.device_name}>{device.serviceUUIDs}</Text>
            <Text style={styles.device_name}>{device.id}</Text>
          </View>
        ))} */}
      </View>
      <TouchableOpacity onPress={openModal} style={styles.ctaButton}>
        <Text style={styles.ctaButtonText}>{'Connect'}</Text>
      </TouchableOpacity>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  heartRateTitleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartRateTitleText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
    color: 'black',
  },
  heartRateText: {
    fontSize: 25,
    marginTop: 15,
  },
  ctaButton: {
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  device_name: {
    color: '#000',
  },
});

export default App;
