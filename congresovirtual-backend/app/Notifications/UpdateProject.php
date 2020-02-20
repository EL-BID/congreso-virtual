<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class UpdateProject extends Notification
{
    use Queueable;

    protected $project;

    /**
     * Create a new notification instance.
     *
     * @param  object  $project
     * @return void
     */
    public function __construct($project)
    {
        $this->project = $project;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = env('APP_CLIENT_URL') . '/project/' . $this->project->id;
        return (new MailMessage)
            ->subject('¡Mira las últimas novedades de Congreso Virtual!')
            ->markdown('mail.project.update', [
                'user' => $notifiable,
                'project' => $this->project,
                'url' => $url
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
