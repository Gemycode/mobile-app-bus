import React from 'react';
import { Stack } from 'expo-router';
import { useSelector } from 'react-redux';
import { Redirect } from 'expo-router';
import { RootState } from '../../src/store/store';

export default function AuthLayout() {
  const { user, token } = useSelector((state: RootState) => state.auth);

  // If user is authenticated, redirect to main app
  if (user && token) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}