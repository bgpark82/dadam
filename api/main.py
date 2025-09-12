import os

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
from supabase_client import supabase



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

import os

from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import google.generativeai as genai
from supabase_client import supabase
import assemblyai as aai



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
model = genai.GenerativeModel('gemini-2.0-flash')

aai.settings.api_key = os.getenv("ASSEMBLYAI_API_KEY")

class TextInput(BaseModel):
    text: str = Field(..., min_length=1)

@app.post("/api/improve-text")
async def improve_text(text_input: TextInput):
    print(f"Received request with text: {text_input.text}")
    try:
        prompt = (f"""
            You are an AI assistant specialized in professional communication. 
            Rewrite the following sentence to correct its grammar and make it sound more natural and smooth, 
            as if written by a native speaker. 
            Do not include any additional explanations or text, just the final, polished sentence: {text_input.text}
            """)
        print(f"Generated prompt: {prompt}")

        response = model.generate_content(prompt, generation_config={"temperature": 0})
        
        if response.prompt_feedback.block_reason:
            print(f"Content blocked: {response.prompt_feedback.block_reason}")
            raise HTTPException(status_code=400, detail=f"Content blocked: {response.prompt_feedback.block_reason}")

        improved_text = response.text
        print(f"Successfully generated response: {improved_text}")

        # Save to Supabase
        dummy_user_id = os.getenv("DUMMY_USER_ID")
        if dummy_user_id:
            try:
                supabase.table('history').insert({
                    'original_text': text_input.text,
                    'improved_text': improved_text,
                    'user_id': dummy_user_id
                }).execute()
                print(f"Saved history for user {dummy_user_id}")
            except Exception as e:
                print(f"Failed to save history to Supabase: {str(e)}", exc_info=True)
                # We don't want to fail the whole request if logging fails, so we'll just log the error.

        return {"improved_text": improved_text}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"An error occurred: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/api/history")
async def get_history():
    dummy_user_id = os.getenv("DUMMY_USER_ID")
    if not dummy_user_id:
        raise HTTPException(status_code=500, detail="DUMMY_USER_ID not found in .env file")

    try:
        response = supabase.table('history').select('*').eq('user_id', dummy_user_id).order('created_at', desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if not aai.settings.api_key:
        raise HTTPException(status_code=500, detail="AssemblyAI API key is not configured.")

    try:
        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(file.file)

        if transcript.error:
            raise HTTPException(status_code=502, detail=transcript.error)

        return {"transcription": transcript.text}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"An error occurred during transcription: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred during transcription: {str(e)}")

@app.get("/api/models")
async def list_models():
    try:
        models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        return {"models": models}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_root():
    return {"message": "Dadam API is running."}
model = genai.GenerativeModel('gemini-2.0-flash')

class TextInput(BaseModel):
    text: str = Field(..., min_length=1)

@app.post("/api/improve-text")
async def improve_text(text_input: TextInput):
    print(f"Received request with text: {text_input.text}")
    try:
        prompt = (f"""
            You are an AI assistant specialized in professional communication. 
            Rewrite the following sentence to correct its grammar and make it sound more natural and smooth, 
            as if written by a native speaker. 
            Do not include any additional explanations or text, just the final, polished sentence: {text_input.text}
            """)
        print(f"Generated prompt: {prompt}")

        response = model.generate_content(prompt, generation_config={"temperature": 0})
        
        if response.prompt_feedback.block_reason:
            print(f"Content blocked: {response.prompt_feedback.block_reason}")
            raise HTTPException(status_code=400, detail=f"Content blocked: {response.prompt_feedback.block_reason}")

        improved_text = response.text
        print(f"Successfully generated response: {improved_text}")

        # Save to Supabase
        dummy_user_id = os.getenv("DUMMY_USER_ID")
        if dummy_user_id:
            try:
                supabase.table('history').insert({
                    'original_text': text_input.text,
                    'improved_text': improved_text,
                    'user_id': dummy_user_id
                }).execute()
                print(f"Saved history for user {dummy_user_id}")
            except Exception as e:
                print(f"Failed to save history to Supabase: {str(e)}", exc_info=True)
                # We don't want to fail the whole request if logging fails, so we'll just log the error.

        return {"improved_text": improved_text}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"An error occurred: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.get("/api/history")
async def get_history():
    dummy_user_id = os.getenv("DUMMY_USER_ID")
    if not dummy_user_id:
        raise HTTPException(status_code=500, detail="DUMMY_USER_ID not found in .env file")

    try:
        response = supabase.table('history').select('*').eq('user_id', dummy_user_id).order('created_at', desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/models")
async def list_models():
    try:
        models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        return {"models": models}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_root():
    return {"message": "Dadam API is running."}

@app.post("/api/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    if not aai.settings.api_key:
        raise HTTPException(status_code=500, detail="AssemblyAI API key is not configured.")

    try:
        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(file.file)

        if transcript.error:
            raise HTTPException(status_code=502, detail=transcript.error)

        return {"transcription": transcript.text}
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"An error occurred during transcription: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An error occurred during transcription: {str(e)}")
