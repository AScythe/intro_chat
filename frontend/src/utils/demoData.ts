// demoData.ts [CLEANUP]
// Description: Demo/simulation data — sample users, fallback prompts, and mock responses

import type { SampleUserData } from '@/types/api';

function freezeDeep<T>(obj: T): T {
  if (obj && typeof obj === 'object') {
    Object.freeze(obj);
    Object.values(obj as Record<string, unknown>).forEach(freezeDeep);
  }
  return obj;
}

export const SAMPLE_USERS: Record<string, SampleUserData[]> = freezeDeep({
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
    { name: 'Olga_Rust', available: true, status: 'Happy to meet' },
    { name: 'Tom_Swift', available: false, status: 'On a call' },
  ],
  'Table 3': [
    { name: 'Diana_Go', available: true, status: 'Just arrived' },
  ],
  'Table 4': [
    { name: 'Raj_Java', available: false, status: 'Debugging' },
    { name: 'Ella_Ruby', available: true, status: 'Excited to chat' },
    { name: 'Finn_Web3', available: true, status: 'Browsing' },
  ],
  'Table 5': [
    { name: 'Nina_ML', available: false, status: 'Training model' },
    { name: 'Omar_Scala', available: true, status: 'Open for chat' },
  ],
  'Quiet Corner': [
    { name: 'Zara_Read', available: false, status: 'Reading docs' },
    { name: 'Kai_Write', available: true, status: 'Taking a break' },
  ],
  'Coffee Area': [
    { name: 'Liam_Chat', available: true, status: 'Grabbing coffee' },
    { name: 'Sara_Design', available: false, status: 'Sketching UI' },
    { name: 'Noah_Ops', available: true, status: 'Ready to connect' },
  ],
});

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
