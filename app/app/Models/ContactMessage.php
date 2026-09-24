<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    protected $fillable = ['name', 'email', 'phone', 'topic', 'message', 'is_handled', 'ip'];

    protected $casts = ['is_handled' => 'boolean'];
}
