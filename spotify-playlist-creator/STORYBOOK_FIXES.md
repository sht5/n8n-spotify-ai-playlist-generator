# Storybook Fixes Documentation

## Issue: Maximum Update Depth Exceeded

### Problem
React warning about "Maximum update depth exceeded" was occurring in PlaylistPreview and ChatInterface stories when running in Storybook.

### Root Cause
The `actions` object from `usePlaylist()` context was included in `useEffect` dependency arrays. Since the `actions` object is created as a plain object literal on every render in `PlaylistContext.tsx` (line 142), it gets a new reference each time, causing infinite re-render loops.

```typescript
// In PlaylistContext.tsx - This creates a new object reference on every render
const actions = {
  setLoading: (isLoading: boolean, loadingType?: ...) => { ... },
  addUserMessage: (content: string) => { ... },
  // ... other actions
};
```

### Solution
Removed `actions` from `useEffect` dependency arrays in story components:

**Fixed in:**
1. `PlaylistPreview.stories.tsx` - `PlaylistStateDecorator` component
2. `ChatInterface.stories.tsx` - `ChatWithPreloadedData` component  
3. `ChatInterface.stories.tsx` - `LoadingDemo` component

### Before (Problematic)
```typescript
useEffect(() => {
  if (songs.length > 0) {
    actions.setPlaylist(songs, name || 'Sample Playlist', description);
  }
}, [actions, songs, name, description]); // ❌ actions causes infinite loop
```

### After (Fixed)
```typescript
useEffect(() => {
  if (songs.length > 0) {
    actions.setPlaylist(songs, name || 'Sample Playlist', description);
  }
}, [songs, name, description]); // ✅ actions removed from dependencies
```

### Why This Fix Is Safe

1. **Actions are Stable**: The actual action functions themselves don't change functionality between renders
2. **Props Drive Updates**: We only want effects to re-run when the actual data (songs, name, description) changes
3. **Storybook Context**: In Storybook stories, we're setting up initial state, not responding to action changes

### Alternative Solutions Considered

1. **Memoize Actions**: Could use `useMemo` or `useCallback` in PlaylistContext, but this would be a breaking change to production code
2. **Separate Effect**: Could split into multiple effects, but removing actions from deps is simpler and safer
3. **Ref Pattern**: Could use `useRef` to store actions, but unnecessary complexity for this use case

### Impact
- ✅ No more infinite re-render warnings in Storybook
- ✅ Stories load and function correctly
- ✅ No impact on production code
- ✅ Proper separation of concerns (actions vs. data dependencies)

### Prevention
When creating Storybook stories with context setup:
1. Be careful with context objects in `useEffect` dependencies
2. Focus on data changes rather than function reference changes
3. Use ESLint rules to catch potential dependency issues
4. Test stories thoroughly before committing