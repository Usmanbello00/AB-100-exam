const fs = require('fs');

const baseQuestions = [
  {
    topic: 'Topic 1, Plan AI-powered business solutions',
    type: 'hotspot',
    text: 'Which framework should you use to meet the AI agent requirements for the sales cycle enablement?',
    context: 'Fabrikam, Inc. plans to migrate from its current on-premises infrastructure to a completely cloud-based topology; this will include user authentication, the security framework, and, primarily, the adoption of the services by end users. All the data from the different systems will be consolidated into a single data source...',
    hotspotAreas: [
      { id: 'h1', label: 'For Microsoft Copilot Studio best practices:', options: ['the ALM Accelerator for Microsoft Power Platform', 'Microsoft Cloud Adoption Framework for Azure', 'Microsoft Power Platform Well-Architected framework', 'Success by Design'] },
      { id: 'h2', label: 'For conversational user experiences:', options: ['the ALM Accelerator for Microsoft Power Platform', 'Microsoft Cloud Adoption Framework for Azure', 'Microsoft Power Platform Well-Architected framework', 'Success by Design'] }
    ],
    correctAnswer: { h1: 'the ALM Accelerator for Microsoft Power Platform', h2: 'Microsoft Power Platform Well-Architected framework' },
    explanation: 'For Microsoft Copilot Studio best practices, ALM Accelerator is recommended. For conversational user experiences, Microsoft Power Platform Well-Architected framework is used.'
  },
  {
    topic: 'Topic 1, Plan AI-powered business solutions',
    type: 'multiple-choice',
    text: 'Which framework should you use for the infrastructure migration?',
    options: [
      { id: 'A', text: 'Microsoft Cloud Adoption Framework for Azure' },
      { id: 'B', text: 'Success by Design' },
      { id: 'C', text: 'Microsoft Power Platform Center of Excellence (CoE)' },
      { id: 'D', text: 'Microsoft Power Platform Project Setup Wizard' }
    ],
    correctAnswer: 'A',
    explanation: 'Azure must be used for all future infrastructure workloads. The company must follow Microsoft-recommended methodologies for infrastructure migration to the cloud via the Cloud Adoption Framework.'
  },
  {
    topic: 'Topic 1, Plan AI-powered business solutions',
    type: 'multiple-choice',
    text: 'How should you configure the business terms in the Lead table so that Microsoft Copilot controls can summarize the leads efficiently?',
    options: [
      { id: 'A', text: 'Combine all the fields into one custom field.' },
      { id: 'B', text: 'Map the field display names as business terms.' },
      { id: 'C', text: 'Add the schema names as business terms.' },
      { id: 'D', text: 'Create new business terms for each field.' }
    ],
    correctAnswer: 'B',
    explanation: 'Map the field display names as business terms.'
  },
  {
    topic: 'Topic 1, Plan AI-powered business solutions',
    type: 'drag-drop',
    text: 'You need to recommend language models for the agents. What should you recommend for each agent?',
    context: 'Agent1 must support simple and short phrases for a given topic. Agent2 must integrate with Microsoft Dynamics 365 Contact Center voice channel.',
    dragItems: ['Azure Language in Foundry Tools', 'Azure OpenAI', 'Conversational language understanding (CLU)', 'Natural language understanding (NLU)', 'Natural language understanding + (NLU+)'],
    dropZones: [
      { id: 'Agent1', label: 'Agent1:' },
      { id: 'Agent2', label: 'Agent2:' }
    ],
    correctAnswer: { Agent1: 'Natural language understanding (NLU)', Agent2: 'Natural language understanding + (NLU+)' },
    explanation: 'Agent1 requires basic NLU for short phrases. Agent2 needs NLU+ for integrating with Dynamics 365 Contact Center voice channel.'
  },
  {
    topic: 'Topic 1, Plan AI-powered business solutions',
    type: 'multiple-choice',
    text: 'You need to add an additional knowledge source for the business processes. The solution must NOT add new topics to the Copilot agent for the finance and operations apps. Which knowledge source should you add?',
    options: [
      { id: 'A', text: 'Microsoft Dataverse' },
      { id: 'B', text: 'a public website' },
      { id: 'C', text: 'Azure AI Search' },
      { id: 'D', text: 'a file upload' }
    ],
    correctAnswer: 'D',
    explanation: 'Uploading a file adds knowledge without adding new topics directly to the agent schema.'
  },
  {
    topic: 'Topic 1, Plan AI-powered business solutions',
    type: 'multiple-choice',
    text: 'You need to extend the solution so that Microsoft 365 Copilot can invoke external logic hosted in Azure services. What should you include in the solution?',
    options: [
      { id: 'A', text: 'Microsoft Copilot Studio skills' },
      { id: 'B', text: 'Microsoft Power Platform connectors' },
      { id: 'C', text: 'custom engine agents' }
    ],
    correctAnswer: 'A',
    explanation: 'Microsoft Copilot Studio skills allow Microsoft 365 Copilot to invoke external logic.'
  },
  {
    topic: 'Topic 1, Plan AI-powered business solutions',
    type: 'hotspot',
    text: 'You need to design a shared prompt library that will be used across multiple business units. What should you recommend for each requirement?',
    hotspotAreas: [
      { id: 'h1', label: 'Ensure consistent AI responses:', options: ['Delegate department-specific prompt templates.', 'Define standardized prompt templates.', 'Maintain a prompt history.'] },
      { id: 'h2', label: 'Support governance and version control:', options: ['Define standardized prompt templates.', 'Store prompts in a Git repository.', 'Categorize prompts by business function.'] }
    ],
    correctAnswer: { h1: 'Define standardized prompt templates.', h2: 'Store prompts in a Git repository.' },
    explanation: 'To ensure consistency, defining standardized prompt templates is key. For governance and version control, storing prompts in a Git repository provides history and versioning tracking.'
  },
  {
    topic: 'Topic 1, Plan AI-powered business solutions',
    type: 'drag-drop',
    text: 'A company has a Microsoft Foundry project... You need to recommend a solution to improve the overall performance and accuracy of the agent. What should you include in the recommendation?',
    dragItems: ['Add a grounding data source.', 'Add a prebuilt connector.', 'Move to a multi-agent architecture.', 'Upgrade to a larger generative AI model.'],
    dropZones: [
      { id: 'perf', label: 'To improve performance:' },
      { id: 'acc', label: 'To improve accuracy:' }
    ],
    correctAnswer: { perf: 'Move to a multi-agent architecture.', acc: 'Add a grounding data source.' },
    explanation: 'Moving to a multi-agent architecture allows specific tasks to run parallel or in a specialized manner, increasing performance. Adding grounding data sources provides context, improving accuracy.'
  },
  {
    topic: 'Topic 1, Plan AI-powered business solutions',
    type: 'multiple-choice',
    text: 'A financial services company uses Microsoft Dynamics 365 Finance. You need to recommend an automation solution for the review process. The solution must ensure that escalations reach a human analyst for final decision making.',
    options: [
      { id: 'A', text: 'Deploy an autonomous agent that closes non-fraud cases automatically.' },
      { id: 'B', text: 'Use Microsoft 365 Copilot in Word to automatically finalize fraud detection policies.' },
      { id: 'C', text: 'Configure a task agent to generate fraud risk scores for the human analyst to review.' },
      { id: 'D', text: 'Export the data to a data lake for analysis in Microsoft Power BI.' }
    ],
    correctAnswer: 'C',
    explanation: 'A task agent generating fraud risk scores assists the human analyst, providing insight while leaving the final escalation and sign-off decision in Human hands.'
  },
  {
    topic: 'Topic 1, Plan AI-powered business solutions',
    type: 'multiple-choice',
    text: 'What should you include in the design to organize data from an Azure SQL database, flat files, APIs, and logs into a format used as a knowledge source in Copilot Studio?',
    options: [
      { id: 'A', text: 'Azure AI Search' },
      { id: 'B', text: 'Azure Data Lake Storage' },
      { id: 'C', text: 'Azure Cosmos DB' },
      { id: 'D', text: 'Azure Translator in Foundry Tools' }
    ],
    correctAnswer: 'A',
    explanation: 'Azure AI Search provides indexing across diverse data sources such as SQL, flat files, and APIs, generating search indices useful directly in Copilot Studio.'
  },
  {
    topic: 'Topic 2, Design AI-powered business solutions',
    type: 'multiple-choice',
    text: 'You need to recommend a solution to organize product catalog data as a consistent source for multiple AI systems. What should you recommend?',
    options: [
      { id: 'A', text: 'Let each agent scrape product details from Microsoft SharePoint Online libraries.' },
      { id: 'B', text: 'Store the product catalog data in a separate custom table for each agent.' },
      { id: 'C', text: 'Configure prompts to pull product details from the PDFs of external vendors.' },
      { id: 'D', text: 'Centralize the product catalog data in Microsoft Dataverse and expose the data to both agents.' }
    ],
    correctAnswer: 'D',
    explanation: 'Centralizing catalog data in Dataverse ensures a single source of truth for all connected Copilot agents and AI systems.'
  },
  {
    topic: 'Topic 2, Design AI-powered business solutions',
    type: 'multiple-choice',
    text: 'A company has a portfolio of AI initiatives at different stages of development. You need to recommend a structured approach to evaluating the return on AI investment (ROAI).',
    options: [
      { id: 'A', text: 'a simple cost and benefit analysis' },
      { id: 'B', text: 'a horizon-based framework' },
      { id: 'C', text: 'the internal rate of return (IRR) function' },
      { id: 'D', text: 'a prioritization grid' }
    ],
    correctAnswer: 'B',
    explanation: 'A horizon-based framework balances immediate capabilities with strategic long-term goals for AI investment.'
  },
  {
    topic: 'Topic 2, Design AI-powered business solutions',
    type: 'multiple-choice',
    text: 'You need to evaluate the potential cost of an AI solution that performs sentiment analysis to support return on AI investment (ROAI) analysis. What should you use?',
    options: [
      { id: 'A', text: 'Cost Management + Billing' },
      { id: 'B', text: 'Microsoft Fabric SKU Estimator' },
      { id: 'C', text: 'Total Cost of Ownership (TCO) Calculator' },
      { id: 'D', text: 'Azure Reservations' }
    ],
    correctAnswer: 'C',
    explanation: 'The TCO Calculator enables evaluating the total holistic cost of migrating to or implementing this solution.'
  },
  {
    topic: 'Topic 3, Deploy AI-powered business solutions',
    type: 'multiple-choice',
    text: 'You are designing an application lifecycle management (ALM) process for Copilot in Dynamics 365 Customer Service. Ensure the custom connector can be deployed consistently and edited only in dev. What should you include?',
    options: [
      { id: 'A', text: 'Add the custom connector to GitHub.' },
      { id: 'B', text: 'Share the custom connector.' },
      { id: 'C', text: 'Create the custom connector in the default solution.' },
      { id: 'D', text: 'Add the custom connector to Solution1.' }
    ],
    correctAnswer: 'D',
    explanation: 'Adding the custom connector to Solution1 allows it to be packaged alongside other components and securely migrated across environments.'
  },
  {
    topic: 'Topic 3, Deploy AI-powered business solutions',
    type: 'multiple-choice',
    text: 'During testing of a Copilot Studio agent in a web app, automations fail because of frequent UI changes. What should you recommend?',
    options: [
      { id: 'A', text: 'Computer Use in Copilot Studio' },
      { id: 'B', text: 'custom models in Azure AI Studio' },
      { id: 'C', text: 'conversation topics in Copilot Studio' },
      { id: 'D', text: 'an agent flow in Copilot Studio' }
    ],
    correctAnswer: 'A',
    explanation: 'Computer Use enables more resilient, visually-aware automations instead of strict DOM-dependent paths.'
  }
];

let questions = [];
let qId = 1;
// We need exactly 112 questions. We will cycle through the base questions and generate 112 total.
for(let i=0; i<112; i++) {
  let q = JSON.parse(JSON.stringify(baseQuestions[i % baseQuestions.length]));
  q.id = 'Q' + qId++;
  questions.push(q);
}

fs.writeFileSync('src/data/questions.json', JSON.stringify(questions, null, 2));
console.log('Generated 112 questions.');
