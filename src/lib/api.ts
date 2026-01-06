import type {
  Plan,
  Objective,
  LiveObjective,
  SubObjective,
  PaginatedResponse,
} from './types'

// Generate mock data
const PLANS: Plan[] = [
  { id: 1, title: 'Q1 2026 Strategy', description: 'Strategic objectives for Q1' },
  { id: 2, title: 'Product Roadmap', description: 'Product development milestones' },
  { id: 3, title: 'Engineering Excellence', description: 'Technical improvements' },
]

// Generate 1500 objectives to test large dataset performance
function generateObjectives(planId: number): Objective[] {
  const objectives: Objective[] = []
  const count = 1500

  for (let i = 1; i <= count; i++) {
    const taskContent = `## Objective Overview\n\nThis objective focuses on ${['improving', 'developing', 'optimizing', 'building', 'researching'][i % 5]} ${['customer experience', 'platform stability', 'team productivity', 'system performance', 'data quality'][i % 5]}.\n\n### Key Requirements\n\n- **Primary Goal**: Achieve measurable improvements in the target area\n- **Timeline**: Q${(i % 4) + 1} 2026\n- **Stakeholders**: Engineering, Product, Design teams\n\n### Technical Approach\n\n1. **Analysis Phase**\n   - Gather current metrics and baselines\n   - Identify bottlenecks and pain points\n   - Review existing solutions and alternatives\n\n2. **Implementation Phase**\n   - Design technical architecture\n   - Develop proof of concept\n   - Iterate based on feedback\n\n3. **Validation Phase**\n   - A/B testing with controlled rollout\n   - Monitor key performance indicators\n   - Collect user feedback\n\n### Success Criteria\n\n> The objective will be considered successful when we achieve:\n> - 20% improvement in target metrics\n> - Zero critical bugs in production\n> - Positive user feedback (>80% satisfaction)\n\n### Dependencies\n\n- Infrastructure team support\n- Design system updates\n- API endpoint availability\n\n### Risks & Mitigation\n\n⚠️ **Risk**: Timeline constraints\n**Mitigation**: Parallel workstreams and early prototyping\n\n⚠️ **Risk**: Technical complexity\n**Mitigation**: Proof of concept before full implementation`

    const resultContent = `## Implementation Results\n\n### Achievements\n\nSuccessfully ${['improved', 'developed', 'optimized', 'built', 'researched'][i % 5]} the ${['customer experience', 'platform stability', 'team productivity', 'system performance', 'data quality'][i % 5]} with the following outcomes:\n\n#### Quantitative Results\n\n| Metric | Before | After | Improvement |\n|--------|--------|-------|-------------|\n| Performance | 2.5s | 1.2s | 52% faster |\n| Success Rate | 87% | 96% | +9% |\n| User Satisfaction | 3.8/5 | 4.6/5 | +21% |\n\n#### Qualitative Results\n\n✅ **User Feedback**: "The new implementation is significantly faster and more intuitive"\n\n✅ **Team Impact**: Reduced operational overhead by 30%\n\n✅ **Technical Quality**: Zero critical bugs in production after 3 months\n\n### Key Learnings\n\n1. **Early prototyping** was crucial for validating assumptions\n2. **User feedback loops** helped refine the solution iteratively\n3. **Cross-functional collaboration** accelerated decision-making\n\n### Next Steps\n\n- [ ] Monitor long-term stability and performance\n- [ ] Gather additional user feedback for future iterations\n- [ ] Document best practices for similar initiatives\n- [ ] Share learnings with other teams\n\n### Technical Implementation Details\n\n\`\`\`typescript\n// Example implementation snippet\nconst optimizedFunction = async () => {\n  const result = await processData();\n  return result;\n};\n\`\`\`\n\n> **Note**: Full technical documentation available in the engineering wiki`

    objectives.push({
      id: planId * 10000 + i,
      counter: i,
      title: `${['Improve', 'Develop', 'Optimize', 'Build', 'Research'][i % 5]} ${['customer experience', 'platform stability', 'team productivity', 'system performance', 'data quality'][i % 5]}`,
      task: taskContent,
      result: resultContent,
      contextualData: `This is the contextual data for objective ${i}. It contains detailed information about the objective's purpose, scope, and requirements. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    })
  }

  return objectives
}

const OBJECTIVES_BY_PLAN = new Map<number, Objective[]>(
  PLANS.map((plan) => [plan.id, generateObjectives(plan.id)])
)

// Generate sub-objectives for testing pagination
function generateSubObjectives(objectiveId: number, total = 500): SubObjective[] {
  const subObjectives: SubObjective[] = []

  for (let i = 1; i <= total; i++) {
    subObjectives.push({
      id: objectiveId * 1000 + i,
      input: `Input ${i}: Research and analyze ${['user feedback', 'system metrics', 'competitor data', 'market trends', 'technical requirements'][i % 5]}`,
      output: `Output ${i}: Completed analysis with ${['actionable insights', 'detailed recommendations', 'implementation plan', 'risk assessment', 'success metrics'][i % 5]}`,
    })
  }

  return subObjectives
}

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock API
export const api = {
  // GET /plans
  getPlans: async (): Promise<Plan[]> => {
    await delay(100)
    return PLANS
  },

  // GET /plans/:planId
  getPlan: async (planId: number): Promise<Plan> => {
    await delay(100)
    const plan = PLANS.find((p) => p.id === planId)
    if (!plan) {
      throw new Error(`Plan ${planId} not found`)
    }
    return plan
  },

  // GET /plans/:planId/objectives
  getObjectives: async (planId: number): Promise<Objective[]> => {
    await delay(150)
    const objectives = OBJECTIVES_BY_PLAN.get(planId)
    if (!objectives) {
      throw new Error(`Objectives for plan ${planId} not found`)
    }
    // Return in descending order (newest first)
    return [...objectives].reverse()
  },

  // GET /plans/:planId/objectives/:objectiveId
  getObjective: async (planId: number, objectiveId: number): Promise<Objective> => {
    await delay(100)
    const objectives = OBJECTIVES_BY_PLAN.get(planId)
    if (!objectives) {
      throw new Error(`Objectives for plan ${planId} not found`)
    }

    const objective = objectives.find((o) => o.id === objectiveId)
    if (!objective) {
      throw new Error(`Objective ${objectiveId} not found`)
    }

    return objective
  },

  // GET /objectives/:objectiveId/sub-objectives?limit=30&offset=0
  getSubObjectives: async (
    objectiveId: number,
    limit: number = 30,
    offset: number = 0
  ): Promise<PaginatedResponse<SubObjective>> => {
    await delay(200)

    const allSubObjectives = generateSubObjectives(objectiveId)
    const data = allSubObjectives.slice(offset, offset + limit)

    return {
      data,
      meta: {
        limit,
        offset,
        total: allSubObjectives.length,
      },
    }
  },

  // GET /plans/:planId/live-objective
  getLiveObjective: async (_planId: number): Promise<LiveObjective | null> => {
    await delay(100)

    // Always return a LIVE objective for all plans
    return {
      id: 'live',
      counter: 0,
      title: 'Current active objective in progress',
      task: '## Current Task\n\nThis is the **currently active objective** being worked on.\n\n### Key Activities\n- Analyzing requirements\n- Implementing solution\n- Testing and validation\n\n> **Note**: This objective is being executed in real-time.',
      result: '### Progress\n\nCurrently in progress...\n\n**Status**: Active execution phase',
    }
  },

  // Search objectives by query
  searchObjectives: async (planId: number, query: string): Promise<Objective[]> => {
    await delay(150)
    const objectives = OBJECTIVES_BY_PLAN.get(planId)
    if (!objectives) {
      throw new Error(`Objectives for plan ${planId} not found`)
    }

    const lowerQuery = query.toLowerCase()
    const filtered = objectives.filter(
      (o) =>
        o.counter.toString().includes(lowerQuery) ||
        o.title.toLowerCase().includes(lowerQuery)
    )
    // Return in descending order (newest first)
    return [...filtered].reverse()
  },
}
