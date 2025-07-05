import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchBuses, selectBus } from '../../store/slices/busSlice';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';

export default function MapScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { buses, selectedBus } = useSelector((state: RootState) => state.bus);
  
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const [showBusDetails, setShowBusDetails] = useState(false);
  const [trackingMode, setTrackingMode] = useState(false);

  useEffect(() => {
    dispatch(fetchBuses());
  }, []);

  const handleBusPress = (bus: any) => {
    dispatch(selectBus(bus));
    setShowBusDetails(true);
    
    // Center map on selected bus
    setMapRegion({
      ...mapRegion,
      latitude: bus.lat,
      longitude: bus.lng,
    });
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'on-time':
        return Colors.success;
      case 'delayed':
        return Colors.error;
      case 'stopped':
        return Colors.warning;
      default:
        return Colors.gray500;
    }
  };

  const toggleTracking = () => {
    setTrackingMode(!trackingMode);
  };

  const centerOnUserLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        {/* Google Maps WebView */}
        <WebView
          source={{ uri: 'https://www.google.com/maps/@30.0444,31.2357,12z' }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.controlButton} onPress={centerOnUserLocation}>
            <Ionicons name="locate" size={20} color={Colors.brandMediumBlue} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.controlButton, trackingMode && styles.controlButtonActive]} 
            onPress={toggleTracking}
          >
            <Ionicons 
              name={trackingMode ? "pause" : "play"} 
              size={20} 
              color={trackingMode ? Colors.white : Colors.brandMediumBlue} 
            />
          </TouchableOpacity>
        </View>
        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Status</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
              <Text style={styles.legendText}>On Time</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.error }]} />
              <Text style={styles.legendText}>Delayed</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.legendText}>Stopped</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bus Details Modal */}
      <Modal
        visible={showBusDetails}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBusDetails(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bus Details</Text>
            <TouchableOpacity onPress={() => setShowBusDetails(false)}>
              <Ionicons name="close" size={24} color={Colors.gray600} />
            </TouchableOpacity>
          </View>
          
          {selectedBus && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.busDetailsCard}>
                <View style={styles.busDetailsHeader}>
                  <Text style={styles.busDetailsNumber}>Bus #{selectedBus.number}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getMarkerColor(selectedBus.status) }]}>
                    <Text style={styles.statusBadgeText}>{selectedBus.status.replace('-', ' ')}</Text>
                  </View>
                </View>
                
                <Text style={styles.busDetailsRoute}>{selectedBus.route}</Text>
                <Text style={styles.busDetailsDriver}>Driver: {selectedBus.driver}</Text>
                
                <View style={styles.busDetailsStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{selectedBus.passengers}/{selectedBus.capacity}</Text>
                    <Text style={styles.statLabel}>Passengers</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{selectedBus.speed} mph</Text>
                    <Text style={styles.statLabel}>Speed</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{selectedBus.eta}</Text>
                    <Text style={styles.statLabel}>ETA</Text>
                  </View>
                </View>
                
                <View style={styles.nextStopCard}>
                  <Text style={styles.nextStopTitle}>Next Stop</Text>
                  <Text style={styles.nextStopName}>{selectedBus.nextStop}</Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="call" size={20} color={Colors.white} />
                    <Text style={styles.actionButtonText}>Contact Driver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                    <Ionicons name="notifications" size={20} color={Colors.brandMediumBlue} />
                    <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Get Alerts</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    borderRadius: 16,
    margin: Spacing.lg,
    overflow: 'hidden',
  },
  mapControls: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    gap: Spacing.sm,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  controlButtonActive: {
    backgroundColor: Colors.brandMediumBlue,
  },
  legend: {
    position: 'absolute',
    bottom: Spacing.lg,
    left: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  legendItems: {
    gap: Spacing.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  legendText: {
    fontSize: 10,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts.display.semiBold,
    color: Colors.brandDarkBlue,
  },
  modalContent: {
    flex: 1,
    padding: Spacing.lg,
  },
  busDetailsCard: {
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  busDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  busDetailsNumber: {
    fontSize: 20,
    fontFamily: Fonts.display.bold,
    color: Colors.brandDarkBlue,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontFamily: Fonts.body.medium,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  busDetailsRoute: {
    fontSize: 16,
    fontFamily: Fonts.body.medium,
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  busDetailsDriver: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
    marginBottom: Spacing.lg,
  },
  busDetailsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: Fonts.display.bold,
    color: Colors.brandDarkBlue,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
  },
  nextStopCard: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  nextStopTitle: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  nextStopName: {
    fontSize: 16,
    fontFamily: Fonts.body.medium,
    color: Colors.brandDarkBlue,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandMediumBlue,
    borderRadius: 8,
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.brandMediumBlue,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Colors.white,
  },
  secondaryButtonText: {
    color: Colors.brandMediumBlue,
  },
});