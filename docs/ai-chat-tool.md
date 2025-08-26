# AI Chat Tool

## Overview

The AI Chat tool provides a modern chat interface for interacting with multiple AI models including OpenAI's GPT models and Anthropic's Claude models. It features real-time streaming responses, customizable system prompts, and markdown rendering.

## Features

- **Multiple AI Models**: Support for GPT-4o, GPT-4 Turbo, GPT-4o Mini, Claude 3.5 Sonnet, and Claude 3 Haiku
- **Real-time Streaming**: Messages are streamed in real-time for faster user experience
- **System Prompts**: Predefined prompts for different use cases (developer, writer, analyst, teacher) plus custom prompts
- **Markdown Support**: Full markdown rendering with syntax highlighting for code blocks
- **Message Management**: Copy messages, clear chat history, and proper message threading
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dark Mode**: Full dark mode support following the app's theme system

## Technical Implementation

### API Route
- **Location**: `app/api/chat/route.ts`
- **Framework**: Uses Vercel AI SDK for streaming responses
- **Providers**: Supports both OpenAI and Anthropic API providers
- **Streaming**: Implements `streamText` for real-time response streaming

### Component Structure
- **Location**: `app/tools/ai-chat/page.tsx`
- **Framework**: Next.js 14 with React hooks
- **State Management**: Uses `useChat` hook from Vercel AI SDK
- **Styling**: Tailwind CSS with dark mode support

### Dependencies Added
```json
{
  "ai": "^5.0.24",
  "@ai-sdk/openai": "^2.0.21",
  "@ai-sdk/anthropic": "^2.0.7"
}
```

## Configuration

### Environment Variables
Set one or both of these environment variables:

```bash
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Tool Configuration
The tool is registered in `config/tools.json` with:
- **ID**: `ai-chat`
- **Category**: `ai` (new category)
- **Login Required**: `false` (accessible to all users)
- **Recommended**: `true` (featured prominently)

### Model Configuration
Models and settings are configured in `config/ai-chat.json`:
- Model definitions with provider information
- System prompt templates
- Feature descriptions
- Environment requirements

## Usage

1. **Access the Tool**: Navigate to `/tools/ai-chat`
2. **Configure Settings**: Click the Settings button to:
   - Select AI model (GPT-4o Mini, GPT-4o, GPT-4 Turbo, Claude 3.5 Sonnet, Claude 3 Haiku)
   - Choose system prompt (Default, Developer, Writer, Analyst, Teacher, or Custom)
   - Set custom system prompt if needed
3. **Start Chatting**: Type messages in the input field and press Send
4. **Manage Conversation**: 
   - Copy individual messages
   - Clear entire chat history
   - Stop generation if needed

## System Prompts

### Available Presets
1. **Default Assistant**: General-purpose helpful assistant
2. **Developer Assistant**: Expert software developer for coding help
3. **Writing Assistant**: Professional writer and editor
4. **Data Analyst**: Specialist for data analysis and statistics
5. **Teacher**: Educational guidance and concept explanation
6. **Custom**: User-defined system prompt

### Custom Prompts
Users can create custom system prompts for specialized use cases. The custom prompt is applied at the start of each new conversation.

## Error Handling

- **API Key Missing**: User-friendly toast notification when API keys are not configured
- **Network Errors**: Graceful error handling with retry options
- **Rate Limiting**: Automatic handling of API rate limits
- **Model Availability**: Fallback to default model if selected model is unavailable

## Security Considerations

- API keys are server-side only (not exposed to client)
- Rate limiting through API provider built-in limits
- Input validation on both client and server side
- Proper CORS handling for API routes

## Integration with Existing Architecture

### Authentication
- Tool does not require login (`loginRequired: false`)
- Works with existing NextAuth.js authentication system
- Respects user theme preferences

### Styling
- Uses existing Tailwind CSS classes
- Follows established design patterns from other tools
- Implements proper dark mode support

### Layout
- Uses `ClientToolLayout` component for consistency
- Follows same header/content/info structure as other tools
- Responsive grid layout for different screen sizes

## Future Enhancements

Potential improvements for future versions:
- File upload support for multimodal models
- Conversation persistence with database storage
- Export conversations to various formats
- Custom model parameters (temperature, max tokens)
- Conversation templates and sharing
- Integration with other tools in the suite