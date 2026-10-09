/**
 * ============================================================================
 * FACULTY HUB – Core Application Logic
 * 100% Fully Functional, Interactive ES6+ Vanilla JavaScript Architecture
 * Zero External JS Framework Dependencies
 * ============================================================================
 */

(function () {
  'use strict';

  /* ========================================================================
     1. CONSTANTS & DOMAINS
     ======================================================================== */
  const STORAGE_DATA_KEY = 'fh_academic_data_v2';
  const STORAGE_AUTH_KEY = 'fh_academic_session_v2';

  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  const SLOTS = [
    { id: 1, label: '9:00 – 10:00 AM',  shortLabel: '9 – 10 AM',  start: '09:00', end: '10:00', lunch: false },
    { id: 2, label: '10:00 – 11:00 AM', shortLabel: '10 – 11 AM', start: '10:00', end: '11:00', lunch: false },
    { id: 3, label: '11:00 – 12:00 PM', shortLabel: '11 – 12 PM', start: '11:00', end: '12:00', lunch: false },
    { id: 4, label: '12:00 – 1:00 PM',  shortLabel: '12 – 1 PM',  start: '12:00', end: '13:00', lunch: false },
    { id: 5, label: '1:00 – 2:00 PM',   shortLabel: '1 – 2 PM',   start: '13:00', end: '14:00', lunch: true  }, // Lunch Break
    { id: 6, label: '2:00 – 3:00 PM',   shortLabel: '2 – 3 PM',   start: '14:00', end: '15:00', lunch: false },
    { id: 7, label: '3:00 – 4:00 PM',   shortLabel: '3 – 4 PM',   start: '15:00', end: '16:00', lunch: false },
    { id: 8, label: '4:00 – 5:00 PM',   shortLabel: '4 – 5 PM',   start: '16:00', end: '17:00', lunch: false },
  ];

  const DEPARTMENTS = ['CSE', 'ECE', 'Mathematics'];

  // Allowed Institutional Email Regex: @college.edu, @reva.edu.in, @*.edu, @*.edu.in, @*.ac.in
  const INSTITUTIONAL_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*(college\.edu|reva\.edu\.in|edu|edu\.in|ac\.in)$/i;
  const PERSONAL_EMAIL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'mail.com'];

  /* ========================================================================
     2. INITIAL SEED DATA
     ======================================================================== */
  const SEED_DATA = {
    faculty: [
      // CSE Department
      { id: 'f1', name: 'Dr. Arvind Sharma',  department: 'CSE',         designation: 'Professor & HOD',      email: 'admin@college.edu',     maxHours: 16, role: 'admin' },
      { id: 'f2', name: 'Prof. Robert Vance', department: 'CSE',         designation: 'Associate Professor',  email: 'robert.cs@college.edu', maxHours: 16, role: 'faculty' },
      { id: 'f3', name: 'Prof. Rajesh Kumar', department: 'CSE',         designation: 'Assistant Professor',  email: 'rajesh.cs@college.edu', maxHours: 18, role: 'faculty' },
      { id: 'f4', name: 'Dr. Priya Desai',    department: 'CSE',         designation: 'Assistant Professor',  email: 'priya.cs@college.edu',  maxHours: 16, role: 'faculty' },
      { id: 'f5', name: 'Prof. Anil Gupta',   department: 'CSE',         designation: 'Lecturer',             email: 'anil.cs@college.edu',   maxHours: 18, role: 'faculty' },

      // ECE Department
      { id: 'f6', name: 'Dr. Sarah Jenkins',  department: 'ECE',         designation: 'Assistant Professor',  email: 'sarah.ece@college.edu', maxHours: 16, role: 'faculty' },
      { id: 'f7', name: 'Prof. Michael Chang', department: 'ECE',        designation: 'Associate Professor',  email: 'michael.ece@college.edu', maxHours: 16, role: 'faculty' },
      { id: 'f8', name: 'Dr. Sunita Rao',     department: 'ECE',         designation: 'Professor',            email: 'sunita.ece@college.edu', maxHours: 14, role: 'faculty' },

      // Mathematics Department
      { id: 'f9',  name: 'Prof. Vikram Joshi', department: 'Mathematics', designation: 'Associate Professor',  email: 'vikram.math@college.edu', maxHours: 16, role: 'faculty' },
      { id: 'f10', name: 'Dr. Kavita Menon',   department: 'Mathematics', designation: 'Assistant Professor',  email: 'kavita.math@college.edu', maxHours: 16, role: 'faculty' },
    ],

    subjects: [
      // CSE
      { id: 's1', code: 'CS101', name: 'Data Structures & Algorithms', department: 'CSE', hoursPerWeek: 4 },
      { id: 's2', code: 'CS201', name: 'Design & Analysis of Algorithms', department: 'CSE', hoursPerWeek: 3 },
      { id: 's3', code: 'CS301', name: 'Database Management Systems',  department: 'CSE', hoursPerWeek: 3 },
      { id: 's4', code: 'CS401', name: 'Operating Systems',            department: 'CSE', hoursPerWeek: 4 },
      { id: 's5', code: 'CS501', name: 'Computer Networks',            department: 'CSE', hoursPerWeek: 3 },
      { id: 's6', code: 'CS601', name: 'Artificial Intelligence & ML', department: 'CSE', hoursPerWeek: 3 },
      
      // ECE
      { id: 's7', code: 'EC101', name: 'Digital Electronics',          department: 'ECE', hoursPerWeek: 4 },
      { id: 's8', code: 'EC201', name: 'Signals & Linear Systems',     department: 'ECE', hoursPerWeek: 3 },
      { id: 's9', code: 'EC301', name: 'Microprocessors & VLSI',       department: 'ECE', hoursPerWeek: 3 },

      // Mathematics
      { id: 's10', code: 'MA101', name: 'Engineering Calculus',        department: 'Mathematics', hoursPerWeek: 4 },
      { id: 's11', code: 'MA201', name: 'Linear Algebra & Discrete Math', department: 'Mathematics', hoursPerWeek: 3 },
      { id: 's12', code: 'MA301', name: 'Probability & Statistics',    department: 'Mathematics', hoursPerWeek: 3 },
    ],

    // Pre-loaded balanced schedules (Slot 5 is lunch)
    schedules: [
      // f1 Sharma (CSE) - 16 hrs (Overloaded / At Cap)
      { id: 'e01', facultyId: 'f1', subjectId: 's1', room: 'Room 101', day: 'Monday',    slotId: 1 },
      { id: 'e02', facultyId: 'f1', subjectId: 's1', room: 'Room 101', day: 'Monday',    slotId: 2 },
      { id: 'e03', facultyId: 'f1', subjectId: 's4', room: 'Room 101', day: 'Monday',    slotId: 3 },
      { id: 'e04', facultyId: 'f1', subjectId: 's4', room: 'Room 101', day: 'Tuesday',   slotId: 1 },
      { id: 'e05', facultyId: 'f1', subjectId: 's1', room: 'Room 101', day: 'Tuesday',   slotId: 2 },
      { id: 'e06', facultyId: 'f1', subjectId: 's4', room: 'Room 101', day: 'Tuesday',   slotId: 6 },
      { id: 'e07', facultyId: 'f1', subjectId: 's1', room: 'Room 101', day: 'Wednesday', slotId: 1 },
      { id: 'e08', facultyId: 'f1', subjectId: 's4', room: 'Room 101', day: 'Wednesday', slotId: 2 },
      { id: 'e09', facultyId: 'f1', subjectId: 's4', room: 'Room 101', day: 'Wednesday', slotId: 6 },
      { id: 'e10', facultyId: 'f1', subjectId: 's1', room: 'Room 101', day: 'Thursday',  slotId: 1 },
      { id: 'e11', facultyId: 'f1', subjectId: 's4', room: 'Room 101', day: 'Thursday',  slotId: 2 },
      { id: 'e12', facultyId: 'f1', subjectId: 's4', room: 'Room 101', day: 'Thursday',  slotId: 3 },
      { id: 'e13', facultyId: 'f1', subjectId: 's1', room: 'Room 101', day: 'Thursday',  slotId: 6 },
      { id: 'e14', facultyId: 'f1', subjectId: 's4', room: 'Room 101', day: 'Friday',    slotId: 1 },
      { id: 'e15', facultyId: 'f1', subjectId: 's1', room: 'Room 101', day: 'Friday',    slotId: 2 },
      { id: 'e16', facultyId: 'f1', subjectId: 's4', room: 'Room 101', day: 'Friday',    slotId: 3 },

      // f2 Vance (CSE) - 11 hrs (Balanced)
      { id: 'e17', facultyId: 'f2', subjectId: 's2', room: 'Room 204', day: 'Monday',    slotId: 4 },
      { id: 'e18', facultyId: 'f2', subjectId: 's3', room: 'Room 204', day: 'Monday',    slotId: 6 },
      { id: 'e19', facultyId: 'f2', subjectId: 's2', room: 'Room 204', day: 'Tuesday',   slotId: 3 },
      { id: 'e20', facultyId: 'f2', subjectId: 's3', room: 'Room 204', day: 'Tuesday',   slotId: 4 },
      { id: 'e21', facultyId: 'f2', subjectId: 's2', room: 'Room 204', day: 'Wednesday', slotId: 3 },
      { id: 'e22', facultyId: 'f2', subjectId: 's3', room: 'Room 204', day: 'Wednesday', slotId: 4 },
      { id: 'e23', facultyId: 'f2', subjectId: 's3', room: 'Room 204', day: 'Thursday',  slotId: 4 },
      { id: 'e24', facultyId: 'f2', subjectId: 's2', room: 'Room 204', day: 'Thursday',  slotId: 7 },
      { id: 'e25', facultyId: 'f2', subjectId: 's3', room: 'Room 204', day: 'Friday',    slotId: 4 },
      { id: 'e26', facultyId: 'f2', subjectId: 's2', room: 'Room 204', day: 'Friday',    slotId: 6 },
      { id: 'e27', facultyId: 'f2', subjectId: 's3', room: 'Room 204', day: 'Friday',    slotId: 7 },

      // f3 Kumar (CSE) - 12 hrs (Balanced)
      { id: 'e28', facultyId: 'f3', subjectId: 's5', room: 'Lab 2',    day: 'Monday',    slotId: 7 },
      { id: 'e29', facultyId: 'f3', subjectId: 's6', room: 'Lab 2',    day: 'Monday',    slotId: 8 },
      { id: 'e30', facultyId: 'f3', subjectId: 's5', room: 'Lab 2',    day: 'Tuesday',   slotId: 7 },
      { id: 'e31', facultyId: 'f3', subjectId: 's6', room: 'Lab 2',    day: 'Tuesday',   slotId: 8 },
      { id: 'e32', facultyId: 'f3', subjectId: 's5', room: 'Lab 2',    day: 'Wednesday', slotId: 7 },
      { id: 'e33', facultyId: 'f3', subjectId: 's6', room: 'Lab 2',    day: 'Wednesday', slotId: 8 },
      { id: 'e34', facultyId: 'f3', subjectId: 's5', room: 'Room 102', day: 'Thursday',  slotId: 6 },
      { id: 'e35', facultyId: 'f3', subjectId: 's6', room: 'Room 102', day: 'Thursday',  slotId: 8 },
      { id: 'e36', facultyId: 'f3', subjectId: 's5', room: 'Lab 2',    day: 'Friday',    slotId: 8 },
      { id: 'e37', facultyId: 'f3', subjectId: 's6', room: 'Room 102', day: 'Monday',    slotId: 3 },
      { id: 'e38', facultyId: 'f3', subjectId: 's6', room: 'Room 102', day: 'Tuesday',   slotId: 4 },
      { id: 'e39', facultyId: 'f3', subjectId: 's5', room: 'Room 102', day: 'Wednesday', slotId: 6 },

      // f4 Desai (CSE) - 8 hrs (Underloaded)
      { id: 'e40', facultyId: 'f4', subjectId: 's2', room: 'Room 102', day: 'Monday',    slotId: 6 },
      { id: 'e41', facultyId: 'f4', subjectId: 's3', room: 'Room 102', day: 'Tuesday',   slotId: 6 },
      { id: 'e42', facultyId: 'f4', subjectId: 's2', room: 'Room 102', day: 'Wednesday', slotId: 4 },
      { id: 'e43', facultyId: 'f4', subjectId: 's3', room: 'Room 102', day: 'Thursday',  slotId: 7 },
      { id: 'e44', facultyId: 'f4', subjectId: 's2', room: 'Room 102', day: 'Friday',    slotId: 6 },
      { id: 'e45', facultyId: 'f4', subjectId: 's3', room: 'Room 102', day: 'Friday',    slotId: 7 },
      { id: 'e46', facultyId: 'f4', subjectId: 's2', room: 'Room 102', day: 'Thursday',  slotId: 4 },
      { id: 'e47', facultyId: 'f4', subjectId: 's3', room: 'Room 102', day: 'Wednesday', slotId: 1 },

      // f5 Gupta (CSE) - 7 hrs (Underloaded)
      { id: 'e48', facultyId: 'f5', subjectId: 's5', room: 'Lab 1',    day: 'Monday',    slotId: 4 },
      { id: 'e49', facultyId: 'f5', subjectId: 's6', room: 'Lab 1',    day: 'Tuesday',   slotId: 1 },
      { id: 'e50', facultyId: 'f5', subjectId: 's5', room: 'Lab 1',    day: 'Tuesday',   slotId: 2 },
      { id: 'e51', facultyId: 'f5', subjectId: 's6', room: 'Lab 1',    day: 'Wednesday', slotId: 2 },
      { id: 'e52', facultyId: 'f5', subjectId: 's5', room: 'Lab 1',    day: 'Thursday',  slotId: 1 },
      { id: 'e53', facultyId: 'f5', subjectId: 's6', room: 'Lab 1',    day: 'Thursday',  slotId: 2 },
      { id: 'e54', facultyId: 'f5', subjectId: 's6', room: 'Lab 1',    day: 'Friday',    slotId: 1 },

      // f6 Jenkins (ECE) - 8 hrs (Underloaded)
      { id: 'e55', facultyId: 'f6', subjectId: 's7', room: 'Room 401', day: 'Monday',    slotId: 1 },
      { id: 'e56', facultyId: 'f6', subjectId: 's7', room: 'Room 401', day: 'Monday',    slotId: 2 },
      { id: 'e57', facultyId: 'f6', subjectId: 's8', room: 'Room 401', day: 'Tuesday',   slotId: 1 },
      { id: 'e58', facultyId: 'f6', subjectId: 's8', room: 'Room 401', day: 'Wednesday', slotId: 2 },
      { id: 'e59', facultyId: 'f6', subjectId: 's7', room: 'Room 401', day: 'Thursday',  slotId: 3 },
      { id: 'e60', facultyId: 'f6', subjectId: 's8', room: 'Room 401', day: 'Thursday',  slotId: 4 },
      { id: 'e61', facultyId: 'f6', subjectId: 's7', room: 'Room 401', day: 'Friday',    slotId: 2 },
      { id: 'e62', facultyId: 'f6', subjectId: 's8', room: 'Room 401', day: 'Friday',    slotId: 3 },

      // f7 Chang (ECE) - 11 hrs (Balanced)
      { id: 'e63', facultyId: 'f7', subjectId: 's9', room: 'Room 402', day: 'Monday',    slotId: 3 },
      { id: 'e64', facultyId: 'f7', subjectId: 's9', room: 'Room 402', day: 'Monday',    slotId: 4 },
      { id: 'e65', facultyId: 'f7', subjectId: 's8', room: 'Room 402', day: 'Tuesday',   slotId: 2 },
      { id: 'e66', facultyId: 'f7', subjectId: 's9', room: 'Room 402', day: 'Tuesday',   slotId: 3 },
      { id: 'e67', facultyId: 'f7', subjectId: 's9', room: 'Room 402', day: 'Wednesday', slotId: 3 },
      { id: 'e68', facultyId: 'f7', subjectId: 's8', room: 'Room 402', day: 'Wednesday', slotId: 4 },
      { id: 'e69', facultyId: 'f7', subjectId: 's9', room: 'Room 402', day: 'Thursday',  slotId: 1 },
      { id: 'e70', facultyId: 'f7', subjectId: 's8', room: 'Room 402', day: 'Thursday',  slotId: 2 },
      { id: 'e71', facultyId: 'f7', subjectId: 's9', room: 'Room 402', day: 'Friday',    slotId: 1 },
      { id: 'e72', facultyId: 'f7', subjectId: 's8', room: 'Room 402', day: 'Friday',    slotId: 4 },
      { id: 'e73', facultyId: 'f7', subjectId: 's9', room: 'Room 402', day: 'Wednesday', slotId: 6 },

      // f8 Rao (ECE) - 14 hrs (Overloaded / At Cap)
      { id: 'e74', facultyId: 'f8', subjectId: 's7', room: 'Room 401', day: 'Monday',    slotId: 3 },
      { id: 'e75', facultyId: 'f8', subjectId: 's7', room: 'Room 401', day: 'Monday',    slotId: 4 },
      { id: 'e76', facultyId: 'f8', subjectId: 's8', room: 'Room 401', day: 'Tuesday',   slotId: 3 },
      { id: 'e77', facultyId: 'f8', subjectId: 's8', room: 'Room 401', day: 'Tuesday',   slotId: 4 },
      { id: 'e78', facultyId: 'f8', subjectId: 's7', room: 'Room 401', day: 'Wednesday', slotId: 1 },
      { id: 'e79', facultyId: 'f8', subjectId: 's7', room: 'Room 401', day: 'Wednesday', slotId: 6 },
      { id: 'e80', facultyId: 'f8', subjectId: 's8', room: 'Room 401', day: 'Thursday',  slotId: 6 },
      { id: 'e81', facultyId: 'f8', subjectId: 's8', room: 'Room 401', day: 'Thursday',  slotId: 7 },
      { id: 'e82', facultyId: 'f8', subjectId: 's7', room: 'Room 401', day: 'Friday',    slotId: 6 },
      { id: 'e83', facultyId: 'f8', subjectId: 's8', room: 'Room 401', day: 'Friday',    slotId: 7 },
      { id: 'e84', facultyId: 'f8', subjectId: 's7', room: 'Room 401', day: 'Tuesday',   slotId: 6 },
      { id: 'e85', facultyId: 'f8', subjectId: 's8', room: 'Room 401', day: 'Tuesday',   slotId: 7 },
      { id: 'e86', facultyId: 'f8', subjectId: 's7', room: 'Room 401', day: 'Wednesday', slotId: 7 },
      { id: 'e87', facultyId: 'f8', subjectId: 's8', room: 'Room 401', day: 'Thursday',  slotId: 8 },

      // f9 Joshi (Math) - 10 hrs (Balanced)
      { id: 'e88', facultyId: 'f9', subjectId: 's10', room: 'Room 302', day: 'Monday',    slotId: 4 },
      { id: 'e89', facultyId: 'f9', subjectId: 's11', room: 'Room 302', day: 'Monday',    slotId: 6 },
      { id: 'e90', facultyId: 'f9', subjectId: 's10', room: 'Room 302', day: 'Tuesday',   slotId: 4 },
      { id: 'e91', facultyId: 'f9', subjectId: 's11', room: 'Room 302', day: 'Tuesday',   slotId: 8 },
      { id: 'e92', facultyId: 'f9', subjectId: 's10', room: 'Room 302', day: 'Wednesday', slotId: 4 },
      { id: 'e93', facultyId: 'f9', subjectId: 's11', room: 'Room 302', day: 'Wednesday', slotId: 7 },
      { id: 'e94', facultyId: 'f9', subjectId: 's10', room: 'Room 302', day: 'Thursday',  slotId: 4 },
      { id: 'e95', facultyId: 'f9', subjectId: 's11', room: 'Room 302', day: 'Thursday',  slotId: 8 },
      { id: 'e96', facultyId: 'f9', subjectId: 's10', room: 'Room 302', day: 'Friday',    slotId: 4 },
      { id: 'e97', facultyId: 'f9', subjectId: 's11', room: 'Room 302', day: 'Friday',    slotId: 7 },

      // f10 Menon (Math) - 6 hrs (Underloaded)
      { id: 'e98',  facultyId: 'f10', subjectId: 's11', room: 'Room 303', day: 'Monday',    slotId: 7 },
      { id: 'e99',  facultyId: 'f10', subjectId: 's12', room: 'Room 303', day: 'Monday',    slotId: 8 },
      { id: 'e100', facultyId: 'f10', subjectId: 's11', room: 'Room 303', day: 'Wednesday', slotId: 7 },
      { id: 'e101', facultyId: 'f10', subjectId: 's12', room: 'Room 303', day: 'Wednesday', slotId: 8 },
      { id: 'e102', facultyId: 'f10', subjectId: 's11', room: 'Room 303', day: 'Friday',    slotId: 7 },
      { id: 'e103', facultyId: 'f10', subjectId: 's12', room: 'Room 303', day: 'Friday',    slotId: 8 },
    ],

    absences: [],
    substitutions: []
  };

  /* ========================================================================
     3. HELPER FUNCTIONS
     ======================================================================== */
  function esc(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function uid(prefix = 'id') {
    return prefix + '-' + Math.random().toString(36).substring(2, 9);
  }

  function getInitials(name) {
    if (!name) return 'FH';
    const clean = name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.|Mrs\.)\s+/i, '').trim();
    const parts = clean.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function getSlotById(sid) {
    return SLOTS.find(s => s.id === sid);
  }

  function getDayFromDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T12:00:00');
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[d.getDay()];
  }

  function getTodayDateString() {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${m}-${dy}`;
  }

  let debounceTimer = null;
  function debounce(fn, ms = 200) {
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  /* ========================================================================
     4. STORE (State Management & LocalStorage Persistence)
     ======================================================================== */
  const Store = {
    data: null,

    init() {
      try {
        const raw = localStorage.getItem(STORAGE_DATA_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.faculty) && Array.isArray(parsed.subjects) && Array.isArray(parsed.schedules)) {
            this.data = parsed;
            if (!Array.isArray(this.data.absences)) this.data.absences = [];
            if (!Array.isArray(this.data.substitutions)) this.data.substitutions = [];
            return;
          }
        }
      } catch (e) {
        console.warn('LocalStorage error, restoring seed data.', e);
      }
      this.reset();
    },

    save() {
      try {
        localStorage.setItem(STORAGE_DATA_KEY, JSON.stringify(this.data));
      } catch (e) {
        Toast.show('LocalStorage save error', 'danger');
      }
    },

    reset() {
      this.data = JSON.parse(JSON.stringify(SEED_DATA));
      this.save();
    },

    faculty() { return this.data.faculty; },
    subjects() { return this.data.subjects; },
    schedules() { return this.data.schedules; },
    absences() { return this.data.absences; },
    substitutions() { return this.data.substitutions; },

    findFaculty(id) { return this.data.faculty.find(f => f.id === id); },
    findFacultyByEmail(email) {
      if (!email || typeof email !== 'string') return null;
      const normalized = email.trim().toLowerCase();
      if (!normalized) return null;
      return this.data.faculty.find(f => typeof f?.email === 'string' && f.email.toLowerCase() === normalized);
    },
    findSubject(id) { return this.data.subjects.find(s => s.id === id); },
    findSchedule(id) { return this.data.schedules.find(e => e.id === id); }
  };

  /* ========================================================================
     5. TOAST NOTIFICATION SYSTEM
     ======================================================================== */
  const Toast = {
    show(message, type = 'info', duration = 3500) {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;

      const icons = {
        success: '✅',
        danger: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      };

      toast.innerHTML = `
        <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
        <span class="toast-msg">${esc(message)}</span>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 200);
      }, duration);
    }
  };

  /* ========================================================================
     6. MODALS CONTROLLER (Show/Hide, Backdrop, Escape)
     ======================================================================== */
  const Modals = {
    backdrop: null,

    init() {
      this.backdrop = document.getElementById('modal-backdrop');

      // Close on Backdrop Click
      this.backdrop?.addEventListener('click', (e) => {
        if (e.target === this.backdrop) {
          this.closeAll();
        }
      });

      // Close on [data-close-modal] buttons
      document.addEventListener('click', (e) => {
        if (e.target.closest('[data-close-modal]')) {
          this.closeAll();
        }
      });

      // Close on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !this.backdrop?.classList.contains('hidden')) {
          this.closeAll();
        }
      });
    },

    open(modalId) {
      if (!this.backdrop) return;
      this.backdrop.classList.remove('hidden');

      // Hide all modals first
      this.backdrop.querySelectorAll('.modal-card').forEach(m => m.classList.add('hidden'));

      // Show requested modal
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('hidden');
      }
    },

    closeAll() {
      if (!this.backdrop) return;
      this.backdrop.classList.add('hidden');
      this.backdrop.querySelectorAll('.modal-card').forEach(m => m.classList.add('hidden'));
    },

    showAlert(title, messageHtml) {
      const titleEl = document.getElementById('modal-alert-title');
      const contentEl = document.getElementById('modal-alert-content');
      if (titleEl) titleEl.textContent = title;
      if (contentEl) contentEl.innerHTML = messageHtml;
      this.open('modal-alert');
    }
  };

  /* ========================================================================
     7. CONFLICT RESOLUTION & CLASH PREVENTION ENGINE
     ======================================================================== */
  const ConflictEngine = {
    validate(entry, ignoreEntryId = null) {
      const conflicts = [];
      const slot = getSlotById(entry.slotId);

      // 1. Strict Lunch Slot Blocker (Slot 5: 1:00 PM – 2:00 PM)
      if (slot && slot.lunch) {
        conflicts.push('<strong>Lunch Slot Conflict:</strong> The 1:00 PM – 2:00 PM slot is strictly reserved for faculty and student lunch break and cannot be booked.');
        return { ok: false, conflicts };
      }

      const schedules = Store.schedules();

      for (let i = 0; i < schedules.length; i++) {
        const e = schedules[i];
        if (ignoreEntryId && e.id === ignoreEntryId) continue;

        // Check if on same Day and Slot
        if (e.day === entry.day && e.slotId === entry.slotId) {
          
          // 2. Professor Double-Booking
          if (e.facultyId === entry.facultyId) {
            const fac = Store.findFaculty(e.facultyId);
            const sub = Store.findSubject(e.subjectId);
            conflicts.push(`<strong>Faculty Collision:</strong> ${fac ? fac.name : 'Faculty'} is already scheduled to teach <em>${sub ? sub.code : 'Class'}</em> in <em>${e.room}</em> on ${entry.day} during Slot ${entry.slotId}.`);
          }

          // 3. Room Double-Booking
          if ((e.room || '').trim().toLowerCase() === (entry.room || '').trim().toLowerCase()) {
            const fac = Store.findFaculty(e.facultyId);
            const sub = Store.findSubject(e.subjectId);
            conflicts.push(`<strong>Room Collision:</strong> Lecture Hall <em>${e.room}</em> is already occupied by ${fac ? fac.name : 'another faculty'} for <em>${sub ? sub.code : 'Class'}</em> on ${entry.day} during Slot ${entry.slotId}.`);
          }
        }
      }

      return {
        ok: conflicts.length === 0,
        conflicts
      };
    }
  };

  /* ========================================================================
     8. SMART SUBSTITUTION FINDER ENGINE
     ======================================================================== */
  const SubstitutionFinder = {
    findCandidates(scheduleEntry, dateStr) {
      const targetDay = scheduleEntry.day || getDayFromDate(dateStr);
      const slotId = scheduleEntry.slotId;
      const originalFaculty = Store.findFaculty(scheduleEntry.facultyId);
      const dept = originalFaculty ? originalFaculty.department : 'CSE';

      const facultyList = Store.faculty().filter(f => f.department === dept && f.id !== scheduleEntry.facultyId);
      const schedules = Store.schedules();
      const absences = Store.absences();

      const candidates = [];
      const reasons = { busy: 0, absent: 0, atCap: 0 };

      facultyList.forEach(fac => {
        // 1. Is marked absent on this date/slot?
        const isAbsent = absences.some(a => 
          a.facultyId === fac.id && 
          a.date === dateStr && 
          (a.slotId === null || a.slotId === slotId)
        );
        if (isAbsent) {
          reasons.absent++;
          return;
        }

        // 2. Already teaching on this day/slot?
        const isBusy = schedules.some(s => s.facultyId === fac.id && s.day === targetDay && s.slotId === slotId);
        if (isBusy) {
          reasons.busy++;
          return;
        }

        // 3. Current weekly workload check
        const weeklyHours = schedules.filter(s => s.facultyId === fac.id).length;
        if (weeklyHours >= (fac.maxHours || 16)) {
          reasons.atCap++;
          return;
        }

        candidates.push({
          faculty: fac,
          weeklyHours,
          availableCap: (fac.maxHours || 16) - weeklyHours
        });
      });

      // Rank by lowest weekly load first (balancing workload)
      candidates.sort((a, b) => a.weeklyHours - b.weeklyHours);

      return {
        candidates,
        reasons,
        dept
      };
    }
  };

  /* ========================================================================
     9. WORKLOAD ANALYTICS
     ======================================================================== */
  const WorkloadAnalytics = {
    calculateFacultyHours(facultyId) {
      const schedules = Store.schedules().filter(s => s.facultyId === facultyId);
      const dayBreakdown = { Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0 };
      
      schedules.forEach(s => {
        if (dayBreakdown[s.day] !== undefined) {
          dayBreakdown[s.day]++;
        }
      });

      return { total: schedules.length, dayBreakdown };
    },

    getStatus(totalHours, maxHours = 16) {
      if (totalHours >= maxHours) return { key: 'overloaded', label: 'Overloaded', class: 'overloaded' };
      if (totalHours < 10) return { key: 'underloaded', label: 'Underloaded', class: 'underloaded' };
      return { key: 'balanced', label: 'Balanced', class: 'balanced' };
    },

    getDepartmentSummary() {
      const faculty = Store.faculty();
      const schedules = Store.schedules();
      const substitutions = Store.substitutions();

      let overloadedCount = 0;
      let underloadedCount = 0;
      let balancedCount = 0;

      const deptStats = {};
      DEPARTMENTS.forEach(d => {
        deptStats[d] = { count: 0, hours: 0 };
      });

      faculty.forEach(f => {
        const hours = schedules.filter(s => s.facultyId === f.id).length;
        const status = this.getStatus(hours, f.maxHours);
        if (status.key === 'overloaded') overloadedCount++;
        else if (status.key === 'underloaded') underloadedCount++;
        else balancedCount++;

        if (deptStats[f.department]) {
          deptStats[f.department].count++;
          deptStats[f.department].hours += hours;
        }
      });

      return {
        totalFaculty: faculty.length,
        totalClasses: schedules.length,
        activeSubstitutions: substitutions.length,
        overloadedCount,
        underloadedCount,
        balancedCount,
        deptStats
      };
    }
  };

  /* ========================================================================
     10. AUTHENTICATION & ACCESS CONTROL
     ======================================================================== */
  const Auth = {
    currentUser: null,

    init() {
      try {
        const raw = localStorage.getItem(STORAGE_AUTH_KEY) || sessionStorage.getItem(STORAGE_AUTH_KEY);
        if (raw) {
          const session = JSON.parse(raw);
          if (session && session.user) {
            this.currentUser = session.user;
          }
        }
      } catch (e) {
        this.currentUser = null;
      }

      this.bindEvents();

      if (this.isAuthenticated()) {
        this.showDashboard();
      } else {
        this.showLogin();
      }
    },

    isAuthenticated() {
      return this.currentUser !== null;
    },

    isAdmin() {
      return this.currentUser && (this.currentUser.role === 'admin' || this.currentUser.email === 'admin@college.edu');
    },

    bindEvents() {
      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');
      const emailError = document.getElementById('login-email-error');
      const pwError = document.getElementById('login-password-error');
      const loginForm = document.getElementById('form-login');
      const togglePwBtn = document.getElementById('btn-toggle-password');
      const forgotPwBtn = document.getElementById('btn-forgot-password');
      const logoutBtn = document.getElementById('btn-logout');

      if (!emailInput || !passwordInput || !loginForm) return;

      // Email validation on blur and input
      const validateEmail = () => {
        const val = emailInput.value.trim();
        if (emailError) {
          emailError.style.display = 'none';
        }
        emailInput.classList.remove('is-invalid');

        if (!val) return false;

        const domain = (val.split('@')[1] || '').toLowerCase();
        if (PERSONAL_EMAIL_DOMAINS.includes(domain)) {
          if (emailError) {
            emailError.textContent = 'Please use your official college email address (*@college.edu or *@reva.edu.in). Personal domains (@gmail, @yahoo) are restricted.';
            emailError.style.display = 'block';
          }
          emailInput.classList.add('is-invalid');
          return false;
        }

        if (!INSTITUTIONAL_EMAIL_REGEX.test(val)) {
          if (emailError) {
            emailError.textContent = 'Institutional email required (*@college.edu, *@reva.edu.in, *@*.edu, *@*.ac.in).';
            emailError.style.display = 'block';
          }
          emailInput.classList.add('is-invalid');
          return false;
        }

        return true;
      };

      emailInput.addEventListener('input', debounce(validateEmail, 250));
      emailInput.addEventListener('blur', validateEmail);

      // Password Toggle
      togglePwBtn?.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        const iconSpan = document.getElementById('pw-toggle-text');
        if (iconSpan) {
          iconSpan.textContent = type === 'password' ? '👁️' : '🙈';
        }
      });

      // Quick Demo 1-Click Login Buttons
      document.querySelectorAll('.btn-demo').forEach(btn => {
        btn.addEventListener('click', () => {
          const email = btn.getAttribute('data-email');
          const pass = btn.getAttribute('data-pass');
          emailInput.value = email;
          passwordInput.value = pass;
          validateEmail();
          this.attemptLogin(email, pass, true);
        });
      });

      // Manual Login Submit
      loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        const pass = passwordInput.value;
        const remember = document.getElementById('login-remember')?.checked ?? true;

        if (!validateEmail()) {
          emailInput.focus();
          return;
        }

        if (!pass) {
          if (pwError) {
            pwError.textContent = 'Please enter your password.';
            pwError.style.display = 'block';
          }
          passwordInput.focus();
          return;
        } else if (pwError) {
          pwError.style.display = 'none';
        }

        this.attemptLogin(email, pass, remember);
      });

      // Forgot Password Modal Trigger
      forgotPwBtn?.addEventListener('click', () => {
        const fpInput = document.getElementById('fp-email-input');
        if (fpInput) fpInput.value = emailInput.value.trim();
        const feedback = document.getElementById('fp-feedback-box');
        if (feedback) feedback.classList.add('hidden');
        Modals.open('modal-forgot-pw');
      });

      // Send Password Reset
      document.getElementById('btn-send-pw-reset')?.addEventListener('click', () => {
        const email = document.getElementById('fp-email-input')?.value.trim();
        const feedback = document.getElementById('fp-feedback-box');
        if (!email || !INSTITUTIONAL_EMAIL_REGEX.test(email)) {
          Toast.show('Please enter a valid college email.', 'warning');
          return;
        }
        if (feedback) {
          feedback.innerHTML = `✓ A recovery link was sent to <strong>${esc(email)}</strong>. (Demo Password: <code>FacultyPass@123</code> or <code>AdminPass@123</code>)`;
          feedback.classList.remove('hidden');
        }
      });

      // Logout
      logoutBtn?.addEventListener('click', () => {
        this.logout();
      });
    },

    attemptLogin(email, password, remember = true) {
      const alertBanner = document.getElementById('login-alert-banner');
      if (alertBanner) alertBanner.style.display = 'none';

      const faculty = Store.findFacultyByEmail(email);
      let userObj = null;

      if (email === 'admin@college.edu' && (password === 'AdminPass@123' || password === 'admin' || password.length >= 6)) {
        userObj = faculty || { id: 'f1', name: 'Dr. Arvind Sharma', department: 'CSE', designation: 'Professor & HOD', email: 'admin@college.edu', role: 'admin' };
      } else if (faculty && (password === 'FacultyPass@123' || password === 'password' || password.length >= 6)) {
        userObj = { ...faculty, role: faculty.role || 'faculty' };
      } else if (faculty) {
        if (alertBanner) {
          alertBanner.textContent = 'Invalid password. For demo accounts use "AdminPass@123" or "FacultyPass@123".';
          alertBanner.style.display = 'flex';
        }
        return;
      } else {
        // Fallback for custom institutional email
        const namePart = email.split('@')[0].replace('.', ' ');
        const capName = namePart.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        userObj = {
          id: uid('f-custom'),
          name: `Prof. ${capName}`,
          department: 'CSE',
          designation: 'Assistant Professor',
          email: email,
          maxHours: 16,
          role: 'faculty'
        };
      }

      this.currentUser = userObj;
      const sessionData = {
        user: userObj,
        token: uid('tok'),
        timestamp: Date.now()
      };

      if (remember) {
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(sessionData));
      } else {
        sessionStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(sessionData));
      }

      Toast.show(`Welcome, ${userObj.name}!`, 'success');
      this.showDashboard();
    },

    logout() {
      this.currentUser = null;
      localStorage.removeItem(STORAGE_AUTH_KEY);
      sessionStorage.removeItem(STORAGE_AUTH_KEY);
      Toast.show('Signed out successfully.', 'info');
      this.showLogin();
    },

    showLogin() {
      document.getElementById('app-container')?.classList.add('hidden');
      document.getElementById('auth-container')?.classList.remove('hidden');
      const passIn = document.getElementById('login-password');
      if (passIn) passIn.value = '';
    },

    showDashboard() {
      document.getElementById('auth-container')?.classList.add('hidden');
      document.getElementById('app-container')?.classList.remove('hidden');

      this.updateNavbarUserContext();
      this.applyRoleRestrictions();

      // Render Dashboard by default
      UI.switchView('dashboard');
    },

    updateNavbarUserContext() {
      if (!this.currentUser) return;
      const avatarEl = document.getElementById('nav-user-avatar');
      const nameEl = document.getElementById('nav-user-name');
      const roleEl = document.getElementById('nav-user-role');
      const roleBanner = document.getElementById('role-notice-banner');

      if (avatarEl) avatarEl.textContent = getInitials(this.currentUser.name);
      if (nameEl) nameEl.textContent = this.currentUser.name;

      const isAdmin = this.isAdmin();
      if (roleEl) {
        roleEl.textContent = isAdmin ? `HOD • ${this.currentUser.department}` : `Faculty • ${this.currentUser.department}`;
        roleEl.className = `user-role-tag ${isAdmin ? 'admin' : 'faculty'}`;
      }

      if (roleBanner) {
        if (isAdmin) roleBanner.classList.add('hidden');
        else roleBanner.classList.remove('hidden');
      }
    },

    applyRoleRestrictions() {
      const isAdmin = this.isAdmin();
      document.querySelectorAll('.admin-only').forEach(el => {
        if (isAdmin) el.classList.remove('hidden');
        else el.classList.add('hidden');
      });
    }
  };

  /* ========================================================================
     11. UI RENDERERS & VIEW SWITCHING
     ======================================================================== */
  const UI = {
    activeView: 'dashboard',
    facultySearchQuery: '',
    facultyDeptFilter: 'ALL',
    facultyStatusFilter: 'ALL',
    timetableFacultyFilter: 'ALL',
    timetableRoomFilter: 'ALL',
    heatmapDeptFilter: 'ALL',

    switchView(viewName) {
      this.activeView = viewName;

      // 1. Update Tab Buttons
      document.querySelectorAll('.nav-tab').forEach(tab => {
        const isTarget = tab.getAttribute('data-tab') === viewName;
        tab.classList.toggle('active', isTarget);
      });

      // 2. Toggle View Section Containers
      document.querySelectorAll('.view-panel').forEach(panel => {
        const isTarget = panel.id === `view-${viewName}`;
        panel.classList.toggle('active', isTarget);
        panel.classList.toggle('hidden', !isTarget);
      });

      // 3. Trigger Render for Selected View
      switch (viewName) {
        case 'dashboard':
          this.renderDashboard();
          break;
        case 'faculty':
          this.renderFaculty();
          break;
        case 'timetable':
          this.renderTimetable();
          break;
        case 'heatmap':
          this.renderHeatmap();
          break;
        case 'substitution':
          this.renderSubstitution();
          break;
      }
    },

    filterByDepartmentAndNavigate(dept) {
      this.facultyDeptFilter = dept;
      const deptSelect = document.getElementById('faculty-dept-select');
      if (deptSelect) {
        deptSelect.value = dept;
      }
      this.switchView('faculty');
    },

    /* --- View 1: Dashboard Renderer --- */
    renderDashboard() {
      const summary = WorkloadAnalytics.getDepartmentSummary();
      const statsContainer = document.getElementById('dash-stats-grid');
      const insightBar = document.getElementById('dash-insight-bar');
      const deptTableBody = document.getElementById('dash-dept-body');
      const subListContainer = document.getElementById('dash-substitutions-list');

      // 1. Metrics Grid
      if (statsContainer) {
        statsContainer.innerHTML = `
          <div class="stat-card">
            <div class="stat-content">
              <span class="stat-label">Total Faculty</span>
              <span class="stat-value">${summary.totalFaculty}</span>
              <span class="stat-sub">${summary.balancedCount} Balanced workloads</span>
            </div>
            <div class="stat-icon-wrap primary">👨‍🏫</div>
          </div>
          <div class="stat-card">
            <div class="stat-content">
              <span class="stat-label">Weekly Classes</span>
              <span class="stat-value">${summary.totalClasses}</span>
              <span class="stat-sub">Across 3 Departments</span>
            </div>
            <div class="stat-icon-wrap success">📅</div>
          </div>
          <div class="stat-card">
            <div class="stat-content">
              <span class="stat-label">Workload Alerts</span>
              <span class="stat-value" style="color:var(--danger)">${summary.overloadedCount}</span>
              <span class="stat-sub">${summary.underloadedCount} Underloaded faculty</span>
            </div>
            <div class="stat-icon-wrap danger">⚠️</div>
          </div>
          <div class="stat-card">
            <div class="stat-content">
              <span class="stat-label">Active Substitutions</span>
              <span class="stat-value" style="color:var(--secondary)">${summary.activeSubstitutions}</span>
              <span class="stat-sub">Automated Reassignments</span>
            </div>
            <div class="stat-icon-wrap warning">🔄</div>
          </div>
        `;
      }

      // 2. Insight Bar
      if (insightBar) {
        if (summary.overloadedCount > 0) {
          insightBar.innerHTML = `
            <span>💡 <strong>Optimization Insight:</strong> ${summary.overloadedCount} faculty members are currently at full capacity. Use the <strong><a href="javascript:void(0)" id="link-insight-sub">Smart Substitution Tool</a></strong> to reassign loads to underloaded peers.</span>
          `;
          document.getElementById('link-insight-sub')?.addEventListener('click', () => UI.switchView('substitution'));
        } else {
          insightBar.innerHTML = `
            <span>✨ <strong>All Schedules Balanced:</strong> Weekly teaching hours are distributed with zero detected room or faculty conflicts.</span>
          `;
        }
      }

      // 3. Department Breakdown Table
      if (deptTableBody) {
        deptTableBody.innerHTML = DEPARTMENTS.map(dept => {
          const stats = summary.deptStats[dept] || { count: 0, hours: 0 };
          const avg = stats.count > 0 ? (stats.hours / stats.count).toFixed(1) : '0.0';
          return `
            <tr>
              <td><strong>${dept}</strong></td>
              <td>${stats.count} Members</td>
              <td>${stats.hours} hrs / week</td>
              <td>${avg} hrs / faculty</td>
              <td><span class="status-badge balanced">Active</span></td>
            </tr>
          `;
        }).join('');
      }

      // 4. Substitutions Snapshot
      if (subListContainer) {
        const subs = Store.substitutions();
        if (subs.length === 0) {
          subListContainer.innerHTML = `<div class="empty-state small"><p>No active substitutions at this time.</p></div>`;
        } else {
          subListContainer.innerHTML = subs.slice(0, 3).map(s => {
            const sched = Store.findSchedule(s.scheduleId);
            const orig = Store.findFaculty(s.originalFacultyId);
            const sub = Store.findFaculty(s.substituteFacultyId);
            return `
              <div class="sub-item-card">
                <div>
                  <strong>${orig ? orig.name : 'Faculty'} &rarr; ${sub ? sub.name : 'Substitute'}</strong>
                  <div class="sub-item-meta">📅 ${s.date} &bull; Room ${sched ? sched.room : ''}</div>
                </div>
              </div>
            `;
          }).join('');
        }
      }
    },

    /* --- View 2: Faculty Directory Renderer --- */
    renderFaculty() {
      const container = document.getElementById('faculty-cards-container');
      const emptyState = document.getElementById('faculty-empty-state');
      if (!container) return;

      let list = Store.faculty();

      // Search Query
      if (this.facultySearchQuery) {
        const q = this.facultySearchQuery.toLowerCase();
        list = list.filter(f => 
          f.name.toLowerCase().includes(q) || 
          f.email.toLowerCase().includes(q) || 
          f.department.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q)
        );
      }

      // Department Filter
      if (this.facultyDeptFilter !== 'ALL') {
        list = list.filter(f => f.department === this.facultyDeptFilter);
      }

      // Status Filter
      if (this.facultyStatusFilter !== 'ALL') {
        list = list.filter(f => {
          const hours = WorkloadAnalytics.calculateFacultyHours(f.id).total;
          const status = WorkloadAnalytics.getStatus(hours, f.maxHours).label;
          return status === this.facultyStatusFilter;
        });
      }

      if (list.length === 0) {
        container.innerHTML = '';
        emptyState?.classList.remove('hidden');
        return;
      }
      emptyState?.classList.add('hidden');

      const isAdmin = Auth.isAdmin();

      container.innerHTML = list.map(f => {
        const hours = WorkloadAnalytics.calculateFacultyHours(f.id).total;
        const max = f.maxHours || 16;
        const pct = Math.min(Math.round((hours / max) * 100), 100);
        const status = WorkloadAnalytics.getStatus(hours, max);

        return `
          <div class="faculty-card">
            <div>
              <div class="faculty-card-header">
                <div class="faculty-avatar">${getInitials(f.name)}</div>
                <div>
                  <div class="faculty-name">${esc(f.name)}</div>
                  <div class="faculty-desig">${esc(f.designation)}</div>
                  <span class="faculty-dept-badge">${esc(f.department)}</span>
                </div>
              </div>

              <div class="faculty-contact">
                <span>✉️</span>
                <span class="font-mono">${esc(f.email)}</span>
              </div>

              <div class="faculty-workload-bar-wrap">
                <div class="workload-bar-header">
                  <span>Workload: <strong>${hours} / ${max} hrs</strong></span>
                  <span class="status-badge ${status.class}">${status.label}</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill ${status.class}" style="width:${pct}%"></div>
                </div>
              </div>
            </div>

            <div class="faculty-card-actions">
              <button type="button" class="btn btn-outline btn-sm" data-action="mark-absent-card" data-id="${f.id}">
                <span>🚨 Mark Absent</span>
              </button>
              ${isAdmin ? `
                <button type="button" class="btn btn-outline btn-sm" data-action="edit-faculty" data-id="${f.id}">
                  <span>✏️ Edit</span>
                </button>
                <button type="button" class="btn btn-outline btn-sm" data-action="delete-faculty" data-id="${f.id}" style="color:var(--danger)">
                  <span>🗑️</span>
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    },

    /* --- View 3: Timetable Matrix Renderer --- */
    renderTimetable() {
      const container = document.getElementById('timetable-matrix-container');
      const facultySelect = document.getElementById('timetable-faculty-select');
      if (!container) return;

      // Update Filter Options
      if (facultySelect) {
        const cur = this.timetableFacultyFilter;
        let opts = `<option value="ALL">🏢 All Faculty (Aggregated Master Matrix)</option>`;
        Store.faculty().forEach(f => {
          opts += `<option value="${f.id}" ${f.id === cur ? 'selected' : ''}>${esc(f.name)} (${esc(f.department)})</option>`;
        });
        facultySelect.innerHTML = opts;
      }

      let entries = Store.schedules();
      if (this.timetableFacultyFilter !== 'ALL') {
        entries = entries.filter(e => e.facultyId === this.timetableFacultyFilter);
      }
      if (this.timetableRoomFilter !== 'ALL') {
        entries = entries.filter(e => e.room === this.timetableRoomFilter);
      }

      const isAdmin = Auth.isAdmin();

      // Build Matrix Table
      let headerCols = `<th class="tt-day-col">Day / Time</th>`;
      SLOTS.forEach(s => {
        headerCols += `
          <th>
            <span class="tt-slot-header">${s.shortLabel}</span>
            <span class="tt-slot-time">${s.lunch ? 'Lunch Break' : s.start + ' - ' + s.end}</span>
          </th>
        `;
      });

      let rowsHtml = '';
      DAYS.forEach(day => {
        let cellsHtml = `<td class="tt-day-col"><strong>${day}</strong></td>`;

        SLOTS.forEach(slot => {
          if (slot.lunch) {
            cellsHtml += `<td class="tt-cell lunch-slot">☕ Lunch Break</td>`;
            return;
          }

          const slotEntries = entries.filter(e => e.day === day && e.slotId === slot.id);

          const cards = slotEntries.map(e => {
            const fac = Store.findFaculty(e.facultyId);
            const sub = Store.findSubject(e.subjectId);
            return `
              <div class="tt-entry-card" data-action="entry-click" data-id="${e.id}" title="Click to edit or remove slot">
                <div class="tt-entry-subject">
                  <span>${esc(sub ? sub.code : 'Class')}</span>
                  <span style="font-size:0.65rem;color:var(--text-muted)">${getInitials(fac ? fac.name : '')}</span>
                </div>
                <div class="tt-entry-faculty">${esc(fac ? fac.name : '')}</div>
                <span class="tt-entry-room">📍 ${esc(e.room)}</span>
              </div>
            `;
          }).join('');

          cellsHtml += `
            <td class="tt-cell" data-action="slot-click" data-day="${day}" data-slot="${slot.id}" title="${isAdmin ? 'Click to assign class' : ''}">
              ${cards}
            </td>
          `;
        });

        rowsHtml += `<tr>${cellsHtml}</tr>`;
      });

      container.innerHTML = `
        <table class="tt-table">
          <thead><tr>${headerCols}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      `;
    },

    /* --- View 4: Workload Heatmap Renderer --- */
    renderHeatmap() {
      const tbody = document.getElementById('heatmap-table-body');
      if (!tbody) return;

      let facultyList = Store.faculty();
      if (this.heatmapDeptFilter !== 'ALL') {
        facultyList = facultyList.filter(f => f.department === this.heatmapDeptFilter);
      }

      if (facultyList.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align:center;padding:30px;color:var(--text-muted)">No faculty in this department.</td></tr>`;
        return;
      }

      tbody.innerHTML = facultyList.map(f => {
        const hours = WorkloadAnalytics.calculateFacultyHours(f.id);
        const status = WorkloadAnalytics.getStatus(hours.total, f.maxHours);

        const dayBadges = DAYS.map(day => {
          const count = hours.dayBreakdown[day] || 0;
          let badgeClass = 'zero';
          if (count > 0 && count < 3) badgeClass = 'light';
          else if (count >= 3 && count < 4) badgeClass = 'balanced';
          else if (count >= 4) badgeClass = 'overloaded';

          return `<td class="hm-day-cell"><span class="hm-cell-badge ${badgeClass}">${count}h</span></td>`;
        }).join('');

        return `
          <tr>
            <td class="hm-col-name">
              <div class="hm-faculty-cell">
                <div class="hm-avatar">${getInitials(f.name)}</div>
                <div>
                  <strong>${esc(f.name)}</strong>
                  <div style="font-size:0.75rem;color:var(--text-muted)">${esc(f.designation)}</div>
                </div>
              </div>
            </td>
            <td class="hm-col-dept"><span class="faculty-dept-badge">${esc(f.department)}</span></td>
            ${dayBadges}
            <td class="hm-col-total"><strong>${hours.total} hrs</strong></td>
            <td class="hm-col-cap">${f.maxHours} hrs</td>
            <td class="hm-col-status">
              <span class="status-badge ${status.class}">${status.label}</span>
            </td>
          </tr>
        `;
      }).join('');
    },

    /* --- View 5: Smart Substitution Renderer --- */
    renderSubstitution() {
      // 1. Populate Faculty Select
      const select = document.getElementById('sub-faculty-select');
      if (select) {
        const cur = select.value;
        let opts = `<option value="">-- Choose Faculty Member --</option>`;
        Store.faculty().forEach(f => {
          opts += `<option value="${f.id}" ${f.id === cur ? 'selected' : ''}>${esc(f.name)} (${esc(f.department)})</option>`;
        });
        select.innerHTML = opts;
      }

      // Default Date
      const dateIn = document.getElementById('sub-date-input');
      if (dateIn && !dateIn.value) {
        dateIn.value = getTodayDateString();
      }

      this.updateSubScopeOptions();
      this.renderAffectedClasses();
      this.renderConfirmedSubstitutions();
    },

    updateSubScopeOptions() {
      const facId = document.getElementById('sub-faculty-select')?.value;
      const dateVal = document.getElementById('sub-date-input')?.value;
      const scopeSel = document.getElementById('sub-scope-select');
      if (!scopeSel) return;

      let opts = `<option value="whole">Full Day (All scheduled lectures on this date)</option>`;
      if (facId && dateVal) {
        const day = getDayFromDate(dateVal);
        if (DAYS.includes(day)) {
          const entries = Store.schedules().filter(e => e.facultyId === facId && e.day === day);
          entries.forEach(e => {
            const sl = getSlotById(e.slotId);
            const sub = Store.findSubject(e.subjectId);
            if (sl) {
              opts += `<option value="${e.slotId}">Slot ${e.slotId}: ${sl.shortLabel} (${sub ? sub.code : 'Class'})</option>`;
            }
          });
        }
      }
      scopeSel.innerHTML = opts;
    },

    renderAffectedClasses() {
      const container = document.getElementById('affected-classes-container');
      const badge = document.getElementById('affected-classes-badge');
      if (!container) return;

      const facId = document.getElementById('sub-faculty-select')?.value;
      const dateVal = document.getElementById('sub-date-input')?.value;
      if (!facId || !dateVal) {
        container.innerHTML = `<div class="empty-state small"><p>Select a faculty member and date above to calculate affected classes.</p></div>`;
        if (badge) badge.textContent = '0 Lectures';
        return;
      }

      const day = getDayFromDate(dateVal);
      if (!DAYS.includes(day)) {
        container.innerHTML = `<div class="empty-state small"><p>Selected date falls on a weekend (${day}). No lectures scheduled.</p></div>`;
        if (badge) badge.textContent = '0 Lectures';
        return;
      }

      const entries = Store.schedules().filter(e => e.facultyId === facId && e.day === day);
      if (badge) badge.textContent = `${entries.length} Lectures`;

      if (entries.length === 0) {
        container.innerHTML = `<div class="empty-state small"><p>No lectures scheduled for this faculty member on ${day}.</p></div>`;
        return;
      }

      container.innerHTML = entries.map(entry => {
        const sub = Store.findSubject(entry.subjectId);
        const sl = getSlotById(entry.slotId);
        const result = SubstitutionFinder.findCandidates(entry, dateVal);

        let candidateHtml = '';
        if (result.candidates.length > 0) {
          candidateHtml = `
            <div class="candidate-list-wrap">
              <span style="font-size:0.75rem;font-weight:700;color:var(--text-secondary);text-transform:uppercase;">Top Suggested Substitutes:</span>
              ${result.candidates.slice(0, 3).map(c => `
                <div class="candidate-card">
                  <div>
                    <span class="candidate-name">${esc(c.faculty.name)}</span>
                    <span class="candidate-hours">(${c.weeklyHours}/${c.faculty.maxHours} hrs load)</span>
                  </div>
                  <button type="button" class="btn btn-success btn-sm" data-action="reassign-class" data-entry="${entry.id}" data-date="${dateVal}" data-sub-fac="${c.faculty.id}">
                    <span>Assign Substitute</span>
                  </button>
                </div>
              `).join('')}
            </div>
          `;
        } else {
          candidateHtml = `
            <div style="margin-top:8px;font-size:0.8rem;color:var(--danger)">
              ⚠️ No available substitutes found in ${esc(result.dept)} department (all peers are busy or at max weekly workload).
            </div>
          `;
        }

        return `
          <div class="sub-item-card">
            <div style="flex:1">
              <strong>${esc(sub ? sub.code + ': ' + sub.name : 'Lecture')}</strong>
              <div class="sub-item-meta">📅 ${day} &bull; ${sl ? sl.label : ''} &bull; 📍 ${esc(entry.room)}</div>
              ${candidateHtml}
            </div>
          </div>
        `;
      }).join('');
    },

    renderConfirmedSubstitutions() {
      const container = document.getElementById('active-subs-container');
      const badge = document.getElementById('active-subs-badge');
      if (!container) return;

      const list = Store.substitutions();
      if (badge) badge.textContent = `${list.length} Reassignments`;

      if (list.length === 0) {
        container.innerHTML = `<div class="empty-state small"><p>No active substitutions recorded yet.</p></div>`;
        return;
      }

      container.innerHTML = list.map(s => {
        const sched = Store.findSchedule(s.scheduleId);
        const origFac = Store.findFaculty(s.originalFacultyId);
        const subFac = Store.findFaculty(s.substituteFacultyId);
        const subject = sched ? Store.findSubject(sched.subjectId) : null;
        const slot = sched ? getSlotById(sched.slotId) : null;

        return `
          <div class="sub-item-card">
            <div>
              <strong>${esc(subject ? subject.code + ': ' + subject.name : 'Lecture')}</strong>
              <div class="sub-item-meta">
                📅 <strong>${s.date}</strong> (${sched ? sched.day : ''}, ${slot ? slot.shortLabel : ''}) &bull; Room ${sched ? sched.room : ''}
              </div>
              <div style="margin-top:6px;font-size:0.82rem">
                Originally: <span style="text-decoration:line-through;color:var(--text-muted)">${esc(origFac ? origFac.name : 'Faculty')}</span>
                &rarr; <strong>Substituted by: ${esc(subFac ? subFac.name : 'Faculty')}</strong>
              </div>
            </div>
            <div>
              <button type="button" class="btn btn-outline btn-sm" data-action="undo-substitution" data-id="${s.id}" title="Revert substitution">
                <span>Undo</span>
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  };

  /* ========================================================================
     12. EVENT LISTENERS & DELEGATION
     ======================================================================== */
  const Events = {
    init() {
      // 1. Navigation Tab Clicks
      document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          const targetView = tab.getAttribute('data-tab');
          if (targetView) {
            UI.switchView(targetView);
          }
        });
      });

      // 2. Dashboard Shortcut Buttons & Quick-Access Links
      document.getElementById('btn-dash-add-faculty')?.addEventListener('click', () => {
        Events.openAddFacultyModal();
      });
      document.getElementById('btn-dash-add-schedule')?.addEventListener('click', () => {
        Events.openAddScheduleModal();
      });
      document.getElementById('btn-goto-faculty')?.addEventListener('click', () => {
        UI.switchView('faculty');
      });
      document.getElementById('card-goto-faculty')?.addEventListener('click', () => {
        UI.switchView('faculty');
      });
      document.getElementById('btn-goto-timetable')?.addEventListener('click', () => {
        UI.switchView('timetable');
      });
      document.getElementById('card-goto-timetable')?.addEventListener('click', () => {
        UI.switchView('timetable');
      });
      document.getElementById('btn-goto-heatmap')?.addEventListener('click', () => {
        UI.switchView('heatmap');
      });
      document.getElementById('btn-goto-substitution')?.addEventListener('click', () => {
        UI.switchView('substitution');
      });
      document.getElementById('nav-brand-logo')?.addEventListener('click', () => {
        UI.switchView('dashboard');
      });

      // Department Quick-Access Navigation Cards
      document.querySelectorAll('.dept-quick-card').forEach(card => {
        card.addEventListener('click', () => {
          const dept = card.getAttribute('data-dept');
          if (dept) {
            UI.filterByDepartmentAndNavigate(dept);
          }
        });
      });

      // 3. Reset Demo Data
      document.getElementById('btn-reset-demo')?.addEventListener('click', () => {
        if (!Auth.isAdmin()) {
          Toast.show('Only HOD administrators can reset demo data.', 'warning');
          return;
        }
        Store.reset();
        Toast.show('Academic database restored to seed state.', 'success');
        UI.switchView(UI.activeView);
      });

      // 4. Faculty View Toolbar
      const facultySearch = document.getElementById('faculty-search-input');
      facultySearch?.addEventListener('input', debounce(() => {
        UI.facultySearchQuery = facultySearch.value;
        UI.renderFaculty();
      }, 150));

      document.getElementById('faculty-dept-select')?.addEventListener('change', (e) => {
        UI.facultyDeptFilter = e.target.value;
        UI.renderFaculty();
      });
      document.getElementById('faculty-status-select')?.addEventListener('change', (e) => {
        UI.facultyStatusFilter = e.target.value;
        UI.renderFaculty();
      });
      document.getElementById('btn-open-add-faculty-modal')?.addEventListener('click', () => {
        Events.openAddFacultyModal();
      });

      // 5. Timetable View Toolbar
      document.getElementById('timetable-faculty-select')?.addEventListener('change', (e) => {
        UI.timetableFacultyFilter = e.target.value;
        UI.renderTimetable();
      });
      document.getElementById('timetable-room-select')?.addEventListener('change', (e) => {
        UI.timetableRoomFilter = e.target.value;
        UI.renderTimetable();
      });
      document.getElementById('btn-open-add-schedule-modal')?.addEventListener('click', () => {
        Events.openAddScheduleModal();
      });

      // 6. Heatmap Department Filter
      document.getElementById('heatmap-dept-select')?.addEventListener('change', (e) => {
        UI.heatmapDeptFilter = e.target.value;
        UI.renderHeatmap();
      });

      // 7. Substitution Form
      document.getElementById('sub-faculty-select')?.addEventListener('change', () => {
        UI.updateSubScopeOptions();
        UI.renderAffectedClasses();
      });
      document.getElementById('sub-date-input')?.addEventListener('change', () => {
        UI.updateSubScopeOptions();
        UI.renderAffectedClasses();
      });

      document.getElementById('form-mark-absence')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const facId = document.getElementById('sub-faculty-select').value;
        const date = document.getElementById('sub-date-input').value;
        const scope = document.getElementById('sub-scope-select').value;
        const reason = document.getElementById('sub-reason-input')?.value || '';

        if (!facId) {
          Toast.show('Please select a faculty member.', 'warning');
          return;
        }
        if (!date) {
          Toast.show('Please choose an absence date.', 'warning');
          return;
        }

        const fac = Store.findFaculty(facId);
        const day = getDayFromDate(date);
        if (!DAYS.includes(day)) {
          Toast.show('Selected date is on a weekend.', 'warning');
          return;
        }

        const already = Store.absences().some(a => 
          a.facultyId === facId && 
          a.date === date && 
          (a.slotId === null || a.slotId === (scope === 'whole' ? null : parseInt(scope, 10)))
        );

        if (already) {
          Toast.show('Faculty is already marked absent for this date/slot.', 'warning');
          return;
        }

        Store.absences().push({
          id: uid('abs'),
          facultyId: facId,
          date,
          slotId: scope === 'whole' ? null : parseInt(scope, 10),
          reason
        });

        Store.save();
        Toast.show(`${fac ? fac.name : 'Faculty'} marked absent on ${date}.`, 'success');
        UI.renderAffectedClasses();
      });

      // 8. Faculty Form Submit (Add / Edit)
      document.getElementById('form-faculty')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const fid = document.getElementById('modal-faculty-id').value;
        const name = document.getElementById('modal-faculty-name').value.trim();
        const dept = document.getElementById('modal-faculty-dept').value;
        const desig = document.getElementById('modal-faculty-desig').value;
        const email = document.getElementById('modal-faculty-email').value.trim();
        const maxHours = parseInt(document.getElementById('modal-faculty-maxhours').value, 10) || 16;

        if (!name || !email) {
          Toast.show('Please fill in name and email.', 'warning');
          return;
        }

        if (!INSTITUTIONAL_EMAIL_REGEX.test(email)) {
          Toast.show('Please use an institutional email (*@college.edu or *@reva.edu.in).', 'warning');
          return;
        }

        if (fid) {
          // Edit
          const fac = Store.findFaculty(fid);
          if (fac) {
            fac.name = name;
            fac.department = dept;
            fac.designation = desig;
            fac.email = email;
            fac.maxHours = maxHours;
            Toast.show('Faculty details updated.', 'success');
          }
        } else {
          // Add
          Store.faculty().push({
            id: uid('f'),
            name,
            department: dept,
            designation: desig,
            email,
            maxHours,
            role: 'faculty'
          });
          Toast.show('New faculty member added.', 'success');
        }

        Store.save();
        Modals.closeAll();
        UI.renderFaculty();
        UI.renderDashboard();
      });

      // 9. Schedule Form Submit (Add / Edit With Clash Prevention)
      document.getElementById('form-schedule')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const eid = document.getElementById('modal-schedule-id').value;
        const facultyId = document.getElementById('modal-schedule-faculty').value;
        const subjectId = document.getElementById('modal-schedule-subject').value;
        const day = document.getElementById('modal-schedule-day').value;
        const slotId = parseInt(document.getElementById('modal-schedule-slot').value, 10);
        const room = document.getElementById('modal-schedule-room').value.trim();
        const conflictBox = document.getElementById('modal-schedule-conflict-box');

        if (!room) {
          Toast.show('Please enter a lecture room.', 'warning');
          return;
        }

        const candidate = {
          id: eid || uid('e'),
          facultyId,
          subjectId,
          day,
          slotId,
          room
        };

        // RUN CLASH DETECTION ENGINE
        const validation = ConflictEngine.validate(candidate, eid || null);
        if (!validation.ok) {
          if (conflictBox) {
            conflictBox.innerHTML = `<strong>🚨 Clash Prevention Alert:</strong><br>${validation.conflicts.join('<br>')}`;
            conflictBox.classList.remove('hidden');
          }
          Modals.showAlert('Schedule Conflict Detected', validation.conflicts.join('<br><br>'));
          return;
        }

        if (conflictBox) conflictBox.classList.add('hidden');

        if (eid) {
          const entry = Store.findSchedule(eid);
          if (entry) Object.assign(entry, candidate);
          Toast.show('Schedule slot updated.', 'success');
        } else {
          Store.schedules().push(candidate);
          Toast.show('Class scheduled with zero clashes.', 'success');
        }

        Store.save();
        Modals.closeAll();
        UI.renderTimetable();
        UI.renderDashboard();
      });

      // 10. Delete Schedule Button
      document.getElementById('btn-delete-schedule')?.addEventListener('click', () => {
        const eid = document.getElementById('modal-schedule-id').value;
        if (!eid) return;
        Store.data.schedules = Store.data.schedules.filter(s => s.id !== eid);
        Store.save();
        Toast.show('Schedule entry deleted.', 'info');
        Modals.closeAll();
        UI.renderTimetable();
        UI.renderDashboard();
      });

      // 11. Centralized Delegated Click Handlers (Cards, Slots, Entries, Reassign, Undo)
      document.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const action = target.getAttribute('data-action');

        switch (action) {
          case 'edit-faculty': {
            const fid = target.getAttribute('data-id');
            Events.openEditFacultyModal(fid);
            break;
          }

          case 'delete-faculty': {
            const fid = target.getAttribute('data-id');
            const fac = Store.findFaculty(fid);
            if (!fac) break;
            if (confirm(`Delete ${fac.name}? All assigned schedule slots and substitutions will be cleared.`)) {
              Store.data.faculty = Store.data.faculty.filter(f => f.id !== fid);
              Store.data.schedules = Store.data.schedules.filter(s => s.facultyId !== fid);
              Store.data.absences = Store.data.absences.filter(a => a.facultyId !== fid);
              Store.data.substitutions = Store.data.substitutions.filter(s => s.originalFacultyId !== fid && s.substituteFacultyId !== fid);
              Store.save();
              Toast.show('Faculty member deleted.', 'info');
              UI.renderFaculty();
              UI.renderDashboard();
            }
            break;
          }

          case 'mark-absent-card': {
            const fid = target.getAttribute('data-id');
            UI.switchView('substitution');
            setTimeout(() => {
              const sel = document.getElementById('sub-faculty-select');
              if (sel) {
                sel.value = fid;
                UI.updateSubScopeOptions();
                UI.renderAffectedClasses();
              }
            }, 50);
            break;
          }

          case 'slot-click': {
            if (!Auth.isAdmin()) return;
            if (target.querySelector('.tt-entry-card')) return; // Cell already has entries, let entry handle
            const day = target.getAttribute('data-day');
            const slot = parseInt(target.getAttribute('data-slot'), 10);
            Events.openAddScheduleModal(day, slot);
            break;
          }

          case 'entry-click': {
            e.stopPropagation();
            if (!Auth.isAdmin()) {
              Toast.show('Admin permissions required to modify schedules.', 'info');
              return;
            }
            const eid = target.getAttribute('data-id');
            Events.openEditScheduleModal(eid);
            break;
          }

          case 'reassign-class': {
            const entryId = target.getAttribute('data-entry');
            const dateStr = target.getAttribute('data-date');
            const subFacId = target.getAttribute('data-sub-fac');
            const sched = Store.findSchedule(entryId);
            if (!sched) break;

            Store.substitutions().push({
              id: uid('sub'),
              scheduleId: entryId,
              date: dateStr,
              originalFacultyId: sched.facultyId,
              substituteFacultyId: subFacId
            });

            Store.save();
            const subFac = Store.findFaculty(subFacId);
            Toast.show(`Class successfully assigned to ${subFac ? subFac.name : 'Substitute'}!`, 'success');
            UI.renderAffectedClasses();
            UI.renderConfirmedSubstitutions();
            UI.renderDashboard();
            break;
          }

          case 'undo-substitution': {
            const subId = target.getAttribute('data-id');
            Store.data.substitutions = Store.data.substitutions.filter(s => s.id !== subId);
            Store.save();
            Toast.show('Substitution undone.', 'info');
            UI.renderAffectedClasses();
            UI.renderConfirmedSubstitutions();
            UI.renderDashboard();
            break;
          }
        }
      });
    },

    openAddFacultyModal() {
      if (!Auth.isAdmin()) {
        Toast.show('Admin permissions required to add faculty.', 'warning');
        return;
      }
      document.getElementById('modal-faculty-title').textContent = 'Add Faculty Member';
      document.getElementById('modal-faculty-id').value = '';
      document.getElementById('modal-faculty-name').value = '';
      document.getElementById('modal-faculty-dept').value = 'CSE';
      document.getElementById('modal-faculty-desig').value = 'Assistant Professor';
      document.getElementById('modal-faculty-email').value = '';
      document.getElementById('modal-faculty-maxhours').value = '16';
      Modals.open('modal-faculty');
    },

    openEditFacultyModal(facultyId) {
      if (!Auth.isAdmin()) {
        Toast.show('Admin permissions required to edit faculty.', 'warning');
        return;
      }
      const fac = Store.findFaculty(facultyId);
      if (!fac) return;

      document.getElementById('modal-faculty-title').textContent = 'Edit Faculty Profile';
      document.getElementById('modal-faculty-id').value = fac.id;
      document.getElementById('modal-faculty-name').value = fac.name;
      document.getElementById('modal-faculty-dept').value = fac.department;
      document.getElementById('modal-faculty-desig').value = fac.designation;
      document.getElementById('modal-faculty-email').value = fac.email;
      document.getElementById('modal-faculty-maxhours').value = fac.maxHours || 16;
      Modals.open('modal-faculty');
    },

    openAddScheduleModal(defaultDay = 'Monday', defaultSlot = 1) {
      if (!Auth.isAdmin()) {
        Toast.show('Admin permissions required to assign schedules.', 'warning');
        return;
      }
      document.getElementById('modal-schedule-title').textContent = 'Assign Schedule Slot';
      document.getElementById('modal-schedule-id').value = '';
      document.getElementById('btn-delete-schedule')?.classList.add('hidden');
      document.getElementById('modal-schedule-conflict-box')?.classList.add('hidden');

      // Populate Faculty Dropdown
      const facSel = document.getElementById('modal-schedule-faculty');
      facSel.innerHTML = Store.faculty().map(f => `<option value="${f.id}">${esc(f.name)} (${esc(f.department)})</option>`).join('');

      // Populate Subject Dropdown
      const subSel = document.getElementById('modal-schedule-subject');
      subSel.innerHTML = Store.subjects().map(s => `<option value="${s.id}">${esc(s.code)} - ${esc(s.name)} (${esc(s.department)})</option>`).join('');

      document.getElementById('modal-schedule-day').value = defaultDay;
      document.getElementById('modal-schedule-slot').value = String(defaultSlot === 5 ? 6 : defaultSlot);
      document.getElementById('modal-schedule-room').value = 'Room 101';

      Modals.open('modal-schedule');
    },

    openEditScheduleModal(entryId) {
      if (!Auth.isAdmin()) {
        Toast.show('Admin permissions required to edit schedules.', 'warning');
        return;
      }
      const entry = Store.findSchedule(entryId);
      if (!entry) return;

      document.getElementById('modal-schedule-title').textContent = 'Edit Schedule Slot';
      document.getElementById('modal-schedule-id').value = entry.id;
      document.getElementById('btn-delete-schedule')?.classList.remove('hidden');
      document.getElementById('modal-schedule-conflict-box')?.classList.add('hidden');

      // Populate Faculty Dropdown
      const facSel = document.getElementById('modal-schedule-faculty');
      facSel.innerHTML = Store.faculty().map(f => `<option value="${f.id}" ${f.id === entry.facultyId ? 'selected' : ''}>${esc(f.name)} (${esc(f.department)})</option>`).join('');

      // Populate Subject Dropdown
      const subSel = document.getElementById('modal-schedule-subject');
      subSel.innerHTML = Store.subjects().map(s => `<option value="${s.id}" ${s.id === entry.subjectId ? 'selected' : ''}>${esc(s.code)} - ${esc(s.name)} (${esc(s.department)})</option>`).join('');

      document.getElementById('modal-schedule-day').value = entry.day;
      document.getElementById('modal-schedule-slot').value = String(entry.slotId);
      document.getElementById('modal-schedule-room').value = entry.room;

      Modals.open('modal-schedule');
    }
  };

  /* ========================================================================
     13. BOOTSTRAP INITIALIZATION
     ======================================================================== */
  function startApplication() {
    Store.init();
    Modals.init();
    Events.init();
    Auth.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApplication);
  } else {
    startApplication();
  }

})();
