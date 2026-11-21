/*
 * Interactive prototype walkthroughs, "sliced" from the case-study screenshots.
 *
 * - img / w / h : the source screenshot and its pixel size
 * - screens[id].crop : {x,y,w,h} region of the screenshot to show (in source pixels)
 * - screens[id].notes : numbered pins. rect = [x,y,w,h] in SOURCE pixels (so you can read them straight off the image)
 * - screens[id].nav : clickable areas that jump to another screen (goto), e.g. tabs / bottom navigation
 * Edit freely — coordinates are all in the original image's pixel space.
 */
window.PROTOS = {
  'loan-collection-hub': {
    title: 'Try the Cust 360 workspace',
    hint: 'Click the tabs inside the screen (Billing & Collateral, Task Action) to move around, and tap the numbered pins to read the design decisions.',
    kind: 'desktop',
    start: 'activity',
    screens: {
      activity: {
        label: 'Activity List', img: 'images/upload-1782051434487-frame.png', w: 1920, h: 1080,
        crop: { x: 467, y: 40, w: 985, h: 999 },
        nav: [
          { label: 'Billing & Collateral', rect: [978, 286, 90, 20], goto: 'billing' },
          { label: 'Task Action', rect: [1070, 286, 62, 20], goto: 'task' },
        ],
        notes: [
          { rect: [655, 145, 238, 262], title: 'Persistent context sidebar', text: 'The customer profile stays pinned on the left no matter which tab the PIC opens — identity, a one-tap Call button, ID info and billing are always in view during a live call.' },
          { rect: [1187, 145, 251, 128], title: 'Proactive risk flagging', text: 'Blacklist, High Risk and PEP flags sit top-right with explicit red markers, so the PIC knows the risk level in seconds and can adapt the negotiation strategy.' },
          { rect: [669, 573, 224, 233], title: 'Dense but calm: accordions', text: 'ID Info and Billing & Outstanding collapse into accordions, keeping a lot of data on one screen without clutter. "Broken Promise" is surfaced as a status chip.' },
          { rect: [920, 353, 518, 220], title: 'Latest activity log', text: 'A chronological, scannable table of every interaction — who did what and the response — with pagination for heavy reading.' },
        ],
      },
      billing: {
        label: 'Billing & Collateral', img: 'images/upload-1782051447094-frame-02.png', w: 1920, h: 1080,
        crop: { x: 460, y: 30, w: 994, h: 1012 },
        nav: [
          { label: 'Activity List', rect: [916, 281, 58, 20], goto: 'activity' },
          { label: 'Task Action', rect: [1068, 281, 60, 20], goto: 'task' },
        ],
        notes: [
          { rect: [918, 352, 521, 118], title: 'Repayment breakdown', text: 'Principal, interest, late charge and other fees are laid out as one payment breakdown that rolls up to Total Billing — no calculator needed during the call.' },
          { rect: [918, 600, 521, 145], title: 'Payment history', text: 'Standardised data tables with the same column logic everywhere make heavy reading easy to scan.' },
          { rect: [918, 775, 521, 240], title: 'Collateral & guarantor', text: 'Collateral and guarantor details live next to billing, so deep-dive questions are answered without leaving the page.' },
        ],
      },
      task: {
        label: 'Task Action', img: 'images/upload-1782051457499-frame-03.png', w: 1920, h: 1080,
        crop: { x: 462, y: 33, w: 996, h: 1014 },
        nav: [
          { label: 'Activity List', rect: [918, 284, 58, 20], goto: 'activity' },
          { label: 'Billing & Collateral', rect: [982, 284, 84, 20], goto: 'billing' },
        ],
        notes: [
          { rect: [923, 316, 330, 44], title: 'One form, three jobs', text: 'Create activity, follow up a reminder, or transfer the task — one radio choice switches the whole form.' },
          { rect: [923, 375, 520, 100], title: 'Progressive disclosure', text: 'Action → Response → Detail Response are dependent dropdowns, so the PIC only sees valid options and logging errors drop.' },
          { rect: [923, 583, 520, 46], title: 'Proof upload', text: 'Drag-and-drop (or manual) proof of payment, right inside the same flow.' },
          { rect: [923, 660, 520, 48], title: 'Reminders in-line', text: 'Scheduling the next follow-up is part of logging the call, not a separate screen.' },
          { rect: [1283, 736, 160, 32], title: 'Clear primary action', text: 'Save is the single filled button; Cancel stays quiet. Notes can be typed while the customer profile remains visible.' },
        ],
      },
    },
  },

  'loan-collection-mobile': {
    title: 'Try the collector app',
    hint: 'Use the bottom navigation inside the phone (Home, Nasabah, Report) and tap the numbered pins for the thinking behind each screen.',
    kind: 'phone',
    start: 'home',
    screens: {
      home: {
        label: 'Home', img: 'images/upload-1782050469682-frame.png', w: 1920, h: 1080,
        crop: { x: 232, y: 144, w: 392, h: 840 },
        nav: [
          { label: 'Nasabah', rect: [348, 874, 70, 40], goto: 'clients' },
          { label: 'Report', rect: [438, 874, 70, 40], goto: 'report' },
        ],
        notes: [
          { rect: [260, 272, 336, 254], title: 'The command center', text: 'The "Target Kolektor" widget shows live progress against the daily quota — accounts assigned, total outstanding and collection progress — the first thing a collector sees.' },
          { rect: [260, 540, 336, 160], title: 'Priority first', text: 'Critical accounts rise to the top with a "10 Kritis" counter, status chips (Broken PTP) and a full-width Visit action, so the day\'s first target is obvious.' },
          { rect: [510, 282, 72, 32], title: 'Multi Visit', text: 'A shortcut for planning several visits at once on the same route.' },
        ],
      },
      clients: {
        label: 'Nasabah', img: 'images/upload-1782050469682-frame.png', w: 1920, h: 1080,
        crop: { x: 762, y: 138, w: 392, h: 840 },
        nav: [
          { label: 'Home', rect: [788, 868, 70, 40], goto: 'home' },
          { label: 'Report', rect: [968, 868, 70, 40], goto: 'report' },
        ],
        notes: [
          { rect: [790, 248, 336, 46], title: 'Search the pipeline', text: 'Quickly find a debtor by name among dozens of assigned accounts.' },
          { rect: [790, 304, 352, 34], title: 'Filter by status', text: 'Chips such as Broken Promise, Janji Bayar and No Action turn a long list into focused queues.' },
          { rect: [790, 396, 336, 160], title: 'Scannable account cards', text: 'Name, amount owed, days past due, status and distance share one card, with a single clear Visit button — plus a transfer action.' },
        ],
      },
      report: {
        label: 'Report', img: 'images/upload-1782050469682-frame.png', w: 1920, h: 1080,
        crop: { x: 1292, y: 131, w: 392, h: 840 },
        nav: [
          { label: 'Home', rect: [1318, 862, 70, 40], goto: 'home' },
          { label: 'Nasabah', rect: [1408, 862, 70, 40], goto: 'clients' },
        ],
        notes: [
          { rect: [1320, 252, 336, 90], title: 'Transparent performance', text: 'Total tasks at a glance, with a month filter — collectors can see how they are doing without asking anyone.' },
          { rect: [1320, 354, 336, 228], title: 'Colour-coded status', text: 'Not-yet-actioned, in progress and paid each get a colour and a big number, so progress reads instantly.' },
          { rect: [1320, 596, 336, 250], title: 'Activity breakdown', text: 'Successful vs. failed visits with a split bar and average visits per task — feedback that motivates.' },
        ],
      },
    },
  },

  'gen-ai-companion': {
    title: 'Chat with the AI companion',
    hint: 'Hit the send button or the retry button inside the phone to move through the states, and tap the pins to see how the mascot and tone of voice shape each one.',
    kind: 'phone',
    start: 'welcome',
    screens: {
      welcome: {
        label: 'Welcome', img: 'images/upload-1779623751646-screenshot-2026-05-24-at-18-55-28.png', w: 2904, h: 1626,
        crop: { x: 400, y: 391, w: 630, h: 1106 },
        nav: [{ label: 'Send "Analyze this customer"', rect: [918, 1376, 62, 62], goto: 'analysis' }],
        notes: [
          { rect: [610, 523, 232, 203], title: 'A mascot, not a chatbot', text: 'A friendly mascot humanises the AI, builds emotional trust and lowers resistance — it feels like a teammate rather than a tool.' },
          { rect: [494, 820, 430, 44], title: 'Personal, calm greeting', text: 'The AI greets the analyst by name. Friendly but professional, calm and supportive — never authoritative.' },
          { rect: [438, 1241, 555, 211], title: 'Natural-language input', text: 'Analysts simply ask in plain language, with an upload option for extra context, instead of hunting through menus.' },
        ],
      },
      analysis: {
        label: 'Analysis', img: 'images/upload-1779623751646-screenshot-2026-05-24-at-18-55-28.png', w: 2904, h: 1626,
        crop: { x: 1139, y: 391, w: 630, h: 1106 },
        nav: [{ label: 'Close', rect: [1682, 437, 40, 40], goto: 'welcome' }],
        notes: [
          { rect: [1440, 518, 270, 61], title: 'The analyst stays in control', text: 'The request is shown as the analyst\'s own message, so the conversation stays human-led.' },
          { rect: [1194, 634, 497, 90], title: 'Signals made readable', text: 'A clear title and a "Heads up, we found a potential risk" line translate AI output into something an analyst understands quickly — reducing alert overload.' },
          { rect: [1194, 788, 497, 330], title: 'Explained, not just flagged', text: 'Each risk comes with a reason (unusual amount, location mismatch, receiver alert), which builds confidence in the recommendation.' },
          { rect: [1194, 1166, 490, 70], title: 'Human in the loop', text: 'The system note says it processed automatically but "needs a human touch" — supporting analysts instead of replacing them.' },
        ],
      },
      error: {
        label: 'Error state', img: 'images/upload-1779623751646-screenshot-2026-05-24-at-18-55-28.png', w: 2904, h: 1626,
        crop: { x: 1878, y: 391, w: 630, h: 1106 },
        nav: [{ label: 'Retry', rect: [2073, 1253, 241, 74], goto: 'analysis' }],
        notes: [
          { rect: [2091, 563, 196, 180], title: 'Failure with empathy', text: 'The mascot looks apologetic — errors stay approachable and keep trust intact.' },
          { rect: [1968, 868, 453, 272], title: 'Plain-language recovery', text: '"Oops, Sorry!" explains what happened without jargon and tells the user what to do next.' },
          { rect: [2073, 1253, 241, 74], title: 'One clear action', text: 'A single Retry button, so there is no dead end.' },
        ],
      },
    },
  },

  'drag-and-drop-interface': {
    title: 'From rigid forms to drag-and-drop',
    hint: 'Start on the old workflow: click "Create Form" and the old modal appears, close it, then switch to the redesigned Form Generator and tap the pins.',
    kind: 'desktop',
    start: 'before',
    screens: {
      before: {
        label: 'Before', img: 'images/upload-1779625883026-screenshot-2026-05-24-at-19-33-00.png', w: 2794, h: 1274,
        crop: { x: 176, y: 405, w: 1148, h: 620 },
        nav: [{ label: 'Create Form', rect: [401, 515, 104, 34], goto: 'modal' }],
        notes: [
          { rect: [401, 515, 290, 34], title: 'Everything starts with a button', text: 'To add anything, the user must press "Create Form" and go through a chain of steps — the workflow is rigid.' },
          { rect: [468, 636, 763, 112], title: 'No sense of the end result', text: 'Fields are configured as abstract inputs, so the user has to guess how the final form will look.' },
          { rect: [182, 489, 181, 482], title: 'Deep, text-heavy navigation', text: 'A long nested sidebar makes the tool feel heavy before the real work even begins.' },
        ],
      },
      modal: {
        label: 'Old modal flow', img: 'images/upload-1779625883026-screenshot-2026-05-24-at-19-33-00.png', w: 2794, h: 1274,
        crop: { x: 1412, y: 405, w: 1163, h: 620 },
        nav: [{ label: 'Close', rect: [1968, 816, 44, 28], goto: 'before' }],
        notes: [
          { rect: [1838, 550, 307, 332], title: 'One field = one modal', text: 'Each field is added through a dialog: choose the type, fill it in, submit, repeat. It is slow and loses context.' },
          { rect: [1857, 759, 172, 31], title: 'A patch for repetition', text: '"Create another" exists only to soften how repetitive the process is.' },
        ],
      },
      after: {
        label: 'After: Form Generator', img: 'images/upload-1779625582691-screenshot-2026-05-24-at-19-28-01.png', w: 2908, h: 1634,
        crop: { x: 302, y: 167, w: 2307, h: 1302 },
        nav: [],
        notes: [
          { rect: [2043, 502, 566, 967], title: 'Always-visible toolbox', text: 'The right-hand panel exposes every component — Text Box, Dropdown, Date, File Upload, Camera and more — so there are no hidden menus.' },
          { rect: [518, 737, 1393, 89], title: 'Direct manipulation', text: 'Drag a component and drop it onto the canvas. The drop zone tells you exactly what to do.' },
          { rect: [490, 545, 1447, 310], title: 'Real-time canvas', text: 'A true WYSIWYG section: what you see is what you get, so no more guessing how the form will look.' },
          { rect: [441, 587, 32, 35], title: 'Reorder by dragging', text: 'Sections have a drag handle, keeping the whole structure editable by direct manipulation.' },
          { rect: [935, 881, 577, 55], title: 'Grow the form', text: 'Add more forms or notifications right below the canvas, without leaving the page.' },
          { rect: [2247, 403, 330, 61], title: 'Preview and save', text: 'Preview and Save sit at the top right, always one click away.' },
        ],
      },
    },
  },
};
