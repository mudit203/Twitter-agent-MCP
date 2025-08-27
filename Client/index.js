import { createInterface } from 'readline/promises';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { text } from 'stream/consumers';
import { type } from 'os';

const transport = new StreamableHTTPClientTransport("http://localhost:3000/mcp");
let tools=[];
const chathistory=[];
const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});
const rl=createInterface({
    input: process.stdin,
    output: process.stdout
})
const mcpclient=new Client({
    name:"client",
    version:"1.0.0"
})

console.log("Connecting to MCP server...");
try {
    await mcpclient.connect(transport);
    console.log("Connected successfully!");
} catch (error) {
    console.log("Connection failed:", error);
    process.exit(1);
}
tools=(await mcpclient.listTools()).tools.map((tool)=>{
    return {
        name:tool.name,
        description:tool.description,
        parameters:{
            type:tool.inputSchema.type,
            properties:tool.inputSchema.properties,
            required:tool.inputSchema.required
        }
    }
});
const chatloop= async(toolcall)=>{
    //console.log(chathistory);
    
    if(toolcall){
        try {
             //console.log("yeayeayea",toolcall);
             chathistory.push({
                role:"model",
                parts:[
                    {
                        text: `calling tool ${toolcall.name}`,
                        type:"text"
                    }
                ]
             })
       const toolresult= await mcpclient.callTool({
            name:toolcall.name,
            arguments:toolcall.args || {}
        })
     chathistory.push({
        role:"user",
        parts:[
            {
                text:toolresult.content[0].text,
                type:"text"
            }
        ]
     })
        
      console.log(toolresult.content[0].text)
        } catch (error) {
            console.log("Tool call error:", error);
            console.log("Tool call details:", JSON.stringify(toolcall, null, 2));
        }
   
     
    
     
     

    }
    else{
      const question= await rl.question("You:");
    chathistory.push({
        role:"user",
        parts:[{
            text:question,
            type:"text"
        }]
    })
    }
    
    const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: chathistory,
    config: {
        tools:[
            
            {functionDeclarations : tools},
        ]

        
    }

  });
  const functioncalls=response.candidates[0].content.parts[0].functionCall
  if(functioncalls){
    //console.log("AI toolcalls",functioncalls)
    return chatloop(functioncalls);
  }
  //console.log("this is the raw response",response.candidates[0].content.parts[0].functionCall.args);
    chathistory.push({
        role:"model",
        parts:[{
            text:response.candidates[0].content.parts[0].text
        }]
    })
  
  console.log("AI:",response.candidates[0].content.parts[0].text);
  chatloop();
  
}





chatloop();



//console.log("Available tools are",tools);





