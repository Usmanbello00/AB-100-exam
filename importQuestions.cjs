const fs = require('fs');

const questions = JSON.parse(fs.readFileSync('./src/data/questions.json', 'utf8'));

const fabrikamContext = `Fabrikam, Inc., is a global consumer goods company that is undergoing a digital transformation initiative to migrate its entire infrastructure to the Microsoft cloud. As a key element of this cloud migration, the company will implement Microsoft Dynamics 365 Sales, moving away from the current on-premises proprietary technologies used by its business-to-business (B2B) sales team.
As part of the cloud migration, Fabrikam will adopt an AI-first approach to its business solutions and implement AI solutions, wherever possible, to streamline operations.

Problem Statements:
Fabrikam's infrastructure currently relies on various on-premises systems that require sales executives to use corporate computers with physical keyboards to access business information during customer interactions. Mobile phones cannot be used for these purposes, as the systems depend on keyboard input. As a result, the sales executives spend a lot of time using keyboards to search for data on several disparate systems and file servers, rather than focusing on the customers. This affects the customer experience.
Fabrikam stakeholders are concerned that users will be hesitant to adopt AI. If the AI initiatives are NOT adopted, cost savings will never be realized. Additionally, funding for future AI initiatives will depend on demonstrating an increase in AI adoption month over month. As the AI agent initiative for the sales team will be the first for Fabrikam, the rapid adoption of the agent is a high priority.

Planned Initiatives:
Fabrikam management has prioritized AI-driven projects to improve efficiency, customer engagement, and responsible AI adoption. The current application infrastructure is on-premises and must be migrated to the cloud to support the adoption of these technologies.

Infrastructure Migration:
Fabrikam plans to migrate from its current on-premises infrastructure to a completely cloud-based topology; this will include user authentication, the security framework, and, primarily, the adoption of the services by end users.
All the data from the different systems will be consolidated into a single data source - a common data model that will use a Microsoft Dataverse environment as a single source of truth (SSOT) for the sales team.

Sales Cycle Enablement:
To achieve the company's objectives, Fabrikam intends to implement the following strategies to enhance the sales cycle:
Use low-code development to create a single AI agent that has Dataverse as its core component. Ensure that sales managers can access unanswered correspondence from prospects and intervene as appropriate. Replace the previous proprietary software with Dynamics 365 Sales to track sales cycles and customer interactions. Have the sales executives use Dynamics 365 Sales to track interactions for open opportunities and send follow-up communications to prospects. Have the sales executives use handsfree headsets to interact with an AI agent when they have questions about internal policies or customer data.`;

const contosoContext = `Contoso, Ltd. is a high-tech manufacturing company that uses Microsoft Dynamics 365 Finance. Dynamics 365 Supply Chain Management, and Dynamics 365 Commerce for its North American operations. The company designs and develops innovative products that have many patents and proprietary technologies. The patents and engineering designs are closely guarded secrets.

Contoso executives want to integrate and adopt AI solutions to help scale the company in preparation for an anticipated period of rapid growth. The company has multiple legal entities and Azure subscriptions that will be used in the adopted AI solutions.

AI Adoption:
The following executives will have specific responsibilities in the overall AI adoption:
- Chief Technology Officer (CTO): Select one Dynamics 365 Finance, Dynamics 365 Supply Chain Management or Dynamics 365 Commerce prebuilt AI agent and one custom Microsoft Copilot Studio AI agent to prioritize and deploy during the initial AI adoption phase.
- Chief Information Officer (CIO): Ensure that appropriate security labels are assigned to the data used by the AI agents.
- Chief Financial Officer (CFO): Analyze the return on investment (ROI) for the AI agents being deployed.
- Chief Information Security Officer (CISO): Discover and inventory AI resources for auditing.
- Chief Executive Officer (CEO): Ensure that all solutions adhere to industry-standard responsible AI practices.

All AI initiatives and agents will have a detailed business use case, a defined audience profile, and an estimated ROI that will compare the cost savings of the current process against the estimated costs of using the new AI solutions.

The company's research and development (R&D) department already has a custom Model Context Protocol (MCP) server that contains comprehensive product specifications and compliance data.

Custom AI Agent:
Contoso has identified the following custom AI agent requirements:
- The custom AI agent will use data from Dynamics 365 Supply Chain Management to answer questions for the manufacturing team as a low-code solution.
- The custom AI agent will be accessible from within Microsoft Teams.
- The custom AI agent must be designed to eventually connect to other agents that can be selected based on their description.
- The topics used in the custom AI agent will be selected based NOT on a trigger phrase, but on a description of the purpose of the query, to make the interactions more conversational.
- The custom AI agent must be able to answer questions about product specifications by using existing technologies. The product specifications are maintained by the R&D department.

Analysis, Reporting, and Troubleshooting:
Contoso has identified the following analysis, reporting, and troubleshooting requirements:
- The CISO will audit all the AI solutions monthly for compliance and security.
- The CFO will analyze all the AI solutions quarterly to compare the estimated ROI against actual measured efficiencies and adoption. The CFO will use the Copilot Studio agent usage estimator to perform this analysis.
- The CISO wants to identify how much sensitive data was accessed for a given AI agent run and who accessed the data. Too much sensitive data accessed by a single user might indicate a high security risk.
- The CTO wants to track user feedback on the quality of the AI agent responses during user interactions with the agents. Consistently poor feedback will trigger an escalated reengineering discussion.
- The CEO wants a quarterly assessment of all the required metrics for their specific responsibilities. The tools used for the assessments must be Microsoft-recommended and must verify reliability, interpretability, fairness, and compliance.
- The CFO wants to identify how many interactions with the AI agents are abandoned on a given day as compared to resolved conversations. Too many abandoned sessions might indicate that Copilot Studio credits are being used inefficiently by end users.`;


questions.forEach(q => {
  // Add contexts
  if (q.text.includes('Fabrikam Case Study:')) {
    q.context = fabrikamContext;
  } else if (q.text.includes('Contoso Case Study:')) {
    q.context = contosoContext;
  } else if (q.text.includes('company uses Microsoft Dynamics 365 Sales to manage leads that are stored in a Microsoft Dataverse table named Lead')) {
     q.context = 'A company uses Microsoft Dynamics 365 Sales to manage leads that are stored in a Microsoft Dataverse table named Lead and use non-standard terminology and custom columns.';
  } else if (q.text.includes('company has a Microsoft 365 tenant in Canada')) {
     q.context = 'The company plans to deploy a Microsoft Copilot Studio agent to the Canadian environment that will use:\n- Microsoft Dataverse data stored in Canada\n- A connector that connects to an Azure OpenAI instance in the United States';
  } else if (q.text.includes('company has Microsoft Power Platform development, staging, and production environments. Each environment has its own Microsoft Dataverse tables and Azure AI Search index.')) {
     q.context = 'The company has a Copilot Studio agent named Agent1 in development. Agent1 uses the following grounding data sources:\n- A Dataverse table named CustomerOrders\n- An Azure AI Search index named customer-knowledge';
  } else if (q.text.includes('company has an AI solution built by using Microsoft Copilot Studio and Power Platform')) {
     q.context = "The solution is used by the company's sales, marketing, and customer service teams. You are performing a return on AI investment (ROAI) analysis to evaluate the impact of the solution.";
  }

  // Handle hotspot / drag-drop configurations
  if (q.type === 'hotspot') {
    if (!q.hotspotAreas && q.correctAnswer) {
      q.hotspotAreas = Object.keys(q.correctAnswer).map(key => {
         let options = Object.values(q.correctAnswer);
         options.push('Azure Policy', 'Microsoft Purview', 'Power Automate workflow', 'Application Insights', 'Dynamics 365 Sales');
         return {
            id: key, // Use the literal question key for simplicity
            label: key,
            options: Array.from(new Set(options))
         };
      });
    }
  }

  if (q.type === 'drag-drop') {
    if (!q.dragItems && q.correctAnswer) {
       q.dragItems = Array.from(new Set(Object.values(q.correctAnswer)));
       q.dragItems.push('Natural language understanding (NLU)', 'Microsoft 365 Toolkit', 'Azure AI Content Safety');
       q.dragItems = Array.from(new Set(q.dragItems));
       
       q.dropZones = Object.keys(q.correctAnswer).map(key => ({
          id: key,
          label: key
       }));
    }
  }
});

fs.writeFileSync('./src/data/questions.json', JSON.stringify(questions, null, 2));
console.log('Enriched questions successfully!');
