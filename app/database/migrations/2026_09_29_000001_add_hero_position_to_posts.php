<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Focal point for a story's hero image, stored as a CSS object-position value
 * (e.g. "50% 30%"). Lets editors shift an image up/down/left/right inside the
 * fixed card and hero frames instead of the browser always centre-cropping it.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('hero_position', 20)->default('50% 50%')->after('hero_image');
        });
    }

    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('hero_position');
        });
    }
};
