import React, {useCallback, useState, useEffect} from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import ScanArea from './ScanArea';

// const DeviceModalListItem = props => {
//   const {item, connectToPeripheral, closeModal} = props;

//   const connectAndCloseModal = useCallback(() => {
//     connectToPeripheral(item.item);
//     closeModal();
//   }, [connectToPeripheral, closeModal, item.item]);

//   return (
//     <TouchableOpacity
//       style={styles.save__btn_container}
//       onPress={connectAndCloseModal}>
//       <View style={styles.save__btn}>
//         <Text style={styles.save__btn_text}>connect</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

const DeviceModal = props => {
  const {devices, visible, connectToPeripheral, closeModal} = props;
  const [qrcode, setQRCode] = useState('');

  //clear qrcode value after 30s
  useEffect(() => {
    const timeout = setTimeout(() => {
      setQRCode('');
    }, 30000);

    return () => clearTimeout(timeout);
  }, [qrcode]);

  const renderDeviceModalListItem = useCallback(
    item => {
      if (item.item.id === qrcode) {
        // return (
        //   <DeviceModalListItem
        //     item={item}
        //     connectToPeripheral={connectToPeripheral}
        //     closeModal={closeModal}
        //   />
        // );
        connectToPeripheral(item.item);
        closeModal();
      } else return null;
    },
    [closeModal, connectToPeripheral, qrcode],
  );

  return (
    <Modal
      style={styles.modalContainer}
      animationType="slide"
      transparent={false}
      visible={visible}>
      <SafeAreaView style={styles.modalTitle}>
        <QRCodeScanner
          onRead={({data}) => setQRCode(data)}
          reactivate={true}
          reactivateTimeout={2000}
          fadeIn={true}
          showMarker={true}
          customMarker={
            <View style={styles.camera__scan}>
              <ScanArea />
            </View>
          }
          // cameraStyle={{
          //   height: 500,
          // }}
          cameraStyle={{
            height: 800,
          }}
        />
        <FlatList
          contentContainerStyle={styles.modalFlatlistContiner}
          data={devices}
          renderItem={renderDeviceModalListItem}
        />
        {/* {console.log(devices)} */}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalFlatlistContiner: {
    position: 'relative',
    zIndex: -1,
    marginTop: 450,
  },
  modalTitle: {
    position: 'relative',
    flex: 1,
    backgroundColor: '#15212D',
  },
  save__btn_container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  save__btn: {
    backgroundColor: '#E79C25',
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 5,
    width: '70%',
  },
  save__btn_text: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: 17,
  },
});

export default DeviceModal;
