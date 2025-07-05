import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import busSlice from './slices/busSlice';
import routeSlice from './slices/routeSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    bus: busSlice,
    route: routeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;