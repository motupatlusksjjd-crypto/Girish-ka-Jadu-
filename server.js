// Girish Ka Jadu — secure server
// Node 18+ recommended. API keys stay on the server, NOT in the HTML.
require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json({limit:"2mb"}));
app.use(express.static(path.join(__dirname,"public")));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENAI_API_KEY;
const BASE = process.env.AI_BASE_URL || "https://api.openai.com/v1";
const CHAT_MODEL = process.env.CHAT_MODEL || "gpt-4o-mini";
const IMAGE_MODEL = process.env.IMAGE_MODEL || "gpt-image-1";

function auth(){
  if(!API_KEY) throw new Error("OPENAI_API_KEY is missing. Add it to your .env file.");
}

async function api(pathname, body){
  auth();
  const r = await fetch(BASE + pathname,{
    method:"POST",
    headers:{"Authorization":"Bearer "+API_KEY,"Content-Type":"application/json"},
    body:JSON.stringify(body)
  });
  const text=await r.text();
  let data; try{data=JSON.parse(text)}catch{data={error:{message:text}}}
  if(!r.ok) throw new Error(data?.error?.message || `AI API error ${r.status}`);
  return data;
}

app.post("/api/chat",async(req,res)=>{
  try{
    const message=String(req.body?.message||"").trim();
    if(!message) return res.status(400).json({error:"Message is required."});
    const data=await api("/chat/completions",{
      model:CHAT_MODEL,
      messages:[
        {role:"system",content:"You are Girish Ka Jadu, a helpful, friendly AI assistant. Answer clearly. If the user writes Hindi/Hinglish, respond naturally in Hindi/Hinglish."},
        {role:"user",content:message}
      ],
      temperature:0.7
    });
    res.json({reply:data.choices?.[0]?.message?.content||"No response returned."});
  }catch(e){res.status(500).json({error:e.message})}
});

app.post("/api/image",async(req,res)=>{
  try{
    const prompt=String(req.body?.prompt||"").trim();
    if(!prompt) return res.status(400).json({error:"Image prompt is required."});
    const data=await api("/images/generations",{
      model:IMAGE_MODEL,
      prompt,
      size:"1024x1024"
    });
    const images=(data.data||[]).map(x=>{
      if(x.b64_json) return "data:image/png;base64,"+x.b64_json;
      return x.url;
    }).filter(Boolean);
    if(!images.length) throw new Error("The image API returned no image.");
    res.json({images});
  }catch(e){res.status(500).json({error:e.message})}
});

app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`Girish Ka Jadu running at http://localhost:${PORT}`));
