# Chat State Manager

The Chat State Manager (`useChatManager`) provides centralized state management for the chat system. It handles caching, real-time updates, and authentication to improve performance and user experience.

## Core Features

### Authentication
```typescript
const { getAuthUser } = useChatManager(userId);
```
Manages user authentication with automatic token refresh and state caching.

### Chat Data
```typescript
const { data, loading, error } = chatManager.useChatData(groupId);
```
Handles chat room data with real-time updates and optimized polling.

### Groups
```typescript
const chatManager = useChatManager(userId);
await chatManager.fetchGroups();
```
Manages group listings with metadata caching for better performance.

### Messages
```typescript
await chatManager.sendMessage(groupId, content);
```
Sends messages with optimistic updates and automatic error handling.

## Common Usage Patterns

### Chat Room Component
```typescript
function ChatRoom({ groupId }) {
  const chatManager = useChatManager(userId);
  const { data, loading } = chatManager.useChatData(groupId);

  if (loading) return <Loading />;
  
  return (
    <div>
      <MessageList messages={data.messages} />
      <MessageInput 
        onSend={(content) => chatManager.sendMessage(groupId, content)} 
      />
    </div>
  );
}
```

### Group List Component
```typescript
function GroupList() {
  const chatManager = useChatManager(userId);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const loadGroups = async () => {
      const groupsData = await chatManager.fetchGroups();
      setGroups(groupsData);
    };
    loadGroups();
  }, []);

  return groups.map(group => (
    <GroupPreview 
      key={group._id}
      groupId={group._id}
      userId={userId}
    />
  ));
}
```

## Best Practices

1. **Authentication First**
   ```typescript
   const user = await chatManager.getAuthUser();
   if (!user) {
     router.push('/login');
     return;
   }
   ```

2. **Error Handling**
   ```typescript
   const { data, error } = chatManager.useChatData(groupId);
   if (error) {
     return <ErrorDisplay error={error} />;
   }
   ```

3. **Cache Invalidation**
   ```typescript
   // For specific group
   chatManager.invalidateCache(groupId);
   
   // For all data
   chatManager.invalidateCache();
   ```

4. **Loading States**
   ```typescript
   const { data, loading } = chatManager.useChatData(groupId);
   if (loading && !data) {
     return <LoadingSpinner />;
   }
   ```