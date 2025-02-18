document.addEventListener("DOMContentLoaded", function () {
    var term = new Terminal();
    term.open(document.getElementById("terminal"));
    term.write("Welcome to Web Terminal\r\n$ ");

    let commandBuffer = ""; // Store user input

    term.onData(async (data) => {
        if (data === "\r") {
            // Enter key pressed -> send command to backend
            if (commandBuffer.trim().length === 0) {
                term.write("\r\n$ "); // If empty, just go to new line
                return;
            }

            term.write("\r\n"); // New line before sending output

            try {
                const response = await fetch("http://192.168.1.8:5000/interact", {
                    method: "POST",
                    body: new URLSearchParams({ command: commandBuffer }),
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                });

                const result = await response.json();
                term.writeln(result.output + "\n$ "); // Show output and prompt again
            } catch (error) {
                term.writeln("Error: Could not connect to backend\n$ ");
            }

            commandBuffer = ""; // Clear buffer after execution
        } else if (data === "\x7F") {
            // Handle backspace (Delete key)
            if (commandBuffer.length > 0) {
                commandBuffer = commandBuffer.slice(0, -1);
                term.write("\b \b"); // Move cursor back, clear character
            }
        } else {
            // Store typed characters and display them
            commandBuffer += data;
            term.write(data);
        }
    });
});
