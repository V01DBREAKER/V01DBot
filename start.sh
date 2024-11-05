#!/bin/bash
# Written by CHATGPT
# Directory where logs will be stored
LOG_DIR="./logs"

# Create the log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Infinite loop to keep running the command
while true; do
    # Run the npm command and capture both output and errors
    OUTPUT=$(npm run start 2>&1)
    
    # Get the current date and time for the log filename
    TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
    LOG_FILE="$LOG_DIR/npm_run_log_$TIMESTAMP.log"
    
    # Log the output to the file
    echo "$OUTPUT" > "$LOG_FILE"
    
    # Optionally, print an update to the console
    echo "Logged output to $LOG_FILE"

    # Wait a bit before restarting the command to avoid immediate looping
    sleep 5
done