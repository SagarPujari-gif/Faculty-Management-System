-- ============================================================================
-- FACULTY HUB – Supabase Database Schema & Initial Migration
-- ============================================================================

-- Enable UUID generation extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. Faculty Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faculty (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    max_hours INTEGER NOT NULL DEFAULT 16 CHECK (max_hours > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 2. Subjects Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    hours_per_week INTEGER NOT NULL DEFAULT 3 CHECK (hours_per_week > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 3. Schedules (Timetable Entries) Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.schedules (
    id TEXT PRIMARY KEY,
    faculty_id TEXT NOT NULL REFERENCES public.faculty(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    room TEXT NOT NULL,
    day TEXT NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    slot_id INTEGER NOT NULL CHECK (slot_id BETWEEN 1 AND 8 AND slot_id != 5), -- Slot 5 is 1-2 PM Lunch
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_faculty_day_slot UNIQUE (faculty_id, day, slot_id),
    CONSTRAINT uq_room_day_slot UNIQUE (room, day, slot_id)
);

-- ----------------------------------------------------------------------------
-- 4. Absences Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.absences (
    id TEXT PRIMARY KEY,
    faculty_id TEXT NOT NULL REFERENCES public.faculty(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    slot_id INTEGER NULL CHECK (slot_id IS NULL OR (slot_id BETWEEN 1 AND 8 AND slot_id != 5)),
    reason TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- 5. Substitutions Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.substitutions (
    id TEXT PRIMARY KEY,
    schedule_id TEXT NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    original_faculty_id TEXT NOT NULL REFERENCES public.faculty(id) ON DELETE CASCADE,
    substitute_faculty_id TEXT NOT NULL REFERENCES public.faculty(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ----------------------------------------------------------------------------
-- Indexes for Performance
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_faculty_dept ON public.faculty(department);
CREATE INDEX IF NOT EXISTS idx_subjects_dept ON public.subjects(department);
CREATE INDEX IF NOT EXISTS idx_schedules_faculty ON public.schedules(faculty_id);
CREATE INDEX IF NOT EXISTS idx_schedules_subject ON public.schedules(subject_id);
CREATE INDEX IF NOT EXISTS idx_schedules_day_slot ON public.schedules(day, slot_id);
CREATE INDEX IF NOT EXISTS idx_absences_date ON public.absences(date);
CREATE INDEX IF NOT EXISTS idx_absences_faculty_date ON public.absences(faculty_id, date);
CREATE INDEX IF NOT EXISTS idx_substitutions_date ON public.substitutions(date);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.substitutions ENABLE ROW LEVEL SECURITY;

-- Allow public read & write operations for web app interaction
CREATE POLICY "Allow public read on faculty" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Allow public insert on faculty" ON public.faculty FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on faculty" ON public.faculty FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete on faculty" ON public.faculty FOR DELETE USING (true);

CREATE POLICY "Allow public read on subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Allow public insert on subjects" ON public.subjects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on subjects" ON public.subjects FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete on subjects" ON public.subjects FOR DELETE USING (true);

CREATE POLICY "Allow public read on schedules" ON public.schedules FOR SELECT USING (true);
CREATE POLICY "Allow public insert on schedules" ON public.schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on schedules" ON public.schedules FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete on schedules" ON public.schedules FOR DELETE USING (true);

CREATE POLICY "Allow public read on absences" ON public.absences FOR SELECT USING (true);
CREATE POLICY "Allow public insert on absences" ON public.absences FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on absences" ON public.absences FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete on absences" ON public.absences FOR DELETE USING (true);

CREATE POLICY "Allow public read on substitutions" ON public.substitutions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on substitutions" ON public.substitutions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on substitutions" ON public.substitutions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete on substitutions" ON public.substitutions FOR DELETE USING (true);

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================
INSERT INTO public.faculty (id, name, department, designation, email, max_hours) VALUES
('f1', 'Dr. Arvind Sharma',  'CSE',         'Professor',            'arvind@univ.edu',  16),
('f2', 'Dr. Meera Nair',     'CSE',         'Associate Professor',  'meera@univ.edu',   16),
('f3', 'Prof. Rajesh Kumar', 'CSE',         'Assistant Professor',  'rajesh@univ.edu',  18),
('f4', 'Dr. Priya Desai',    'CSE',         'Assistant Professor',  'priya@univ.edu',   16),
('f5', 'Prof. Anil Gupta',   'CSE',         'Lecturer',             'anil@univ.edu',    18),
('f6', 'Dr. Sunita Rao',     'Mathematics', 'Professor',            'sunita@univ.edu',  14),
('f7', 'Prof. Vikram Joshi', 'Mathematics', 'Associate Professor',  'vikram@univ.edu',  16),
('f8', 'Dr. Kavita Menon',   'Mathematics', 'Assistant Professor',  'kavita@univ.edu',  16)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.subjects (id, code, name, department, hours_per_week) VALUES
('s1',  'CS101', 'Data Structures',          'CSE',         4),
('s2',  'CS201', 'Algorithms',               'CSE',         3),
('s3',  'CS301', 'Database Systems',         'CSE',         3),
('s4',  'CS401', 'Operating Systems',        'CSE',         4),
('s5',  'CS501', 'Computer Networks',        'CSE',         3),
('s6',  'CS601', 'Machine Learning',         'CSE',         3),
('s7',  'MA101', 'Calculus',                 'Mathematics', 4),
('s8',  'MA201', 'Linear Algebra',           'Mathematics', 3),
('s9',  'MA301', 'Probability & Statistics', 'Mathematics', 3),
('s10', 'MA401', 'Discrete Mathematics',     'Mathematics', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.schedules (id, faculty_id, subject_id, room, day, slot_id) VALUES
-- f1 Sharma (CSE)
('e01', 'f1', 's1', 'Room 101', 'Monday',    1),
('e02', 'f1', 's1', 'Room 101', 'Monday',    2),
('e03', 'f1', 's4', 'Room 101', 'Monday',    3),
('e04', 'f1', 's4', 'Room 101', 'Tuesday',   1),
('e05', 'f1', 's1', 'Room 101', 'Tuesday',   2),
('e06', 'f1', 's4', 'Room 101', 'Tuesday',   6),
('e07', 'f1', 's1', 'Room 101', 'Wednesday', 1),
('e08', 'f1', 's4', 'Room 101', 'Wednesday', 2),
('e09', 'f1', 's4', 'Room 101', 'Wednesday', 6),
('e10', 'f1', 's1', 'Room 101', 'Thursday',  1),
('e11', 'f1', 's4', 'Room 101', 'Thursday',  2),
('e12', 'f1', 's4', 'Room 101', 'Thursday',  3),
('e13', 'f1', 's1', 'Room 101', 'Thursday',  6),
('e14', 'f1', 's4', 'Room 101', 'Friday',    1),
('e15', 'f1', 's1', 'Room 101', 'Friday',    2),
('e16', 'f1', 's4', 'Room 101', 'Friday',    3),

-- f2 Nair (CSE)
('e17', 'f2', 's2', 'Room 204', 'Monday',    4),
('e18', 'f2', 's3', 'Room 204', 'Monday',    6),
('e19', 'f2', 's2', 'Room 204', 'Tuesday',   3),
('e20', 'f2', 's3', 'Room 204', 'Tuesday',   4),
('e21', 'f2', 's2', 'Room 204', 'Wednesday', 3),
('e22', 'f2', 's3', 'Room 204', 'Wednesday', 4),
('e23', 'f2', 's3', 'Room 204', 'Thursday',  4),
('e24', 'f2', 's2', 'Room 204', 'Thursday',  7),
('e25', 'f2', 's3', 'Room 204', 'Friday',    4),
('e26', 'f2', 's2', 'Room 204', 'Friday',    6),
('e27', 'f2', 's3', 'Room 204', 'Friday',    7),

-- f3 Kumar (CSE)
('e28', 'f3', 's5', 'Lab 2',    'Monday',    7),
('e29', 'f3', 's6', 'Lab 2',    'Monday',    8),
('e30', 'f3', 's5', 'Lab 2',    'Tuesday',   7),
('e31', 'f3', 's6', 'Lab 2',    'Tuesday',   8),
('e32', 'f3', 's5', 'Lab 2',    'Wednesday', 7),
('e33', 'f3', 's6', 'Lab 2',    'Wednesday', 8),
('e34', 'f3', 's5', 'Room 102', 'Thursday',  6),
('e35', 'f3', 's6', 'Room 102', 'Thursday',  8),
('e36', 'f3', 's5', 'Lab 2',    'Friday',    8),
('e37', 'f3', 's6', 'Room 102', 'Monday',    3),
('e38', 'f3', 's6', 'Room 102', 'Tuesday',   4),
('e39', 'f3', 's5', 'Room 102', 'Wednesday', 6),

-- f4 Desai (CSE)
('e40', 'f4', 's2', 'Room 102', 'Monday',    6),
('e41', 'f4', 's3', 'Room 102', 'Tuesday',   6),
('e42', 'f4', 's2', 'Room 102', 'Wednesday', 4),
('e43', 'f4', 's3', 'Room 102', 'Thursday',  7),
('e44', 'f4', 's2', 'Room 102', 'Friday',    6),
('e45', 'f4', 's3', 'Room 102', 'Friday',    7),
('e46', 'f4', 's2', 'Room 102', 'Thursday',  4),
('e47', 'f4', 's3', 'Room 102', 'Wednesday', 1),

-- f5 Gupta (CSE)
('e48', 'f5', 's5', 'Lab 1',    'Monday',    4),
('e49', 'f5', 's6', 'Lab 1',    'Tuesday',   1),
('e50', 'f5', 's5', 'Lab 1',    'Tuesday',   2),
('e51', 'f5', 's6', 'Lab 1',    'Wednesday', 2),
('e52', 'f5', 's5', 'Lab 1',    'Thursday',  1),
('e53', 'f5', 's6', 'Lab 1',    'Thursday',  2),
('e54', 'f5', 's6', 'Lab 1',    'Friday',    1),

-- f6 Rao (Mathematics)
('e55', 'f6', 's7', 'Room 301', 'Monday',    1),
('e56', 'f6', 's8', 'Room 301', 'Monday',    2),
('e57', 'f6', 's7', 'Room 301', 'Monday',    3),
('e58', 'f6', 's8', 'Room 301', 'Tuesday',   3),
('e59', 'f6', 's7', 'Room 301', 'Tuesday',   6),
('e60', 'f6', 's8', 'Room 301', 'Tuesday',   7),
('e61', 'f6', 's7', 'Room 301', 'Wednesday', 1),
('e62', 'f6', 's8', 'Room 301', 'Wednesday', 3),
('e63', 'f6', 's7', 'Room 301', 'Wednesday', 6),
('e64', 'f6', 's7', 'Room 301', 'Thursday',  3),
('e65', 'f6', 's8', 'Room 301', 'Thursday',  6),
('e66', 'f6', 's7', 'Room 301', 'Thursday',  7),
('e67', 'f6', 's8', 'Room 301', 'Friday',    3),
('e68', 'f6', 's7', 'Room 301', 'Friday',    6),

-- f7 Joshi (Mathematics)
('e69', 'f7', 's9',  'Room 302', 'Monday',    4),
('e70', 'f7', 's10', 'Room 302', 'Monday',    6),
('e71', 'f7', 's9',  'Room 302', 'Tuesday',   4),
('e72', 'f7', 's10', 'Room 302', 'Tuesday',   8),
('e73', 'f7', 's9',  'Room 302', 'Wednesday', 4),
('e74', 'f7', 's10', 'Room 302', 'Wednesday', 7),
('e75', 'f7', 's9',  'Room 302', 'Thursday',  4),
('e76', 'f7', 's10', 'Room 302', 'Thursday',  8),
('e77', 'f7', 's9',  'Room 302', 'Friday',    4),
('e78', 'f7', 's10', 'Room 302', 'Friday',    7),

-- f8 Menon (Mathematics)
('e79', 'f8', 's8',  'Room 303', 'Monday',    7),
('e80', 'f8', 's10', 'Room 303', 'Monday',    8),
('e81', 'f8', 's8',  'Room 303', 'Wednesday', 7),
('e82', 'f8', 's10', 'Room 303', 'Wednesday', 8),
('e83', 'f8', 's8',  'Room 303', 'Friday',    7),
('e84', 'f8', 's10', 'Room 303', 'Friday',    8)
ON CONFLICT (id) DO NOTHING;
