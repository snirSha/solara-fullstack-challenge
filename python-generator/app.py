from fastapi import FastAPI
from pydantic import BaseModel
import os
import threading
import requests
import google.generativeai as genai
import time


app = FastAPI()

@app.on_event("startup")
async def startup_event():
    print("✅ FastAPI is now listening on port 8000")

OUTPUT_DIR = "output"
os.makedirs(OUTPUT_DIR, exist_ok=True)


class CampaignRequest(BaseModel):
    prompt: str
    campaignId: int
    userId: str


@app.post("/generate")
async def generate_campaign(req: CampaignRequest):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    text_result = ""
    status = "processing"

    try:
        model = genai.GenerativeModel("models/gemini-1.5-flash-8b-latest")
        prompt = f"Create a creative campaign based on the idea: {req.prompt}"
        response = model.generate_content(prompt)
        text_result = response.text
    except Exception as e:
        print(f"Gemini error: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "campaignId": req.campaignId,
                "result": "Failed to generate text.",
                "status": "failed",
                "error": str(e)
            }
        )

    return {
        "campaignId": req.campaignId,
        "result": text_result,
        "status": status
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 FastAPI is starting...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
    print("✅ FastAPI is now listening on port 8000")