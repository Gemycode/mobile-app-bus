import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  busNumber?: string;
  routeNumber?: string;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'Bus Arriving Soon',
        message: 'Bus #1042 will arrive at your stop in 5 minutes',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: false,
        busNumber: '1042',
        routeNumber: '42',
      },
      {
        id: '2',
        type: 'warning',
        title: 'Route Delay',
        message: 'Route #15 is experiencing a 10-minute delay due to traffic',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        read: false,
        routeNumber: '15',
      },
      {
        id: '3',
        type: 'success',
        title: 'Trip Completed',
        message: 'Your child has safely arrived at school',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: true,
        busNumber: '1042',
      },
      {
        id: '4',
        type: 'info',
        title: 'Schedule Update',
        message: 'Tomorrow\'s pickup time has been changed to 7:45 AM',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        read: true,
        routeNumber: '42',
      },
      {
        id: '5',
        type: 'error',
        title: 'Service Alert',
        message: 'Route #28 is temporarily suspended due to road construction',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        routeNumber: '28',
      },
    ];
    
    setNotifications(mockNotifications);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadNotifications();
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return 'information-circle';
      case 'warning':
        return 'warning';
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info':
        return Colors.info;
      case 'warning':
        return Colors.warning;
      case 'success':
        return Colors.success;
      case 'error':
        return Colors.error;
      default:
        return Colors.gray500;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationCard, !item.read && styles.unreadCard]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationLeft}>
          <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) + '20' }]}>
            <Ionicons 
              name={getNotificationIcon(item.type) as any} 
              size={20} 
              color={getNotificationColor(item.type)} 
            />
          </View>
          <View style={styles.notificationContent}>
            <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
              {item.title}
            </Text>
            <Text style={styles.notificationMessage}>{item.message}</Text>
            <View style={styles.notificationMeta}>
              <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
              {item.busNumber && (
                <Text style={styles.metaTag}>Bus #{item.busNumber}</Text>
              )}
              {item.routeNumber && (
                <Text style={styles.metaTag}>Route #{item.routeNumber}</Text>
              )}
            </View>
          </View>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllRead}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'unread' && styles.activeFilter]}
          onPress={() => setFilter('unread')}
        >
          <Text style={[styles.filterText, filter === 'unread' && styles.activeFilterText]}>
            Unread ({unreadCount})
          </Text>
        </TouchableOpacity>
      </View>

      {filteredNotifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-outline" size={64} color={Colors.gray400} />
          <Text style={styles.emptyTitle}>No notifications</Text>
          <Text style={styles.emptyMessage}>
            {filter === 'unread' 
              ? "You're all caught up! No unread notifications."
              : "You don't have any notifications yet."
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
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
  markAllRead: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.brandBeige,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  filterButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
  },
  activeFilter: {
    backgroundColor: Colors.brandMediumBlue,
  },
  filterText: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.gray600,
  },
  activeFilterText: {
    color: Colors.white,
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  notificationCard: {
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
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.brandMediumBlue,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  notificationLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: Fonts.body.medium,
    color: Colors.gray900,
    marginBottom: Spacing.xs,
  },
  unreadTitle: {
    fontFamily: Fonts.body.semiBold,
    color: Colors.brandDarkBlue,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray500,
  },
  metaTag: {
    fontSize: 10,
    fontFamily: Fonts.body.medium,
    color: Colors.brandMediumBlue,
    backgroundColor: Colors.brandBeige1,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.brandMediumBlue,
    marginTop: Spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: Fonts.display.semiBold,
    color: Colors.gray700,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  emptyMessage: {
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 24,
  },
});