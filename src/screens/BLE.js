import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import DeviceModal from './components/DeviceConnectionModal';
import useBLE from '../../useBLE';
import Svg, {G, Circle} from 'react-native-svg';
import MapView, {Heatmap} from 'react-native-maps';

const res = Dimensions.get('window').height;

//IMAGE
import welcomeBG from '../../assets/images/welcome_bg.png';
import Logo from '../../assets/images/logo.png';
import BackGround from '../../assets/images/background.png';
import Jump1 from '../../assets/images/jump.png';

//ICON
import Icon from 'react-native-vector-icons/MaterialIcons';
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const BLE = ({
  navigation,
  radius = 60,
  strokeWidth = 10,
  color = '#FF6B00',
  max = 200,
}) => {
  const {
    requestPermissions,
    scanForDevices,
    allDevices,
    connectToDevice,
    connectedDevice,
    data,
    disconnectFromDevice,
  } = useBLE();
  const [isModalVisible, setIsModalVisible] = useState(false);

  //split the data

  const dataSplited = data.split('|');
  id = [dataSplited[0]];
  server = [dataSplited[1]];
  softVers = [dataSplited[2]];
  hardVers = [dataSplited[3]];
  steps = [dataSplited[4]];
  jump = parseInt(steps * 0.3);
  calories = Math.round(steps * 0.03);
  caloriesTarget = 200;
  distance = (Math.floor(steps * 0.85) / 1000).toFixed(2);
  longitudeDMS = [dataSplited[6]];
  latitudeDMS = [dataSplited[5]];
  battery = parseInt([dataSplited[7]]);
  sprint = [dataSplited[8]];
  jump_acc = (sprint / 50).toFixed(2);
  run = (sprint * 0.3).toFixed(1);
  run_avg = (run * 0.5).toFixed(1);
  run_max = (run * 0.7).toFixed(1);
  run_acc = (run / 10).toFixed(1);
  run_acc_avg = (run_acc * 0.5).toFixed(1);
  run_acc_max = (run_acc * 0.7).toFixed(1);
  trainTime = [dataSplited[9]];

  //convert from DMS (degree - minute - second) to Decimal
  const getDecimal = coordinate => {
    const degree = Math.round(coordinate / 100);
    const minute = Math.round(coordinate - degree * 100);
    const second = ((coordinate - (degree * 100 + minute)) * 100).toFixed(2);

    return (coordinateDecimal = (degree + minute / 60 + second / 3600).toFixed(
      6,
    ));
  };

  longitude = parseFloat(getDecimal(longitudeDMS));
  latitude = parseFloat(getDecimal(latitudeDMS));

  //CLOCK
  const [clock, setClock] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date());
    }, 1000);
    // Clean up the interval on component unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  const hours = clock.getHours().toString().padStart(2, '0');
  const minutes = clock.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const timeString = `${formattedHours}:${minutes}`;

  //Hide Modal
  const hideModal = () => {
    setIsModalVisible(false);
  };

  //Open Modal, pass connection function
  const openModal = async () => {
    requestPermissions(isGranted => {
      if (isGranted) {
        scanForDevices();
        setIsModalVisible(true);
      }
    });
  };

  //Calories - Donut chart
  const halfCircle = radius + strokeWidth;
  const circleCirumference = 2 * Math.PI * radius;
  const circleRef = useRef();

  const maxPerc = (100 * calories) / max;
  const strokeDashoffset =
    circleCirumference - (circleCirumference * maxPerc) / 100;

  //HEATMAP
  const stringArray = [
    '10.80059,106.74493',
    '10.800520,106.74490',
    '10.800556,106.74493',
    '10.800463,106.74483',
    '10.800530,106.74483',
    '10.800430,106.74483',
  ];
  const heatmapCoordinates = stringArray.map(coordinate => {
    const [latitude, longitude] = coordinate
      .split(',')
      .map(c => parseFloat(c.trim()));
    return {latitude, longitude};
  });

  const handleDisconnect = () => {
    Alert.alert('Disconnect warining!', 'Do you want to disconnect ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel disconnect'),
      },
      {
        text: 'OK',
        onPress: () => disconnectFromDevice(),
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        {connectedDevice ? (
          <View style={styles.container}>
            <Image source={BackGround} style={styles.background} />
            {/* HEADER */}
            <View style={styles.header}>
              <View>
                <Text style={styles.header__text}>Dashboard</Text>
                <Text style={styles.device__id}>{id}</Text>
              </View>
              <View style={styles.battery__container}>
                {battery > 21 ? (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: `${battery}%`,
                      height: `100%`,
                      backgroundColor: '#43A047',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}></View>
                ) : (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: `${battery}%`,
                      height: `100%`,
                      backgroundColor: '#F4511E',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}></View>
                )}
                <View style={styles.battery}>
                  <Text style={styles.batter__status}>{battery}%</Text>
                </View>
                <View style={styles.battery__head_container}>
                  <View style={styles.battery__head}></View>
                </View>
              </View>
            </View>
            <ScrollView>
              <View style={styles.content}>
                {/* CONTENT */}
                <View style={styles.stat__container}>
                  <View style={styles.stat__list}>
                    {/* VERTICAL LIST */}
                    <View style={styles.vertical__list}>
                      <View style={styles.stat__box}>
                        {/* ITEM - STEPS */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[styles.stat__icon, styles.step__blur]}>
                                <Icon
                                  name="run-circle"
                                  style={[styles.icon, styles.step]}
                                />
                              </View>
                              <Text style={styles.stat__name}>Steps</Text>
                            </View>
                            {/* STAT NUMBER */}
                            <View style={styles.item__number}>
                              <Text style={styles.number}>{steps}</Text>
                              <Text style={styles.unit}>steps</Text>
                            </View>
                          </View>
                        </View>
                        {/* ITEM - DISTANCE */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[
                                  styles.stat__icon,
                                  styles.distance__blur,
                                ]}>
                                <Icon
                                  name="directions-walk"
                                  style={[styles.icon, styles.distance]}
                                />
                              </View>
                              <Text style={styles.stat__name}>Distance</Text>
                            </View>
                            {/* STAT NUMBER */}
                            <View style={styles.item__number}>
                              <Text style={styles.number}>{distance}</Text>
                              <Text style={styles.unit}>km</Text>
                            </View>
                          </View>
                        </View>
                        {/* ITEM - CALORIES */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[
                                  styles.stat__icon,
                                  styles.calories__blur,
                                ]}>
                                <Icon
                                  name="local-fire-department"
                                  style={[styles.icon, styles.calories]}
                                />
                              </View>
                              <Text style={styles.stat__name}>Calories</Text>
                            </View>
                            {/* STAT NUMBER */}
                            <View style={styles.item__number}>
                              <View>
                                <Svg
                                  width={radius * 2}
                                  height={radius * 2}
                                  viewBox={`0 0 ${halfCircle * 2} ${
                                    halfCircle * 2
                                  }`}>
                                  <G
                                    rotation="-90"
                                    origin={`${halfCircle},${halfCircle}`}>
                                    <Circle
                                      cx="50%"
                                      cy="50%"
                                      stroke={color}
                                      strokeWidth={strokeWidth}
                                      r={radius}
                                      strokeOpacity={0.2}
                                      fill="transparent"
                                    />
                                    <AnimatedCircle
                                      ref={circleRef}
                                      cx="50%"
                                      cy="50%"
                                      stroke={color}
                                      strokeWidth={strokeWidth}
                                      r={radius}
                                      fill="transparent"
                                      strokeDasharray={circleCirumference}
                                      strokeDashoffset={strokeDashoffset}
                                      strokeLinecap="round"
                                    />
                                  </G>
                                </Svg>
                              </View>
                              <Text style={styles.unit}>
                                {calories}/{caloriesTarget} kcal
                              </Text>
                              {calories >= 200 ? (
                                <Text style={styles.congrate}>
                                  You have reached your goal!
                                </Text>
                              ) : (
                                <></>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.stat__box}>
                        {/* ITEM - JUMP ACCELERATION */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            <View style={styles.stat__jump}>
                              <Text style={styles.bottom__name}>
                                Jump Acceleration
                              </Text>
                              <Image
                                source={Jump1}
                                style={styles.jump__image}
                              />
                            </View>
                            {/* STAT NUMBER */}
                            <View style={styles.item__number}>
                              <Text style={styles.number}>{jump_acc}</Text>
                              <Text style={styles.unit}>m/s</Text>
                            </View>
                          </View>
                        </View>
                        {/* ITEM - JUMP */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[styles.stat__icon, styles.jump__blur]}>
                                <Icon
                                  name="arrow-upward"
                                  style={[styles.icon, styles.jump]}
                                />
                              </View>
                              <Text style={styles.stat__name}>Jump</Text>
                            </View>
                            {/* STAT NUMBER */}
                            <View style={styles.item__number}>
                              <Text style={styles.number}>{jump}</Text>
                              <Text style={styles.unit}>jumps</Text>
                            </View>
                          </View>
                        </View>
                        {/* ITEM - ACCELERATION */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[
                                  styles.stat__icon,
                                  styles.sprint__blur,
                                ]}>
                                <Icon
                                  name="directions-run"
                                  style={[styles.icon, styles.sprint]}
                                />
                              </View>
                              <Text style={styles.stat__name}>
                                Acceleration
                              </Text>
                            </View>
                            {/* STAT NUMBER */}
                            <View style={styles.item__number}>
                              <Text style={styles.number}>{sprint}</Text>
                              <Text style={styles.unit}>AVG m/s</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* DISABLE */}
                    <View style={[styles.vertical__list, styles.disable]}>
                      <View style={styles.stat__box}>
                        {/* ITEM - TIME */}
                        <View style={[styles.stat__item, styles.break]}>
                          <View style={[styles.stat__item_content]}>
                            <View style={styles.item__head}>
                              <View
                                style={[styles.stat__icon, styles.time__blur]}>
                                <Icon
                                  name="schedule"
                                  style={[styles.icon, styles.time]}
                                />
                              </View>
                              <Text style={styles.stat__name}>Time</Text>
                            </View>
                            <View style={styles.item__number}>
                              <Text style={styles.number}>{steps}</Text>
                              <Text style={styles.unit}>mins</Text>
                            </View>
                          </View>
                        </View>
                        {/* ITEM - CALORIES */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[
                                  styles.stat__icon,
                                  styles.calories__blur,
                                ]}>
                                <Icon
                                  name="local-fire-department"
                                  style={[styles.icon, styles.calories]}
                                />
                              </View>
                              <Text style={styles.stat__name}>Calories</Text>
                            </View>
                            {/* STAT NUMBER */}
                            <View style={styles.item__number}>
                              <View>
                                <Svg
                                  width={radius * 2}
                                  height={radius * 2}
                                  viewBox={`0 0 ${halfCircle * 2} ${
                                    halfCircle * 2
                                  }`}>
                                  <G
                                    rotation="-90"
                                    origin={`${halfCircle},${halfCircle}`}>
                                    <Circle
                                      cx="50%"
                                      cy="50%"
                                      stroke={color}
                                      strokeWidth={strokeWidth}
                                      r={radius}
                                      strokeOpacity={0.2}
                                      fill="transparent"
                                    />
                                    <AnimatedCircle
                                      ref={circleRef}
                                      cx="50%"
                                      cy="50%"
                                      stroke={color}
                                      strokeWidth={strokeWidth}
                                      r={radius}
                                      fill="transparent"
                                      strokeDasharray={circleCirumference}
                                      strokeDashoffset={strokeDashoffset}
                                      strokeLinecap="round"
                                    />
                                  </G>
                                </Svg>
                              </View>
                              <Text style={styles.unit}>
                                {calories}/{caloriesTarget} kcal
                              </Text>
                              {calories >= 200 ? (
                                <Text style={styles.congrate}>
                                  You have reached your goal!
                                </Text>
                              ) : (
                                <></>
                              )}
                            </View>
                          </View>
                        </View>
                        {/* ITEM - JUMP ACCELERATION */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            <View style={styles.stat__jump}>
                              <Text style={styles.bottom__name}>
                                Jump Acceleration
                              </Text>
                              <Image
                                source={Jump1}
                                style={styles.jump__image}
                              />
                            </View>
                            {/* STAT NUMBER */}
                            <View style={styles.item__number}>
                              <Text style={styles.number}>{sprint}</Text>
                              <Text style={styles.unit}>m/s</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                      <View style={styles.stat__box}>
                        {/* ITEM - SPRINT */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[
                                  styles.stat__icon,
                                  styles.sprint__blur,
                                ]}>
                                <Icon
                                  name="directions-run"
                                  style={[styles.icon, styles.sprint]}
                                />
                              </View>
                              <Text style={styles.stat__name}>Sprint</Text>
                            </View>
                            {/* STAT NUMBER */}
                            <View style={styles.item__number}>
                              <Text style={styles.number}>{sprint}</Text>
                              <Text style={styles.unit}>AVG m/s</Text>
                            </View>
                          </View>
                        </View>
                        {/* ITEM - STEPS */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[styles.stat__icon, styles.step__blur]}>
                                <Icon
                                  name="run-circle"
                                  style={[styles.icon, styles.step]}
                                />
                              </View>
                              <Text style={styles.stat__name}>Steps</Text>
                            </View>
                            {/* STAT NUMBER */}
                            <View style={styles.item__number}>
                              <Text style={styles.number}>{steps}</Text>
                              <Text style={styles.unit}>steps</Text>
                            </View>
                          </View>
                        </View>
                        {/* ITEM - DISTANCE */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[
                                  styles.stat__icon,
                                  styles.distance__blur,
                                ]}>
                                <Icon
                                  name="directions-walk"
                                  style={[styles.icon, styles.distance]}
                                />
                              </View>
                              <Text style={styles.stat__name}>Distance</Text>
                            </View>
                            {/* STAT NUMBER */}
                            <View style={styles.item__number}>
                              <Text style={styles.number}>{distance}</Text>
                              <Text style={styles.unit}>km</Text>
                            </View>
                          </View>
                        </View>
                        {/* ITEM - JUMP */}
                        <View style={[styles.stat__item, styles.break]}>
                          {/* STAT ITEM CONTENT */}
                          <View style={[styles.stat__item_content]}>
                            {/* HEAD ITEM */}
                            <View style={styles.item__head}>
                              <View
                                style={[styles.stat__icon, styles.jump__blur]}>
                                <Icon
                                  name="arrow-upward"
                                  style={[styles.icon, styles.jump]}
                                />
                              </View>
                              <Text style={styles.stat__name}>Jump</Text>
                            </View>
                            {/* STAT NUMBER */}
                            <View style={styles.item__number}>
                              <Text style={styles.number}>{steps}</Text>
                              <Text style={styles.unit}>jumps</Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* ITEM - HEATMAP */}
                    <View style={[styles.stat__item]}>
                      {/* STAT ITEM CONTENT */}
                      <View style={[styles.stat__item_content]}>
                        {/* HEAD ITEM */}
                        <View style={styles.item__head}>
                          <View
                            style={[styles.stat__icon, styles.heatmap__blur]}>
                            <Icon
                              name="location-on"
                              style={[styles.icon, styles.heatmap]}
                            />
                          </View>
                          <Text style={styles.stat__name}>Heat map</Text>
                        </View>
                        {/* MAP */}
                        <View style={styles.map__container}>
                          <View style={styles.map__disable}></View>
                          <MapView
                            style={styles.map}
                            initialRegion={{
                              // latitude: latitude, // Set the initial latitude of the map
                              // longitude: longitude, // Set the initial longitude of the map
                              latitude: 10.80043, // Set the initial latitude of the map ,
                              longitude: 106.74503, // Set the initial longitude of the map
                              latitudeDelta: 0.0005, // Adjust the delta values as needed to zoom in/out
                              longitudeDelta: 0.0005,
                            }}
                            mapType="satellite" // Change the map style to satellite
                          >
                            <Heatmap
                              points={heatmapCoordinates}
                              radius={10} // Adjust the radius of each heatmap point
                              opacity={0.8} // Adjust the opacity of the heatmap
                            />
                          </MapView>
                        </View>
                      </View>
                    </View>
                    {/* ITEM-RUN */}
                    <View style={styles.stat__item}>
                      {/* STAT ITEM CONTENT */}
                      <View style={[styles.stat__item_content]}>
                        {/* HEAD ITEM */}
                        <View style={styles.item__head}>
                          <View style={[styles.stat__icon, styles.speed__blur]}>
                            <Icon
                              name="directions-run"
                              style={[styles.icon, styles.speed]}
                            />
                          </View>
                          <Text style={styles.stat__name}>Speed</Text>
                        </View>
                        {/* STAT NUMBER */}
                        <View style={[styles.item__number, styles.multi]}>
                          <View style={styles.item}>
                            <Text style={styles.number}>{run}</Text>
                            <Text style={styles.unit}>km/h</Text>
                          </View>
                          <View style={styles.line}></View>
                          <View style={styles.item}>
                            <Text style={styles.number}>{run_avg}</Text>
                            <Text style={styles.unit}>AVG km/h</Text>
                          </View>
                          <View style={styles.line}></View>
                          <View style={styles.item}>
                            <Text style={styles.number}>{run_max}</Text>
                            <Text style={styles.unit}>MAX km/h</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    {/* ITEM-RUN ACCELERATION*/}
                    <View style={styles.stat__item}>
                      {/* STAT ITEM CONTENT */}
                      <View style={[styles.stat__item_content]}>
                        {/* HEAD ITEM */}
                        <View style={styles.item__head}>
                          <View
                            style={[
                              styles.stat__icon,
                              styles.speed_accecleration__blur,
                            ]}>
                            <Icon
                              name="call-made"
                              style={[styles.icon, styles.speed_accecleration]}
                            />
                          </View>
                          <Text style={styles.stat__name}>
                            Speed Acceleration
                          </Text>
                        </View>
                        {/* STAT NUMBER */}
                        <View style={[styles.item__number, styles.multi]}>
                          <View style={styles.item}>
                            <Text style={styles.number}>{run_acc}</Text>
                          </View>
                          <View style={styles.line}></View>
                          <View style={styles.item}>
                            <Text style={styles.number}>{run_acc_avg}</Text>
                          </View>
                          <View style={styles.line}></View>
                          <View style={styles.item}>
                            <Text style={styles.number}>{run_acc_max}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* BUTTON SAVE OR RESET */}
                  {/* <TouchableOpacity
                  style={styles.save__btn_container}
                  onPress={handleSave}>
                  <View style={styles.save__btn}>
                    <Text style={styles.save__btn_text}>save your data</Text>
                  </View>
                </TouchableOpacity> */}
                  <TouchableOpacity
                    style={styles.save__btn_container}
                    onPress={handleDisconnect}>
                    <View style={styles.save__btn}>
                      <Text style={styles.save__btn_text}>disconnect</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        ) : (
          <View style={styles.container}>
            <Image source={welcomeBG} style={styles.welcome__bg} />
            <View style={styles.content}>
              <View style={styles.welcome__container}>
                <Animated.View style={[styles.welcome__time]}>
                  <Text style={[styles.time__welcome, styles.highlight]}>
                    {timeString}
                  </Text>
                  <Text style={styles.time__welcome}>{period}</Text>
                </Animated.View>
                <View style={styles.welcome__logo}>
                  <Image source={Logo} style={styles.logo__image} />
                  <Text style={styles.logo__name}>smart coach</Text>
                </View>
                <View style={styles.welcome__scan}>
                  <Text style={styles.scan__text}>Scan your device</Text>
                  <TouchableOpacity
                    style={styles.scan__box}
                    onPress={openModal}>
                    <Icon name="chevron-right" style={styles.scan__icon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
      <DeviceModal
        closeModal={hideModal}
        visible={isModalVisible}
        connectToPeripheral={connectToDevice}
        devices={allDevices}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  disable: {
    display: 'none',
  },
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  welcome__bg: {
    position: 'absolute',
    width: '100%',
    height: '100%',

    // resizeMode: 'cover',
  },
  welcome__container: {
    position: 'relative',
    padding: res * 0.025,
    // backgroundColor: 'red',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome__time: {
    position: 'absolute',
    top: res * 0.035,
    left: 0,
    backgroundColor: '#E79C25',
    padding: res * 0.02,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.95,
  },
  time__welcome: {
    fontSize: res * 0.02,
    color: '#FFF',
  },
  highlight: {
    fontWeight: 700,
    fontSize: res * 0.03,
  },
  welcome__logo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo__image: {
    width: res * 0.25,
    height: res * 0.25,
    resizeMode: 'cover',
  },
  logo__name: {
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: res * 0.04,
    color: '#FFF',
  },
  welcome__scan: {
    position: 'absolute',
    bottom: res * 0.035,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  scan__text: {
    fontSize: res * 0.025,
    color: '#FFF',
  },
  scan__box: {
    width: res * 0.06,
    height: res * 0.06,
    borderRadius: (res * 0.06) / 2,
    backgroundColor: '#E79C25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scan__icon: {
    fontSize: res * 0.04,
  },

  //STATS STYLE --------------------------------------------------------------------------------
  background: {
    position: 'absolute',
    zIndex: -1,
  },
  content: {
    padding: res * 0.02,
    // backgroundColor: 'teal',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: res * 0.025,
    padding: res * 0.02,
  },
  header__text: {
    fontSize: res * 0.03,
    fontWeight: 900,
    color: '#FFF',
  },
  device__id: {
    fontSize: 15,
    marginTop: 10,
    color: '#FFF',
  },
  battery__container: {
    position: 'relative',
    width: res * 0.04,
    height: res * 0.017,
    // overflow: 'hidden',
    borderRadius: 2,
    borderColor: '#fff',
    borderWidth: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  battery__head_container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: -3,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  battery__head: {
    width: res * 0.005,
    height: res * 0.007,
    backgroundColor: '#FFF',
    borderRadius: 1,
  },
  battery: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  batter__status: {
    fontSize: res * 0.01,
    color: '#FFF',
    fontWeight: 600,
  },
  stat__container: {
    width: '100%',
    height: '100%',
    marginTop: res * 0.005,
    paddingHorizontal: res * 0.009,
    paddingBottom: res * 0.06, //clear after done
  },
  stat__list: {
    gap: 20,
  },
  vertical__list: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  stat__box: {
    width: '48%',
    justifyContent: 'space-between',
  },
  stat__item: {
    width: '100%',
    marginTop: res * 0.01,
  },
  stat__item_content: {
    width: '100%',
    backgroundColor: '#15212D',
    padding: res * 0.015,
    borderRadius: 15,
    shadowColor: '#EFE8E8',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.5,
    shadowRadius: 7.68,
    elevation: 12,
  },
  item__head: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat__icon: {
    width: res * 0.045,
    height: res * 0.045,
    borderRadius: (res * 0.045) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: res * 0.025,
  },
  time__blur: {
    backgroundColor: '#4F4722',
  },
  time: {
    color: '#FFB800',
  },
  distance__blur: {
    backgroundColor: '#243352',
  },
  distance: {
    color: '#627CE6',
  },
  sprint__blur: {
    backgroundColor: '#113C24',
  },
  sprint: {
    color: '#03A900',
  },
  calories__blur: {
    backgroundColor: '#443024',
  },
  calories: {
    color: '#FF6B00',
  },
  step__blur: {
    backgroundColor: '#412F39',
  },
  step: {
    fontSize: 25,
    color: '#F16767',
  },
  jump__blur: {
    backgroundColor: '#443C2C',
  },
  jump: {
    color: '#FFA726',
  },
  heatmap__blur: {
    backgroundColor: '#4D292F',
  },
  heatmap: {
    color: '#F44336',
  },
  stat__name: {
    fontSize: res * 0.02,
    color: '#FFF',
    fontWeight: 600,
    marginLeft: res * 0.015,
  },
  stat__jump: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  jump__image: {
    width: res * 0.06,
    height: res * 0.1,
    resizeMode: 'cover',
  },
  item__number: {
    alignItems: 'center',
    paddingVertical: res * 0.01,
  },
  number: {
    fontSize: res * 0.04,
    color: '#FFF',
    fontWeight: 700,
  },
  bottom__name: {
    textAlign: 'center',
    fontSize: res * 0.02,
    color: '#FFF',
    fontWeight: 700,
  },
  unit: {
    marginTop: res * 0.015,
    color: '#FFF',
    fontWeight: 600,
  },
  congrate: {
    fontSize: res * 0.015,
    marginTop: 10,
    color: '#43A047',
    textAlign: 'center',
  },
  map__container: {
    position: 'relative',
    marginTop: res * 0.025,
    paddingBottom: res * 0.015,
  },
  map__disable: {
    position: 'absolute',
    width: '100%',
    height: res * 0.3,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  map: {
    width: '100%',
    height: res * 0.3,
  },
  speed__blur: {
    backgroundColor: '#4F2E2A',
  },
  speed: {
    color: '#FF5722',
  },
  multi: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: res * 0.015,
    paddingVertical: res * 0.025,
  },
  item: {
    alignItems: 'center',
    width: '31%',
  },
  speed_accecleration__blur: {
    backgroundColor: '#103945',
  },
  speed_accecleration: {
    color: '#00ACC1',
  },
  line: {
    height: '50%',
    width: 1,
    backgroundColor: '#616161',
  },
  save__btn_container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: res * 0.035,
  },
  save__btn: {
    backgroundColor: '#E79C25',
    paddingHorizontal: res * 0.015,
    paddingVertical: res * 0.02,
    alignItems: 'center',
    borderRadius: 5,
    width: '70%',
  },
  save__btn_text: {
    color: '#FFF',
    textTransform: 'uppercase',
    fontWeight: 600,
    fontSize: res * 0.02,
  },
});

export default BLE;
