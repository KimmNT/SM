/* eslint-disable no-bitwise */
import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

import {atob} from 'react-native-quick-base64';

const IOT__UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const IOT__TX__CHARACTERISTIC = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
const IOT__RX__CHARACTERISTIC = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';

const bleManager = new BleManager();

function useBLE() {
  const [allDevices, setAllDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [data, setData] = useState('Start with empty string');

  const requestPermissions = async cb => {
    if (Platform.OS === 'android') {
      const grantedStatus = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'Bluetooth Low Engery Needs Location Permission',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
          buttonNeutral: 'Maybe later',
        },
      );
      cb(grantedStatus === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      cb(true);
    }
  };

  const isDuplicateDevice = (devices, nextDevice) =>
    devices.findIndex(device => nextDevice.id === device.id) > -1;

  const scanForDevices = () => {
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log('Yo, error: ', error);
      }
      if (device && device.name?.includes('Genino ')) {
        setAllDevices(prevState => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });
  };
  const connectToDevice = async device => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      bleManager.stopDeviceScan();
      await deviceConnection.discoverAllServicesAndCharacteristics();
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
    }
  };

  const disconnectFromDevice = () => {
    console.log('disconneted');
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setData('');
      console.log(data);
    }
  };

  const onDataUpdate = (error, characteristic) => {
    if (error) {
      console.log(error);
      return;
    } else if (!characteristic?.value) {
      console.error('No Data was recieved');
      return;
    }

    const rawData = atob(characteristic.value);

    // const firstBitValue: number = Number(rawData) & 0x01;

    // if (firstBitValue === 0) {
    //   innerdata = rawData[1].charCodeAt(0);
    // } else {
    //   innerdata =
    //     Number(rawData[1].charCodeAt(0) << 8) +
    //     Number(rawData[2].charCodeAt(2));
    // }

    setData(rawData);
  };

  const startStreamingData = async device => {
    if (device) {
      device.monitorCharacteristicForService(
        IOT__UUID,
        IOT__TX__CHARACTERISTIC,
        onDataUpdate,
      );
    } else {
      console.log('No Device Connected');
    }
  };

  return {
    scanForDevices,
    // scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    data,
  };
}

export default useBLE;
