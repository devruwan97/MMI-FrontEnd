// Dummy data based on Database_tables.pdf schema

export const courses = [
  {
    id: 1,
    title: "Mathematics Grade 10",
    category: "Mathematics",
    fee: 150,
    capacity: 20,
    description: "Comprehensive mathematics course covering algebra, geometry, and trigonometry for Grade 10 students.",
    created_by: 1,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80",
    units: [
      { id: 1, unit_code: "MATH101", unit_name: "Algebra Fundamentals", description: "Linear equations, quadratic equations, polynomials" },
      { id: 2, unit_code: "MATH102", unit_name: "Geometry", description: "Triangles, circles, and coordinate geometry" },
      { id: 3, unit_code: "MATH103", unit_name: "Trigonometry", description: "Sine, cosine, tangent and their applications" },
    ],
  },
  {
    id: 2,
    title: "English Literature & Composition",
    category: "English",
    fee: 130,
    capacity: 18,
    description: "Develop writing skills and explore classic and contemporary literature.",
    created_by: 2,
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80",
    units: [
      { id: 4, unit_code: "ENG101", unit_name: "Essay Writing", description: "Argumentative and analytical essays" },
      { id: 5, unit_code: "ENG102", unit_name: "Classic Literature", description: "Shakespeare, Dickens, and contemporaries" },
    ],
  },
  {
    id: 3,
    title: "Science: Physics & Chemistry",
    category: "Science",
    fee: 170,
    capacity: 15,
    description: "Hands-on science course combining physics principles and chemistry experiments.",
    created_by: 3,
    image: "https://images.unsplash.com/photo-1532094349884-543559196a72?w=400&q=80",
    units: [
      { id: 6, unit_code: "SCI101", unit_name: "Mechanics", description: "Forces, motion, energy and momentum" },
      { id: 7, unit_code: "SCI102", unit_name: "Atomic Structure", description: "Atoms, molecules and chemical bonding" },
      { id: 8, unit_code: "SCI103", unit_name: "Thermodynamics", description: "Heat, temperature and energy transfer" },
    ],
  },
  {
    id: 4,
    title: "Computer Science Fundamentals",
    category: "Technology",
    fee: 200,
    capacity: 16,
    description: "Introduction to programming, algorithms, and computational thinking.",
    created_by: 4,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80",
    units: [
      { id: 9, unit_code: "CS101", unit_name: "Programming Basics", description: "Variables, loops, functions in Python" },
      { id: 10, unit_code: "CS102", unit_name: "Data Structures", description: "Arrays, lists, stacks and queues" },
    ],
  },
  {
    id: 5,
    title: "History & Social Studies",
    category: "Humanities",
    fee: 120,
    capacity: 22,
    description: "Explore world history, geography and social systems from ancient to modern times.",
    created_by: 2,
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
    units: [
      { id: 11, unit_code: "HST101", unit_name: "Ancient Civilisations", description: "Egypt, Greece and Rome" },
      { id: 12, unit_code: "HST102", unit_name: "Modern History", description: "World Wars and post-colonial era" },
    ],
  },
  {
    id: 6,
    title: "Art & Creative Design",
    category: "Arts",
    fee: 110,
    capacity: 12,
    description: "Explore drawing, painting, and digital design fundamentals.",
    created_by: 5,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80",
    units: [
      { id: 13, unit_code: "ART101", unit_name: "Drawing Techniques", description: "Sketching, shading and perspective" },
      { id: 14, unit_code: "ART102", unit_name: "Digital Design", description: "Intro to Canva and Adobe tools" },
    ],
  },
];

export const teachers = [
  { id: 1, user_id: 101, name: "Dr. Sarah Mitchell", email: "s.mitchell@mathsmasterylms.com.au", qualifications: "PhD Mathematics, University of Melbourne", bio: "15 years teaching experience in secondary mathematics.", availability: { days: ["Monday", "Wednesday", "Friday"] }, courses: [1] },
  { id: 2, user_id: 102, name: "Mr. James Thornton", email: "j.thornton@mathsmasterylms.com.au", qualifications: "MA English Literature, ANU", bio: "Passionate about bringing literature to life for young learners.", availability: { days: ["Tuesday", "Thursday"] }, courses: [2, 5] },
  { id: 3, user_id: 103, name: "Ms. Priya Nair", email: "p.nair@mathsmasterylms.com.au", qualifications: "BSc Physics, MSc Chemistry", bio: "Makes complex science concepts accessible and fun.", availability: { days: ["Monday", "Tuesday", "Thursday"] }, courses: [3] },
  { id: 4, user_id: 104, name: "Mr. Kevin Liu", email: "k.liu@mathsmasterylms.com.au", qualifications: "BE Computer Science, UNSW", bio: "Industry experience at Google before transitioning to education.", availability: { days: ["Wednesday", "Friday"] }, courses: [4] },
  { id: 5, user_id: 105, name: "Ms. Emma Watson", email: "e.watson@mathsmasterylms.com.au", qualifications: "BA Fine Arts, VCA", bio: "Professional artist and passionate art educator.", availability: { days: ["Tuesday", "Friday"] }, courses: [6] },
];

export const students = [
  { id: 1, user_id: 201, name: "Liam Johnson", email: "liam.j@mathsmasterylms.com.au", date_of_birth: "2009-03-15", parent_name: "Robert Johnson", address: "12 Oak Street, Melbourne VIC 3000" },
  { id: 2, user_id: 202, name: "Ava Smith", email: "ava.s@mathsmasterylms.com.au", date_of_birth: "2010-07-22", parent_name: "Mary Smith", address: "45 Pine Ave, Sydney NSW 2000" },
  { id: 3, user_id: 203, name: "Noah Williams", email: "noah.w@mathsmasterylms.com.au", date_of_birth: "2009-11-08", parent_name: "David Williams", address: "78 Elm Road, Brisbane QLD 4000" },
  { id: 4, user_id: 204, name: "Olivia Brown", email: "olivia.b@mathsmasterylms.com.au", date_of_birth: "2010-01-30", parent_name: "Jennifer Brown", address: "23 Maple Drive, Perth WA 6000" },
  { id: 5, user_id: 205, name: "Ethan Davis", email: "ethan.d@mathsmasterylms.com.au", date_of_birth: "2009-06-14", parent_name: "Michael Davis", address: "56 Cedar Lane, Adelaide SA 5000" },
  { id: 6, user_id: 206, name: "Sophia Martinez", email: "sophia.m@mathsmasterylms.com.au", date_of_birth: "2010-09-05", parent_name: "Carlos Martinez", address: "34 Birch Blvd, Melbourne VIC 3001" },
  { id: 7, user_id: 207, name: "Mason Taylor", email: "mason.t@mathsmasterylms.com.au", date_of_birth: "2009-12-19", parent_name: "Susan Taylor", address: "90 Willow Way, Sydney NSW 2001" },
  { id: 8, user_id: 208, name: "Isabella Anderson", email: "isabella.a@mathsmasterylms.com.au", date_of_birth: "2010-04-27", parent_name: "Thomas Anderson", address: "67 Spruce St, Brisbane QLD 4001" },
];

export const schedules = [
  { id: 1, course_id: 1, teacher_id: 1, day_of_week: "Monday", start_time: "09:00", end_time: "10:30", location: "Room 101" },
  { id: 2, course_id: 1, teacher_id: 1, day_of_week: "Wednesday", start_time: "09:00", end_time: "10:30", location: "Room 101" },
  { id: 3, course_id: 2, teacher_id: 2, day_of_week: "Tuesday", start_time: "11:00", end_time: "12:30", location: "Room 203" },
  { id: 4, course_id: 2, teacher_id: 2, day_of_week: "Thursday", start_time: "11:00", end_time: "12:30", location: "Room 203" },
  { id: 5, course_id: 3, teacher_id: 3, day_of_week: "Monday", start_time: "13:00", end_time: "14:30", location: "Lab A" },
  { id: 6, course_id: 3, teacher_id: 3, day_of_week: "Thursday", start_time: "13:00", end_time: "14:30", location: "Lab A" },
  { id: 7, course_id: 4, teacher_id: 4, day_of_week: "Wednesday", start_time: "14:00", end_time: "15:30", location: "Computer Lab" },
  { id: 8, course_id: 4, teacher_id: 4, day_of_week: "Friday", start_time: "14:00", end_time: "15:30", location: "Computer Lab" },
  { id: 9, course_id: 5, teacher_id: 2, day_of_week: "Tuesday", start_time: "09:00", end_time: "10:30", location: "Room 105" },
  { id: 10, course_id: 6, teacher_id: 5, day_of_week: "Friday", start_time: "10:00", end_time: "11:30", location: "Art Studio" },
];

export const enrollments = [
  { id: 1, student_id: 1, course_id: 1, status: "active", enrolled_at: "2026-01-15" },
  { id: 2, student_id: 1, course_id: 4, status: "active", enrolled_at: "2026-01-15" },
  { id: 3, student_id: 2, course_id: 1, status: "active", enrolled_at: "2026-01-16" },
  { id: 4, student_id: 2, course_id: 2, status: "active", enrolled_at: "2026-01-16" },
  { id: 5, student_id: 3, course_id: 3, status: "active", enrolled_at: "2026-01-17" },
  { id: 6, student_id: 4, course_id: 2, status: "active", enrolled_at: "2026-01-18" },
  { id: 7, student_id: 4, course_id: 5, status: "completed", enrolled_at: "2025-07-01" },
  { id: 8, student_id: 5, course_id: 4, status: "active", enrolled_at: "2026-01-19" },
  { id: 9, student_id: 6, course_id: 1, status: "active", enrolled_at: "2026-01-20" },
  { id: 10, student_id: 7, course_id: 6, status: "active", enrolled_at: "2026-01-21" },
  { id: 11, student_id: 8, course_id: 3, status: "pending", enrolled_at: "2026-01-22" },
  { id: 12, student_id: 3, course_id: 5, status: "active", enrolled_at: "2026-01-17" },
];

export const discounts = [
  { id: 1, name: "Sibling Discount", type: "percentage", value: 10, condition: "2+ siblings enrolled", active: true },
  { id: 2, name: "Early Bird", type: "percentage", value: 15, condition: "Enroll 4 weeks before term start", active: true },
  { id: 3, name: "Multi-Course Bundle", type: "percentage", value: 20, condition: "Enrol in 3+ courses", active: true },
  { id: 4, name: "Loyalty Discount", type: "fixed", value: 50, condition: "Returning student (2+ terms)", active: true },
  { id: 5, name: "Scholarship", type: "percentage", value: 50, condition: "Academic merit – requires application", active: true },
];

export const payments = [
  { id: 1, student_id: 1, enrollment_id: 1, amount: 150, discount_applied: "Early Bird", final_amount: 127.50, status: "paid", payment_date: "2026-01-10" },
  { id: 2, student_id: 1, enrollment_id: 2, amount: 200, discount_applied: "Multi-Course Bundle", final_amount: 160, status: "paid", payment_date: "2026-01-10" },
  { id: 3, student_id: 2, enrollment_id: 3, amount: 150, discount_applied: null, final_amount: 150, status: "paid", payment_date: "2026-01-16" },
  { id: 4, student_id: 2, enrollment_id: 4, amount: 130, discount_applied: "Sibling Discount", final_amount: 117, status: "paid", payment_date: "2026-01-16" },
  { id: 5, student_id: 3, enrollment_id: 5, amount: 170, discount_applied: null, final_amount: 170, status: "pending", payment_date: null },
  { id: 6, student_id: 4, enrollment_id: 6, amount: 130, discount_applied: "Loyalty Discount", final_amount: 80, status: "paid", payment_date: "2026-01-18" },
  { id: 7, student_id: 5, enrollment_id: 8, amount: 200, discount_applied: null, final_amount: 200, status: "overdue", payment_date: null },
  { id: 8, student_id: 6, enrollment_id: 9, amount: 150, discount_applied: "Sibling Discount", final_amount: 135, status: "paid", payment_date: "2026-01-20" },
];

export const stats = {
  totalStudents: 8,
  totalTeachers: 5,
  totalCourses: 6,
  activeEnrollments: 10,
  totalRevenue: 939.50,
  pendingPayments: 370,
};
