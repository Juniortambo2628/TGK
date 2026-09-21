<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\MentorApplication;
use App\Models\Registration;
use App\Models\ScholarshipApplication;
use App\Models\Subscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;

class FormController extends Controller
{
    public function subscribe(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'email:rfc,dns', 'max:255'],
        ]);

        $this->throttle($request, 'newsletter', 5);

        Subscriber::firstOrCreate(
            ['email' => strtolower($data['email'])],
            ['ip' => $request->ip()]
        );

        return back()->with('success', "You're on the list.");
    }

    public function contact(Request $request)
    {
        $data = $request->validate([
            'name'    => ['required', 'string', 'max:120'],
            'email'   => ['required', 'email:rfc', 'max:255'],
            'phone'   => ['nullable', 'string', 'max:40'],
            'topic'   => ['nullable', 'string', 'max:40'],
            'message' => ['required', 'string', 'min:5', 'max:5000'],
        ]);

        $this->throttle($request, 'contact', 5);

        $msg = ContactMessage::create($data + ['ip' => $request->ip()]);
        $this->notify('New contact message · '.($msg->topic ?: 'general'), $msg->toArray());

        return back()->with('success', "Thanks. We'll be in touch.");
    }

    public function mentor(Request $request)
    {
        $data = $request->validate([
            'name'            => ['required', 'string', 'max:120'],
            'email'           => ['required', 'email:rfc', 'max:255'],
            'phone'           => ['nullable', 'string', 'max:40'],
            'profession'      => ['nullable', 'string', 'max:120'],
            'hours_per_month' => ['nullable', 'string', 'max:40'],
            'message'         => ['nullable', 'string', 'max:3000'],
        ]);

        $this->throttle($request, 'mentor', 3);

        $app = MentorApplication::create($data);
        $this->notify('New mentor application', $app->toArray());

        return back()->with('success', "Thanks. We'll be in touch.");
    }

    public function scholarship(Request $request)
    {
        $data = $request->validate([
            'name'         => ['required', 'string', 'max:120'],
            'email'        => ['required', 'email:rfc', 'max:255'],
            'phone'        => ['nullable', 'string', 'max:40'],
            'organisation' => ['nullable', 'string', 'max:200'],
            'amount'       => ['nullable', 'string', 'max:40'],
            'message'      => ['nullable', 'string', 'max:3000'],
        ]);

        $this->throttle($request, 'scholarship', 3);

        $app = ScholarshipApplication::create($data);
        $this->notify('New scholarship enquiry', $app->toArray());

        return back()->with('success', "Thanks. We'll be in touch.");
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name'      => ['required', 'string', 'max:120'],
            'email'     => ['required', 'email:rfc', 'max:255'],
            'phone'     => ['required', 'string', 'max:40'],
            'dob'       => ['nullable', 'date'],
            'location'  => ['nullable', 'string', 'max:120'],
            'programme' => ['required', 'in:msingi,imarisha,stawi,daraja'],
            'message'   => ['nullable', 'string', 'max:3000'],
        ]);

        $this->throttle($request, 'register', 3);

        $reg = Registration::create($data);
        $this->notify('New programme registration ('.$reg->programme.')', $reg->toArray());

        return back()->with('success', "Thanks. We'll be in touch about the next intake.");
    }

    protected function throttle(Request $request, string $key, int $maxPerMinute): void
    {
        $rl = 'form:'.$key.':'.$request->ip();
        if (RateLimiter::tooManyAttempts($rl, $maxPerMinute)) {
            abort(429, 'Too many attempts. Please try again in a minute.');
        }
        RateLimiter::hit($rl, 60);
    }

    protected function notify(string $subject, array $payload): void
    {
        $to = config('mail.notify_email', env('CONTACT_NOTIFY_EMAIL'));
        if (! $to) return;

        try {
            Mail::raw(json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), function ($m) use ($to, $subject) {
                $m->to($to)->subject($subject);
            });
        } catch (\Throwable $e) {
            report($e);
        }
    }
}
