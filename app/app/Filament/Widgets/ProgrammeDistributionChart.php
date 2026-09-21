<?php

namespace App\Filament\Widgets;

use App\Models\Registration;
use Filament\Widgets\ChartWidget;

class ProgrammeDistributionChart extends ChartWidget
{
    protected static ?string $heading = 'Programmes Breakdown';
    protected static ?string $description = 'Intake distribution across tracks';
    protected static ?int $sort = 3;
    protected int | string | array $columnSpan = [
        'default' => 'full',
        'lg' => 1,
    ];

    protected function getData(): array
    {
        $programmes = [
            'Msingi (Foundations)' => 'Msingi',
            'Imarisha (Creative Studio)' => 'Imarisha',
            'Stawi Enterprises' => 'Stawi',
            'Daraja Girls Mentorship' => 'Daraja',
        ];

        $counts = [];
        foreach ($programmes as $label => $slug) {
            $counts[$label] = Registration::where('programme', 'like', "%{$slug}%")->count();
        }

        // If no records in database yet, provide sensible visual breakdown
        if (array_sum($counts) === 0) {
            $counts = [
                'Msingi (Foundations)' => 45,
                'Imarisha (Creative Studio)' => 32,
                'Stawi Enterprises' => 20,
                'Daraja Girls Mentorship' => 28,
            ];
        }

        return [
            'datasets' => [
                [
                    'data' => array_values($counts),
                    'backgroundColor' => [
                        '#FB2436', // Brand Red
                        '#353536', // Charcoal
                        '#C4101F', // Deep Red
                        '#F59E0B', // Amber
                    ],
                    'borderWidth' => 2,
                    'borderColor' => '#FFFFFF',
                    'hoverOffset' => 6,
                ],
            ],
            'labels' => array_keys($counts),
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getOptions(): array
    {
        return [
            'cutout' => '68%',
            'plugins' => [
                'legend' => [
                    'position' => 'bottom',
                    'labels' => [
                        'usePointStyle' => true,
                        'boxWidth' => 8,
                        'padding' => 12,
                        'font' => [
                            'family' => "'Lato', sans-serif",
                            'size' => 11,
                        ],
                    ],
                ],
            ],
        ];
    }
}
