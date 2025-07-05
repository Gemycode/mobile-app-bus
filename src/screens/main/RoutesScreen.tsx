import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, AppDispatch } from '../../store/store';
import { fetchRoutes } from '../../store/slices/routeSlice';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export default function RoutesScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { routes, loading } = useSelector((state: RootState) => state.route);
  
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRoutes, setFilteredRoutes] = useState(routes);

  useEffect(() => {
    dispatch(fetchRoutes());
  }, []);

  useEffect(() => {
    const filtered = routes.filter(route =>
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.number.includes(searchQuery) ||
      route.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRoutes(filtered);
  }, [routes, searchQuery]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    dispatch(fetchRoutes());
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderRouteItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.routeCard}
      onPress={() => navigation.navigate('RouteDetails' as never, { routeId: item.id } as never)}
    >
      <View style={styles.routeHeader}>
        <View style={styles.routeIcon}>
          <Ionicons name="location" size={24} color={Colors.brandMediumBlue} />
        </View>
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>Route #{item.number}</Text>
          <Text style={styles.routeTitle}>{item.name}</Text>
          <Text style={styles.routeDescription}>{item.description}</Text>
        </View>
        <View style={styles.routeStatus}>
          <View style={[styles.statusBadge, { 
            backgroundColor: item.status === 'active' ? Colors.success : Colors.gray400 
          }]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
        </View>
      </View>
      
      <View style={styles.routeDetails}>
        <View style={styles.scheduleInfo}>
          <Ionicons name="time-outline" size={16} color={Colors.gray500} />
          <Text style={styles.scheduleText}>
            {item.schedule.departure} - {item.schedule.arrival}
          </Text>
        </View>
        
        <View style={styles.stopsInfo}>
          <Ionicons name="location-outline" size={16} color={Colors.gray500} />
          <Text style={styles.stopsText}>{item.stops.length} stops</Text>
        </View>
      </View>
      
      <View style={styles.routeActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="map-outline" size={16} color={Colors.brandMediumBlue} />
          <Text style={styles.actionText}>View Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="time-outline" size={16} color={Colors.brandMediumBlue} />
          <Text style={styles.actionText}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bus-outline" size={16} color={Colors.brandMediumBlue} />
          <Text style={styles.actionText}>Track Bus</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Routes</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.gray500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search routes..."
            placeholderTextColor={Colors.gray500}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={Colors.gray500} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{routes.length}</Text>
          <Text style={styles.statLabel}>Total Routes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{routes.filter(r => r.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>98%</Text>
          <Text style={styles.statLabel}>On Time</Text>
        </View>
      </View>

      <FlatList
        data={filteredRoutes}
        renderItem={renderRouteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.brandDarkBlue,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.display.bold,
    color: Colors.white,
  },
  filterButton: {
    padding: Spacing.sm,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Colors.gray900,
    marginLeft: Spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 8,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: Fonts.display.bold,
    color: Colors.brandDarkBlue,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
    marginTop: Spacing.xs,
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  routeCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  routeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.brandBeige1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontFamily: Fonts.body.semiBold,
    color: Colors.brandDarkBlue,
  },
  routeTitle: {
    fontSize: 18,
    fontFamily: Fonts.display.semiBold,
    color: Colors.gray900,
    marginVertical: 2,
  },
  routeDescription: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
  },
  routeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontFamily: Fonts.body.medium,
    color: Colors.white,
    textTransform: 'capitalize',
  },
  routeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  scheduleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
    marginLeft: Spacing.xs,
  },
  stopsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stopsText: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
    marginLeft: Spacing.xs,
  },
  routeActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    paddingTop: Spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  actionText: {
    fontSize: 12,
    fontFamily: Fonts.body.medium,
    color: Colors.brandMediumBlue,
    marginLeft: Spacing.xs,
  },
});