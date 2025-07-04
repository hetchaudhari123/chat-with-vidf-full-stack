
# Chat with VIDF - Full Stack

![Homepage](/assets/homepage.png)

A powerful, context-aware conversational AI application that enables intelligent Q&A with document understanding, video analysis, and customizable AI characters.

## ✨ Features

### 🧠 Intelligent Q&A System

-   **Context-aware conversations** with memory retention across sessions
-   **Natural language processing** for comprehensive question answering
-   **Multi-turn dialogue** support with conversation history

### 📄 Document Intelligence

-   **PDF upload and analysis** - Extract insights from uploaded PDF documents
-   **Document-based Q&A** - Ask questions about specific content within your PDFs
-   **Content summarization** and key information extraction

### 🎥 Video Analysis

-   **Video upload support** - Analyze video content for Q&A
-   **Video transcription** and content understanding
-   **Time-stamped responses** linked to specific video segments

### 🎭 Custom AI Characters

-   **Character creation** with unique personalities and traits
-   **Tone customization** - Get responses in different character voices
-   **Personality-driven conversations** that match your chosen character's style
-   **Character memory** - Each character remembers previous interactions

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn package manager
-   Modern web browser with JavaScript enabled

### Installation

1.  **Clone the repository**
    
    ```bash
    git clone https://github.com/hetchaudhari123/chat-with-vidf-full-stack.git
    cd chat-with-vidf-full-stack
    
    
    ```
    
2.  **Install dependencies**
    
    ```bash
    # Install server dependencies
    cd server
    npm install
    
    # Install client dependencies
    cd ../client
    npm install
    
    
    ```
    
3.  **Set up environment variables**
    
    ```bash
    # Create .env file in the server directory
    cd server
    touch .env
    
    # Add your API keys and configuration (see Configuration section below)
    
    
    ```
    
4.  **Start the application**
    
    ```bash
    # Start server
    cd server
    npm start
    
    # Start client (in a new terminal)
    cd client
    npm start
    
    
    ```
    
5.  **Open your browser** Navigate to `http://localhost:3000` to start using the application.
    

## 📖 Usage

### General Q&A

-   Simply type your question in the chat interface
-   The AI will provide contextual answers based on conversation history
-   Ask follow-up questions for deeper understanding

### Document Analysis

1.  Click the **Upload PDF** button
2.  Select your PDF file
3.  Wait for processing to complete
4.  Ask questions about the document content
5.  Get accurate, document-specific answers

### Video Q&A

1.  Click the **Upload Video** button
2.  Select your video file (supported formats: MP4, AVI, MOV)
3.  Wait for transcription and analysis
4.  Ask questions about video content
5.  Receive responses with relevant timestamps

### Custom Characters

1.  Go to the **Characters** section
2.  Click **Create New Character**
3.  Define personality traits, speaking style, and background
4.  Save your character
5.  Select the character before starting a conversation
6.  Enjoy responses in your character's unique voice

## 🛠️ Technology Stack

### Backend

-   **Node.js** - Runtime environment
-   **Express.js** - Web framework
-   **MongoDB** - Database for storing conversations and characters
-   **Multer** - File upload handling
-   **PDF-parse** - PDF text extraction
-   **FFmpeg** - Video processing
-   **OpenAI API** - AI language model integration

### Frontend

-   **React.js** - User interface framework
-   **Material-UI** - Component library
-   **Axios** - HTTP client
-   **React Router** - Navigation
-   **Context API** - State management

## 📁 Project Structure

```
chat-with-vidf-full-stack/
├── client/
├── server/
├── .gitignore
├── Project Documentation.docx
├── README.md


```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the **server** directory with the following required variables:

```env
# Server Configuration
PORT=

# Database
MONGO_URI=mongodb://localhost:27017/chat-vidf

# AI Services
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_API_KEY_AI=your_google_ai_api_key

# Media Processing
ASSEMBLY_AI_KEY=your_assemblyai_api_key

# Cloud Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Optional Configuration
MAX_FILE_SIZE=50MB
UPLOAD_DIR=./uploads


```

**Note:** All the above environment variables are required for the application to function properly. Make sure to obtain API keys from the respective services:

-   **AssemblyAI** - For video transcription and audio processing
-   **Cloudinary** - For media file storage and management
-   **Google AI/Gemini** - For AI-powered question answering and character responses
-   **MongoDB** - For data persistence

### Supported File Formats

-   **PDFs**: .pdf
-   **Videos**: .mp4, .avi, .mov, .wmv
-   **Maximum file size**: 50MB (configurable)

## 🤝 Contributing

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](https://claude.ai/chat/LICENSE) file for details.



## 🗺️ Roadmap

-   [ ] Support for more document formats (DOCX, TXT)
-   [ ] Real-time collaboration features
-   [ ] Advanced character customization options
-   [ ] Mobile app development
-   [ ] Integration with additional AI models

## 📞 Support

If you encounter any issues or have questions:

-   Open an issue on GitHub
-   Check the [FAQ](https://claude.ai/chat/docs/FAQ.md) section
-   Join our community discussions

## 🙏 Acknowledgments

-   OpenAI for providing the language model API
-   The open-source community for various libraries and tools
-   Contributors who helped improve this project

----------

**Made with ❤️ by [hetchaudhari123](https://github.com/hetchaudhari123)**
