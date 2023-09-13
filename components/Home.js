import React, { useState, useEffect } from "react";
import { View, Button, TextInput, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

import * as Location from "expo-location";

function Home({ navigation }) {
  const [isTracking, setIsTracking] =useState(false);
  const [locationData, setLocationData] = useState(null);
  const [locationSubscription, setLocationSubscription] = useState(null);
  const [userName, setUserName] = useState(""); 
  const [selectedBus, setSelectedBus] = useState("Select the bus"); 

  const fiexdloaction= {
    latitude: 19.4593719,
    longitude: 72.8005249,
  };



  const startLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      // Start tracking location
      setIsTracking(true);
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 0.5,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          setLocationData({ latitude, longitude });
        }
      );
      setLocationSubscription(subscription);
    } catch (error) {
      console.error("Error while tracking location:", error);
    }
  };

  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
    }
    setIsTracking(false);
  };


  useEffect(() => {
    if (locationData) {
      navigation.navigate("Map", {
        locationData: locationData,
        fiexdloaction: fiexdloaction,
        userName: userName,
        selectedBus: selectedBus, 
        // stopLocationTracking:stopLocationTracking,
      });
    }
  }, [locationData, userName, selectedBus]);

  useEffect(() => {
    // Clean up when the component unmounts
    return () => {
      stopLocationTracking();
    };
  }, []);

  return (
    <View style={styles.home_container}>
      <TextInput
        placeholder="Enter your name"
        value={userName}
        onChangeText={(text) => setUserName(text)}
        style={styles.input}
      />
      <Picker
        selectedValue={selectedBus}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => setSelectedBus(itemValue)}
      >
        <Picker.Item label="Select the bus" value="" />
        <Picker.Item label="Bus 1" value="bus1" />
        <Picker.Item label="Bus 2" value="bus2" />
        <Picker.Item label="Bus 3" value="bus3" />
      </Picker>
      <Button
        title={isTracking ? "Stop Ride" : "Start Ride"}
        // title="start ride"
        onPress={() => {
          if (isTracking) {
            // startLocationTracking();
            stopLocationTracking();
          } 
          else {
            startLocationTracking();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  home_container: {
    flex: 1,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: 200,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  picker: {
    width: 200,
    height: 40,
  },
});

export default Home;
