// demoData.ts [CLEANUP]
// Description: Demo/simulation data — sample users, fallback prompts, and mock responses

import type { UserData } from '@/types/api';

function freezeDeep<T>(obj: T): T {
  if (obj && typeof obj === 'object') {
    Object.freeze(obj);
    Object.values(obj as Record<string, unknown>).forEach(freezeDeep);
  }
  return obj;
}

export const SAMPLE_USERS: Record<string, UserData[]> = freezeDeep({
  'Main Hall': [
    { name: 'Alex_Coder', available: false, status: 'Busy coding', is_sample: true, id: '' },
    { name: 'Sarah_Dev', available: true, status: 'Looking to chat', is_sample: true, id: '' },
    { name: 'Mike_Hacker', available: false, status: 'In deep focus', is_sample: true, id: '' },
    { name: 'Emma_Tech', available: true, status: 'Open to talk', is_sample: true, id: '' },
  ],
  'Table 1': [
    { name: 'Jake_Python', available: true, status: 'Ready to chat', is_sample: true, id: '' },
    { name: 'Lisa_JS', available: false, status: 'Taking notes', is_sample: true, id: '' },
  ],
  'Table 2': [
    { name: 'Olga_Rust', available: true, status: 'Happy to meet', is_sample: true, id: '' },
    { name: 'Tom_Swift', available: false, status: 'On a call', is_sample: true, id: '' },
  ],
  'Table 3': [
    { name: 'Diana_Go', available: true, status: 'Just arrived', is_sample: true, id: '' },
  ],
  'Table 4': [
    { name: 'Raj_Java', available: false, status: 'Debugging', is_sample: true, id: '' },
    { name: 'Ella_Ruby', available: true, status: 'Excited to chat', is_sample: true, id: '' },
    { name: 'Finn_Web3', available: true, status: 'Browsing', is_sample: true, id: '' },
  ],
  'Table 5': [
    { name: 'Nina_ML', available: false, status: 'Training model', is_sample: true, id: '' },
    { name: 'Omar_Scala', available: true, status: 'Open for chat', is_sample: true, id: '' },
  ],
  'Quiet Corner': [
    { name: 'Zara_Read', available: false, status: 'Reading docs', is_sample: true, id: '' },
    { name: 'Kai_Write', available: true, status: 'Taking a break', is_sample: true, id: '' },
  ],
  'Coffee Area': [
    { name: 'Liam_Chat', available: true, status: 'Grabbing coffee', is_sample: true, id: '' },
    { name: 'Sara_Design', available: false, status: 'Sketching UI', is_sample: true, id: '' },
    { name: 'Noah_Ops', available: true, status: 'Ready to connect', is_sample: true, id: '' },
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
