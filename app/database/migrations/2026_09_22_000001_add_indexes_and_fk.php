<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sessions', function (Blueprint $table) {
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->index('is_handled');
        });

        Schema::table('mentor_applications', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('scholarship_applications', function (Blueprint $table) {
            $table->index('status');
        });

        Schema::table('registrations', function (Blueprint $table) {
            $table->index('status');
            $table->index('programme');
        });
    }

    public function down(): void
    {
        Schema::table('sessions', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
        });

        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropIndex(['is_handled']);
        });

        Schema::table('mentor_applications', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('scholarship_applications', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('registrations', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['programme']);
        });
    }
};
