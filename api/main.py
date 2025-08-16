import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY not found in .env file")

genai.configure(api_key=gemini_api_key)
model = genai.GenerativeModel('gemini-pro')

class TextInput(BaseModel):
    text: str

@app.post("/api/improve-text")
async def improve_text(text_input: TextInput):
    try:
        prompt = f"Rewrite the following text for a job interview, focusing on a confident and professional tone:\n\n{text_input.text}"
        response = model.generate_content(prompt)
        return {"improved_text": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_root():
    return {"message": "Dadam API is running."}