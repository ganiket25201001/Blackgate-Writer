export interface DocumentTemplate {
  name: string
  description: string
  icon: string
  content: string
}

export const TEMPLATES: DocumentTemplate[] = [
  {
    name: 'Blank Document',
    description: 'Start with a blank page',
    icon: '📄',
    content: '',
  },
  {
    name: 'Business Letter',
    description: 'Professional business letter template',
    icon: '💼',
    content: `[Your Name]
[Your Address]
[City, State ZIP Code]
[Your Email]
[Your Phone]

[Date]

[Recipient Name]
[Recipient Title]
[Company Name]
[Company Address]
[City, State ZIP Code]

Dear [Recipient Name]:

[Opening paragraph - State the purpose of your letter]

[Body paragraph(s) - Provide details and supporting information]

[Closing paragraph - Call to action or next steps]

Sincerely,

[Your Name]`,
  },
  {
    name: 'Report Template',
    description: 'Professional report with sections',
    icon: '📊',
    content: `# [Report Title]

**Prepared by:** [Author Name]
**Date:** [Date]
**Status:** [Draft/Final]

## Executive Summary

[Brief summary of key findings and recommendations]

## Introduction

[Background and purpose of the report]

## Methodology

[Approach and methods used]

## Findings

### Key Finding 1
[Details]

### Key Finding 2
[Details]

### Key Finding 3
[Details]

## Analysis

[Discussion of findings]

## Recommendations

1. [Recommendation 1]
2. [Recommendation 2]
3. [Recommendation 3]

## Conclusion

[Summary and final thoughts]

## Appendices

[Supporting documents and data]`,
  },
  {
    name: 'Proposal',
    description: 'Business proposal template',
    icon: '🎯',
    content: `# Project Proposal

**To:** [Client Name]
**From:** [Your Company]
**Date:** [Date]
**Project:** [Project Name]

## Executive Summary

[Brief overview of the proposal]

## Problem Statement

[Describe the client's problem or need]

## Proposed Solution

[Detailed solution approach]

## Deliverables

- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

## Timeline

**Phase 1:** [Duration] - [Description]
**Phase 2:** [Duration] - [Description]
**Phase 3:** [Duration] - [Description]

## Investment

| Item | Cost |
|------|------|
| Service/Product 1 | $XX,XXX |
| Service/Product 2 | $XX,XXX |
| Total | $XX,XXX |

## Terms & Conditions

[Payment terms, warranties, etc.]

## Next Steps

[How to move forward with the proposal]`,
  },
]
