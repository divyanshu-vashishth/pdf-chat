from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from utils import get_pdf_text, get_text_chunks, get_vector_store, get_answer_from_question
from database import Document, get_session
import uuid
import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
os.makedirs("indices", exist_ok=True)

@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        doc_id = str(uuid.uuid4())
        
        doc_dir = f"uploads/{doc_id}"
        os.makedirs(doc_dir, exist_ok=True)
        
        file_path = f"{doc_dir}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        raw_text = get_pdf_text([file_path])
        text_chunks = get_text_chunks(raw_text)
        get_vector_store(text_chunks, doc_id)

        session = get_session()
        new_document = Document(id=doc_id, filename=file.filename)
        session.add(new_document)
        session.commit()
        
        return {"success": True, "message": "PDF uploaded and processed", "doc_id": doc_id, "filename": file.filename}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")

@app.post("/ask-question")
async def ask_question(doc_id: str = Form(...), question: str = Form(...)):
    try:
        answer = get_answer_from_question(question, doc_id)
        return {"success": True, "answer": answer}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error answering question: {str(e)}")


