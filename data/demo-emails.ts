// ============================================================
// ActionPath - 5 Synthetic Demo Emails for Judging
// ============================================================

export interface DemoEmail {
  id: string;
  title: string;
  type: string;
  description: string;
  content: string;
}

export const DEMO_EMAILS: DemoEmail[] = [
  {
    id: 'demo-1',
    title: 'Biology Field Trip & Lab Fee',
    type: 'deadline_notice',
    description: 'Dense deadline notice with 3 buried action items, a form, and a payment',
    content: `Subject: Important - Biology Field Trip Details & Upcoming Lab Requirements

Dear Students and Families,

I hope this message finds you well as we approach the final weeks of the semester. I wanted to reach out with several important updates regarding our Biology class that require your attention and action.

First, I'm excited to announce that our annual field trip to the Riverside Wetland Preserve has been confirmed for Friday, June 20th. This is a wonderful opportunity for students to observe the ecosystems we've been studying in Chapter 14 firsthand. We will depart from the school parking lot at 8:15 AM and return by 2:30 PM. Students should wear closed-toe shoes and bring a water bottle and a packed lunch - the cafeteria will not be providing meals that day.

In order to attend, every student must return a signed permission slip to room 204 by Wednesday, June 18th. No exceptions will be made, as the bus company requires a final headcount 48 hours before departure. Permission slips were distributed in class last Tuesday, but if your student needs another copy, they can download one from our Google Classroom page under the "Field Trip" topic or pick one up from the front office. Please note that students who do not submit the form by the deadline will remain at school and be assigned alternative coursework.

Second, the lab supply fee of $15 for the dissection unit must be paid through the school's online payment portal by Thursday, June 19th. This fee covers the cost of specimens, gloves, and lab equipment. If this fee presents a financial hardship, please contact me privately at s.rivera@lincoln.edu or speak with Mrs. Chen in the counseling office - we have fee waivers available and I want every student to participate. Students who have not paid by the deadline will need to complete a virtual dissection module instead, which will be graded on the same rubric but does not offer the hands-on experience.

Third, a reminder that the Chapter 14 study guide is due on Monday, June 16th at the start of class. This study guide counts as a homework grade and will not be accepted late. The study guide can be found on Google Classroom under "Chapter 14 Materials." I strongly encourage students to complete it this weekend, as it directly prepares them for the unit exam on Wednesday, June 25th.

If you have any questions about any of the above, please don't hesitate to reach out. I'm available during office hours (Tuesday and Thursday, 3:00–4:00 PM) or by email.

Best regards,
Ms. Rivera
Biology, Periods 2 & 5
Lincoln High School`,
  },
  {
    id: 'demo-2',
    title: 'Weekly School Newsletter',
    type: 'general_update',
    description: 'Multi-subject newsletter with 5 action items across different classes',
    content: `Subject: Lincoln High Weekly Update - Week of June 16

Hello Lincoln Lions! 🦁

Here's everything happening this week. Please read carefully and mark your calendars!

📚 ACADEMICS
- English 10: Your poetry portfolio final draft is due Tuesday, June 17th. Submit via Google Classroom by 11:59 PM. Ms. Thompson will not accept late submissions as grades close Friday. The portfolio must include your three revised poems and the reflection essay (minimum 500 words). See the rubric posted in Classroom for formatting requirements.

- AP US History: The document-based question (DBQ) practice essay has been moved from Wednesday to Thursday, June 19th. Mr. Kowalski has posted new primary source documents in the shared Google Drive folder. Students should read all four documents before class. This is the last practice before the mock AP exam on June 23rd.

- Algebra 2: Chapter 12 test corrections are available for any student who scored below 80%. Corrections must be submitted to Mrs. Park by Friday, June 20th to receive half credit back. Show all work on a separate sheet of paper.

🎭 ACTIVITIES & EVENTS
- Spring Concert: The spring concert is this Thursday, June 19th at 7:00 PM in the auditorium. All band, choir, and orchestra students must arrive by 6:00 PM for warm-up. Concert attire is required (black pants/skirt, white top). Families are welcome - admission is free!

- Yearbook Distribution: Yearbooks will be distributed during lunch periods on Wednesday, June 18th and Thursday, June 19th in the commons area. Students who pre-ordered can pick theirs up with their student ID. Limited extra copies are available for $45 - first come, first served.

📋 ADMINISTRATIVE
- Senior Exit Survey: All seniors must complete the exit survey by Friday, June 20th. The link was emailed to your school account. Completion is required to receive your graduation materials.

- Summer Reading Lists: The English department has posted summer reading lists for all grade levels on the school website under "Academics > English Department." Students entering AP English should begin reading their assigned novel over the summer.

Stay focused, Lions - the finish line is in sight! 💪

- Principal Margaret Washington`,
  },
  {
    id: 'demo-3',
    title: 'Emergency Schedule Change',
    type: 'emergency',
    description: 'Urgent snow day makeup with rescheduled exam and shifted deadlines',
    content: `Subject: URGENT - Schedule Change Due to Monday Closure + Exam Reschedule

Dear Lincoln High School Community,

Due to the severe weather advisory issued for Monday, June 16th, school will be CLOSED. This is a mandatory closure - no students or staff should report to the building.

This closure affects several important deadlines and scheduled events. Please read the following changes carefully:

RESCHEDULED EVENTS:
1. The Biology Chapter 14 study guide that was due Monday is now due TUESDAY, June 17th at the start of class. Ms. Rivera has confirmed this extension.

2. The Algebra 2 midterm review session originally scheduled for Monday after school has been moved to TUESDAY, June 17th from 3:00–4:30 PM in room 112. Mrs. Park will be available for questions.

3. The Student Council meeting is rescheduled from Monday to WEDNESDAY, June 18th during lunch in the library. If you are a council member, please confirm your attendance by replying to this email.

IMPORTANT - EXAM IMPACT:
The Chemistry midterm exam that was scheduled for Tuesday, June 17th has been pushed to WEDNESDAY, June 18th, Period 3. Mr. Okafor has uploaded an additional practice problem set to Google Classroom to account for the extra study day. Students are strongly encouraged to complete it.

MAKE-UP WORK:
Any student who had an assessment or assignment due on Monday must submit it on Tuesday instead. Teachers will communicate any additional changes through Google Classroom.

REMINDERS:
- The school building will be open on Tuesday at the normal time (7:30 AM)
- All after-school activities resume on Tuesday unless your coach/advisor communicates otherwise
- Bus routes will run normally on Tuesday

Please check your email and Google Classroom on Monday evening for any additional updates. Stay safe and warm!

- Dr. James Chen, Assistant Principal
Lincoln High School`,
  },
  {
    id: 'demo-4',
    title: 'AP Exam Fees & Scholarship',
    type: 'payment_required',
    description: 'Financial deadlines with AP exam fee, scholarship application, and fee waiver info',
    content: `Subject: ACTION REQUIRED - AP Exam Fee Payment & Scholarship Opportunity

Dear AP Students and Families,

This email contains two time-sensitive items that require your action. Please read both sections completely.

═══════════════════════════════════════
SECTION 1: AP EXAM FEE PAYMENT
═══════════════════════════════════════

The College Board AP exam fee of $98 per exam is due by Friday, June 20th. Payment must be made through the school's online portal at payments.lincolnhs.edu.

If you are registered for multiple AP exams, each exam requires a separate payment. Your current registration:
- You can view your registered exams in your College Board account at myap.collegeboard.org

IMPORTANT: Students who do not pay by June 20th will be DROPPED from the exam roster and will NOT be able to take the exam. There are no extensions - this is a College Board deadline, not a school deadline.

FEE REDUCTION: Students who qualify for free or reduced lunch are eligible for a $53 fee reduction per exam ($45 instead of $98). If you believe you qualify but haven't applied, contact Mrs. Chen in the counseling office IMMEDIATELY - she needs to process the waiver before the payment deadline.

═══════════════════════════════════════
SECTION 2: LINCOLN LIONS SCHOLARSHIP
═══════════════════════════════════════

The Lincoln High School Alumni Association is offering three $2,500 scholarships for graduating seniors planning to attend a four-year college or university.

Application requirements:
1. Complete the online application at lincolnalumni.org/scholarship
2. Submit your unofficial transcript (request from the front office)
3. Write a 300-word personal statement on the topic: "How has a teacher at Lincoln High School shaped your future?"
4. Provide one letter of recommendation from a Lincoln High School teacher

APPLICATION DEADLINE: Wednesday, June 25th at 5:00 PM. Late applications will not be reviewed.

Recipients will be announced at the Senior Awards Ceremony on June 28th.

If you have questions about either item, please contact the counseling office at (555) 123-4567 or counseling@lincolnhs.edu.

Best regards,
Mrs. Patricia Chen
Director of College Counseling
Lincoln High School`,
  },
  {
    id: 'demo-5',
    title: 'Prom & Volunteer Signup',
    type: 'event_invitation',
    description: 'Event with ticket purchase, volunteer form, and dress code requirements',
    content: `Subject: Prom 2026 - Tickets, Volunteer Opportunities & What You Need to Know!

Hey Lions! 🎉

PROM IS COMING! Saturday, June 28th, 7:00 PM – 11:00 PM at The Grand Ballroom, 450 Riverside Drive. Here's everything you need to know:

🎟️ TICKETS
Tickets are $75 per person or $140 per couple. Purchase at the student activities window during lunch (Monday–Friday this week) or online at lincolnevents.com/prom2026. You MUST have your student ID to purchase.

TICKET DEADLINE: All tickets must be purchased by Wednesday, June 25th. NO tickets will be sold at the door.

Guest passes: If you're bringing a guest from outside Lincoln High, you must submit a Guest Approval Form to the main office by Monday, June 23rd. The form is available at the front desk or downloadable from the school website. Guests must be under 21 and the form requires a parent/guardian signature from both the student and the guest.

👗 DRESS CODE
- Formal attire required (suits, dresses, dress shoes)
- No sneakers, jeans, or casual wear
- All outfits must comply with the school dress code policy (no excessive revealing clothing)
- If you're unsure whether your outfit is appropriate, email photos to Ms. Davis at k.davis@lincoln.edu by June 25th for pre-approval

🙋 VOLUNTEER OPPORTUNITIES
We need 20 volunteers for setup and cleanup! Volunteers get a $15 discount on their ticket (refunded after the event).

- Setup crew: Saturday June 28th, 2:00 PM – 5:00 PM (decorating, table arrangement)
- Cleanup crew: Saturday June 28th, 11:00 PM – 12:30 AM (breakdown, trash, equipment return)

Sign up using this Google Form by Friday, June 20th: forms.google.com/lincolnprom2026volunteers

Parent chaperones are also welcome! Contact Ms. Davis if interested.

📸 PHOTO PACKAGES
Professional photos will be available at prom. Pre-order your photo package at lincolnphotos.com for a 20% discount (use code LIONS2026). Walk-up pricing will be higher.

Can't wait to see you all there! Let's make this a night to remember! ✨

- Student Council & Ms. Davis, Activities Coordinator`,
  },
];
