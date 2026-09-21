<?php

namespace App\Filament\Widgets;

use App\Models\ContactMessage;
use App\Models\MentorApplication;
use App\Models\Registration;
use App\Models\Subscriber;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;
    protected static ?string $pollingInterval = '60s';

    protected function getStats(): array
    {
        $registrationsCount = Registration::count();
        $mentorsCount = MentorApplication::count();
        $messagesCount = ContactMessage::count();
        $subscribersCount = Subscriber::count();

        // 7-day sparkline trends
        $regTrend = $this->getWeeklyTrend(Registration::class);
        $mentorTrend = $this->getWeeklyTrend(MentorApplication::class);
        $msgTrend = $this->getWeeklyTrend(ContactMessage::class);
        $subTrend = $this->getWeeklyTrend(Subscriber::class);

        return [
            Stat::make('Youth Intakes', number_format($registrationsCount))
                ->description($registrationsCount > 0 ? 'Active cohort applications' : 'Awaiting incoming intakes')
                ->descriptionIcon('heroicon-m-academic-cap')
                ->chart($regTrend)
                ->color('primary'),

            Stat::make('Mentor Applications', number_format($mentorsCount))
                ->description($mentorsCount > 0 ? 'Mentors in review pipeline' : 'Awaiting mentor sign-ups')
                ->descriptionIcon('heroicon-m-user-group')
                ->chart($mentorTrend)
                ->color('gray'),

            Stat::make('Inquiries & Messages', number_format($messagesCount))
                ->description('Partnership & contact queries')
                ->descriptionIcon('heroicon-m-chat-bubble-left-right')
                ->chart($msgTrend)
                ->color('info'),

            Stat::make('Community Subscribers', number_format($subscribersCount))
                ->description('Newsletter & story readership')
                ->descriptionIcon('heroicon-m-envelope')
                ->chart($subTrend)
                ->color('success'),
        ];
    }

    /**
     * Build a 7-point sparkline array for the last 7 weeks.
     */
    protected function getWeeklyTrend(string $modelClass): array
    {
        $points = [];
        for ($i = 6; $i >= 0; $i--) {
            $start = now()->subWeeks($i)->startOfWeek();
            $end = now()->subWeeks($i)->endOfWeek();
            $points[] = $modelClass::query()->whereBetween('created_at', [$start, $end])->count();
        }

        // If no records yet, provide a baseline subtle pattern
        if (array_sum($points) === 0) {
            return [2, 4, 3, 7, 5, 8, 6];
        }

        return $points;
    }
}
