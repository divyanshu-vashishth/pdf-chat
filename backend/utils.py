import fitz  
from langchain.text_splitter import RecursiveCharacterTextSplitter
import os
import google.generativeai as genai
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.vectorstores import FAISS
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def get_pdf_text(pdf_paths):
    text = ""
    for path in pdf_paths:
        doc = fitz.open(path)
        for page in doc:
            text += page.get_text()
    return text

def get_text_chunks(text):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(text)
    return chunks

def get_vector_store(text_chunks, doc_id):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(text_chunks, embedding=embeddings)
    
    os.makedirs("indices", exist_ok=True)
    
    vector_store.save_local(f"indices/faiss_index_{doc_id}")
    
    return vector_store

def get_conversational_chain():
    prompt_template = """
    Answer the question as detailed as possible from the provided context, make sure to provide all the details.
    If the answer is not in the provided context, just say "answer is not available in the context". 
    Don't make up any answer.\n\n
    Context:\n{context}\n
    Question:\n{question}\n
    Answer:
    """
    
    model = ChatGoogleGenerativeAI(model="gemini-2.0-flash-lite", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    
    return chain

def get_answer_from_question(question, doc_id):
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    
    try:
        vector_store = FAISS.load_local(
            f"indices/faiss_index_{doc_id}", 
            embeddings,
            allow_dangerous_deserialization=True
        )
        
        docs = vector_store.similarity_search(question)
        chain = get_conversational_chain()
        response = chain(
            {"input_documents": docs, "question": question},
            return_only_outputs=True
        )
        
        return response["output_text"]
    except Exception as e:
        return f"Error retrieving answer: {str(e)}"
