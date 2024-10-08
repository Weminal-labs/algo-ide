# Use an official Python runtime as the base image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Install git (needed to clone the repository)
RUN apt-get update && apt-get install -y git

# Clone the Algorand Python SDK repository
RUN git clone https://github.com/algorand/py-algorand-sdk.git -b examples

# Change to the SDK directory
WORKDIR /app/py-algorand-sdk

# Install the SDK and its dependencies
RUN pip install -r requirements.txt
RUN pip install .

# Set the working directory back to /app
WORKDIR /app

# Command to run when the container starts
CMD ["python"]
