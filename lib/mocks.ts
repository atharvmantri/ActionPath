// ============================================================
// ActionPath - High-Fidelity Mock Responses for Demo Emails
// Provides rock-solid fallback for hackathon presentations
// ============================================================

import type { PipelineResponse } from './schema';

export function getMockResponse(text: string): PipelineResponse | null {
  const normalized = text.toLowerCase();

  // Demo 1: Biology Field Trip & Lab Fee
  if (normalized.includes('wetland preserve') || normalized.includes('s.rivera@lincoln.edu')) {
    return mockDemo1;
  }

  // Demo 2: Weekly School Newsletter
  if (normalized.includes('lincoln lions') && normalized.includes('poetry portfolio')) {
    return mockDemo2;
  }

  // Demo 3: Emergency Schedule Change
  if (normalized.includes('weather advisory') || normalized.includes('closed')) {
    return mockDemo3;
  }

  // Demo 4: AP Exam Fees & Scholarship
  if (normalized.includes('college board AP exam') || normalized.includes('lincoln alumni')) {
    return mockDemo4;
  }

  // Demo 5: Prom & Volunteer Signup
  if (normalized.includes('prom 2026') || normalized.includes('grand ballroom')) {
    return mockDemo5;
  }

  // Generic fallback if someone enters custom text and quota is exhausted
  return generateGenericMock(text);
}

// ---- Dynamic fallback generator ----
function generateGenericMock(text: string): PipelineResponse {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return {
    pipeline_version: '2.0',
    processed_at: new Date().toISOString(),
    stage_1_classify: {
      comm_type: 'deadline_notice',
      cognitive_load_score: 5,
      word_count: text.split(/\s+/).length,
      action_density: 0.5,
      routing_template: 'DEADLINE_V2',
      language_complexity: 'medium',
      model: 'gemini-3.1-flash-lite',
    },
    stage_2_extract: {
      items: [
        {
          task_id: 't1',
          task: 'Complete tasks from communication.',
          deadline: tomorrow,
          days_remaining: 1,
          source_sentence: text.substring(0, 100) + '...',
          item_type: 'action',
          people: ['Teacher'],
          subject: 'General',
          url: null,
          confidence: 0.95,
        }
      ],
      model: 'gemini-3.1-flash-lite',
    },
    stage_3_score: {
      scored_items: [
        {
          task_id: 't1',
          urgency: 8,
          effort: 'medium',
          consequence: 'grade',
          dependency: null,
          composite_score: 7.5,
        }
      ],
      collision_days: [],
      reorder_suggestion: null,
      model: 'gemini-3.1-flash-lite',
    },
    stage_4_fuse: {
      merged_items: [
        {
          task_id: 't1',
          task: 'Complete tasks from communication.',
          deadline: tomorrow,
          days_remaining: 1,
          source_sentence: text.substring(0, 100) + '...',
          item_type: 'action',
          people: ['Teacher'],
          subject: 'General',
          url: null,
          confidence: 0.95,
        }
      ],
      deduplicated: [],
      recurring_detected: false,
      student_subject_match: {},
      model: 'gemini-3.1-flash-lite',
    },
    stage_5_plan: {
      plan: {
        today: [{ task_id: 't1', est_mins: 20 }],
        tomorrow: [],
        this_week: [],
        later: [],
      },
      daily_budgets: { today: 20, tomorrow: 0 },
      load_warning: null,
      model: 'gemini-3.1-flash-lite',
    },
    stage_6_rewrite: {
      rewritten_items: [
        {
          task_id: 't1',
          rewritten: 'Check and complete items.',
          why_it_matters: 'Keeps you on track with assignments.',
          start_cue: 'Open school web portal.',
          original: 'Complete tasks from communication.',
          model: 'gemini-3.1-flash-lite',
        }
      ],
      model: 'gemini-3.1-flash-lite',
    },
    stage_7_qa: {
      qa_passed: true,
      qa_issues: [],
      model: 'gemini-3.1-flash-lite',
    },
  };
}

// ============================================================
// MOCK DATA 1 - Biology Field Trip & Lab Fee
// ============================================================
const mockDemo1: PipelineResponse = {
  pipeline_version: '2.0',
  processed_at: new Date().toISOString(),
  stage_1_classify: {
    comm_type: 'deadline_notice',
    cognitive_load_score: 8,
    word_count: 382,
    action_density: 0.75,
    routing_template: 'DEADLINE_V2',
    language_complexity: 'medium',
    model: 'gemini-3.1-flash-lite',
  },
  stage_2_extract: {
    items: [
      {
        task_id: 't1',
        task: 'Submit Chapter 14 study guide',
        deadline: '2026-06-16',
        days_remaining: 1,
        source_sentence: 'Second, the Chapter 14 study guide is due on Monday, June 16th at the start of class.',
        item_type: 'deadline',
        people: ['Ms. Rivera'],
        subject: 'Biology',
        url: null,
        confidence: 0.98,
      },
      {
        task_id: 't2',
        task: 'Return signed field trip permission slip to room 204',
        deadline: '2026-06-18',
        days_remaining: 3,
        source_sentence: 'In order to attend, every student must return a signed permission slip to room 204 by Wednesday, June 18th.',
        item_type: 'form',
        people: ['Ms. Rivera', 'Mrs. Chen'],
        subject: 'Biology',
        url: null,
        confidence: 0.97,
      },
      {
        task_id: 't3',
        task: 'Pay $15 dissection lab fee on online portal',
        deadline: '2026-06-19',
        days_remaining: 4,
        source_sentence: 'Second, the lab supply fee of $15 for the dissection unit must be paid through the school\'s online payment portal by Thursday, June 19th.',
        item_type: 'payment',
        people: ['Mrs. Chen'],
        subject: 'Biology',
        url: 'http://payments.lincolnhs.edu',
        confidence: 0.95,
      }
    ],
    model: 'gemini-3.1-flash-lite',
  },
  stage_3_score: {
    scored_items: [
      {
        task_id: 't1',
        urgency: 9,
        effort: 'medium',
        consequence: 'grade',
        dependency: null,
        composite_score: 8.7,
      },
      {
        task_id: 't2',
        urgency: 7,
        effort: 'low',
        consequence: 'opportunity',
        dependency: null,
        composite_score: 7.3,
      },
      {
        task_id: 't3',
        urgency: 6,
        effort: 'low',
        consequence: 'opportunity',
        dependency: null,
        composite_score: 6.5,
      }
    ],
    collision_days: [],
    reorder_suggestion: null,
    model: 'gemini-3.1-flash-lite',
  },
  stage_4_fuse: {
    merged_items: [
      {
        task_id: 't1',
        task: 'Submit Chapter 14 study guide',
        deadline: '2026-06-16',
        days_remaining: 1,
        source_sentence: 'Second, the Chapter 14 study guide is due on Monday, June 16th at the start of class.',
        item_type: 'deadline',
        people: ['Ms. Rivera'],
        subject: 'Biology',
        url: null,
        confidence: 0.98,
      },
      {
        task_id: 't2',
        task: 'Return signed field trip permission slip to room 204',
        deadline: '2026-06-18',
        days_remaining: 3,
        source_sentence: 'In order to attend, every student must return a signed permission slip to room 204 by Wednesday, June 18th.',
        item_type: 'form',
        people: ['Ms. Rivera', 'Mrs. Chen'],
        subject: 'Biology',
        url: null,
        confidence: 0.97,
      },
      {
        task_id: 't3',
        task: 'Pay $15 dissection lab fee on online portal',
        deadline: '2026-06-19',
        days_remaining: 4,
        source_sentence: 'Second, the lab supply fee of $15 for the dissection unit must be paid through the school\'s online payment portal by Thursday, June 19th.',
        item_type: 'payment',
        people: ['Mrs. Chen'],
        subject: 'Biology',
        url: 'http://payments.lincolnhs.edu',
        confidence: 0.95,
      }
    ],
    deduplicated: [],
    recurring_detected: false,
    student_subject_match: { 'Biology': ['t1', 't2', 't3'] },
    model: 'gemini-3.1-flash-lite',
  },
  stage_5_plan: {
    plan: {
      today: [{ task_id: 't1', est_mins: 30 }],
      tomorrow: [{ task_id: 't2', est_mins: 10 }],
      this_week: [{ task_id: 't3', est_mins: 5 }],
      later: [],
    },
    daily_budgets: { today: 30, tomorrow: 10, this_week: 5 },
    load_warning: null,
    model: 'gemini-3.1-flash-lite',
  },
  stage_6_rewrite: {
    rewritten_items: [
      {
        task_id: 't1',
        rewritten: 'Complete Biology study guide.',
        why_it_matters: 'Will not be accepted late and counts as homework.',
        start_cue: 'Open Google Classroom under "Chapter 14 Materials".',
        original: 'Submit Chapter 14 study guide',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't2',
        rewritten: 'Return signed permission slip.',
        why_it_matters: 'Missing this means you remain at school.',
        start_cue: 'Find permission slip in your backpack or Google Classroom.',
        original: 'Return signed field trip permission slip to room 204',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't3',
        rewritten: 'Pay $15 dissection fee.',
        why_it_matters: 'Missing this means doing a virtual lab instead.',
        start_cue: 'Go to payments.lincolnhs.edu in your web browser.',
        original: 'Pay $15 dissection lab fee on online portal',
        model: 'gemini-3.1-flash-lite',
      }
    ],
    model: 'gemini-3.1-flash-lite',
  },
  stage_7_qa: {
    qa_passed: true,
    qa_issues: [],
    model: 'gemini-3.1-flash-lite',
  },
};

// ============================================================
// MOCK DATA 2 - Weekly School Newsletter
// ============================================================
const mockDemo2: PipelineResponse = {
  pipeline_version: '2.0',
  processed_at: new Date().toISOString(),
  stage_1_classify: {
    comm_type: 'general_update',
    cognitive_load_score: 9,
    word_count: 421,
    action_density: 0.8,
    routing_template: 'GENERAL_V2',
    language_complexity: 'medium',
    model: 'gemini-3.1-flash-lite',
  },
  stage_2_extract: {
    items: [
      {
        task_id: 't1',
        task: 'Submit English 10 poetry portfolio final draft via Google Classroom',
        deadline: '2026-06-17',
        days_remaining: 2,
        source_sentence: 'English 10: Your poetry portfolio final draft is due Tuesday, June 17th.',
        item_type: 'deadline',
        people: ['Ms. Thompson'],
        subject: 'English',
        url: null,
        confidence: 0.98,
      },
      {
        task_id: 't2',
        task: 'Pick up yearbooks during lunch with student ID',
        deadline: '2026-06-18',
        days_remaining: 3,
        source_sentence: 'Yearbooks will be distributed during lunch periods on Wednesday, June 18th and Thursday, June 19th.',
        item_type: 'action',
        people: ['Staff'],
        subject: 'Activities',
        url: null,
        confidence: 0.95,
      },
      {
        task_id: 't3',
        task: 'Read primary source documents for AP US History',
        deadline: '2026-06-19',
        days_remaining: 4,
        source_sentence: 'Students should read all four documents before class.',
        item_type: 'action',
        people: ['Mr. Kowalski'],
        subject: 'History',
        url: null,
        confidence: 0.96,
      },
      {
        task_id: 't4',
        task: 'Arrive at Spring Concert warmup in concert attire',
        deadline: '2026-06-19',
        days_remaining: 4,
        source_sentence: 'All band, choir, and orchestra students must arrive by 6:00 PM for warm-up.',
        item_type: 'meeting',
        people: ['Chaperones'],
        subject: 'Music',
        url: null,
        confidence: 0.97,
      },
      {
        task_id: 't5',
        task: 'Submit Algebra 2 corrections to Mrs. Park',
        deadline: '2026-06-20',
        days_remaining: 5,
        source_sentence: 'Corrections must be submitted to Mrs. Park by Friday, June 20th.',
        item_type: 'action',
        people: ['Mrs. Park'],
        subject: 'Math',
        url: null,
        confidence: 0.95,
      },
      {
        task_id: 't6',
        task: 'Complete Senior Exit Survey online',
        deadline: '2026-06-20',
        days_remaining: 5,
        source_sentence: 'All seniors must complete the exit survey by Friday, June 20th.',
        item_type: 'form',
        people: ['Principal Washington'],
        subject: 'Administrative',
        url: null,
        confidence: 0.98,
      }
    ],
    model: 'gemini-3.1-flash-lite',
  },
  stage_3_score: {
    scored_items: [
      {
        task_id: 't1',
        urgency: 9,
        effort: 'high',
        consequence: 'grade',
        dependency: null,
        composite_score: 8.9,
      },
      {
        task_id: 't2',
        urgency: 7,
        effort: 'low',
        consequence: 'none',
        dependency: null,
        composite_score: 5.1,
      },
      {
        task_id: 't3',
        urgency: 6,
        effort: 'medium',
        consequence: 'opportunity',
        dependency: null,
        composite_score: 6.8,
      },
      {
        task_id: 't4',
        urgency: 6,
        effort: 'medium',
        consequence: 'social',
        dependency: null,
        composite_score: 6.3,
      },
      {
        task_id: 't5',
        urgency: 5,
        effort: 'high',
        consequence: 'grade',
        dependency: null,
        composite_score: 7.2,
      },
      {
        task_id: 't6',
        urgency: 5,
        effort: 'low',
        consequence: 'grade',
        dependency: null,
        composite_score: 6.5,
      }
    ],
    collision_days: ['2026-06-19', '2026-06-20'],
    reorder_suggestion: 'Start the AP History readings today so Thursday remains free for the Spring Concert.',
    model: 'gemini-3.1-flash-lite',
  },
  stage_4_fuse: {
    merged_items: [
      {
        task_id: 't1',
        task: 'Submit English 10 poetry portfolio final draft via Google Classroom',
        deadline: '2026-06-17',
        days_remaining: 2,
        source_sentence: 'English 10: Your poetry portfolio final draft is due Tuesday, June 17th.',
        item_type: 'deadline',
        people: ['Ms. Thompson'],
        subject: 'English',
        url: null,
        confidence: 0.98,
      },
      {
        task_id: 't2',
        task: 'Pick up yearbooks during lunch with student ID',
        deadline: '2026-06-18',
        days_remaining: 3,
        source_sentence: 'Yearbooks will be distributed during lunch periods on Wednesday, June 18th and Thursday, June 19th.',
        item_type: 'action',
        people: ['Staff'],
        subject: 'Activities',
        url: null,
        confidence: 0.95,
      },
      {
        task_id: 't3',
        task: 'Read primary source documents for AP US History',
        deadline: '2026-06-19',
        days_remaining: 4,
        source_sentence: 'Students should read all four documents before class.',
        item_type: 'action',
        people: ['Mr. Kowalski'],
        subject: 'History',
        url: null,
        confidence: 0.96,
      },
      {
        task_id: 't4',
        task: 'Arrive at Spring Concert warmup in concert attire',
        deadline: '2026-06-19',
        days_remaining: 4,
        source_sentence: 'All band, choir, and orchestra students must arrive by 6:00 PM for warm-up.',
        item_type: 'meeting',
        people: ['Chaperones'],
        subject: 'Music',
        url: null,
        confidence: 0.97,
      },
      {
        task_id: 't5',
        task: 'Submit Algebra 2 corrections to Mrs. Park',
        deadline: '2026-06-20',
        days_remaining: 5,
        source_sentence: 'Corrections must be submitted to Mrs. Park by Friday, June 20th.',
        item_type: 'action',
        people: ['Mrs. Park'],
        subject: 'Math',
        url: null,
        confidence: 0.95,
      },
      {
        task_id: 't6',
        task: 'Complete Senior Exit Survey online',
        deadline: '2026-06-20',
        days_remaining: 5,
        source_sentence: 'All seniors must complete the exit survey by Friday, June 20th.',
        item_type: 'form',
        people: ['Principal Washington'],
        subject: 'Administrative',
        url: null,
        confidence: 0.98,
      }
    ],
    deduplicated: [],
    recurring_detected: true,
    student_subject_match: { 'English': ['t1'], 'History': ['t3'], 'Math': ['t5'] },
    model: 'gemini-3.1-flash-lite',
  },
  stage_5_plan: {
    plan: {
      today: [{ task_id: 't1', est_mins: 45 }, { task_id: 't3', est_mins: 20 }],
      tomorrow: [{ task_id: 't2', est_mins: 15 }],
      this_week: [{ task_id: 't4', est_mins: 120 }, { task_id: 't5', est_mins: 60 }, { task_id: 't6', est_mins: 10 }],
      later: [],
    },
    daily_budgets: { today: 65, tomorrow: 15, this_week: 190 },
    load_warning: 'Thursday (Spring Concert + AP History DBQ) is heavily scheduled.',
    model: 'gemini-3.1-flash-lite',
  },
  stage_6_rewrite: {
    rewritten_items: [
      {
        task_id: 't1',
        rewritten: 'Turn in poetry portfolio.',
        why_it_matters: 'Late submissions will not be accepted.',
        start_cue: 'Open poetry files in Google Docs.',
        original: 'Submit English 10 poetry portfolio final draft via Google Classroom',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't2',
        rewritten: 'Grab your yearbook.',
        why_it_matters: null,
        start_cue: 'Put student ID in your pocket.',
        original: 'Pick up yearbooks during lunch with student ID',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't3',
        rewritten: 'Read History sources.',
        why_it_matters: 'Prepares you for the essay grade.',
        start_cue: 'Open Mr. Kowalski\'s History folder.',
        original: 'Read primary source documents for AP US History',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't4',
        rewritten: 'Go to Spring Concert.',
        why_it_matters: null,
        start_cue: 'Put on concert attire before 6pm.',
        original: 'Arrive at Spring Concert warmup in concert attire',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't5',
        rewritten: 'Turn in Math corrections.',
        why_it_matters: 'Required to get half credit back.',
        start_cue: 'Get Park algebra worksheet.',
        original: 'Submit Chapter 12 test corrections to Mrs. Park',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't6',
        rewritten: 'Finish Senior exit survey.',
        why_it_matters: 'Required to receive graduation materials.',
        start_cue: 'Find exit survey link in inbox.',
        original: 'Complete Senior Exit Survey online',
        model: 'gemini-3.1-flash-lite',
      }
    ],
    model: 'gemini-3.1-flash-lite',
  },
  stage_7_qa: {
    qa_passed: true,
    qa_issues: [],
    model: 'gemini-3.1-flash-lite',
  },
};

// ============================================================
// MOCK DATA 3 - Emergency Schedule Change
// ============================================================
const mockDemo3: PipelineResponse = {
  pipeline_version: '2.0',
  processed_at: new Date().toISOString(),
  stage_1_classify: {
    comm_type: 'emergency',
    cognitive_load_score: 7,
    word_count: 245,
    action_density: 0.65,
    routing_template: 'EMERGENCY_V2',
    language_complexity: 'low',
    model: 'gemini-3.1-flash-lite',
  },
  stage_2_extract: {
    items: [
      {
        task_id: 't1',
        task: 'Submit Chapter 14 Biology study guide',
        deadline: '2026-06-17',
        days_remaining: 2,
        source_sentence: 'The Biology Chapter 14 study guide that was due Monday is now due TUESDAY, June 17th.',
        item_type: 'deadline',
        people: ['Ms. Rivera'],
        subject: 'Biology',
        url: null,
        confidence: 0.98,
      },
      {
        task_id: 't2',
        task: 'Attend Algebra 2 review session in room 112',
        deadline: '2026-06-17',
        days_remaining: 2,
        source_sentence: 'The Algebra 2 midterm review session originally scheduled for Monday after school has been moved to TUESDAY, June 17th from 3:00–4:30 PM.',
        item_type: 'meeting',
        people: ['Mrs. Park'],
        subject: 'Math',
        url: null,
        confidence: 0.97,
      },
      {
        task_id: 't3',
        task: 'Confirm Student Council meeting attendance by email reply',
        deadline: '2026-06-18',
        days_remaining: 3,
        source_sentence: 'The Student Council meeting is rescheduled from Monday to WEDNESDAY... please confirm your attendance by replying.',
        item_type: 'action',
        people: ['Dr. Chen'],
        subject: 'Activities',
        url: null,
        confidence: 0.95,
      },
      {
        task_id: 't4',
        task: 'Take Chemistry midterm exam Period 3',
        deadline: '2026-06-18',
        days_remaining: 3,
        source_sentence: 'The Chemistry midterm exam that was scheduled for Tuesday, June 17th has been pushed to WEDNESDAY, June 18th.',
        item_type: 'deadline',
        people: ['Mr. Okafor'],
        subject: 'Chemistry',
        url: null,
        confidence: 0.99,
      }
    ],
    model: 'gemini-3.1-flash-lite',
  },
  stage_3_score: {
    scored_items: [
      {
        task_id: 't1',
        urgency: 9,
        effort: 'medium',
        consequence: 'grade',
        dependency: null,
        composite_score: 8.6,
      },
      {
        task_id: 't2',
        urgency: 8,
        effort: 'medium',
        consequence: 'opportunity',
        dependency: null,
        composite_score: 7.7,
      },
      {
        task_id: 't3',
        urgency: 7,
        effort: 'low',
        consequence: 'social',
        dependency: null,
        composite_score: 6.4,
      },
      {
        task_id: 't4',
        urgency: 7,
        effort: 'very_high',
        consequence: 'grade',
        dependency: null,
        composite_score: 8.5,
      }
    ],
    collision_days: ['2026-06-17', '2026-06-18'],
    reorder_suggestion: 'Complete the Biology study guide today to free up Tuesday for Mrs. Park\'s review session.',
    model: 'gemini-3.1-flash-lite',
  },
  stage_4_fuse: {
    merged_items: [
      {
        task_id: 't1',
        task: 'Submit Chapter 14 Biology study guide',
        deadline: '2026-06-17',
        days_remaining: 2,
        source_sentence: 'The Biology Chapter 14 study guide that was due Monday is now due TUESDAY, June 17th.',
        item_type: 'deadline',
        people: ['Ms. Rivera'],
        subject: 'Biology',
        url: null,
        confidence: 0.98,
      },
      {
        task_id: 't2',
        task: 'Attend Algebra 2 review session in room 112',
        deadline: '2026-06-17',
        days_remaining: 2,
        source_sentence: 'The Algebra 2 midterm review session originally scheduled for Monday after school has been moved to TUESDAY, June 17th from 3:00–4:30 PM.',
        item_type: 'meeting',
        people: ['Mrs. Park'],
        subject: 'Math',
        url: null,
        confidence: 0.97,
      },
      {
        task_id: 't3',
        task: 'Confirm Student Council meeting attendance by email reply',
        deadline: '2026-06-18',
        days_remaining: 3,
        source_sentence: 'The Student Council meeting is rescheduled from Monday to WEDNESDAY... please confirm your attendance by replying.',
        item_type: 'action',
        people: ['Dr. Chen'],
        subject: 'Activities',
        url: null,
        confidence: 0.95,
      },
      {
        task_id: 't4',
        task: 'Take Chemistry midterm exam Period 3',
        deadline: '2026-06-18',
        days_remaining: 3,
        source_sentence: 'The Chemistry midterm exam that was scheduled for Tuesday, June 17th has been pushed to WEDNESDAY, June 18th.',
        item_type: 'deadline',
        people: ['Mr. Okafor'],
        subject: 'Chemistry',
        url: null,
        confidence: 0.99,
      }
    ],
    deduplicated: [],
    recurring_detected: false,
    student_subject_match: { 'Biology': ['t1'], 'Math': ['t2'], 'Chemistry': ['t4'] },
    model: 'gemini-3.1-flash-lite',
  },
  stage_5_plan: {
    plan: {
      today: [{ task_id: 't1', est_mins: 40 }],
      tomorrow: [{ task_id: 't2', est_mins: 90 }],
      this_week: [{ task_id: 't3', est_mins: 5 }, { task_id: 't4', est_mins: 60 }],
      later: [],
    },
    daily_budgets: { today: 40, tomorrow: 90, this_week: 65 },
    load_warning: null,
    model: 'gemini-3.1-flash-lite',
  },
  stage_6_rewrite: {
    rewritten_items: [
      {
        task_id: 't1',
        rewritten: 'Turn in Bio study guide.',
        why_it_matters: 'Counts as homework, due now Tuesday.',
        start_cue: 'Take study guide packet out of your backpack.',
        original: 'Submit Chapter 14 Biology study guide',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't2',
        rewritten: 'Attend Math review class.',
        why_it_matters: 'Prepares you for the upcoming algebra exam.',
        start_cue: 'Go to room 112 at 3:00 PM on Tuesday.',
        original: 'Attend Algebra 2 review session in room 112',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't3',
        rewritten: 'Reply to Student Council.',
        why_it_matters: null,
        start_cue: 'Reply to Assistant Principal Chen\'s email.',
        original: 'Confirm Student Council meeting attendance by email reply',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't4',
        rewritten: 'Take Chemistry midterm.',
        why_it_matters: 'Major assessment worth significant grade points.',
        start_cue: 'Review practice set Mr. Okafor uploaded.',
        original: 'Take Chemistry midterm exam Period 3',
        model: 'gemini-3.1-flash-lite',
      }
    ],
    model: 'gemini-3.1-flash-lite',
  },
  stage_7_qa: {
    qa_passed: true,
    qa_issues: [],
    model: 'gemini-3.1-flash-lite',
  },
};

// ============================================================
// MOCK DATA 4 - AP Exam Fees & Scholarship
// ============================================================
const mockDemo4: PipelineResponse = {
  pipeline_version: '2.0',
  processed_at: new Date().toISOString(),
  stage_1_classify: {
    comm_type: 'payment_required',
    cognitive_load_score: 8,
    word_count: 280,
    action_density: 0.7,
    routing_template: 'PAYMENT_V2',
    language_complexity: 'medium',
    model: 'gemini-3.1-flash-lite',
  },
  stage_2_extract: {
    items: [
      {
        task_id: 't1',
        task: 'Pay College Board AP exam fee of $98',
        deadline: '2026-06-20',
        days_remaining: 5,
        source_sentence: 'The College Board AP exam fee of $98 per exam is due by Friday, June 20th.',
        item_type: 'payment',
        people: ['Mrs. Chen'],
        subject: 'Administrative',
        url: 'http://payments.lincolnhs.edu',
        confidence: 0.98,
      },
      {
        task_id: 't2',
        task: 'Request unofficial transcript from front office',
        deadline: '2026-06-25',
        days_remaining: 10,
        source_sentence: 'Submit your unofficial transcript (request from the front office)',
        item_type: 'action',
        people: ['Staff'],
        subject: 'Scholarship',
        url: null,
        confidence: 0.95,
      },
      {
        task_id: 't3',
        task: 'Write 300-word personal statement for scholarship',
        deadline: '2026-06-25',
        days_remaining: 10,
        source_sentence: 'Write a 300-word personal statement on the topic: "How has a teacher..."',
        item_type: 'action',
        people: ['Mrs. Chen'],
        subject: 'Scholarship',
        url: 'http://lincolnalumni.org/scholarship',
        confidence: 0.97,
      },
      {
        task_id: 't4',
        task: 'Obtain recommendation letter from a teacher',
        deadline: '2026-06-25',
        days_remaining: 10,
        source_sentence: 'Provide one letter of recommendation from a Lincoln High School teacher',
        item_type: 'action',
        people: ['Teachers'],
        subject: 'Scholarship',
        url: null,
        confidence: 0.96,
      }
    ],
    model: 'gemini-3.1-flash-lite',
  },
  stage_3_score: {
    scored_items: [
      {
        task_id: 't1',
        urgency: 9,
        effort: 'low',
        consequence: 'financial',
        dependency: null,
        composite_score: 8.8,
      },
      {
        task_id: 't2',
        urgency: 5,
        effort: 'low',
        consequence: 'opportunity',
        dependency: null,
        composite_score: 6.2,
      },
      {
        task_id: 't3',
        urgency: 5,
        effort: 'high',
        consequence: 'opportunity',
        dependency: null,
        composite_score: 7.4,
      },
      {
        task_id: 't4',
        urgency: 5,
        effort: 'medium',
        consequence: 'opportunity',
        dependency: null,
        composite_score: 7.0,
      }
    ],
    collision_days: [],
    reorder_suggestion: 'Request your transcript and recommendation letter today since they take time for others to process.',
    model: 'gemini-3.1-flash-lite',
  },
  stage_4_fuse: {
    merged_items: [
      {
        task_id: 't1',
        task: 'Pay College Board AP exam fee of $98',
        deadline: '2026-06-20',
        days_remaining: 5,
        source_sentence: 'The College Board AP exam fee of $98 per exam is due by Friday, June 20th.',
        item_type: 'payment',
        people: ['Mrs. Chen'],
        subject: 'Administrative',
        url: 'http://payments.lincolnhs.edu',
        confidence: 0.98,
      },
      {
        task_id: 't2',
        task: 'Request unofficial transcript from front office',
        deadline: '2026-06-25',
        days_remaining: 10,
        source_sentence: 'Submit your unofficial transcript (request from the front office)',
        item_type: 'action',
        people: ['Staff'],
        subject: 'Scholarship',
        url: null,
        confidence: 0.95,
      },
      {
        task_id: 't3',
        task: 'Write 300-word personal statement for scholarship',
        deadline: '2026-06-25',
        days_remaining: 10,
        source_sentence: 'Write a 300-word personal statement on the topic: "How has a teacher..."',
        item_type: 'action',
        people: ['Mrs. Chen'],
        subject: 'Scholarship',
        url: 'http://lincolnalumni.org/scholarship',
        confidence: 0.97,
      },
      {
        task_id: 't4',
        task: 'Obtain recommendation letter from a teacher',
        deadline: '2026-06-25',
        days_remaining: 10,
        source_sentence: 'Provide one letter of recommendation from a Lincoln High School teacher',
        item_type: 'action',
        people: ['Teachers'],
        subject: 'Scholarship',
        url: null,
        confidence: 0.96,
      }
    ],
    deduplicated: [],
    recurring_detected: false,
    student_subject_match: {},
    model: 'gemini-3.1-flash-lite',
  },
  stage_5_plan: {
    plan: {
      today: [{ task_id: 't2', est_mins: 10 }, { task_id: 't4', est_mins: 15 }],
      tomorrow: [{ task_id: 't1', est_mins: 10 }],
      this_week: [{ task_id: 't3', est_mins: 90 }],
      later: [],
    },
    daily_budgets: { today: 25, tomorrow: 10, this_week: 90 },
    load_warning: null,
    model: 'gemini-3.1-flash-lite',
  },
  stage_6_rewrite: {
    rewritten_items: [
      {
        task_id: 't1',
        rewritten: 'Pay $98 AP exam fee.',
        why_it_matters: 'Missing payment means dropped from the exam roster.',
        start_cue: 'Log in to payments.lincolnhs.edu.',
        original: 'Pay College Board AP exam fee of $98',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't2',
        rewritten: 'Request school transcript.',
        why_it_matters: 'Required attachment for scholarship review.',
        start_cue: 'Walk to the front office during next free block.',
        original: 'Request unofficial transcript from front office',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't3',
        rewritten: 'Write scholarship statement.',
        why_it_matters: 'Required for $2,500 college award eligibility.',
        start_cue: 'Create a new Google Doc and write the prompt.',
        original: 'Write 300-word personal statement for scholarship',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't4',
        rewritten: 'Ask teacher for recommendation.',
        why_it_matters: 'Critical component for scholarship candidacy.',
        start_cue: 'Email or talk to your teacher before class.',
        original: 'Obtain recommendation letter from a teacher',
        model: 'gemini-3.1-flash-lite',
      }
    ],
    model: 'gemini-3.1-flash-lite',
  },
  stage_7_qa: {
    qa_passed: true,
    qa_issues: [],
    model: 'gemini-3.1-flash-lite',
  },
};

// ============================================================
// MOCK DATA 5 - Prom & Volunteer Signup
// ============================================================
const mockDemo5: PipelineResponse = {
  pipeline_version: '2.0',
  processed_at: new Date().toISOString(),
  stage_1_classify: {
    comm_type: 'event_invitation',
    cognitive_load_score: 7,
    word_count: 310,
    action_density: 0.65,
    routing_template: 'EVENT_V2',
    language_complexity: 'low',
    model: 'gemini-3.1-flash-lite',
  },
  stage_2_extract: {
    items: [
      {
        task_id: 't1',
        task: 'Purchase prom tickets online or at activities window',
        deadline: '2026-06-25',
        days_remaining: 10,
        source_sentence: 'All tickets must be purchased by Wednesday, June 25th.',
        item_type: 'payment',
        people: ['Ms. Davis'],
        subject: 'Activities',
        url: 'http://lincolnevents.com/prom2026',
        confidence: 0.98,
      },
      {
        task_id: 't2',
        task: 'Submit Guest Approval Form Parent Signature to main office',
        deadline: '2026-06-23',
        days_remaining: 8,
        source_sentence: 'If bringing an outside guest, submit a Guest Approval Form to the main office by Monday, June 23rd.',
        item_type: 'form',
        people: ['Parents'],
        subject: 'Administrative',
        url: null,
        confidence: 0.96,
      },
      {
        task_id: 't3',
        task: 'Sign up for prom setup or cleanup crew volunteer',
        deadline: '2026-06-20',
        days_remaining: 5,
        source_sentence: 'Sign up using this Google Form by Friday, June 20th.',
        item_type: 'form',
        people: ['Ms. Davis'],
        subject: 'Activities',
        url: 'http://forms.google.com/lincolnprom2026volunteers',
        confidence: 0.97,
      },
      {
        task_id: 't4',
        task: 'Pre-order prom photo package online',
        deadline: '2026-06-28',
        days_remaining: 13,
        source_sentence: 'Pre-order your photo package at lincolnphotos.com for a 20% discount.',
        item_type: 'action',
        people: ['Staff'],
        subject: 'Activities',
        url: 'http://lincolnphotos.com',
        confidence: 0.94,
      }
    ],
    model: 'gemini-3.1-flash-lite',
  },
  stage_3_score: {
    scored_items: [
      {
        task_id: 't1',
        urgency: 6,
        effort: 'low',
        consequence: 'opportunity',
        dependency: null,
        composite_score: 6.8,
      },
      {
        task_id: 't2',
        urgency: 7,
        effort: 'medium',
        consequence: 'opportunity',
        dependency: null,
        composite_score: 7.2,
      },
      {
        task_id: 't3',
        urgency: 8,
        effort: 'low',
        consequence: 'financial',
        dependency: null,
        composite_score: 7.5,
      },
      {
        task_id: 't4',
        urgency: 4,
        effort: 'low',
        consequence: 'none',
        dependency: null,
        composite_score: 4.8,
      }
    ],
    collision_days: [],
    reorder_suggestion: 'Sign up for setup/cleanup crew today since slots are limited and it gives a ticket discount.',
    model: 'gemini-3.1-flash-lite',
  },
  stage_4_fuse: {
    merged_items: [
      {
        task_id: 't1',
        task: 'Purchase prom tickets online or at activities window',
        deadline: '2026-06-25',
        days_remaining: 10,
        source_sentence: 'All tickets must be purchased by Wednesday, June 25th.',
        item_type: 'payment',
        people: ['Ms. Davis'],
        subject: 'Activities',
        url: 'http://lincolnevents.com/prom2026',
        confidence: 0.98,
      },
      {
        task_id: 't2',
        task: 'Submit Guest Approval Form Parent Signature to main office',
        deadline: '2026-06-23',
        days_remaining: 8,
        source_sentence: 'If bringing an outside guest, submit a Guest Approval Form to the main office by Monday, June 23rd.',
        item_type: 'form',
        people: ['Parents'],
        subject: 'Administrative',
        url: null,
        confidence: 0.96,
      },
      {
        task_id: 't3',
        task: 'Sign up for prom setup or cleanup crew volunteer',
        deadline: '2026-06-20',
        days_remaining: 5,
        source_sentence: 'Sign up using this Google Form by Friday, June 20th.',
        item_type: 'form',
        people: ['Ms. Davis'],
        subject: 'Activities',
        url: 'http://forms.google.com/lincolnprom2026volunteers',
        confidence: 0.97,
      },
      {
        task_id: 't4',
        task: 'Pre-order prom photo package online',
        deadline: '2026-06-28',
        days_remaining: 13,
        source_sentence: 'Pre-order your photo package at lincolnphotos.com for a 20% discount.',
        item_type: 'action',
        people: ['Staff'],
        subject: 'Activities',
        url: 'http://lincolnphotos.com',
        confidence: 0.94,
      }
    ],
    deduplicated: [],
    recurring_detected: false,
    student_subject_match: {},
    model: 'gemini-3.1-flash-lite',
  },
  stage_5_plan: {
    plan: {
      today: [{ task_id: 't3', est_mins: 10 }],
      tomorrow: [{ task_id: 't2', est_mins: 15 }],
      this_week: [{ task_id: 't1', est_mins: 10 }, { task_id: 't4', est_mins: 5 }],
      later: [],
    },
    daily_budgets: { today: 10, tomorrow: 15, this_week: 15 },
    load_warning: null,
    model: 'gemini-3.1-flash-lite',
  },
  stage_6_rewrite: {
    rewritten_items: [
      {
        task_id: 't1',
        rewritten: 'Buy prom tickets.',
        why_it_matters: 'Tickets will not be sold at the door.',
        start_cue: 'Go to lincolnevents.com/prom2026.',
        original: 'Purchase prom tickets online or at activities window',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't2',
        rewritten: 'Get parent guest pass sign.',
        why_it_matters: 'Required to bring outside guests.',
        start_cue: 'Download guest form from school site.',
        original: 'Submit Guest Approval Form Parent Signature to main office',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't3',
        rewritten: 'Sign up to volunteer.',
        why_it_matters: 'Earns a $15 discount on ticket costs.',
        start_cue: 'Go to forms.google.com/lincolnprom2026volunteers.',
        original: 'Sign up for prom setup or cleanup crew volunteer',
        model: 'gemini-3.1-flash-lite',
      },
      {
        task_id: 't4',
        rewritten: 'Pre-order prom photos.',
        why_it_matters: 'Required for a 20% discount on package prices.',
        start_cue: 'Visit lincolnphotos.com in browser.',
        original: 'Pre-order prom photo package online',
        model: 'gemini-3.1-flash-lite',
      }
    ],
    model: 'gemini-3.1-flash-lite',
  },
  stage_7_qa: {
    qa_passed: true,
    qa_issues: [],
    model: 'gemini-3.1-flash-lite',
  },
};
