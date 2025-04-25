# 📚 PDF Question Answering App

This is a full-stack project that allows users to **upload PDF documents**, then **ask questions** about their content.  
The backend processes the PDF using **FastAPI** and **LangChain + Google Generative AI**, and the frontend (React.js) allows interaction.

---

## 🏗 Folder Structure

```
/project-root
  ├── backend/
  │   ├── main.py          # FastAPI app
  │   ├── utils.py         # PDF processing, text splitting, vector store handling
  │   ├── database.py      # SQLite DB setup and session management
  │   ├── uploads/         # Folder for uploaded PDFs
  │   ├── indices/         # Folder for FAISS vector indices
  │   ├── db.sqlite3       # SQLite database (auto-created)
  │   ├── requirements.txt # Python dependencies
  │   ├── .env             # Environment variables (GOOGLE_API_KEY)
  │
  ├── frontend/
  │   ├── src/
  │   │   ├── components/  # React components
  │   │   ├── api/         # API request helpers
  │   │   ├── pages/       # Page components
  │   │   └── App.jsx      # Main app file
  │   ├── public/
  │   ├── package.json
  │   ├── pnpm-lock.yaml
  │
  ├── README.md
```

---

## Backend Setup (FastAPI + LangChain)

### 1. Create and activate virtual environment

```bash
python -m venv venv
```

- Windows:
  ```bash
  venv\Scripts\activate
  ```
- Linux/macOS:
  ```bash
  source venv/bin/activate
  ```

---

### 2. Install backend dependencies

```bash
pip install -r requirements.txt
```

---

### 3. Create a `.env` file in `/backend`

```bash
touch .env
```

And add your **Google API Key** inside:

```env
GOOGLE_API_KEY='your-google-api-key-here'
```

(You can get it from the [Google Generative AI](https://makersuite.google.com/app/apikey) page.)

---

### 4. Run the backend server

```bash
uvicorn main:app --reload
```

Server will start at:  
> http://127.0.0.1:8000

---

### 5. API Docs

Once running, FastAPI auto-generates docs:

- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Redoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🎨 Frontend Setup (React.js + pnpm)

### 1. Navigate to `frontend/`

```bash
cd frontend
```

---

### 2. Install frontend dependencies

```bash
pnpm install
```

---

### 3. Start the React app

```bash
pnpm dev
```

Frontend will run at:  
> http://localhost:5173


