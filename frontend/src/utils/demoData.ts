// demoData.ts
// Description: Demo/simulation data — sample users, fallback prompts, and mock responses

export interface SamplePerson {
  name: string;
  available: boolean;
  status: string;
}

export const SAMPLE_USERS: Record<string, SamplePerson[]> = {
  'Main Hall': [
    { name: 'Alex_Coder', available: false, status: 'Busy coding' },
    { name: 'Sarah_Dev', available: true, status: 'Looking to chat' },
    { name: 'Mike_Hacker', available: false, status: 'In deep focus' },
    { name: 'Emma_Tech', available: true, status: 'Open to talk' },
  ],
  'Table 1': [
    { name: 'Jake_Python', available: true, status: 'Ready to chat' },
    { name: 'Lisa_JS', available: false, status: 'Taking notes' },
  ],
  'Table 2': [
    { name: 'Tom_React', available: false, status: 'Debugging' },
    { name: 'Anna_Vue', available: true, status: 'Available' },
    { name: 'Chris_Node', available: false, status: 'On a call' },
  ],
  'Table 3': [
    { name: 'Sam_AI', available: true, status: 'Looking for conversation' },
    { name: 'Ruby_Data', available: false, status: 'Analyzing data' },
  ],
  'Table 4': [
    { name: 'Ben_Mobile', available: false, status: 'Testing app' },
    { name: 'Zoe_Flutter', available: true, status: 'Open to chat' },
  ],
  'Table 5': [
    { name: 'Max_Cloud', available: true, status: 'Ready to talk' },
    { name: 'Luna_AWS', available: false, status: 'Configuring servers' },
  ],
  'Quiet Corner': [
    { name: 'Eve_Designer', available: true, status: 'Quiet but open' },
  ],
  'Coffee Area': [
    { name: 'Dan_DevOps', available: true, status: 'Coffee break - chat me!' },
    { name: 'Maya_FullStack', available: false, status: 'Focused on laptop' },
    { name: 'Leo_Backend', available: false, status: 'Reading documentation' },
  ],
};

export const RESPONSES: Record<string, { accepted: boolean; message: string }> = {
  Dan_DevOps: { accepted: true, message: "Hey! I'd love to chat about DevOps! Let's meet at the coffee table." },
  Sarah_Dev: { accepted: true, message: "Sure! I'm excited to talk about development. See you in a minute!" },
  Emma_Tech: { accepted: true, message: "Absolutely! I'm always up for a good tech conversation." },
  Jake_Python: { accepted: true, message: "Python talk? Count me in! Let's do this!" },
  Anna_Vue: { accepted: true, message: "Vue.js discussion? I'm totally in! Meet you there." },
  Sam_AI: { accepted: true, message: "AI conversation? This is going to be fascinating!" },
  Zoe_Flutter: { accepted: true, message: "Flutter chat? I'm so ready for this!" },
  Max_Cloud: { accepted: true, message: "Cloud architecture talk? Perfect timing!" },
  Eve_Designer: { accepted: true, message: "Design discussion? I'm quietly excited!" },
};
