const fs = require('fs');
const path = require('path');

// Basic parser for .env file
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const index = trimmed.indexOf('=');
      if (index !== -1) {
        const key = trimmed.substring(0, index).trim();
        const value = trimmed.substring(index + 1).trim();
        process.env[key] = value;
      }
    });
  }
}

// Load env variables
loadEnv();

class JiraClient {
  constructor() {
    this.domain = process.env.JIRA_DOMAIN;
    this.email = process.env.JIRA_EMAIL;
    this.token = process.env.JIRA_API_TOKEN;

    if (!this.domain || !this.email || !this.token) {
      throw new Error('Missing Jira credentials in environment variables (JIRA_DOMAIN, JIRA_EMAIL, JIRA_API_TOKEN).');
    }

    const auth = Buffer.from(`${this.email}:${this.token}`).toString('base64');
    this.headers = {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  // Get issue details
  async getIssue(issueKey) {
    const url = `https://${this.domain}/rest/api/3/issue/${issueKey}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: this.headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch issue ${issueKey}: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  // Create task/issue in Jira
  async createIssue(projectKey, summary, descriptionText, issueType = 'Task', parentKey = null) {
    const url = `https://${this.domain}/rest/api/3/issue`;
    
    // Jira Document Format (ADF) for description in v3 API
    const fields = {
      project: {
        key: projectKey
      },
      summary: summary,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: descriptionText || ''
              }
            ]
          }
        ]
      },
      issuetype: {
        name: issueType
      }
    };

    if (parentKey) {
      fields.parent = {
        key: parentKey
      };
    }

    const body = { fields };

    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create issue: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }
}

module.exports = JiraClient;
