import React, {useCallback, useState, useEffect} from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ScanArea from './ScanArea';
const res = Dimensions.get('window').height;

const DeviceModal = props => {
  const {devices, visible, connectToPeripheral, closeModal} = props;
  const [qrcode, setQRCode] = useState('');
  const [showMismatchAlert, setShowMismatchAlert] = useState(false);
  const [scanned, setScanned] = useState(false); // Add a state variable to track if QR code is scanned

  useEffect(() => {
    const timeout = setTimeout(() => {
      setQRCode('');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [qrcode]);

  const renderDeviceModalListItem = useCallback(
    item => {
      if (scanned && item.item.id === qrcode) {
        // Check if QR code is scanned and ID matches
        connectToPeripheral(item.item);
        closeModal();
      } else if (scanned) {
        // If QR code is scanned but ID doesn't match, show alert
        setShowMismatchAlert(true);
      }
    },
    [closeModal, connectToPeripheral, qrcode, scanned],
  );

  const handleQRCodeScanned = useCallback(({data}) => {
    setQRCode(data);
    setScanned(true); // Set the flag to indicate QR code is scanned
  }, []);

  const handleAlertDismiss = useCallback(() => {
    setShowMismatchAlert(false);
    setScanned(false); // Reset the scanned flag
    setQRCode(''); // Reset the QR code value
  }, []);

  return (
    <Modal
      style={styles.modalContainer}
      animationType="slide"
      transparent={false}
      visible={visible}>
      <SafeAreaView style={styles.modalTitle}>
        <QRCodeScanner
          onRead={handleQRCodeScanned}
          reactivate={true}
          reactivateTimeout={2000}
          fadeIn={true}
          showMarker={true}
          customMarker={
            <View style={styles.camera__scan}>
              <ScanArea />
            </View>
          }
          cameraStyle={{
            height: 800,
          }}
        />
        <FlatList
          contentContainerStyle={styles.modalFlatlistContiner}
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
      </SafeAreaView>

      {/* Alert */}
      {showMismatchAlert && scanned && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>Device Is Not Avaiable!</Text>
          <TouchableOpacity onPress={handleAlertDismiss}>
            <Text style={styles.dismissText}>scan again</Text>
          </TouchableOpacity>
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  // modalFlatlistContiner: {
  //   position: 'relative',
  //   zIndex: -1,
  //   marginTop: 550,
  // },
  modalTitle: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#15212D',
  },
  // save__btn_container: {
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // save__btn: {
  //   backgroundColor: '#E79C25',
  //   paddingHorizontal: 10,
  //   paddingVertical: 15,
  //   alignItems: 'center',
  //   borderRadius: 5,
  //   width: '70%',
  // },
  // save__btn_text: {
  //   color: '#FFF',
  //   textTransform: 'uppercase',
  //   fontWeight: 600,
  //   fontSize: 17,
  // },

  // Alert styles
  alertContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertText: {
    color: '#FFF',
    fontSize: res * 0.03,
    marginBottom: res * 0.05,
  },
  dismissText: {
    color: '#FFF',
    fontSize: res * 0.02,
    textTransform: 'uppercase',
    backgroundColor: '#E79C25',
    paddingHorizontal: res * 0.04,
    paddingVertical: res * 0.02,
    borderRadius: 5,
  },
});

export default DeviceModal;
