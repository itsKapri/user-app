import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Alert,
  Button,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

function Map(props) {
  const { locationData, fiexdloaction, userName, selectedBus, locationSubscription } = props.route.params;
  const [alertShown, setAlertShown] = useState({
    lessThan2m: false,
    lessThan6m: false,
    lessThan10m: false,
  });

  const calculateDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Radius of the Earth in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    return distance;
  };

  useEffect(() => {
    if (locationData && fiexdloaction) {
      const distance = calculateDistanceInMeters(
        locationData.latitude,
        locationData.longitude,
        fiexdloaction.latitude,
        fiexdloaction.longitude
      );

      if (distance < 2 && distance > 0 && !alertShown.lessThan2m) {
        setAlertShown({ ...alertShown, lessThan2m: true });
        // Display an alert if the distance is less than 2 meters
        Alert.alert("Alert", "You are within 2 meters of the fixed location.", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      } else if (distance <= 6 && distance > 2 && !alertShown.lessThan6m) {
        setAlertShown({ ...alertShown, lessThan6m: true });
        // Display an alert if the distance is less than 6 meters
        Alert.alert("Alert", "You are within 6 meters of the fixed location.", [
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]);
      } else if (distance <= 10 && distance > 6 && !alertShown.lessThan10m) {
        setAlertShown({ ...alertShown, lessThan10m: true });
        // Display an alert if the distance is less than 10 meters
        Alert.alert(
          "Alert",
          "You are within 10 meters of the fixed location.",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
      }
    }
  }, [locationData, fiexdloaction, alertShown]);

  // Calculate the initial region for auto-zoom
  const initialRegion = locationData
    ? {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        latitudeDelta: 0.01, // Adjust as needed
        longitudeDelta: 0.01, // Adjust as needed
      }
    : null;
  const stopLocationTracking = () => {
    if (locationSubscription) {
      locationSubscription.remove();
    }
    // setIsTracking(false);
  };
  return (
    <SafeAreaView>
      <View style={styles.top}>
        {locationData && (
          <Text>
            Latitude: {locationData.latitude}, Longitude:{" "}
            {locationData.longitude}
          </Text>
        )}

        {/* Display the calculated distance between fixed location and current location */}
        {locationData && (
          <Text>
            Distance:{" "}
            {calculateDistanceInMeters(
              fiexdloaction.latitude,
              fiexdloaction.longitude,
              locationData.latitude,
              locationData.longitude
            )}{" "}
            meters
          </Text>
        )}
        <Button
        title="stope ride"
        onPress={()=>{
            console.log("stop")
            // stopLocationTracking()
        }}
        />
        <View style={styles.container}>
          <MapView
            provider="google" 
            // showsUserLocation={true}
            followsUserLocation={true}
            initialRegion={initialRegion} 
            style={styles.map}
          >
            {/* Marker for fixed location */}
            <Marker
              coordinate={{
                latitude: fiexdloaction.latitude,
                longitude: fiexdloaction.longitude,
              }}
              title="Static Location"
              pinColor="blue"
            />

            {locationData && (
              <Marker
                coordinate={{
                  latitude: locationData.latitude,
                  longitude: locationData.longitude,
                }}
                title={userName} 
                description={selectedBus}
              />
            )}

            {/* Your existing code for Polyline */}
            <Polyline
              coordinates={[
                {
                  latitude: fiexdloaction.latitude,
                  longitude: fiexdloaction.longitude,
                },
                {
                  latitude: locationData.latitude,
                  longitude: locationData.longitude,
                },
              ]}
              strokeColor="#000" // Line color
              strokeWidth={2} // Line width
              lineDashPattern={[6, 3]} // Dotted line style: 6 units dashed, 3 units gap
            />
          </MapView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  top: {
    marginTop: 5,
  },
  container: {
    height: 600,
    width: 600,
  },
  map: {
    height: 750,
    width: 360,
  },
});

export default Map;


