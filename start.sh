#!/bin/bash
# Written by CHATGPT
# Directory where logs will be stored
LOG_DIR="./logs"

# Create the log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Infinite loop to keep running the command
while true; do
    # Get the current date and time for the log filename
    TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
    LOG_FILE="$LOG_DIR/npm_run_log_$TIMESTAMP.log"
    
    # Run the npm command, display output to console and log to file
    npm run app 2>&1 | tee "$LOG_FILE"
    
    # Optionally, print an update after logging
    echo "Logged output to $LOG_FILE"

    # Wait a bit before restarting the command to avoid immediate looping
    sleep 5
done