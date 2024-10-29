import os
import time
from flask import Flask, request, jsonify
from pymongo import MongoClient
import google.generativeai as genai
import PyPDF2
import assemblyai as aai
from flask_cors import CORS  # Import CORS
import uuid  # Importing the uuid module
from dotenv import load_dotenv

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})
# CORS(app, resources={r"/*": {"origins": "https://chat-with-vidf-fdahoxcca-hetchaudhari123s-projects.vercel.app"}})
CORS(app, resources={r"/*": {"origins": "https://chat-with-vidf-flax.vercel.app"}})

load_dotenv()
# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client['chat-with-vidf']  # Replace with your database name
collection = db['uploaded_files']  # Collection for storing uploaded file metadata

# Configure the Gemini API with your API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

aai.settings.api_key = os.getenv("ASSEMBLY_AI_KEY")

# Initialize the Transcriber
transcriber = aai.Transcriber()



@app.route('/')
def home():
    return "Welcome to the Chat-With-ViDF!"

def upload_to_gemini(path, mime_type=None):
    """Uploads the given file to Google Generative AI (Gemini).

    Arguments:
    - path (str): Path to the file on the local file system.
    - mime_type (str, optional): The MIME type of the file (e.g., "application/pdf").

    Returns:
    - file (object): The uploaded file object from Gemini, which contains properties like `uri`.
    """
    file = genai.upload_file(path, mime_type=mime_type)
    print(f"Uploaded file '{file.display_name}' as: {file.uri}")
    return file

def wait_for_files_active(files):
    """Waits for the given files to be active.

    Arguments:
    - files (list): A list of file objects to check their status.
    """
    print("Waiting for file processing...")
    for name in (file.name for file in files):
        file = genai.get_file(name)
        while file.state.name == "PROCESSING":
            print(".", end="", flush=True)
            time.sleep(10)
            file = genai.get_file(name)
        if file.state.name != "ACTIVE":
            raise Exception(f"File {file.name} failed to process")
    print("...all files ready")
    print()

# Create the model configuration
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction="You are Tyrion Lannister from Game of Thrones. Every response you give should reflect Tyrion's wit, intelligence, and subtle sarcasm. Respond to every question or conversation with his characteristic tone — clever, thoughtful, often humorous, and occasionally a touch cynical. Keep your answers concise yet impactful, as Tyrion would, but ensure you stay respectful and insightful, focusing on the deeper meanings behind things, as Tyrion often does. When possible, make use of memorable phrases or metaphors that align with Tyrion’s style. Avoid modern slang and maintain the eloquence of a seasoned nobleman. Also for whatever question asked, try to answer it as if you are a good teacher.",
)




# def extract_text_from_pdf(pdf_path):
#     with open(pdf_path, 'rb') as pdf_file:
#         pdf_reader = PyPDF2.PdfReader(pdf_file)
#         extracted_text = ""
#         for page in pdf_reader.pages:
#             text = page.extract_text()
#             if text:
#                 extracted_text += text
#         return extracted_text

@app.route('/user/ask', methods=['POST'])
def ask():
    """Endpoint to ask a question to the chatbot."""
    data = request.json
    if not data or "question" not in data or "email" not in data:
        return jsonify({"error": "No question or email provided"}), 400

    question = data["question"]
    user_email = data["email"]
    character_name = data.get("character_name")
    character_info = data.get("character_info")
    # Retrieve the file metadata associated with the user email from MongoDB
    store_data = collection.find_one({"email": user_email})  # Fetch document using user's email
    # if not store_data:
        # return jsonify({"error": "No file found for this user."}), 404

    # Get the extracted text content from the stored data
    # Initialize text_context
    text_context = ''

# Check if store_data exists
    if store_data:
        # Attempt to retrieve text_content
        print("Store_data........",store_data)
        text_content = store_data.get("text_content")
    
    # If text_content is not None or an empty string
        if text_content:
            text_context = f" in context with the text content: {text_content}"

# Now you can use text_context as needed


    # Retrieve existing history from the database
    if not store_data:
        store_data = {
            "email": user_email,
            "history": [],
            "characters": [],
            "text_content": "",
            "file_name":""
        }
        # Insert the new document in MongoDB
        collection.insert_one(store_data)
    chat_history = []

    # Check if store_data exists
    chat_history = store_data.get("history", [])

    # Prepare the chat history for the Generative Model
    formatted_history = []

    # Construct the formatted history by iterating through chat history pairs
    for entry in chat_history:
        formatted_history.append({"role": "user", "parts": entry["question"]})
        formatted_history.append({"role": "model", "parts": entry["response"]})

    # Conditional system instruction
    if character_name and character_info:
        system_instruction = (
            f"You are {character_name}. Your name is {character_name}."
            f"Your unique qualities are: {character_info}. "
            f"Respond to any question asked while embodying the tone and characteristics of {character_name}."
        )
    else:
        system_instruction = "Answer the question as best as you can."

    # Start chat session with the current question included in history
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        generation_config=generation_config,
        system_instruction=system_instruction
    )

    chat = model.start_chat(history=formatted_history)

    # Send the current question and get the response, including context from the extracted text
    response = chat.send_message(f"Answer the question: {question}{text_context}")

    # Append the new question and response to history
    new_entry = {"question": question, "response": response.text}

    # Update the user's document with the new history
    store_data['history'].append(new_entry)
    collection.update_one(
        {"email": user_email},
        {"$set": {"history": store_data['history']}}
    )

    return jsonify({"response": response.text})




# import os
# import time
# import PyPDF2
# import assemblyai as aai
# from flask import Flask, request, jsonify
# from pymongo import MongoClient

# app = Flask(__name__)

# # Initialize MongoDB connection (update the connection string as needed)
# client = MongoClient("your_mongodb_connection_string")
# db = client.your_database_name
# collection = db.your_collection_name

@app.route('/file/upload', methods=['POST'])
def upload():
    """Endpoint to upload a PDF or video file, extract its text, and store metadata in MongoDB."""
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Get user email and file type from the request body
    data = request.form
    user_email = data.get("email")  # Extracting email from form-data
    file_type = data.get("file_type")  # Get the file type
    if not user_email:
        return jsonify({"error": "No email provided"}), 400

    # Save the uploaded file temporarily
    file_path = os.path.join("/tmp", file.filename)
    file.save(file_path)

    # Extract text based on file type
    text_content = ""
    try:
        if file_type == "PDF":
            # Extract text from PDF using PyPDF2
            with open(file_path, "rb") as pdf_file:
                reader = PyPDF2.PdfReader(pdf_file)
                for page in reader.pages:
                    text_content += page.extract_text()  # Extract text from each page
        elif file_type == "Video":
            # Extract text from video using Assembly AI
            text_content = transcribe_audio_or_video(file_path)
        else:
            return jsonify({"error": "Unsupported file type"}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to extract text: {str(e)}"}), 500

    # Store the file metadata and extracted text in MongoDB
    file_data = {
        "email": user_email,  # Store the user's email
        "text_content": text_content,  # Store the extracted text
        "file_name":file.filename,
        "history": [],  # Initialize history as an empty list
        "characters":[]
        # "uploaded_at": time.time(),
    }

    # Check if the user already exists
    existing_data = collection.find_one({"email": user_email})
    if existing_data:
        # If the user exists, update the document with the new text content
        collection.update_one(
            {"email": user_email},
            {"$set": { "text_content": text_content,"file_name":file.filename}}
        )
    else:
        # If no existing data, insert new document
        collection.insert_one(file_data)

    return jsonify({"message": "File uploaded and text extracted successfully"})

def transcribe_audio_or_video(file_path):
    transcript = transcriber.transcribe(file_path)
    return transcript.text



# from flask import Flask, request, jsonify
# from pymongo import MongoClient
# import os
# import time

# app = Flask(__name__)

# # MongoDB Connection
# client = MongoClient(os.getenv('MONGODB_CONNECTION_STRING'))
# db = client['your_database_name']
# collection = db['your_collection_name']

@app.route('/character/add', methods=['POST'])
def add_character():
    """Endpoint to add character information, user email, and retain existing user data."""
    data = request.json  # Expecting JSON data in the request body

    # Extracting character details and user email
    character_name = data.get('character_name')
    character_info = data.get('character_info')
    user_email = data.get('email')

    # Input validation
    if not character_name or not character_info or not user_email:
        return jsonify({"error": "All fields are required."}), 400

    # Create a character entry
    id = str(uuid.uuid4())
    character_data = {
         "character_id": id,
        "character_name": character_name,
        "character_info": character_info,
        # "uploaded_at": time.time()  # Timestamp for when character information is added
    }

    try:
        # Check if the user already exists in the database
        existing_data = collection.find_one({"email": user_email})

        if existing_data:
            # If the user exists, append the new character data to the existing document
            if 'characters' not in existing_data:
                existing_data['characters'] = []  # Initialize characters list if it doesn't exist
            existing_data['characters'].append(character_data)

            # Update the document with the new character information
            collection.update_one(
                {"email": user_email},
                {"$set": {"characters": existing_data['characters']}}
            )
        else:
            # If no existing data, create a new document with the character information
            new_data = {
                "email": user_email,
                "characters": [character_data],  # Store character in a list
                # "uploaded_at": time.time(),  # You can set other fields as necessary
                "history": [],  # Initialize history as an empty list
                "text_content": "",  # Initialize text_content as empty
                "file_name":""
            }
            collection.insert_one(new_data)

        return jsonify({"message": "Character information added successfully.","character_id":id}), 201
    except Exception as e:
        return jsonify({"error": f"Failed to add character information: {str(e)}"}), 500


@app.route('/character/list', methods=['POST'])
def list_characters():
    """Endpoint to fetch the list of characters for a user."""
    data = request.json  # Expecting JSON data in the request body

    # Extracting character details and user email
    user_email = data.get('email')
    if not user_email:
        return jsonify({"error": "Email is required."}), 400

    try:
        # Retrieve the user document from MongoDB
        user_data = collection.find_one({"email": user_email})
        if user_data:
            # If user data is found, get the characters list
            characters = user_data.get('characters', [])
            return jsonify({"characters": characters}), 200
        else:
            return jsonify({"error": "No user found with this email."}), 404

    except Exception as e:
        return jsonify({"error": f"Failed to fetch characters: {str(e)}"}), 500




@app.route("/get-chat-history", methods=["POST"])
def get_chat_history():
    data = request.json
    email = data.get("email")

    # Validate email parameter
    if not email:
        return jsonify({"error": "Email is required."}), 400

    try:
        # Fetch user's document from MongoDB based on email
        user_data = collection.find_one({"email": email})

        # Check if user data was found and has history
        if not user_data or "history" not in user_data:
            return jsonify({"error": "No chat history found for this user."}), 404

        # Return chat history
        return jsonify({"history": user_data["history"]}), 200
    except Exception as e:
        print("Error fetching chat history:", e)
        return jsonify({"error": "An error occurred while fetching chat history."}), 500


@app.route('/get-text-content', methods=['POST'])
def get_text_content():
    """Endpoint to fetch text content from MongoDB based on user email."""
    # Get the JSON data from the request
    data = request.get_json()
    user_email = data.get("email")

    if not user_email:
        return jsonify({"error": "No email provided"}), 400

    # Query the MongoDB collection for the user's data
    user_data = collection.find_one({"email": user_email})

    if user_data:
        # Return the text_content associated with the user's email
        return jsonify({"text_content": user_data.get("text_content", "")}), 200
    else:
        return jsonify({"error": "No data found for the provided email"}), 404
@app.route('/get-file-name', methods=['POST'])
def get_file_name():
    """Endpoint to fetch file name from MongoDB based on user email."""
    # Get the JSON data from the request
    data = request.get_json()
    user_email = data.get("email")

    if not user_email:
        return jsonify({"error": "No email provided"}), 400

    # Query the MongoDB collection for the user's data
    user_data = collection.find_one({"email": user_email})

    if user_data:
        # Return the text_content associated with the user's email
        return jsonify({"file_name": user_data.get("file_name", "")}), 200
    else:
        return jsonify({"error": "No data found for the provided email"}), 404


@app.route('/clear-history', methods=['POST'])
def clear_history():
    """Endpoint to clear the history and text_content for a user based on their email."""
    data = request.json  # Get the JSON data from the request
    user_email = data.get('email')  # Extract the email from the request

    if not user_email:
        return jsonify({"error": "No email provided"}), 400

    # Update the document to clear the history and text_content
    try:
        result = collection.update_one(
            {"email": user_email},  # Filter by email
            {"$set": {
                "history": [],  # Clear the history
                "text_content": "",#Clear the text content
                "file_name": ""  # Clear the file_name
            }}
        )

        if result.modified_count > 0:
            return jsonify({"message": "History and text content cleared successfully"}), 200
        else:
            return jsonify({"error": "User not found or no changes made"}), 404

    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


@app.route('/character/remove', methods=['POST'])
def remove_character():
    """Endpoint to remove a character from the user's collection."""
    data = request.json  # Expecting JSON data in the request body

    # Extracting user email and character ID
    user_email = data.get('email')
    character_id = data.get('character_id')

    # Input validation
    if not user_email or not character_id:
        return jsonify({"error": "Both email and character_id are required."}), 400

    try:
        # Find the user document based on the email
        existing_data = collection.find_one({"email": user_email})

        if existing_data:
            # Remove the character with the specified character_id from the characters list
            updated_characters = [
                character for character in existing_data.get('characters', [])
                if character.get('character_id') != character_id
            ]

            # Update the user's characters in the database
            collection.update_one(
                {"email": user_email},
                {"$set": {"characters": updated_characters}}
            )

            return jsonify({"message": "Character removed successfully."}), 200
        else:
            return jsonify({"error": "User not found."}), 404

    except Exception as e:
        return jsonify({"error": f"Failed to remove character: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
