from quart import Quart, request, jsonify
import subprocess
from quart_cors import cors

app = Quart(__name__)
app = cors(app, allow_origin="*")  # Allow frontend requests

@app.route("/interact", methods=["POST"])
async def interact():
    form = await request.form
    command = form.get("command")
    
    if command:
        # Run command in bash shell
        process = subprocess.Popen(
            ["bash", "-c", command],  # Running command in bash
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True  # Ensures the output is returned as a string (not bytes)
        )
        stdout, stderr = process.communicate()
        output = stdout + stderr

        return jsonify({"output": output})
    
    return jsonify({"output": "No command received"})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
