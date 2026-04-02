# Movi AI Assistant

## Current State
New project with no existing application logic.

## Requested Changes (Diff)

### Add
- AI chat assistant named "Movi" with a ChatGPT-style conversation interface
- Sidebar with chat history list, "New Chat" button, and user profile row
- Main welcome screen with glowing Movi orb, suggested starter prompts
- Message composer bar with text input, voice/mic button, and send button
- AI responses powered by HTTP outcalls to an external LLM API (e.g., OpenAI-compatible)
- Persistent chat sessions stored on-chain per user (conversation history)
- Multiple chat sessions support (create, list, delete conversations)
- Message streaming / typewriter effect for AI responses
- Suggested starter prompts: "Summarize this article", "Plan my week", "Brainstorm app names", "Draft an email"

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Select `http-outcalls` and `authorization` components for authenticated sessions and AI API calls
2. Generate Motoko backend:
   - Data model: Chat sessions (id, title, created_at) and messages (role: user/assistant, content, timestamp)
   - APIs: createChat, listChats, deleteChat, sendMessage (calls LLM via HTTP outcall), getMessages
   - Store conversations per authenticated user
3. Build frontend:
   - Dark-mode layout with sidebar and main panel
   - Glowing animated orb on welcome screen
   - Chat thread view with scrollable message bubbles
   - Composer bar at bottom
   - Suggested starter chips on welcome screen
   - Typewriter animation for assistant responses
