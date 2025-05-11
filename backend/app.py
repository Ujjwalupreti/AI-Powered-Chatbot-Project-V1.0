from flask import Flask, request, jsonify
from flask_cors import CORS
import cohere

app = Flask(__name__)
CORS(app)

COHERE_API_KEY = "YOUR_API_KEY"
co = cohere.Client(COHERE_API_KEY)

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_input = data.get("message")

        print("User Input:", user_input)

        response = co.chat(
            message=user_input,
            model="command-r", 
        )

        reply = response.text.strip()
        print("Cohere Reply:", reply)

        return jsonify({"reply": reply})

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500  

if __name__ == "__main__":
    app.run(debug=True, port=5000)
