import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'driver' | 'manager' | 'parent';
  image?: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email,
      role: 'parent',
      image: 'https://ui-avatars.com/api/?name=John+Doe',
    };
    
    const token = 'mock-jwt-token';
    
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(mockUser));
    
    return { user: mockUser, token };
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
});

export const loadStoredAuth = createAsyncThunk('auth/loadStored', async () => {
  const token = await AsyncStorage.getItem('token');
  const userString = await AsyncStorage.getItem('user');
  
  if (token && userString) {
    const user = JSON.parse(userString);
    return { user, token };
  }
  
  throw new Error('No stored auth');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;