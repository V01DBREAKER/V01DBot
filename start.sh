#!/bin/bash
# Written by CHATGPT
# Directory where logs will be stored
LOG_DIR="./logs"

# Create the log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Initialize attempt counter and time tracking
MAX_ATTEMPTS=10
ATTEMPT_COUNT=0
TIME_WINDOW=60  # 60 seconds (1 minute)
LAST_ATTEMPT_TIME=$(date +%s)

# Infinite loop to keep running the command
while true; do
    # Get the current date and time for the log filename
    TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
    LOG_FILE="$LOG_DIR/npm_run_log_$TIMESTAMP.log"
    
    # Run the npm command, display output to console and log to file
    npm run app 2>&1 | tee "$LOG_FILE"
    
    # Optionally, print an update after logging
    echo "Logged output to $LOG_FILE"

    # Increment attempt count and get the current time
    ATTEMPT_COUNT=$((ATTEMPT_COUNT + 1))
    CURRENT_TIME=$(date +%s)

    # Check if current attempt is within the time window
    if (( CURRENT_TIME - LAST_ATTEMPT_TIME <= TIME_WINDOW )); then
        # If max attempts within time window are reached, exit the script
        if (( ATTEMPT_COUNT >= MAX_ATTEMPTS )); then
            echo "Maximum attempts reached within one minute. Exiting script."
            exit 1
        fi
    else
        # Reset counter and timestamp if outside the time window
        ATTEMPT_COUNT=1
        LAST_ATTEMPT_TIME=$CURRENT_TIME
    fi

    # Wait a bit before restarting the command to avoid immediate looping
    sleep 5
done