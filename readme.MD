# Twitter Agent

A Twitter/X posting agent powered by Google Gemini AI and Model Context Protocol (MCP). This project consists of a client-server architecture where the client interfaces with Google Gemini AI to process user inputs and the server provides Twitter posting capabilities through MCP tools.

## Project Structure

```
Twitter-agent/
Client/           # AI-powered client interface
index.js      # Main client application
package.json  # Client dependencies
Server/           # MCP server with Twitter integration
index.js      # Express server with MCP endpoints
mcp.tool.js   # Twitter API integration
package.json  # Server dependencies

```

## Features

### Client Features
- **Interactive Chat Interface**: Command-line chat interface for user interaction
- **Google Gemini Integration**: Uses Gemini 2.5 Flash model for AI responses
- **MCP Client**: Connects to MCP server to access tools
- **Chat History**: Maintains conversation history for context
- **Tool Calling**: Automatically calls server tools based on AI responses

### Server Features
- **MCP Server**: Implements Model Context Protocol for tool communication
- **Twitter/X Integration**: Post tweets using Twitter API v2
- **Express API**: HTTP server with MCP endpoints
- **Session Management**: Handles multiple client sessions
- **Tool Functions**:
  - `addtwonumbers`: Simple math operation (demo tool)
  - `createXpost`: Create posts on Twitter/X platform

## Prerequisites

- Node.js (version 14 or higher)
- Twitter/X Developer Account with API access
- Google AI Studio API key (for Gemini)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Twitter-agent
```

### 2. Install Dependencies

Install client dependencies:
```bash
cd Client
npm install
```

Install server dependencies:
```bash
cd ../Server
npm install
```

### 3. Environment Configuration

Create `.env` files in both Client and Server directories:

#### Client/.env
```env
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```

#### Server/.env
```env
TWITTER_APP_KEY=your_twitter_app_key_here
TWITTER_APP_SECRET=your_twitter_app_secret_here
TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
TWITTER_ACCESS_SECRET=your_twitter_access_secret_here
```

### 4. Get Required API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your Client/.env file

#### Twitter API Keys
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app or use existing one
3. Navigate to "Keys and Tokens"
4. Generate/copy the following:
   - API Key (Consumer Key) � `TWITTER_APP_KEY`
   - API Key Secret (Consumer Secret) � `TWITTER_APP_SECRET`
   - Access Token � `TWITTER_ACCESS_TOKEN`
   - Access Token Secret � `TWITTER_ACCESS_SECRET`

## Usage

### 1. Start the Server
```bash
cd Server
node index.js
```
The server will start on `http://localhost:3000`

### 2. Start the Client
In a new terminal:
```bash
cd Client
node index.js
```

### 3. Interact with the Agent
- The client will connect to the MCP server
- Type your messages when prompted with "You:"
- The AI can perform actions like:
  - Creating Twitter/X posts
  - Basic math operations
  - General conversation

## Example Usage

```
You: Create a tweet saying "Hello from my AI agent!"
AI: [Posts to Twitter and confirms]

You: What's 15 plus 27?
AI: The sum of 15 and 27 is 42
```

## Technical Details

### Architecture
- **Client**: Uses Google Gemini AI with function calling capabilities to interact with MCP tools
- **Server**: Express.js server implementing MCP protocol with Twitter API integration
- **Communication**: HTTP-based MCP transport between client and server

### Key Dependencies
- `@modelcontextprotocol/sdk`: MCP protocol implementation
- `@google/genai`: Google Gemini AI integration
- `twitter-api-v2`: Twitter API client
- `express`: Web server framework
- `dotenv`: Environment variable management

## Troubleshooting

1. **Connection Failed**: Ensure the server is running on port 3000
2. **Twitter API Errors**: Verify your Twitter API keys and permissions
3. **Gemini API Errors**: Check your Google AI Studio API key
4. **Environment Variables**: Ensure `.env` files are in the correct directories

## Security Notes

- Never commit `.env` files to version control
- Keep your API keys secure and rotate them regularly
- The server includes basic session management for security

## License

ISC