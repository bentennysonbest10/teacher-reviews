# 🎓 Teacher Review Platform

A free, anonymous web platform where students can rate and review their professors.
Built for CS departments — organized by semester and section.

🌐 **Live Site:** [teacher-reviews-seven.vercel.app](https://teacher-reviews-seven.vercel.app)

---

## 📸 Screenshots

| Home Page | Section Page | Teacher Detail |
|-----------|-------------|----------------|
| ![Home](https://github.com/user-attachments/assets/6e1da4ef-a242-49c9-9cde-c4ba6e10d3f5) | ![Section](https://github.com/user-attachments/assets/13f93f9f-9af0-464e-99ce-3bfe3cc4d53f) | ![Teacher](https://github.com/user-attachments/assets/7eaca951-e96d-4296-9ee9-5bb0f5477e66) |
---

## ✨ Features

- Browse teachers by **semester and section**
- View teacher **profiles, subjects, and average ratings**
- Submit **anonymous reviews** with star ratings (1–5)
- Reviews display instantly with subject and class context
- **No login required** for students
- Admin manages all data directly via Supabase dashboard
- Ratings **auto-update** via PostgreSQL trigger on every new review
- **Soft delete** — teachers and reviews are hidden, never lost

---

## 🛠️ Tech Stack

| Layer | Tool | Purpose |
|---|---|---|
| Frontend | React + Vite | Fast, modern UI |
| Styling | Tailwind CSS + inline styles | Dark theme, responsive design |
| Database | Supabase (PostgreSQL) | Tables, REST API, RLS |
| Auth | Supabase Auth | Admin access |
| Hosting | Vercel | Free, auto-deploy on push |
| Version Control | GitHub | Code management |

---

## 🗄️ Database Schema

### Tables

<img width="1193" height="782" alt="Screenshot 2026-06-05 104010" src="https://github.com/user-attachments/assets/a49d7191-053d-47ea-b61b-c799389e041f" />


#### `classes`
Stores semesters (e.g. Semester 1, Semester 2).

#### `sections`
Sections under each semester (e.g. Section A, Section B). Linked to `classes`.

#### `subjects`
CS subjects like Programming Fundamentals, Data Structures, etc.

#### `teachers`
Each teacher has a name, photo URL, bio, and an auto-calculated `avg_rating`.

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `name` | VARCHAR | Teacher's full name |
| `photo_url` | TEXT | Link to photo in Supabase Storage |
| `bio` | TEXT | Short description / title |
| `avg_rating` | NUMERIC | Auto-updated by trigger |
| `is_active` | BOOLEAN | Soft delete flag |

#### `teacher_assignments`
Many-to-many join table linking teachers to class/section/subject combinations.
A teacher can have multiple assignments (e.g. teaches Math in Semester 1A and Semester 2B).

#### `reviews`
Anonymous student reviews. Stores rating (1–5), comment, and links to teacher + assignment.
No student identity is stored — only IP for spam control (never shown publicly).

| Column | Type | Description |
|---|---|---|
| `rating` | INT | 1 to 5 stars |
| `comment` | TEXT | Student's written feedback |
| `reviewer_ip` | TEXT | Spam control only, never public |
| `is_visible` | BOOLEAN | Admin can hide reviews |
| `is_flagged` | BOOLEAN | Students can flag reviews |

---

## ⚙️ PostgreSQL Trigger

Ratings auto-update on every review insert or update:

```sql
CREATE OR REPLACE FUNCTION update_avg_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE teacher_assignments
  SET avg_rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM reviews
    WHERE assignment_id = NEW.assignment_id AND is_visible = true
  )
  WHERE id = NEW.assignment_id;

  UPDATE teachers
  SET avg_rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM reviews
    WHERE teacher_id = NEW.teacher_id AND is_visible = true
  )
  WHERE id = NEW.teacher_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_avg_rating
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_avg_rating();
```

---

## 🔐 Row Level Security (RLS)

| Table | Public Can | Admin Can |
|---|---|---|
| `teachers` | Read active only | Full access |
| `sections` | Read all | Full access |
| `classes` | Read all | Full access |
| `subjects` | Read all | Full access |
| `teacher_assignments` | Read active only | Full access |
| `reviews` | Read visible + Insert | Full access |

---

## 📁 Project Structure

```
/src
  /pages
    Home.jsx           ← Semester grid
    SectionPage.jsx    ← Teachers by section
    TeacherDetail.jsx  ← Profile + reviews + review form
  /lib
    supabase.js        ← Supabase client
  index.css            ← Global styles + fonts
  App.jsx              ← Routes
  main.jsx             ← Entry point
```

---

## 🚀 Run Locally

**1. Clone the repo**
```bash
git clone https://github.com/ahmadkhanraj01/teacher-reviews.git
cd teacher-reviews
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env` file in project root**
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**4. Start dev server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌍 Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repository
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click Deploy

Every push to `main` auto-deploys to production.

---

## 🆓 Free Tier Limits

| Service | Free Limit | Usage |
|---|---|---|
| Supabase | 500MB DB, 50k requests/mo | ✅ Well within limits |
| Vercel | 100GB bandwidth/mo | ✅ Fine for small project |
| GitHub | Unlimited repos | ✅ Free |

---

## 🔮 Planned Improvements

- [ ] Search teachers by name
- [ ] Sort reviews by rating / newest
- [ ] Flag button for inappropriate reviews
- [ ] Rate limiting (1 review per teacher per 24hrs per IP)
- [ ] Admin dashboard for managing teachers and reviews
- [ ] Email notification when a review is flagged
- [ ] Export reviews as CSV

---

## 👨‍💻 Built By

