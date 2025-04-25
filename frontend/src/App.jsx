import { useState, useRef } from "react"
import axios from "axios"
import QuestionAnswering from "./components/QuestionAnswering"
import logo from './assets/logo.svg'

function App() {
  const [activeDoc, setActiveDoc] = useState(null)
  const fileInputRef = useRef(null)

  const handleHeaderUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === "application/pdf") {
      const formData = new FormData()
      formData.append("file", selectedFile)

      try {
        const response = await axios.post("http://localhost:8000/upload-pdf", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        setActiveDoc({
          id: response.data.doc_id,
          filename: selectedFile.name,
        })
      } catch (err) {
        console.error("Upload error:", err)
        // user-facing error state if desired
      }
    } else {
      // invalid file type error
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="shadow-md py-4 px-6">
        <div className="max-w-8xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="Logo" />
          </div>
          <div className="flex items-center space-x-4">
            {activeDoc && (
              <div className="flex items-center space-x-2 mx-12">
                <div className="border p-1 rounded-sm text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-icon lucide-file"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                </div>
              <span className="text-green-400 font-medium truncate max-w-xs">
                {activeDoc.filename}
              </span>
              </div>
            )}
            <button
              onClick={handleHeaderUploadClick}
              className="flex items-center border border-black rounded-md px-6 py-2 space-x-1 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-plus-icon lucide-circle-plus">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
              <span className="hidden md:inline ml-2">Upload PDF</span>
            </button>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </header>
      <main className="max-w-8xl mx-auto px-4 py-6">
        <QuestionAnswering activeDoc={activeDoc} />
      </main>
    </div>
  )
}

export default App