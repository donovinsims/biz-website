import {
  BellRing,
  FileClock,
  MessageSquareMore,
  Receipt,
  Star,
  type LucideIcon,
} from "lucide-react";

export type FlowNodeType =
  | "trigger"
  | "step"
  | "draft"
  | "decision"
  | "approve"
  | "result";

export type FlowNode = {
  id: string;
  type: FlowNodeType;
  label: string;
  /** Column (left→right on desktop, top→bottom on mobile). */
  stage: number;
  /** Lane within a stage. 0 = main line, 1 = branch. */
  row?: number;
};

export type FlowEdge = { from: string; to: string; label?: "Yes" | "No" };

export type Flow = {
  nodes: FlowNode[];
  edges: FlowEdge[];
  /** Order the "Play" dot travels. */
  path: string[];
};

export type Example = {
  slug: string;
  icon: LucideIcon;
  title: string;
  hook: string;
  problem: string;
  setup: string[];
  control: string;
  changes: string[];
  day?: string;
  flow: Flow;
};

export const examples: Example[] = [
  {
    slug: "missed-leads",
    icon: MessageSquareMore,
    title: "Never miss a new lead",
    hook: "Every new lead gets a reply in minutes, even when you're on a job.",
    problem:
      "When a call goes unanswered or a web form comes in while you're busy, the customer often moves on to the next company.",
    setup: [
      "An instant, friendly reply in your own words.",
      "A few quick questions (what, where, when).",
      "An alert to your phone for urgent jobs.",
      "One list so no lead gets forgotten.",
    ],
    control:
      "The first reply uses wording you approve. It never quotes a price, promises a time, or commits you to anything.",
    changes: [
      "Faster first response.",
      "Fewer leads slipping away.",
      "You stop checking your phone every few minutes.",
    ],
    day: "You're on a roof at 2 p.m. and a call goes unanswered. Within minutes the caller gets a friendly text and sends back the address and the problem. When you come down, you see a short summary.",
    flow: {
      nodes: [
        { id: "a", type: "trigger", label: "New lead arrives", stage: 0 },
        { id: "b", type: "step", label: "Instant reply sent", stage: 1 },
        { id: "c", type: "draft", label: "Asks a few questions", stage: 2 },
        { id: "d", type: "decision", label: "Urgent?", stage: 3 },
        { id: "e", type: "step", label: "Text you right away", stage: 4 },
        { id: "f", type: "step", label: "Added to lead list", stage: 4, row: 1 },
        { id: "g", type: "approve", label: "You take it from there", stage: 5 },
        { id: "h", type: "result", label: "Lead never gets lost", stage: 6 },
      ],
      edges: [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
        { from: "c", to: "d" },
        { from: "d", to: "e", label: "Yes" },
        { from: "d", to: "f", label: "No" },
        { from: "e", to: "g" },
        { from: "f", to: "g" },
        { from: "g", to: "h" },
      ],
      path: ["a", "b", "c", "d", "e", "g", "h"],
    },
  },
  {
    slug: "quote-followup",
    icon: FileClock,
    title: "Follow up on every estimate",
    hook: "Estimates don't go quiet and die.",
    problem:
      "You send an estimate, get busy, and never follow up. The customer forgets, or hires someone who did.",
    setup: [
      "A list of every estimate you've sent.",
      "A friendly nudge, in your voice, after a few days of silence.",
      "It stops the moment the customer replies.",
      "A heads-up on estimates about to expire.",
    ],
    control:
      "You choose how many nudges and how pushy. At first, you approve every message.",
    changes: [
      "More estimates get an answer.",
      "You stop keeping follow-ups in your head.",
    ],
    flow: {
      nodes: [
        { id: "a", type: "trigger", label: "Estimate sent", stage: 0 },
        { id: "b", type: "step", label: "Wait a few days", stage: 1 },
        { id: "c", type: "decision", label: "Customer replied?", stage: 2 },
        { id: "d", type: "draft", label: "Friendly follow-up drafted", stage: 3 },
        { id: "e", type: "step", label: "Stop and alert you", stage: 3, row: 1 },
        { id: "f", type: "approve", label: "You approve", stage: 4 },
        { id: "g", type: "step", label: "Second nudge later", stage: 5 },
        { id: "h", type: "result", label: "Nothing goes cold silently", stage: 6 },
      ],
      edges: [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
        { from: "c", to: "d", label: "No" },
        { from: "c", to: "e", label: "Yes" },
        { from: "d", to: "f" },
        { from: "f", to: "g" },
        { from: "g", to: "h" },
        { from: "e", to: "h" },
      ],
      path: ["a", "b", "c", "d", "f", "g", "h"],
    },
  },
  {
    slug: "reviews",
    icon: Star,
    title: "Handle reviews without the homework",
    hook: "Every review gets a good reply. Bad ones reach you first.",
    problem:
      "Reviews matter for local business, but replying takes time, so they pile up or get rushed.",
    setup: [
      "New reviews are checked every day.",
      "A reply is drafted in your voice.",
      "Low-star reviews come straight to your phone.",
      "You get a short weekly summary.",
    ],
    control: "Nothing is posted publicly without your OK.",
    changes: [
      "Every review gets a reply.",
      "You hear about an unhappy customer the same day.",
      "No more review homework at night.",
    ],
    flow: {
      nodes: [
        { id: "a", type: "trigger", label: "New review posted", stage: 0 },
        { id: "b", type: "step", label: "Read and sorted", stage: 1 },
        { id: "c", type: "decision", label: "Low rating?", stage: 2 },
        { id: "d", type: "draft", label: "Reply drafted in your voice", stage: 3 },
        { id: "e", type: "step", label: "Alert you now", stage: 3, row: 1 },
        { id: "f", type: "approve", label: "You approve", stage: 4 },
        { id: "g", type: "step", label: "Reply posted", stage: 5 },
        { id: "h", type: "result", label: "Reputation stays tidy", stage: 6 },
      ],
      edges: [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
        { from: "c", to: "d", label: "No" },
        { from: "c", to: "e", label: "Yes" },
        { from: "d", to: "f" },
        { from: "e", to: "f" },
        { from: "f", to: "g" },
        { from: "g", to: "h" },
      ],
      path: ["a", "b", "c", "d", "f", "g", "h"],
    },
  },
  {
    slug: "get-paid",
    icon: Receipt,
    title: "Get paid faster",
    hook: "Polite, steady reminders on unpaid invoices.",
    problem:
      "Chasing payments feels awkward and is easy to put off, so money sits.",
    setup: [
      "A morning check of unpaid invoices.",
      "A polite reminder in your tone, with your payment link, when one is past due.",
      "Follow-ups stay polite and stop once it's paid.",
      "The tough ones handed to you with the story so far.",
    ],
    control:
      "You set the tone and the timing. Larger or sensitive accounts always come to you first.",
    changes: ["Less awkward chasing.", "More predictable cash."],
    flow: {
      nodes: [
        { id: "a", type: "trigger", label: "Every morning", stage: 0 },
        { id: "b", type: "step", label: "Check unpaid invoices", stage: 1 },
        { id: "c", type: "decision", label: "Past due?", stage: 2 },
        { id: "d", type: "draft", label: "Reminder with pay link", stage: 3 },
        { id: "e", type: "step", label: "Gentle follow-up", stage: 4 },
        { id: "f", type: "step", label: "Summary sent to you", stage: 5 },
        { id: "g", type: "approve", label: "You make the call", stage: 6 },
        { id: "h", type: "result", label: "Cash follow-up runs itself", stage: 7 },
      ],
      edges: [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
        { from: "c", to: "d", label: "Yes" },
        { from: "d", to: "e" },
        { from: "e", to: "f" },
        { from: "f", to: "g" },
        { from: "g", to: "h" },
      ],
      path: ["a", "b", "c", "d", "e", "f", "g", "h"],
    },
  },
  {
    slug: "job-updates",
    icon: BellRing,
    title: "Know what's slipping before the customer does",
    hook: "A short morning list of jobs that need attention.",
    problem:
      "Jobs fall behind, wait on parts or permits, or go days without a customer update, and you find out when the customer calls upset.",
    setup: [
      "Each morning it checks your active jobs.",
      "It sends you a short list: jobs behind schedule, not yet scheduled, waiting on parts or permits, or overdue for a customer update.",
      "A drafted update you can send.",
    ],
    control:
      "It reports and drafts. You decide what to do and what gets sent.",
    changes: ["Fewer \"where's my job?\" calls.", "Fewer surprises."],
    flow: {
      nodes: [
        { id: "a", type: "trigger", label: "Every morning", stage: 0 },
        { id: "b", type: "step", label: "Check active jobs", stage: 1 },
        { id: "c", type: "decision", label: "Anything behind or overdue?", stage: 2 },
        { id: "d", type: "step", label: "Short list sent to you", stage: 3 },
        { id: "e", type: "step", label: "All clear", stage: 3, row: 1 },
        { id: "f", type: "draft", label: "Customer update drafted", stage: 4 },
        { id: "g", type: "approve", label: "You approve", stage: 5 },
        { id: "h", type: "result", label: "Fewer surprises", stage: 6 },
      ],
      edges: [
        { from: "a", to: "b" },
        { from: "b", to: "c" },
        { from: "c", to: "d", label: "Yes" },
        { from: "c", to: "e", label: "No" },
        { from: "d", to: "f" },
        { from: "f", to: "g" },
        { from: "g", to: "h" },
        { from: "e", to: "h" },
      ],
      path: ["a", "b", "c", "d", "f", "g", "h"],
    },
  },
];
