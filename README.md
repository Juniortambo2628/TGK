# Good Kenyan Foundation (TGK)

Good Kenyan equips high school leavers with 21st-century job and life skills, mentorship, and economic pathways to move from education into dignified work or entrepreneurship.

## Technology Stack

- **Backend**: Laravel 12, PHP 8.2+, MySQL / SQLite
- **Admin CMS**: Filament 3.3 (Content Management, Submissions, Media Library, Subsections)
- **Frontend**: Inertia.js (v2), React 19, Tailwind CSS / Vanilla styling
- **Media Engine**: Native GD Image Optimizer (auto-downscaling, WebP/JPEG 82% compression, drag-to-reposition & crop)

## Setup & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Juniortambo2628/TGK.git
   cd TGK/app
   ```

2. **Install PHP & Node dependencies:**
   ```bash
   composer install
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Run database migrations & seeders:**
   ```bash
   php artisan migrate --seed
   ```

5. **Symlink storage:**
   ```bash
   php artisan storage:link
   ```

6. **Start development servers:**
   ```bash
   # In terminal 1 (Vite)
   npm run dev

   # In terminal 2 (Laravel)
   php artisan serve
   ```

7. **Access:**
   - Public Website: `http://localhost:8000`
   - Admin CMS Dashboard: `http://localhost:8000/admin`
