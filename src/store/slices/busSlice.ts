import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Bus {
  id: string;
  number: string;
  route: string;
  driver: string;
  lat: number;
  lng: number;
  status: 'on-time' | 'delayed' | 'stopped' | 'early';
  passengers: number;
  capacity: number;
  speed: number;
  nextStop: string;
  eta: string;
}

interface BusState {
  buses: Bus[];
  selectedBus: Bus | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusState = {
  buses: [],
  selectedBus: null,
  loading: false,
  error: null,
};

export const fetchBuses = createAsyncThunk('bus/fetchBuses', async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockBuses: Bus[] = [
    {
      id: '1',
      number: '1042',
      route: 'Route #42 - Westside Express',
      driver: 'John Doe',
      lat: 37.7849,
      lng: -122.4094,
      status: 'on-time',
      passengers: 28,
      capacity: 72,
      speed: 25,
      nextStop: 'Maple & Oak Street',
      eta: '7:15 AM',
    },
    {
      id: '2',
      number: '1087',
      route: 'Route #15 - Downtown Loop',
      driver: 'Sarah Wilson',
      lat: 37.7749,
      lng: -122.4194,
      status: 'delayed',
      passengers: 45,
      capacity: 72,
      speed: 15,
      nextStop: 'Central Station',
      eta: '7:23 AM',
    },
  ];
  
  return mockBuses;
});

const busSlice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    selectBus: (state, action) => {
      state.selectedBus = action.payload;
    },
    clearSelectedBus: (state) => {
      state.selectedBus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuses.fulfilled, (state, action) => {
        state.loading = false;
        state.buses = action.payload;
      })
      .addCase(fetchBuses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch buses';
      });
  },
});

export const { selectBus, clearSelectedBus } = busSlice.actions;
export default busSlice.reducer;