#!/bin/bash
# Jupyter Notebook Launcher for Bash on Windows

echo "Starting Jupyter Notebook..."
echo "================================"

# Use the venv python to run jupyter directly
./venv/Scripts/python.exe -m jupyter notebook

# Note: Jupyter will open in your default browser
# Press Ctrl+C in this terminal to stop the server
