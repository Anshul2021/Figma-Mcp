const JiraClient = require('./jiraClient');

async function main() {
  try {
    const client = new JiraClient();
    console.log('Jira Client initialized successfully.');

    // 1. Fetching CRH-36 issue details
    console.log('Fetching details for issue CRH-36...');
    const issue = await client.getIssue('CRH-36');
    console.log('Successfully fetched issue:');
    console.log(`- Key: ${issue.key}`);
    console.log(`- Summary: ${issue.fields.summary}`);
    console.log(`- Status: ${issue.fields.status ? issue.fields.status.name : 'Unknown'}`);
    console.log(`- Description: ${JSON.stringify(issue.fields.description)}`);

    // 2. Creating a new sub-task in CRH project under CRH-36
    console.log('\nCreating a new Sub-task under CRH-36...');
    const summary = 'Customer page creation';
    const description = 'Sub-task to design and create the Customer page layouts and sub-components.';
    const newIssue = await client.createIssue('CRH', summary, description, 'Subtask', 'CRH-36');
    console.log('Successfully created issue:');
    console.log(`- Key: ${newIssue.key}`);
    console.log(`- Self URL: ${newIssue.self}`);

  } catch (error) {
    console.error('Error during Jira integration test:', error.message);
  }
}

main();
