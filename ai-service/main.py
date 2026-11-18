"""
CropConnect AI Service
FastAPI-based AI service with Ollama integration and local rule-based fallbacks.
Designed for Bangladesh Agricultural Marketplace.
"""

import os
import json
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

app = FastAPI(
    title="CropConnect AI Service",
    description="Intelligent Agri-Commerce Services for Bangladesh",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
DEFAULT_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")

async def call_ollama(prompt: str, system: str = "") -> Optional[str]:
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                f"{OLLAMA_BASE_URL}/api/generate",
                json={
                    "model": DEFAULT_MODEL,
                    "prompt": prompt,
                    "system": system,
                    "stream": False,
                    "options": {"temperature": 0.7}
                }
            )
            if resp.status_code == 200:
                return resp.json().get("response", "")
    except Exception:
        pass
    return None

class DescriptionRequest(BaseModel):
    product_name: str
    category: str
    quantity: float
    unit: str
    district: Optional[str] = None
    harvest_date: Optional[str] = None
    language: str = "bn"

@app.post("/api/generate-description")
async def generate_description(req: DescriptionRequest):
    system = "You are an honest agricultural product listing assistant for CropConnect Bangladesh. Create a 2-sentence description highlighting harvest quality without false claims."
    prompt = f"Product: {req.product_name}, Category: {req.category}, Quantity: {req.quantity} {req.unit}, Location: {req.district or 'Bangladesh'}, Language: {req.language}"

    ai_text = await call_ollama(prompt, system)
    if ai_text:
        return {"description": ai_text.strip(), "suggested_category": req.category, "is_ai": True}

    # Rule-based fallback
    loc = f" from {req.district}" if req.district else ""
    return {
        "description": f"Fresh farm-gate harvest of {req.product_name}{loc}. Properly sorted and ready for immediate procurement. Stock: {req.quantity} {req.unit}.",
        "suggested_category": req.category,
        "is_ai": False
    }

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[Dict[str, Any]] = []

@app.post("/api/chat")
async def assistant_chat(req: ChatRequest):
    # Safety Check: Pesticides
    q = req.message.lower()
    if any(k in q for k in ["বিষ", "কীটনাশক", "pesticide", "dose", "chemical"]):
        return {
            "reply": "⚠️ CropConnect এআই কোনো প্রকার রাসায়নিক কীটনাশকের মাত্রা বা বিষ প্রয়োগের প্রেসক্রিপশন প্রদান করে না। সঠিক মাত্রার জন্য উপজেলা কৃষি সম্প্রসারণ কর্মকর্তা (DAE) বা হেল্পলাইন ১৬১২৩-এ যোগাযোগ করুন।",
            "is_ai": False
        }

    ai_resp = await call_ollama(req.message)
    if ai_resp:
        return {"reply": ai_resp.strip(), "is_ai": True}

    return {
        "reply": "আমি CropConnect এআই সহকারী। ফসল তালিকাভুক্তি, সঠিক দাম নির্ধারণ ও ক্রেতার অর্ডার সংক্রান্ত যেকোনো বিষয়ে আপনাকে সহায়তা করতে পারি।",
        "is_ai": False
    }

@app.get("/health")
async def health():
    return {"status": "ok", "service": "CropConnect AI Service", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
