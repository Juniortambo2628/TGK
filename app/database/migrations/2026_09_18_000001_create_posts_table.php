<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('excerpt', 500)->nullable();
            $table->longText('body');
            $table->string('hero_image')->nullable();
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 300)->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->index(['published_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
