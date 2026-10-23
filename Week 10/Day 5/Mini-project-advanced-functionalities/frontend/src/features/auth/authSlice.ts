import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AuthResponse, User } from '@story-app/types';
import { apiRequest, authenticatedRequest, refreshAccessToken } from '../../api/client';
import type { RootState } from '../../app/store';

interface Credentials {
  email: string;
  password: string;
}

interface SignupData extends Credentials {
  name: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: 'idle' | 'loading' | 'authenticated' | 'guest';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk<AuthResponse, Credentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      return await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unable to log in.');
    }
  },
);

export const signup = createAsyncThunk<AuthResponse, SignupData, { rejectValue: string }>(
  'auth/signup',
  async (details, { rejectWithValue }) => {
    try {
      return await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(details),
      });
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unable to create your account.');
    }
  },
);

export const restoreSession = createAsyncThunk<AuthResponse, void, { rejectValue: string }>(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    try {
      const refreshed = await refreshAccessToken();
      const profile = await apiRequest<{ user: User }>('/auth/me', {
        headers: { Authorization: `Bearer ${refreshed.accessToken}` },
      });
      return { accessToken: refreshed.accessToken, user: profile.user };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Your session has expired.');
    }
  },
);

export const updateProfile = createAsyncThunk<User, { name: string; email: string }, { state: RootState; rejectValue: string }>(
  'auth/updateProfile',
  async (profile, { getState, dispatch, rejectWithValue }) => {
    const token = getState().auth.accessToken;
    if (!token) return rejectWithValue('Please log in to update your profile.');
    try {
      const result = await authenticatedRequest<{ user: User }>('/auth/me', token, {
        method: 'PATCH',
        body: JSON.stringify(profile),
      });
      if (result.accessToken !== token) dispatch(tokenUpdated(result.accessToken));
      return result.data.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unable to update your profile.');
    }
  },
);

export const updateAvatar = createAsyncThunk<User, string, { state: RootState; rejectValue: string }>(
  'auth/updateAvatar',
  async (avatarUrl, { getState, dispatch, rejectWithValue }) => {
    const token = getState().auth.accessToken;
    if (!token) return rejectWithValue('Please log in to update your avatar.');
    try {
      const result = await authenticatedRequest<{ user: User }>('/auth/me/avatar', token, {
        method: 'PUT',
        body: JSON.stringify({ avatarUrl }),
      });
      if (result.accessToken !== token) dispatch(tokenUpdated(result.accessToken));
      return result.data.user;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unable to update your avatar.');
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await apiRequest('/auth/logout', { method: 'POST' });
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    tokenUpdated(state, action: { payload: string }) {
      state.accessToken = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.status = 'guest';
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.status = 'authenticated';
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'guest';
        state.error = action.payload || 'Unable to log in.';
      })
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.status = 'authenticated';
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'guest';
        state.error = action.payload || 'Unable to create your account.';
      })
      .addCase(restoreSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.status = 'authenticated';
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = 'guest';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = 'guest';
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.status = 'guest';
      });
  },
});

export const { clearAuth, tokenUpdated } = authSlice.actions;
export default authSlice.reducer;
