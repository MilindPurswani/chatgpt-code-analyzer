

const axios = require('axios');
const vscode = require('vscode');

const callChatGPT = async (text) => {
  const config = vscode.workspace.getConfiguration('chatgpt-code-analyzer');
  const openaiKey = config.get('apiKey');
  console.error(openaiKey);

  if (!openaiKey) {
    vscode.window.showErrorMessage('Please set the ChatGPT API key in your settings.');
    return;
  }

  // Prepend line numbers to the input text
  const numberedText = text.split('\n').map((line, index) => `${index + 1}: ${line}`).join('\n');

  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      'model': "gpt-3.5-turbo",
      'messages': [{
        'role': "system",
        'content': "You are an AI code analyzer that checks for security vulnerabilities in a given code snippet. Provide a detailed analysis of the potential issues found in the code, including the line number in the format 'Line X: ISSUE_DESCRIPTION'.",
      },{
        role: "user",
        content: `Analyze this code for security vulnerabilities:\n\n${numberedText}`,
      }
    ]
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
    }
  );
  console.log('API response data:', response.data);
  const result = response.data.choices[0].message.content.trim();

  return result === '' ? 'No security vulnerabilities detected.' : result;
};

module.exports = callChatGPT;
