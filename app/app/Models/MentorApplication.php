<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MentorApplication extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'profession', 'hours_per_month', 'message', 'status'];
}
