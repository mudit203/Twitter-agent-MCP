import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import {z} from "zod";
import { type } from "node:os";
import { createpost } from "./mcp.tool.js";
const app = express();
app.use(express.json());

// Map to store transports by session ID
const transports = {};

// Create the MCP server instance once
const server = new McpServer({
  name: "example-server",
  version: "1.0.0"
});

// Define tools once
server.tool("addtwonumbers",
  "add two numbers",
  {
    a: z.number(),
    b: z.number()
  },
  async (arg) => {
    const { a, b } = arg;
    console.log("Tool called with:", a, b);
    return {
      content: [
        {
          type: "text",
          text: `the sum of mudit ${a} and ${b} is ${a + b}`
        }
      ]
    }
  }
);
server.tool("createXpost",
  "Creates post on X (twitter) social media plactform",
  {
    a: z.string(),
  
  },
  async (arg) => {
    const {a}=arg;
    return createpost(a);
  }
);

// Handle POST requests for client-to-server communication
app.post('/mcp', async (req, res) => {
  
  // Check for existing session ID
  const sessionId = req.headers['mcp-session-id'];
  let transport;

  if (sessionId && transports[sessionId]) {
    // Reuse existing transport
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New initialization request
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        // Store the transport by session ID
        transports[sessionId] = transport;
      },
      // DNS rebinding protection is disabled by default for backwards compatibility. If you are running this server
      // locally, make sure to set:
      // enableDnsRebindingProtection: true,
      // allowedHosts: ['127.0.0.1'],
    });

    // Clean up transport when closed
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    };

    // Connect to the MCP server
    await server.connect(transport);
  } else {
    // Invalid request
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: No valid session ID provided',
      },
      id: null,
    });
    return;
  }

  // Handle the request
  await transport.handleRequest(req, res, req.body);
});

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (req, res) => {
  const sessionId = req.headers['mcp-session-id'];
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }
  
  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

// Handle GET requests for server-to-client notifications via SSE
app.get('/mcp', handleSessionRequest);

// Handle DELETE requests for session termination
app.delete('/mcp', handleSessionRequest);

app.listen(3000,()=>{
    console.log("server is running");
    
});