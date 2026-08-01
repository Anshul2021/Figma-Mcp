const JiraClient = require('./jiraClient');

async function main() {
  try {
    const client = new JiraClient();
    console.log('Fetching CRH-38 details and all its subtasks...');
    const parentIssue = await client.getIssue('CRH-38');
    const subtasks = parentIssue.fields.subtasks || [];
    
    for (const st of subtasks) {
      const detail = await client.getIssue(st.key);
      console.log(`\nKey: ${detail.key}`);
      console.log(`Summary: ${detail.fields.summary}`);
      console.log(`Assignee: ${detail.fields.assignee ? detail.fields.assignee.displayName : 'Unassigned'}`);
      console.log(`Status: ${detail.fields.status.name}`);
    }
  } catch (e) {
    console.error(e);
  }
}

main();
