<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->ipAddress('ip')->nullable();
            $table->timestamps();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('topic')->nullable();
            $table->text('message');
            $table->boolean('is_handled')->default(false);
            $table->ipAddress('ip')->nullable();
            $table->timestamps();
        });

        Schema::create('mentor_applications', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('profession')->nullable();
            $table->string('hours_per_month')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('new');
            $table->timestamps();
        });

        Schema::create('scholarship_applications', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('organisation')->nullable();
            $table->string('amount')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('new');
            $table->timestamps();
        });

        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->date('dob')->nullable();
            $table->string('location')->nullable();
            $table->string('programme')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('new');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registrations');
        Schema::dropIfExists('scholarship_applications');
        Schema::dropIfExists('mentor_applications');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('subscribers');
    }
};
