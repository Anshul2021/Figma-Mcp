const JiraClient = require('./jiraClient');

const assigneeId = '712020:1281fddd-22c9-46d8-b834-945227a90dc9'; // Gyan Sharma

const corrections = {
  'CRH-102': {
    summary: 'Design customer basic overview header',
    description: 'Design and layout the header section for the customer basic overview.'
  },
  'CRH-103': {
    summary: 'Create customer list view with all important data points and CRUD functionality',
    description: 'Implement the customer list view containing all key metrics, supporting grid/table toggle and CRUD operations.'
  },
  'CRH-104': {
    summary: 'Add sidebar filter',
    description: 'Create and integrate the sidebar filter panel for sorting and filtering customers.'
  },
  'CRH-105': {
    summary: 'Create customer addition form',
    description: 'Design and build the form/drawer used to add new customer accounts.'
  },
  'CRH-106': {
    summary: 'Manage customer offboarding process (with or without existing contractors)',
    description: 'Design the customer offboarding flow, addressing scenarios where contractors either exist or do not exist.'
  }
};

async function updateIssue(client, key, correctedData) {
  const url = `https://${client.domain}/rest/api/3/issue/${key}`;
  
  // Format description into Jira Document Format (ADF)
  const body = {
    fields: {
      summary: correctedData.summary,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: correctedData.description
              }
            ]
          }
        ]
      },
      assignee: {
        accountId: assigneeId
      }
    }
  };

  const response = await fetch(url, {
    method: 'PUT',
    headers: client.headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to update ${key}: ${response.status} ${response.statusText} - ${text}`);
  }
  console.log(`- Updated ${key} details (Summary, Description, Assignee)`);
}

async function transitionToDone(client, key) {
  const url = `https://${client.domain}/rest/api/3/issue/${key}/transitions`;
  const body = {
    transition: {
      id: '31' // transition ID for 'Done'
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: client.headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to transition ${key} to Done: ${response.status} ${response.statusText} - ${text}`);
  }
  console.log(`- Transitioned ${key} status to Done`);
}

async function main() {
  try {
    const client = new JiraClient();
    console.log('Jira Client initialized.');
    
    const keys = Object.keys(corrections);
    for (const key of keys) {
      console.log(`\nProcessing subtask ${key}...`);
      const corrected = corrections[key];
      
      // Update summary, description, and assignee
      await updateIssue(client, key, corrected);
      
      // Transition to Done
      await transitionToDone(client, key);
    }
    
    console.log('\nAll subtasks have been updated and set to Done!');
  } catch (error) {
    console.error('Error during execution:', error.message);
  }
}

main();
