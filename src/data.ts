export type Article = {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  readTime: string
  image: string
  imageAlt: string
  featured?: boolean
  trending?: boolean
  body: string[]
  source?: string
  url?: string
  isSample?: boolean
}

const sampleFlag = 'AI-generated editorial concept, not a report of real events.'

export const categories = ['All', 'Artificial Intelligence', 'Machine Learning', 'Robotics', 'Future of Work', 'Ethics & Society']

export const sampleArticles: Article[] = [
  {
    id: 'small-models-big-shift',
    title: 'The quiet rise of small models — and what they make possible',
    excerpt: 'A new generation of compact AI is moving intelligence closer to the people and devices that need it.',
    category: 'Artificial Intelligence',
    author: 'Maya Chen',
    date: 'Oct 24, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85',
    imageAlt: 'Intricate computer circuit board lit by soft light',
    featured: true,
    trending: true,
    body: [
      'This AI-generated editorial concept explores a plausible direction in technology; it is not reporting about a real launch or event. The shift toward smaller, specialized models is a useful lens for thinking about where AI could go next.',
      'When an assistant can run close to the data it works with, the trade-offs change. Teams may gain more control over latency, privacy, and cost, while giving up some of the broad capabilities of a much larger system. The right model is increasingly the one that fits the task, not the one with the biggest headline number.',
      'That shift also puts design in the foreground. Better tools will need clear boundaries, good defaults, and a way for people to understand when a model is uncertain. More capability at the edge only matters if it earns trust where it is used.',
    ],
    isSample: true,
  },
  {
    id: 'machines-that-learn-to-wait',
    title: 'What if the most useful AI knew when not to answer?',
    excerpt: 'A thought experiment about uncertainty, restraint, and designing systems that know their limits.',
    category: 'Ethics & Society',
    author: 'Noah Williams',
    date: 'Oct 22, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1100&q=85',
    imageAlt: 'Minimal white robotic head against a neutral background',
    trending: true,
    body: [sampleFlag, 'A useful system is not always the one that responds fastest. In high-stakes settings, a pause can be a feature: a chance to ask for context, show uncertainty, or hand the decision to a person.', 'This concept looks at how product teams might make restraint visible. Confidence indicators alone are not enough; the interaction should explain what information is missing and offer a practical next step.', 'The measure of progress may be less about how often an AI answers and more about how well it recognizes the moments when a human perspective matters.'],
    isSample: true,
  },
  {
    id: 'creative-tools-new-collaborators',
    title: 'The next creative tool might feel more like a collaborator',
    excerpt: 'From one-shot prompts to iterative making, the interface is becoming part of the creative act.',
    category: 'Future of Work',
    author: 'Ari Patel',
    date: 'Oct 20, 2026',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1100&q=85',
    imageAlt: 'Colorful immersive digital installation in a dark gallery',
    trending: true,
    body: [sampleFlag, 'The first wave of generative tools made the prompt feel like a magic word. The next wave may put less emphasis on the perfect instruction and more on the rhythm of revision: suggest, inspect, adjust, and keep what feels right.', 'That kind of interface gives people more room to steer. A model can offer alternatives without taking over, preserve the history of a piece, and make its contribution legible.', 'The most interesting question is not whether AI can make something. It is whether the tool helps a person make something they could not have reached alone.'],
    isSample: true,
  },
  {
    id: 'robots-in-the-real-world',
    title: 'Robots are learning the art of doing less, better',
    excerpt: 'A more practical vision of robotics starts with the repetitive task, not the perfect android.',
    category: 'Robotics',
    author: 'Elena Ruiz',
    date: 'Oct 18, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?auto=format&fit=crop&w=1100&q=85',
    imageAlt: 'Industrial robot arm working on an assembly line',
    body: [sampleFlag, 'A robot does not need to look human to be helpful. In a workshop, a clinic, or a warehouse, the most valuable machine may be the one that takes a single awkward, repeated motion off someone’s hands.', 'Narrow tasks offer a clearer path to safety and reliability. They also demand careful attention to the people who share the space with a machine, from technicians to the workers whose routines change.', 'The future of robotics could be less cinematic and more collaborative: tools that fit into existing work, with people still firmly in control.'],
    isSample: true,
  },
  {
    id: 'the-data-behind-the-answer',
    title: 'Can we make AI provenance feel as natural as a footnote?',
    excerpt: 'A better trail from answer to source could turn machine-generated confidence into something inspectable.',
    category: 'Machine Learning',
    author: 'Jules Morgan',
    date: 'Oct 16, 2026',
    readTime: '9 min read',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1100&q=85',
    imageAlt: 'Network of lights seen across the earth from space',
    body: [sampleFlag, 'A fluent answer can hide a messy path to its conclusion. Provenance tools try to make that path easier to inspect, connecting claims to sources, transformations, and moments of uncertainty.', 'The challenge is to give people enough context without burying them in metadata. Good provenance should be available at the point where a reader needs to check a claim, then get out of the way.', 'Thinking of provenance as part of the reading experience, rather than a compliance layer, may help make transparency feel useful instead of ceremonial.'],
    isSample: true,
  },
  {
    id: 'learning-to-share-the-work',
    title: 'A field guide to working alongside an AI assistant',
    excerpt: 'The best human–AI workflows are built around clear handoffs, not total automation.',
    category: 'Future of Work',
    author: 'Samira Okafor',
    date: 'Oct 14, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=85',
    imageAlt: 'Bright shared workspace with a long communal table',
    body: [sampleFlag, 'A good assistant does not need to disappear the work. It can take on a first pass, surface options, or bring together material that a person then reviews with care.', 'The handoff matters. Teams benefit from deciding which decisions remain human, what evidence is expected, and how an AI contribution should be checked before it moves downstream.', 'That is less a feature checklist than a working agreement, one that will need to evolve as tools and teams change.'],
    isSample: true,
  },
  {
    id: 'making-space-for-better-questions',
    title: 'The questions we ask of AI shape the answers we get',
    excerpt: 'A closer look at how problem framing can expose assumptions before a model ever responds.',
    category: 'Artificial Intelligence',
    author: 'Maya Chen',
    date: 'Oct 12, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1100&q=85',
    imageAlt: 'Person working with notes and a laptop at a desk',
    body: [sampleFlag, 'It is easy to treat a prompt as a private instruction. In practice, the way a question is framed can bring assumptions into view or quietly reinforce them.', 'Asking what a system does not know, what evidence it used, or which alternatives it considered can create a more useful exchange. The question becomes a tool for shaping the work, not only requesting an answer.', 'Better questions are not a substitute for better systems, but they can help people stay active in the loop.'],
    isSample: true,
  },
  {
    id: 'a-more-human-automation',
    title: 'Automation works best when it leaves a little room',
    excerpt: 'Why flexible systems may serve people better than workflows that try to predict every move.',
    category: 'Ethics & Society',
    author: 'Noah Williams',
    date: 'Oct 10, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1100&q=85',
    imageAlt: 'Team collaborating around a laptop in a bright office',
    body: [sampleFlag, 'Automation is often presented as a way to remove friction. But a workflow that leaves no room for exceptions can simply move that friction somewhere harder to see.', 'People need ways to pause, revise, and recover when a system’s assumptions do not match the moment. That flexibility is not an edge case; it is part of designing for the real world.', 'A little room for judgment can make a system more dependable, not less.'],
    isSample: true,
  },
]

export function articlePath(article: Article) {
  return `/article/${article.id}`
}
