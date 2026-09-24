<?php

namespace Database\Seeders;

use App\Models\ContactMessage;
use App\Models\MentorApplication;
use App\Models\Registration;
use App\Models\ScholarshipApplication;
use App\Models\Subscriber;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class SubmissionSeeder extends Seeder
{
    public function run(): void
    {
        // Clean any partial rows from previous attempt
        Registration::truncate();
        MentorApplication::truncate();
        ContactMessage::truncate();
        ScholarshipApplication::truncate();
        Subscriber::truncate();

        $names = [
            'Amina Wanjiru' => ['programme' => 'Msingi', 'location' => 'Nairobi (Kibera)', 'email' => 'amina.w@gmail.com', 'phone' => '+254 712 345 678'],
            'Brian Kiprop' => ['programme' => 'Imarisha', 'location' => 'Eldoret (Juakali)', 'email' => 'brian.kip@yahoo.com', 'phone' => '+254 723 456 789'],
            'Faith Chebet' => ['programme' => 'Daraja', 'location' => 'Eldoret (Turbo)', 'email' => 'faith.c@gmail.com', 'phone' => '+254 734 567 890'],
            'Kevin Omondi' => ['programme' => 'Stawi', 'location' => 'Nairobi (Mathare)', 'email' => 'omondi.k@gmail.com', 'phone' => '+254 745 678 901'],
            'Mercy Akinyi' => ['programme' => 'Msingi', 'location' => 'Nairobi (Mukuru)', 'email' => 'mercy.akinyi@outlook.com', 'phone' => '+254 756 789 012'],
            'Dennis Mwangi' => ['programme' => 'Imarisha', 'location' => 'Nairobi (Eastleigh)', 'email' => 'dmwangi@gmail.com', 'phone' => '+254 767 890 123'],
            'Sharon Jepkoech' => ['programme' => 'Daraja', 'location' => 'Eldoret (Kimumu)', 'email' => 'sharon.j@gmail.com', 'phone' => '+254 778 901 234'],
            'Victor Mutua' => ['programme' => 'Msingi', 'location' => 'Machakos / Nairobi', 'email' => 'vmutua@gmail.com', 'phone' => '+254 789 012 345'],
            'Grace Nyambura' => ['programme' => 'Stawi', 'location' => 'Nairobi (Kasarani)', 'email' => 'grace.nyam@gmail.com', 'phone' => '+254 790 123 456'],
            'Emmanuel Kibet' => ['programme' => 'Imarisha', 'location' => 'Eldoret (Elgon View)', 'email' => 'ekibet@gmail.com', 'phone' => '+254 701 234 567'],
        ];

        $statuses = ['pending', 'reviewed', 'approved', 'approved', 'pending'];

        $i = 0;
        foreach ($names as $name => $info) {
            $date = Carbon::now()->subDays(rand(1, 90));
            Registration::create([
                'name' => $name,
                'email' => $info['email'],
                'phone' => $info['phone'],
                'dob' => Carbon::now()->subYears(rand(18, 24)),
                'location' => $info['location'],
                'programme' => $info['programme'],
                'message' => 'Looking forward to building digital and entrepreneurial skills to launch a sustainable career.',
                'status' => $statuses[$i % count($statuses)],
                'created_at' => $date,
                'updated_at' => $date,
            ]);
            $i++;
        }

        // Mentor Applications
        $mentors = [
            ['name' => 'Dr. James Kariuki', 'email' => 'jkariuki@strathmore.edu', 'phone' => '+254 722 100 200', 'profession' => 'Product Designer & Lecturer', 'hours' => 6],
            ['name' => 'Sarah Nduta', 'email' => 'sarah.nduta@safaricom.co.ke', 'phone' => '+254 722 300 400', 'profession' => 'Financial Literacy Specialist', 'hours' => 4],
            ['name' => 'Peter Rotich', 'email' => 'protich@agrokenya.org', 'phone' => '+254 722 500 600', 'profession' => 'Agri-Enterprise Consultant', 'hours' => 8],
            ['name' => 'Wanjiku Mwangi', 'email' => 'wanjiku@creativeske.com', 'phone' => '+254 722 700 800', 'profession' => 'Creative Director & Photographer', 'hours' => 4],
        ];

        foreach ($mentors as $idx => $m) {
            $date = Carbon::now()->subDays(rand(2, 60));
            MentorApplication::create([
                'name' => $m['name'],
                'email' => $m['email'],
                'phone' => $m['phone'],
                'profession' => $m['profession'],
                'hours_per_month' => $m['hours'],
                'message' => 'Committed to empowering young people with structured mentorship and career guidance.',
                'status' => ($idx % 2 === 0) ? 'approved' : 'pending',
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        // Contact messages
        $contacts = [
            ['name' => 'Linet Achieng', 'email' => 'linet@rotaryke.org', 'topic' => 'Partnership Inquiry', 'message' => 'We would love to discuss sponsoring 15 young women through the Msingi programme.'],
            ['name' => 'Mark Korir', 'email' => 'mark.korir@eldoretchamber.co.ke', 'topic' => 'Stawi Corporate Orders', 'message' => 'Looking to purchase branded corporate merchandise for our upcoming regional conference.'],
        ];

        foreach ($contacts as $c) {
            $date = Carbon::now()->subDays(rand(1, 30));
            ContactMessage::create([
                'name' => $c['name'],
                'email' => $c['email'],
                'phone' => '+254 700 111 222',
                'topic' => $c['topic'],
                'message' => $c['message'],
                'is_handled' => false,
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        // Scholarship Applications
        $scholarships = [
            ['name' => 'Kipchoge Foundation', 'email' => 'grants@kipchogefoundation.org', 'organisation' => 'Eliud Kipchoge Foundation', 'amount' => 500000, 'message' => 'Providing scholarships for North Rift youth training cohorts.'],
        ];

        foreach ($scholarships as $s) {
            $date = Carbon::now()->subDays(rand(5, 20));
            ScholarshipApplication::create([
                'name' => $s['name'],
                'email' => $s['email'],
                'phone' => '+254 700 888 999',
                'organisation' => $s['organisation'],
                'amount' => $s['amount'],
                'message' => $s['message'],
                'status' => 'approved',
                'created_at' => $date,
                'updated_at' => $date,
            ]);
        }

        // Subscribers
        $emails = [
            'supporter1@gmail.com',
            'alumni@goodkenyan.org',
            'partner@undp.org',
            'info@techhub.co.ke',
            'youthleader@eldoret.ke',
        ];

        foreach ($emails as $email) {
            Subscriber::create([
                'email' => $email,
                'created_at' => Carbon::now()->subDays(rand(1, 45)),
            ]);
        }
    }
}
