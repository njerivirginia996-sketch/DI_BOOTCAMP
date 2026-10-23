import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { CommentReaction, SharedStory, Story, StoryComment, StoryVersion } from '@story-app/types';
import { apiRequest, authenticatedRequest } from '../../api/client';
import { clearAuth, tokenUpdated } from '../auth/authSlice';
import type { RootState } from '../../app/store';

interface StoriesState {
  items: Story[];
  activeStory: Story | null;
  sharedStory: SharedStory | null;
  comments: StoryComment[];
  versions: StoryVersion[];
  status: 'idle' | 'loading' | 'saving' | 'failed';
  error: string | null;
}

const initialState: StoriesState = {
  items: [],
  activeStory: null,
  sharedStory: null,
  comments: [],
  versions: [],
  status: 'idle',
  error: null,
};

type ThunkConfig = {
  state: RootState;
  rejectValue: string;
};

async function authorized<T>(
  path: string,
  options: RequestInit,
  getState: () => RootState,
  dispatch: (action: ReturnType<typeof tokenUpdated> | ReturnType<typeof clearAuth>) => unknown,
): Promise<T> {
  const token = getState().auth.accessToken;
  if (!token) {
    dispatch(clearAuth());
    throw new Error('Please log in to continue.');
  }
  try {
    const result = await authenticatedRequest<T>(path, token, options);
    if (result.accessToken !== token) dispatch(tokenUpdated(result.accessToken));
    return result.data;
  } catch (error) {
    if (error instanceof Error && /refresh token|log in/i.test(error.message)) dispatch(clearAuth());
    throw error;
  }
}

function rejectMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export const fetchStories = createAsyncThunk<Story[], boolean, ThunkConfig>(
  'stories/fetch',
  async (mineOnly, { getState, dispatch, rejectWithValue }) => {
    try {
      const result = await authorized<{ stories: Story[] }>(
        `/stories${mineOnly ? '?mine=true' : ''}`,
        {},
        getState,
        dispatch,
      );
      return result.stories;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to load stories.'));
    }
  },
);

export const fetchStory = createAsyncThunk<{ story: Story; comments: StoryComment[] }, number, ThunkConfig>(
  'stories/fetchOne',
  async (id, { getState, dispatch, rejectWithValue }) => {
    try {
      const result = await authorized<{ story: Story }>(`/stories/${id}`, {}, getState, dispatch);
      return { ...result, comments: [] };
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to load this story.'));
    }
  },
);

export const fetchStoryComments = createAsyncThunk<StoryComment[], number, ThunkConfig>(
  'stories/fetchComments',
  async (storyId, { getState, dispatch, rejectWithValue }) => {
    try {
      const result = await authorized<{ comments: StoryComment[] }>(`/comments/${storyId}`, {}, getState, dispatch);
      return result.comments;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to load comments.'));
    }
  },
);

export const fetchStoryVersions = createAsyncThunk<StoryVersion[], number, ThunkConfig>(
  'stories/fetchVersions',
  async (id, { getState, dispatch, rejectWithValue }) => {
    try {
      const result = await authorized<{ versions: StoryVersion[] }>(
        `/stories/${id}/versions`,
        {},
        getState,
        dispatch,
      );
      return result.versions;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to load story history.'));
    }
  },
);

export const restoreStoryVersion = createAsyncThunk<{ story: Story; versions: StoryVersion[] }, { storyId: number; versionId: number }, ThunkConfig>(
  'stories/restoreVersion',
  async ({ storyId, versionId }, { getState, dispatch, rejectWithValue }) => {
    try {
      return await authorized(
        `/stories/${storyId}/versions/${versionId}/restore`,
        { method: 'POST' },
        getState,
        dispatch,
      );
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to restore this version.'));
    }
  },
);

export const saveStory = createAsyncThunk<Story, { id?: number; title: string; content: string }, ThunkConfig>(
  'stories/save',
  async ({ id, title, content }, { getState, dispatch, rejectWithValue }) => {
    try {
      const result = await authorized<{ story: Story }>(
        id ? `/stories/${id}` : '/stories',
        { method: id ? 'PATCH' : 'POST', body: JSON.stringify({ title, content }) },
        getState,
        dispatch,
      );
      return result.story;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to save the story.'));
    }
  },
);

export const removeStory = createAsyncThunk<number, number, ThunkConfig>(
  'stories/remove',
  async (id, { getState, dispatch, rejectWithValue }) => {
    try {
      await authorized(`/stories/${id}`, { method: 'DELETE' }, getState, dispatch);
      return id;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to delete the story.'));
    }
  },
);

export const addContributor = createAsyncThunk<void, { storyId: number; userId: number }, ThunkConfig>(
  'stories/addContributor',
  async ({ storyId, userId }, { getState, dispatch, rejectWithValue }) => {
    try {
      await authorized('/contributors', {
        method: 'POST',
        body: JSON.stringify({ story_id: storyId, user_id: userId }),
      }, getState, dispatch);
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to add contributor.'));
    }
  },
);

export const removeContributor = createAsyncThunk<{ contributorId: number; userId: number }, { contributorId: number; userId: number; storyId: number }, ThunkConfig>(
  'stories/removeContributor',
  async ({ contributorId, userId }, { getState, dispatch, rejectWithValue }) => {
    try {
      await authorized(`/contributors/${contributorId}`, { method: 'DELETE' }, getState, dispatch);
      return { contributorId, userId };
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to remove contributor.'));
    }
  },
);

export const addStoryComment = createAsyncThunk<StoryComment[], { storyId: number; body: string }, ThunkConfig>(
  'stories/comment',
  async ({ storyId, body }, { getState, dispatch, rejectWithValue }) => {
    try {
      const result = await authorized<{ comments: StoryComment[] }>(
        '/comments',
        { method: 'POST', body: JSON.stringify({ story_id: storyId, comment_text: body }) },
        getState,
        dispatch,
      );
      return result.comments;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to add comment.'));
    }
  },
);

export const editStoryComment = createAsyncThunk<StoryComment[], { commentId: number; body: string }, ThunkConfig>(
  'stories/editComment',
  async ({ commentId, body }, { getState, dispatch, rejectWithValue }) => {
    try {
      const result = await authorized<{ comments: StoryComment[] }>(
        `/comments/${commentId}`,
        { method: 'PATCH', body: JSON.stringify({ comment_text: body }) },
        getState,
        dispatch,
      );
      return result.comments;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to update comment.'));
    }
  },
);

export const deleteStoryComment = createAsyncThunk<StoryComment[], number, ThunkConfig>(
  'stories/deleteComment',
  async (commentId, { getState, dispatch, rejectWithValue }) => {
    try {
      const result = await authorized<{ comments: StoryComment[] }>(`/comments/${commentId}`, { method: 'DELETE' }, getState, dispatch);
      return result.comments;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to delete comment.'));
    }
  },
);

export const setCommentReaction = createAsyncThunk<StoryComment[], { commentId: number; reaction: string; active: boolean }, ThunkConfig>(
  'stories/setCommentReaction',
  async ({ commentId, reaction, active }, { getState, dispatch, rejectWithValue }) => {
    try {
      const result = await authorized<{ comments: StoryComment[] }>(
        `/comments/${commentId}/reactions/${reaction}`,
        { method: active ? 'PUT' : 'DELETE' },
        getState,
        dispatch,
      );
      return result.comments;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to update reaction.'));
    }
  },
);

export const setCommentsEnabled = createAsyncThunk<Story, { storyId: number; enabled: boolean }, ThunkConfig>(
  'stories/setCommentsEnabled',
  async ({ storyId, enabled }, { getState, dispatch, rejectWithValue }) => {
    try {
      const result = await authorized<{ story: Story }>(
        `/stories/${storyId}/comments/settings`,
        { method: 'PATCH', body: JSON.stringify({ enabled }) },
        getState,
        dispatch,
      );
      return result.story;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to update comment settings.'));
    }
  },
);

export const createStoryShare = createAsyncThunk<string, number, ThunkConfig>(
  'stories/createShare',
  async (storyId, { getState, dispatch, rejectWithValue }) => {
    try {
      const result = await authorized<{ url: string }>(`/stories/${storyId}/share`, { method: 'POST' }, getState, dispatch);
      return result.url;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to create share link.'));
    }
  },
);

export const fetchSharedStory = createAsyncThunk<SharedStory, string, { rejectValue: string }>(
  'stories/fetchShared',
  async (token, { rejectWithValue }) => {
    try {
      const result = await apiRequest<{ story: Story }>(`/share/${encodeURIComponent(token)}`);
      return result.story;
    } catch (error) {
      return rejectWithValue(rejectMessage(error, 'Unable to load the shared story.'));
    }
  },
);

const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    clearStories(state) {
      state.items = [];
      state.activeStory = null;
      state.comments = [];
      state.versions = [];
      state.error = null;
    },
    updateDraftStory(state, action: { payload: Story }) {
      state.activeStory = action.payload;
    },
    replaceComments(state, action: { payload: StoryComment[] }) {
      state.comments = action.payload;
    },
    optimisticallyToggleReaction(state, action: { payload: { commentId: number; reaction: string } }) {
      const comment = state.comments.find((entry) => entry.id === action.payload.commentId);
      if (!comment) return;
      const existing = comment.reactions.find((entry) => entry.reaction === action.payload.reaction);
      if (existing?.reacted) {
        existing.count -= 1;
        existing.reacted = false;
        if (existing.count === 0) comment.reactions = comment.reactions.filter((entry) => entry.reaction !== action.payload.reaction);
      } else if (existing) {
        existing.count += 1;
        existing.reacted = true;
      } else {
        comment.reactions.push({ reaction: action.payload.reaction, count: 1, reacted: true } satisfies CommentReaction);
      }
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchStories.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to load stories.';
      })
      .addCase(fetchStory.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.comments = [];
        state.versions = [];
      })
      .addCase(fetchStory.fulfilled, (state, action) => {
        state.status = 'idle';
        state.activeStory = action.payload.story;
      })
      .addCase(fetchSharedStory.pending, (state) => {
        state.sharedStory = null;
        state.error = null;
      })
      .addCase(fetchSharedStory.fulfilled, (state, action) => {
        state.sharedStory = action.payload;
      })
      .addCase(fetchSharedStory.rejected, (state, action) => {
        state.error = action.payload || 'Unable to load the shared story.';
      })
      .addCase(fetchStoryComments.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(fetchStoryVersions.fulfilled, (state, action) => {
        state.versions = action.payload;
      })
      .addCase(fetchStoryVersions.rejected, (state, action) => {
        state.error = action.payload || 'Unable to load story history.';
      })
      .addCase(restoreStoryVersion.fulfilled, (state, action) => {
        state.status = 'idle';
        state.activeStory = action.payload.story;
        state.versions = action.payload.versions;
      })
      .addCase(fetchStory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to load this story.';
      })
      .addCase(saveStory.pending, (state) => {
        state.status = 'saving';
        state.error = null;
      })
      .addCase(saveStory.fulfilled, (state, action) => {
        state.status = 'idle';
        state.activeStory = action.payload;
        state.items = [action.payload, ...state.items.filter((story) => story.id !== action.payload.id)];
      })
      .addCase(saveStory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Unable to save the story.';
      })
      .addCase(removeStory.fulfilled, (state, action) => {
        state.items = state.items.filter((story) => story.id !== action.payload);
        if (state.activeStory?.id === action.payload) state.activeStory = null;
      })
      .addCase(addContributor.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(removeContributor.fulfilled, (state, action) => {
        if (state.activeStory) {
          state.activeStory.contributors = state.activeStory.contributors.filter((user) => user.contributorId !== action.payload.contributorId);
        }
      })
      .addCase(addStoryComment.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(editStoryComment.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(deleteStoryComment.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(setCommentReaction.fulfilled, (state, action) => {
        state.comments = action.payload;
      })
      .addCase(setCommentsEnabled.fulfilled, (state, action) => {
        state.activeStory = action.payload;
        state.items = state.items.map((story) => story.id === action.payload.id ? action.payload : story);
      });
  },
});

export const { clearStories, optimisticallyToggleReaction, replaceComments, updateDraftStory } = storiesSlice.actions;
export default storiesSlice.reducer;
