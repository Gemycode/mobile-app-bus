import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export default function BusDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { busId } = route.params as { busId: string };
  const { buses } = useSelector((state: RootState) => state.bus);
  
  const [bus, setBus] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const foundBus = buses.find(b => b.id === busId);
    setBus(foundBus);
  }, [busId, buses]);

  const getStatusColor = (status: string) => {
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

  const handleContactDriver = () => {
    Alert.alert(
      'Contact Driver',
      'Would you like to call the bus driver?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => {} },
      ]
    );
  };

  const handleTrackBus = () => {
    setIsTracking(!isTracking);
    // In a real app, this would start/stop real-time tracking
  };

  const handleGetNotifications = () => {
    Alert.alert('Success', 'You will now receive notifications for this bus');
  };

  if (!bus) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading bus details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.busHeader}>
            <View style={styles.busInfo}>
              <Text style={styles.busNumber}>Bus #{bus.number}</Text>
              <Text style={styles.busRoute}>{bus.route}</Text>
              <Text style={styles.busDriver}>Driver: {bus.driver}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bus.status) }]}>
              <Text style={styles.statusText}>{bus.status.replace('-', ' ')}</Text>
            </View>
          </View>
        </View>

        {/* Live Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Status</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Ionicons name="speedometer-outline" size={24} color={Colors.brandMediumBlue} />
              <Text style={styles.statusValue}>{bus.speed} mph</Text>
              <Text style={styles.statusLabel}>Current Speed</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name="people-outline" size={24} color={Colors.brandMediumBlue} />
              <Text style={styles.statusValue}>{bus.passengers}/{bus.capacity}</Text>
              <Text style={styles.statusLabel}>Passengers</Text>
            </View>
            <View style={styles.statusItem}>
              <Ionicons name="time-outline" size={24} color={Colors.brandMediumBlue} />
              <Text style={styles.statusValue}>{bus.eta}</Text>
              <Text style={styles.statusLabel}>Next Stop ETA</Text>
            </View>
          </View>
        </View>

        {/* Next Stop */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Stop</Text>
          <View style={styles.nextStopCard}>
            <View style={styles.nextStopHeader}>
              <Ionicons name="location" size={20} color={Colors.brandMediumBlue} />
              <Text style={styles.nextStopName}>{bus.nextStop}</Text>
            </View>
            <Text style={styles.nextStopEta}>Estimated arrival: {bus.eta}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '65%' }]} />
            </View>
            <Text style={styles.progressText}>65% of route completed</Text>
          </View>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Location</Text>
          <View style={styles.locationCard}>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Latitude</Text>
              <Text style={styles.locationValue}>{bus.lat.toFixed(6)}</Text>
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Longitude</Text>
              <Text style={styles.locationValue}>{bus.lng.toFixed(6)}</Text>
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Last Updated</Text>
              <Text style={styles.locationValue}>Just now</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, isTracking && styles.trackingActive]} 
              onPress={handleTrackBus}
            >
              <Ionicons 
                name={isTracking ? "pause" : "play"} 
                size={20} 
                color={isTracking ? Colors.white : Colors.brandMediumBlue} 
              />
              <Text style={[styles.actionButtonText, isTracking && styles.trackingActiveText]}>
                {isTracking ? 'Stop Tracking' : 'Track Bus'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleContactDriver}>
              <Ionicons name="call-outline" size={20} color={Colors.brandMediumBlue} />
              <Text style={styles.actionButtonText}>Contact Driver</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleGetNotifications}>
              <Ionicons name="notifications-outline" size={20} color={Colors.brandMediumBlue} />
              <Text style={styles.actionButtonText}>Get Alerts</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => navigation.navigate('Map' as never)}
            >
              <Ionicons name="map-outline" size={20} color={Colors.brandMediumBlue} />
              <Text style={styles.actionButtonText}>View on Map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Departed from Central Depot</Text>
                <Text style={styles.activityTime}>6:30 AM</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Picked up 15 students at Oak Street</Text>
                <Text style={styles.activityTime}>6:45 AM</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>Picked up 8 students at Pine Avenue</Text>
                <Text style={styles.activityTime}>7:00 AM</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
  },
  headerCard: {
    backgroundColor: Colors.white,
    margin: Spacing.lg,
    borderRadius: 12,
    padding: Spacing.lg,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  busInfo: {
    flex: 1,
  },
  busNumber: {
    fontSize: 24,
    fontFamily: Fonts.display.bold,
    color: Colors.brandDarkBlue,
    marginBottom: Spacing.xs,
  },
  busRoute: {
    fontSize: 16,
    fontFamily: Fonts.body.medium,
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  busDriver: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontFamily: Fonts.body.semiBold,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.display.semiBold,
    color: Colors.brandDarkBlue,
    marginBottom: Spacing.md,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusValue: {
    fontSize: 18,
    fontFamily: Fonts.display.bold,
    color: Colors.brandDarkBlue,
    marginTop: Spacing.xs,
  },
  statusLabel: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  nextStopCard: {
    backgroundColor: Colors.gray50,
    borderRadius: 8,
    padding: Spacing.md,
  },
  nextStopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  nextStopName: {
    fontSize: 16,
    fontFamily: Fonts.body.semiBold,
    color: Colors.brandDarkBlue,
    marginLeft: Spacing.sm,
  },
  nextStopEta: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
    marginBottom: Spacing.md,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.gray300,
    borderRadius: 2,
    marginBottom: Spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.brandMediumBlue,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
  },
  locationCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  locationInfo: {
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
    marginBottom: Spacing.xs,
  },
  locationValue: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Colors.brandDarkBlue,
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: 8,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.xs,
  },
  trackingActive: {
    backgroundColor: Colors.brandMediumBlue,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.brandMediumBlue,
  },
  trackingActiveText: {
    color: Colors.white,
  },
  activityList: {
    gap: Spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brandMediumBlue,
    marginTop: 6,
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Colors.gray900,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
  },
});