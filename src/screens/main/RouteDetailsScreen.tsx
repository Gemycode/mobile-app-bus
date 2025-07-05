import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export default function RouteDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { routeId } = route.params as { routeId: string };
  const { routes } = useSelector((state: RootState) => state.route);
  
  const [routeData, setRouteData] = useState<any>(null);

  useEffect(() => {
    const foundRoute = routes.find(r => r.id === routeId);
    setRouteData(foundRoute);
  }, [routeId, routes]);

  if (!routeData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading route details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const mockStops = [
    { id: '1', name: 'Central Depot', time: '6:30 AM', type: 'depot' },
    { id: '2', name: 'Oak Street & 1st Ave', time: '6:45 AM', type: 'pickup', students: 15 },
    { id: '3', name: 'Pine Avenue & Main St', time: '7:00 AM', type: 'pickup', students: 8 },
    { id: '4', name: 'Maple Street Stop', time: '7:10 AM', type: 'pickup', students: 5 },
    { id: '5', name: 'Westside Elementary', time: '7:15 AM', type: 'school' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.routeHeader}>
            <View style={styles.routeIcon}>
              <Ionicons name="location" size={32} color={Colors.brandMediumBlue} />
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeNumber}>Route #{routeData.number}</Text>
              <Text style={styles.routeName}>{routeData.name}</Text>
              <Text style={styles.routeDescription}>{routeData.description}</Text>
            </View>
            <View style={[styles.statusBadge, { 
              backgroundColor: routeData.status === 'active' ? Colors.success : Colors.gray400 
            }]}>
              <Text style={styles.statusText}>{routeData.status}</Text>
            </View>
          </View>
        </View>

        {/* Schedule Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <View style={styles.scheduleCard}>
            <View style={styles.scheduleItem}>
              <Ionicons name="play-outline" size={20} color={Colors.success} />
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleLabel}>Departure</Text>
                <Text style={styles.scheduleTime}>{routeData.schedule.departure}</Text>
              </View>
            </View>
            <View style={styles.scheduleDivider} />
            <View style={styles.scheduleItem}>
              <Ionicons name="flag-outline" size={20} color={Colors.error} />
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleLabel}>Arrival</Text>
                <Text style={styles.scheduleTime}>{routeData.schedule.arrival}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Route Stops */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route Stops</Text>
          <View style={styles.stopsContainer}>
            {mockStops.map((stop, index) => (
              <View key={stop.id} style={styles.stopItem}>
                <View style={styles.stopTimeline}>
                  <View style={[styles.stopDot, { 
                    backgroundColor: stop.type === 'depot' ? Colors.gray500 :
                                   stop.type === 'school' ? Colors.brandMediumBlue :
                                   Colors.success
                  }]} />
                  {index < mockStops.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.stopContent}>
                  <View style={styles.stopHeader}>
                    <Text style={styles.stopName}>{stop.name}</Text>
                    <Text style={styles.stopTime}>{stop.time}</Text>
                  </View>
                  <View style={styles.stopMeta}>
                    <Text style={styles.stopType}>
                      {stop.type === 'depot' ? 'Depot' :
                       stop.type === 'school' ? 'School' :
                       'Pickup Stop'}
                    </Text>
                    {stop.students && (
                      <Text style={styles.studentCount}>{stop.students} students</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Route Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Ionicons name="location-outline" size={24} color={Colors.brandMediumBlue} />
              <Text style={styles.statValue}>{mockStops.length}</Text>
              <Text style={styles.statLabel}>Total Stops</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={24} color={Colors.brandMediumBlue} />
              <Text style={styles.statValue}>28</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={24} color={Colors.brandMediumBlue} />
              <Text style={styles.statValue}>45 min</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="speedometer-outline" size={24} color={Colors.brandMediumBl

} />
              <Text style={styles.statValue}>12.5 mi</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Map' as never)}
            >
              <Ionicons name="map" size={20} color={Colors.white} />
              <Text style={styles.primaryButtonText}>View on Map</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="bus-outline" size={20} color={Colors.brandMediumBlue} />
              <Text style={styles.secondaryButtonText}>Track Bus</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="notifications-outline" size={20} color={Colors.brandMediumBlue} />
              <Text style={styles.secondaryButtonText}>Get Alerts</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton}>
              <Ionicons name="share-outline" size={20} color={Colors.brandMediumBlue} />
              <Text style={styles.secondaryButtonText}>Share Route</Text>
            </TouchableOpacity>
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
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.brandBeige1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  routeInfo: {
    flex: 1,
  },
  routeNumber: {
    fontSize: 16,
    fontFamily: Fonts.body.semiBold,
    color: Colors.brandMediumBlue,
    marginBottom: 2,
  },
  routeName: {
    fontSize: 20,
    fontFamily: Fonts.display.bold,
    color: Colors.brandDarkBlue,
    marginBottom: 2,
  },
  routeDescription: {
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
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: 8,
    padding: Spacing.md,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleInfo: {
    marginLeft: Spacing.sm,
  },
  scheduleLabel: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
  },
  scheduleTime: {
    fontSize: 16,
    fontFamily: Fonts.body.semiBold,
    color: Colors.brandDarkBlue,
  },
  scheduleDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.gray300,
    marginHorizontal: Spacing.md,
  },
  stopsContainer: {
    gap: Spacing.md,
  },
  stopItem: {
    flexDirection: 'row',
  },
  stopTimeline: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  stopDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: Colors.gray300,
    marginTop: Spacing.xs,
  },
  stopContent: {
    flex: 1,
    paddingBottom: Spacing.md,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  stopName: {
    fontSize: 16,
    fontFamily: Fonts.body.medium,
    color: Colors.gray900,
    flex: 1,
  },
  stopTime: {
    fontSize: 14,
    fontFamily: Fonts.body.semiBold,
    color: Colors.brandMediumBlue,
  },
  stopMeta: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  stopType: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
  },
  studentCount: {
    fontSize: 12,
    fontFamily: Fonts.body.medium,
    color: Colors.brandMediumBlue,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: 8,
    padding: Spacing.md,
  },
  statValue: {
    fontSize: 18,
    fontFamily: Fonts.display.bold,
    color: Colors.brandDarkBlue,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  actionButtons: {
    gap: Spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brandMediumBlue,
    borderRadius: 8,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: Fonts.body.semiBold,
    color: Colors.white,
  },
  secondaryButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray50,
    borderRadius: 8,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.brandMediumBlue,
  },
});