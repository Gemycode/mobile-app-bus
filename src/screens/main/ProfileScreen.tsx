import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { logoutUser } from '../../store/slices/authSlice';
import { Colors } from '../../constants/Colors';
import { Fonts } from '../../constants/Fonts';
import { Spacing } from '../../constants/Spacing';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  // Settings
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    // In a real app, you would update the user profile via API
    setEditMode(false);
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => dispatch(logoutUser())
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      onPress: () => {},
    },
    {
      icon: 'location-outline',
      title: 'Location Services',
      subtitle: 'Control location sharing settings',
      onPress: () => {},
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Privacy & Security',
      subtitle: 'Manage your privacy settings',
      onPress: () => {},
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      onPress: () => {},
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      subtitle: 'App version and information',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Text style={styles.profileImageText}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </Text>
            </View>
            <TouchableOpacity style={styles.editImageButton}>
              <Ionicons name="camera" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <Text style={styles.userRole}>{user?.role}</Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile Information</Text>
            <TouchableOpacity onPress={() => setEditMode(!editMode)}>
              <Text style={styles.editButton}>
                {editMode ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={[styles.input, !editMode && styles.inputDisabled]}
              value={firstName}
              onChangeText={setFirstName}
              editable={editMode}
              placeholder="First Name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={[styles.input, !editMode && styles.inputDisabled]}
              value={lastName}
              onChangeText={setLastName}
              editable={editMode}
              placeholder="Last Name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={[styles.input, styles.inputDisabled]}
              value={email}
              editable={false}
              placeholder="Email"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput
              style={[styles.input, !editMode && styles.inputDisabled]}
              value={phone}
              onChangeText={setPhone}
              editable={editMode}
              placeholder="Phone Number"
              keyboardType="phone-pad"
            />
          </View>

          {editMode && (
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={20} color={Colors.brandMediumBlue} />
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.gray300, true: Colors.brandMediumBlue }}
              thumbColor={Colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="location-outline" size={20} color={Colors.brandMediumBlue} />
              <Text style={styles.settingText}>Location Sharing</Text>
            </View>
            <Switch
              value={locationSharing}
              onValueChange={setLocationSharing}
              trackColor={{ false: Colors.gray300, true: Colors.brandMediumBlue }}
              thumbColor={Colors.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={20} color={Colors.brandMediumBlue} />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: Colors.gray300, true: Colors.brandMediumBlue }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>More</Text>
          
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon as any} size={20} color={Colors.brandMediumBlue} />
                <View style={styles.menuItemText}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray400} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>BusTrack v1.0.0</Text>
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
  header: {
    backgroundColor: Colors.brandDarkBlue,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.brandBeige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageText: {
    fontSize: 32,
    fontFamily: Fonts.display.bold,
    color: Colors.brandDarkBlue,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.brandMediumBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: Fonts.display.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Colors.gray300,
    marginBottom: Spacing.xs,
  },
  userRole: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.brandBeige,
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
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
  editButton: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.brandMediumBlue,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: Fonts.body.medium,
    color: Colors.gray700,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Colors.gray900,
  },
  inputDisabled: {
    backgroundColor: Colors.gray100,
    color: Colors.gray600,
  },
  saveButton: {
    backgroundColor: Colors.brandMediumBlue,
    borderRadius: 8,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: Fonts.body.semiBold,
    color: Colors.white,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontFamily: Fonts.body.regular,
    color: Colors.gray900,
    marginLeft: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: Fonts.body.medium,
    color: Colors.gray900,
  },
  menuItemSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.body.regular,
    color: Colors.gray600,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: Fonts.body.medium,
    color: Colors.error,
    marginLeft: Spacing.sm,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  versionText: {
    fontSize: 12,
    fontFamily: Fonts.body.regular,
    color: Colors.gray500,
  },
});