# ChatGPT Code Analyzer for Visual Studio Code

The ChatGPT Code Analyzer is a Visual Studio Code extension that uses the OpenAI ChatGPT API to analyze your code and detect potential security vulnerabilities. The extension works with various file types and supports both single file and whole project analysis.


## Features

- Analyze a single file for security vulnerabilities
- Analyze an entire project for security vulnerabilities

## Installation

Install the ChatGPT Code Analyzer extension from the Visual Studio Code Marketplace.
After installation, you will be prompted to enter your OpenAI API key. You can also set your API key by adding it to your settings.json file:

```json
{
  "chatgpt-code-analyzer.apiKey": "<your_api_key_here>"
}
```

## Usage

### Analyze a single file
1. Open a file you want to analyze in Visual Studio Code.
2. Right-click within the editor and select "Analyze File for Security Vulnerabilities" from the context menu or press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux) and type "Analyze File for Security Vulnerabilities" to execute the command.



### Analyze an entire project

1. In the Visual Studio Code Explorer, right-click the root folder of your project.
2. Select "Analyze Project for Security Vulnerabilities" from the context menu or press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows/Linux) and type "Analyze Project for Security Vulnerabilities" to execute the command.


## Requirements

Visual Studio Code 1.60 or newer
OpenAI API key

##  License
This project is licensed under the MIT License.



