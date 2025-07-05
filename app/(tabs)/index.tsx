import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { RootState, AppDispatch } from '../../src/store/store';
import { fetchBuses } from '../../src/store/slices/busSlice';
import { fetchRoutes } from '../../src/store/slices/routeSlice';
import { Colors } from '../../src/constants/Colors';
import { Fonts } from '../../src/constants/Fonts';
import { Spacing } from '../../src/constants/Spacing';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { buses, loading: busLoading } = useSelector((state: RootState) => state.bus);
  const { routes, loading: routeLoading } = useSelector((state: RootState) => state.route);

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    dispatch(fetchBuses());
    dispatch(fetchRoutes());
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadData();
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.white} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="bus-outline" size={24} color={Colors.brandMediumBlue} />
            <Text style={styles.statNumber}>{buses.length}</Text>
            <Text style={styles.statLabel}>Active Buses</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="location-outline" size={24} color={Colors.success} />
            <Text style={styles.statNumber}>{routes.length}</Text>
            <Text style={styles.statLabel}>Routes</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color={Colors.warning} />
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>On Time</Text>
          </View>
        </View>

        {/* Live Buses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Live Bus Tracking</Text>
            <TouchableOpacity onPress={() => router.push('/map')}>
              <Text style={styles.seeAllText}>View Map</Text>
            </TouchableOpacity>
          </View>
          
          {buses.slice(0, 3).map((bus) => (
            <TouchableOpacity
              key={bus.id}
              style={styles.busCard}
              onPress={() => router.push(`/bus-details?busId=${bus.id}`)}
            >
              <View style={styles.busCardLeft}>
                <View style={[styles.busStatusDot, { backgroundColor: getStatusColor(bus.status) }]} />
                <View>
                  <Text style={styles.busNumber}>Bus #{bus.number}</Text>
                  <Text style={styles.busRoute}>{bus.route}</Text>
                  <Text style={styles.busDriver}>Driver: {bus.driver}</Text>
                </View>
              </View>
              <View style={styles.busCardRight}>
                <Text style={styles.busPassengers}>{bus.passengers}/{bus.capacity}</Text>
                <Text style={styles.busEta}>ETA: {bus.eta}</Text>
                <View style={[styles.busStatusBadge, { backgroundColor: getStatusColor(bus.status) }]}>
                  <Text style={styles.busStatusText}>{bus.status.replace('-', ' ')}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Routes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Routes</Text>
            <TouchableOpacity onPress={() => router.push('/routes')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {routes.slice(0, 2).map((route) => (
            <TouchableOpacity
              key={route.id}
              style={styles.routeCard}
              onPress={() => router.push(`/route-details?routeId=${route.id}`)}
            >
              <View style={styles.routeCardLeft}>
                <View style={styles.routeIcon}>
                  <Ionicons name="location" size={20} color={Colors.brandMediumBlue} />
                </View>
                <View>
                  <Text style={styles.routeName}>Route #{route.number}</Text>
                  <Text style={styles.routeDescription}>{route.description}</Text>
                  <Text style={styles.routeSchedule}>
                    {route.schedule.departure} - {route.schedule.arrival}
                  </Text>
                </View>
              </View>
              <View style={styles.routeCardRight}>
                <View style={[styles.routeStatusBadge, { 
                  backgroundColor: route.status === 'active' ? Colors.success : Colors.gray400 
                }]}>
                  <Text style={styles.routeStatusText}>{route.status}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="map-outline" size={24} color={Colors.brandMediumBlue} />
              <Text style={styles.actionText}>Track Bus</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="time-outline" size={24} color={Colors.brandMediumBlue} />
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="call-outline" size={24} color={Colors.brandMediumBlue} />
              <Text style={styles.actionText}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="help-circle-outline" size={24} color={Colors.brandMediumBlue} />
              <Text style={styles.actionText}>Help</Text>
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
    backgroundColor: Colors.brandDarkBlue,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  greeting: {
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Colors.gray300,
  },
  userName: {
    fontSize: 24,
    fontFamily: Fonts.display.bold,
    color: Colors.white,
  },
  notificationButton: {
    position: 'relative',
    padding: Spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    fontSize: 12,
    fontFamily: Fonts.body.bold,
    color: Colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: Fonts.display.bold,
    color: Colors.brandDarkBlue,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.body.medium,
    color: Colors.gray600,
    textAlign: 'center',
  },
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.display.semiBold,
    color: Colors.brandDarkBlue,
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.brandMediumBlue,
  },
  busCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  busCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  busStatusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.md,
  },
  busNumber: {
    fontSize: 16,
    fontFamily: Fonts.body.semiBold,
    color: Colors.brandDarkBlue,
  },
  busRoute: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
  },
  busDriver: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray500,
  },
  busCardRight: {
    alignItems: 'flex-end',
  },
  busPassengers: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.gray700,
  },
  busEta: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray500,
  },
  busStatusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: Spacing.xs,
  },
  busStatusText: {
    fontSize: 10,
    fontFamily: Fonts.body.medium,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  routeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  routeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.brandBeige1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  routeName: {
    fontSize: 16,
    fontFamily: Fonts.body.semiBold,
    color: Colors.brandDarkBlue,
  },
  routeDescription: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
  },
  routeSchedule: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray500,
  },
  routeCardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  routeStatusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  routeStatusText: {
    fontSize: 10,
    fontFamily: Fonts.body.medium,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10
  },
  actionButton: {
    width: '48%',
    backgroundColor: Colors.gray50,
    borderRadius: 12,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 1,
  },
  actionText: {
    fontSize: 12,
    fontFamily: Fonts.body.medium,
    color: Colors.brandMediumBlue,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});