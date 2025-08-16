import os
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai

# Configure logging
logging.basicConfig(filename='api.log', level=logging.INFO,
                    format='%(asctime)s - %(levelname)s - %(message)s')

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
    text: str = Field(..., min_length=1)

@app.post("/api/improve-text")
async def improve_text(text_input: TextInput):
    logging.info(f"Received request with text: {text_input.text}")
    try:
        prompt = f"Rewrite the following text for a job interview, focusing on a confident and professional tone:\n\n{text_input.text}"
        logging.info(f"Generated prompt: {prompt}")
        
        response = model.generate_content(prompt)
        
        if response.prompt_feedback.block_reason:
            logging.warning(f"Content blocked: {response.prompt_feedback.block_reason}")
            raise HTTPException(status_code=400, detail=f"Content blocked: {response.prompt_feedback.block_reason}")

        logging.info(f"Successfully generated response: {response.text}")
        return {"improved_text": response.text}
    except HTTPException as e:
        raise e
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/")
async def read_root():
    return {"message": "Dadam API is running."}