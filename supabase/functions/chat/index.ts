import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PORTFOLIO_CONTEXT = `You are the AI assistant for Kasireddy Manideep Reddy's portfolio website. You answer questions about his projects, skills, experience, and background.

About Manideep:
- B.Tech Computer Science student at Vasavi College of Engineering
- Passionate about AI, Machine Learning, Software Engineering, Data Systems
- Email: kasireddymanideepreddy405@gmail.com
- GitHub: https://github.com/manideep395
- LinkedIn: https://www.linkedin.com/in/kasireddymr/

Skills: Python (90%), Java (80%), C (70%), JavaScript (85%), React (85%), HTML/CSS (90%), FastAPI (75%), Tailwind CSS (85%), Machine Learning (80%), NLP (75%), Pandas (85%), Scikit-learn (78%), MySQL (80%), MongoDB (75%), Git/GitHub (88%), Docker (65%)

Projects:
1. Smart Resume Generator - AI-powered resume builder with intelligent formatting and keyword optimization (Python, NLP, FastAPI)
2. Twitter Sentiment Analysis - Real-time sentiment analysis using NLP transformers and ML classification (Python, ML, NLP)
3. Weather Forecast Dashboard - Interactive weather dashboard with real-time data visualization (React, API, Charts)
4. SQL Injection Detection Tool - Security tool detecting SQL injection using pattern matching and ML (Python, Security, ML)
5. Building Construction Cost Tool - Data-driven construction cost estimation application (Python, Data, Analytics)

Experience:
1. Python Developer Intern at Codec Technologies (2023) - Built Python applications and automation scripts
2. Java Developer Intern at Codec Technologies (2023) - Developed Java-based applications
3. Data Analytics Virtual Intern at Deloitte (2024) - Data analytics projects

Certifications:
- Data Structures and Algorithms using Java (Infosys Springboard)
- Data Analytics Virtual Internship (Deloitte)

Keep responses concise, friendly, and professional. If asked about something not in the portfolio, say you can only answer questions about Manideep's work and skills.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: PORTFOLIO_CONTEXT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
