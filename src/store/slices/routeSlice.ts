import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Route {
  id: string;
  number: string;
  name: string;
  description: string;
  stops: string[];
  schedule: {
    departure: string;
    arrival: string;
  };
  status: 'active' | 'inactive';
}

interface RouteState {
  routes: Route[];
  selectedRoute: Route | null;
  loading: boolean;
  error: string | null;
}

const initialState: RouteState = {
  routes: [],
  selectedRoute: null,
  loading: false,
  error: null,
};

export const fetchRoutes = createAsyncThunk('route/fetchRoutes', async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const mockRoutes: Route[] = [
    {
      id: '1',
      number: '42',
      name: 'Westside Express',
      description: 'Morning & Afternoon School Service',
      stops: ['Westside Elementary', 'Maple & Oak Street', 'Pine Street'],
      schedule: {
        departure: '6:30 AM',
        arrival: '8:15 AM',
      },
      status: 'active',
    },
    {
      id: '2',
      number: '15',
      name: 'Downtown Loop',
      description: 'City Center Route',
      stops: ['Central Station', 'Downtown Mall', 'City Hall'],
      schedule: {
        departure: '7:00 AM',
        arrival: '8:30 AM',
      },
      status: 'active',
    },
  ];
  
  return mockRoutes;
});

const routeSlice = createSlice({
  name: 'route',
  initialState,
  reducers: {
    selectRoute: (state, action) => {
      state.selectedRoute = action.payload;
    },
    clearSelectedRoute: (state) => {
      state.selectedRoute = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoutes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoutes.fulfilled, (state, action) => {
        state.loading = false;
        state.routes = action.payload;
      })
      .addCase(fetchRoutes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch routes';
      });
  },
});

export const { selectRoute, clearSelectedRoute } = routeSlice.actions;
export default routeSlice.reducer;