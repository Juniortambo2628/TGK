<?php

namespace Database\Seeders;

use App\Models\ContentBlock;
use App\Models\Setting;
use App\Support\Content;
use Illuminate\Database\Seeder;

/**
 * Populates content_blocks + settings with the current public-site copy so
 * every CMS editor opens with the real page as its starting point.
 *
 * Idempotent: uses ContentBlock::set which does an updateOrInsert, so
 * running it more than once just overwrites the same rows.
 */
class PageContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedSettings();
        $this->seedHome();
        $this->seedAbout();
        $this->seedOurModel();
        $this->seedReginaYego();
        $this->seedStawi();
        $this->seedStories();
        $this->seedPartners();
        $this->seedGetInvolved();
        $this->seedContact();

        // Flush every page cache after a full seed so the public site
        // shows the freshly-written values immediately.
        foreach (['home','about','our-model','regina-yego','stawi','stories','partners','get-involved','contact'] as $p) {
            Content::flush($p);
        }
        Setting::flush();
    }

    /* --------------------------- Site settings --------------------------- */

    protected function seedSettings(): void
    {
        $keys = [
            'site_name'        => 'Good Kenyan Foundation',
            'tagline'          => 'From school to opportunity.',
            'short_description'=> 'Good Kenyan Foundation equips young people with the skills, mentorship and pathways to move from education into work or entrepreneurship.',
            'contact_email'    => 'lucy.chepchumba@goodkenyan.org',
            'notify_email'     => 'lucy.chepchumba@goodkenyan.org',
            'contact_phone'    => '+254 708 020 530',
            'address_eldoret'  => 'Regina Yego Girls Center, Mile 13 Juakali, Eldoret',
            'address_nairobi'  => 'PO Box 15137, 00100 Nairobi, Kenya',
            'donate_url'       => env('DONATE_URL', 'https://give-usa.keela.co/good-kenyan-foundation-donate-page'),
            'social_facebook'  => 'https://www.facebook.com/GoodKenyann/',
            'social_instagram' => 'https://www.instagram.com/goodkenyann/',
            'social_x'         => 'https://x.com/GoodKenyann',
        ];
        foreach ($keys as $k => $v) Setting::set($k, $v);
    }

    /* ------------------------------ Home page ---------------------------- */

    protected function seedHome(): void
    {
        $blocks = [
            'hero.eyebrow'  => 'Good Kenyan Foundation',
            'hero.title'    => 'From school to opportunity.',
            'hero.subtitle' => 'Good Kenyan equips young people with the skills, mentorship and pathways they need to move from education into work or entrepreneurship.',
            'hero.images'   => [
                'images/landing/hero-slide-1.jpg',
                'images/landing/hero-slide-2.jpg',
                'images/landing/hero-slide-3.jpg',
            ],
            'hero.cta_primary_route'    => '__donate',
            'hero.cta_primary_external' => '',
            'hero.cta_primary_label'    => 'Support a young person',
            'hero.cta_secondary_route'    => '/our-model',
            'hero.cta_secondary_external' => '',
            'hero.cta_secondary_label'    => 'See how it works',

            'who.eyebrow' => 'Who we are',
            'who.title'   => 'A Kenyan led organisation serving youth.',
            'who.body'    => '<p>Good Kenyan Foundation has a proven record of helping young people bridge the gap between school and opportunity. We work with youth aged 18 to 24 from low income rural communities and Nairobi\'s informal settlements, particularly vulnerable young women, guiding them from uncertainty after high school into clear, practical pathways toward work, business or further education, with a strong focus on the creative economy.</p><p>Alongside this, our Daraja programme works upstream with girls aged 14 to 17 at risk of dropping out, supporting them through high school with mentorship and life skills so they complete their education and leave with a plan.</p>',
            'who.mission' => '<p>To grow the potential of Kenya\'s youth by providing skills, mentorship and tools that enable them to build sustainable livelihoods.</p>',
            'who.vision'  => '<p>A Kenya where youth creativity drives meaningful work and sustainable livelihoods.</p>',

            'impact.eyebrow'      => 'Impact by the numbers',
            'impact.title'        => 'A track record we count and can point to.',
            'impact.body'         => 'Since 2017, we have built a structured gateway from school-leaving into economic independence. Our alumni are running micro-enterprises, working in the creative and service sectors, and moving through targeted scholarship pipelines.',
            'impact.stats'        => [
                ['value' => '600',    'label' => 'Youth skilled and mentored', 'description' => 'Direct graduates of Msingi, Imarisha and Stawi.'],
                ['value' => '75%',    'label' => 'Transition rate',            'description' => 'Move into work, business or further study after the programme.'],
                ['value' => '400',    'label' => 'Mentors equipped',           'description' => 'Trained to hold a mentee relationship end to end.'],
                ['value' => '2,000',  'label' => 'Youth indirectly supported', 'description' => 'Family, cohort peers and community touched by the work.'],
            ],
            'impact.centers_text' => '2 Centers in Nairobi and Eldoret.',

            'problem.eyebrow'     => "The problem we're solving",
            'problem.title'       => 'The transition trap.',
            'problem.description' => 'What happens between finishing school and finding a livelihood decides most of what comes next. For a majority of Kenyan youth, that space is empty.',

            'believe.body' => '<p><strong>IF</strong> vulnerable youth engage in a holistic, gender responsive programme that builds individualised career plans, digital skills, life skills and self awareness, <strong>AND IF</strong> they receive 6 to 18 months of sustained, staged support, <strong>THEN</strong> they build the confidence, skills and networks to transition into their chosen pathway and begin earning, <strong>SO THAT</strong> over time they lead sustainable, dignified livelihoods with greater control over their economic, health and life decisions.</p>',

            'model.eyebrow'     => 'From uncertainty to income',
            'model.title'       => 'The Discover, Develop, Launch model.',
            'model.description' => 'Three interconnected stages, not isolated programmes, but a single structured journey from self discovery to economic participation.',

            'stawi.eyebrow' => 'Stawi Enterprises',
            'stawi.title'   => "Not a side venture. It's how we pay young people.",
            'stawi.body'    => '<p>Stawi Enterprises is the commercial arm of our model. It is how we give young people paid work with real clients, and how we carry a growing share of our own costs rather than starting every year from zero.</p><p>When you buy from us, you are buying good work and funding a livelihood.</p>',

            'cta.title'       => "Let's build something with a young person's name on it.",
            'cta.description' => "Fund a cohort, hire our services or send a young person to the next intake. We'll write back.",
        ];
        $this->write('home', $blocks);
    }

    /* ------------------------------ About -------------------------------- */

    protected function seedAbout(): void
    {
        $this->write('about', [
            'hero.eyebrow'  => 'Who we are',
            'hero.title'    => 'A Kenyan led organisation serving youth.',
            'hero.subtitle' => 'We have a proven record of helping young people bridge the gap between school and opportunity, with a strong focus on the creative economy.',
            'hero.images'   => ['images/landing/about-hero.jpg'],
            'story.eyebrow' => 'Our story',
            'story.title'   => 'Founded in 2017. Based in Eldoret and Nairobi.',
            'story.body'    => '<p>We work with youth aged 18 to 24 from low income rural communities and Nairobi\'s informal settlements, particularly vulnerable young women, guiding them from uncertainty after high school into clear, practical pathways toward work, business or further education.</p><p>Alongside this, our Daraja programme works upstream with girls aged 14 to 17 at risk of dropping out, supporting them through high school with mentorship and life skills so they complete their education and leave with a plan.</p>',
            'mission'       => '<p>To grow the potential of Kenya\'s youth by providing skills, mentorship and tools that enable them to build sustainable livelihoods.</p>',
            'vision'        => '<p>A Kenya where youth creativity drives meaningful work and sustainable livelihoods.</p>',
            'values.title'  => 'Warm, vibrant, clean, modern.',
            'values.body'   => '<p>We think like a person, not a company. When we talk about young people and their transition into work, we are experts, and we sound like it: knowledgeable and friendly. Never institutional, never pitying, never shouty.</p><p>Everything we publish should sound like a person wrote it for a person, and every interaction should feel full of possibility.</p>',
            'values.image'  => ['images/landing/values.jpg'],
        ]);
    }

    /* ---------------------------- Our Model ------------------------------ */

    protected function seedOurModel(): void
    {
        $this->write('our-model', [
            'hero.eyebrow'  => 'Our model',
            'hero.title'    => 'From uncertainty to income.',
            'hero.subtitle' => 'Three interconnected stages, one structured journey from self discovery to economic participation.',
            'hero.images'   => ['images/landing/model-hero.jpg'],
            'stages'        => [
                ['stage' => 'Discover', 'name' => 'Msingi',   'swahili' => 'Foundation',       'duration' => '6 weeks',   'description' => 'Participants build self awareness, clarity, and the digital foundations needed to make informed decisions about their futures.', 'exit' => 'Certificate in Digital Skills and a clear individual direction.'],
                ['stage' => 'Develop',  'name' => 'Imarisha', 'swahili' => 'Training',         'duration' => '6 months',  'description' => 'Participants enter focused technical pathways designed with industry to build market relevant skills for the creative and service economy.', 'exit' => 'Industry verified skills and employer relationships.'],
                ['stage' => 'Launch',   'name' => 'Stawi',    'swahili' => 'Work & Enterprise', 'duration' => '1 year',    'description' => 'Participants gain paid work experience through Stawi Enterprises, transitioning into employment or supported entrepreneurship with continued alumni support.', 'exit' => 'Three pathways: employment, entrepreneurship, or higher education.'],
            ],
            'daraja.eyebrow' => 'Upstream',
            'daraja.title'   => 'Daraja: staying in school.',
            'daraja.body'    => '<p>Daraja works with girls aged 14 to 17 at risk of dropping out. Through structured mentorship and life skills at Regina Yego Girls Center, they complete high school and leave with a plan for what comes next.</p>',
            'daraja.image'   => ['images/landing/daraja.jpg'],
        ]);
    }

    /* ---------------------------- Regina Yego ---------------------------- */

    protected function seedReginaYego(): void
    {
        $this->write('regina-yego', [
            'hero.eyebrow'  => 'Regina Yego Girls Center',
            'hero.title'    => 'A home for the Daraja programme.',
            'hero.subtitle' => 'Our first center, in Mile 13 Juakali, Eldoret. Green belongs to Regina Yego, and to Regina Yego alone.',
            'hero.images'   => ['images/landing/regina-yego.jpg'],
            'who.eyebrow'   => 'Who we serve',
            'who.title'     => 'Girls aged 14 to 17, at risk of dropping out.',
            'who.body'      => '<p>The Daraja programme walks with girls through the years when a small setback becomes a permanent one. Mentorship, life skills and a safe study environment help them finish high school and leave with a clear plan.</p><p>Many alumni go on to join the Discover programme at 18, continuing the journey from school to opportunity without a gap in between.</p>',
            'stats'         => [
                ['value' => '14–17', 'label' => 'Ages served',     'description' => 'Girls in the Daraja programme at the center.'],
                ['value' => '100%',  'label' => 'Guardian consent','description' => 'Every photograph, every enrolment, every share.'],
                ['value' => '1',     'label' => 'First center',    'description' => 'The template every future center will follow.'],
            ],
            'growing.title' => 'One system. Many centers.',
            'growing.body'  => '<p>Every future center inherits three fixed things from this one: the bracket mark, the Lato wordmark, and the parent line "Good Kenyan Foundation". One thing is chosen per center: a single colour, assigned once, used the way green is used here.</p>',
        ]);
    }

    /* ------------------------------- Stawi ------------------------------- */

    protected function seedStawi(): void
    {
        $this->write('stawi', [
            'hero.eyebrow'    => 'Stawi Enterprises',
            'hero.title'      => 'Buy good work. Fund a livelihood.',
            'hero.subtitle'   => 'Stawi Enterprises is the commercial arm of our model. Two brands, one purpose: paid work for young people, delivered to real clients.',
            'hero.images'     => ['images/landing/stawi-hero.jpg'],
            'studio.eyebrow'  => 'Good Studio',
            'studio.title'    => 'Events, design and products with a traceable story.',
            'studio.body'     => '<p>Good Studio delivers creative and event work for corporate, NGO and private clients. Every brief is delivered by trainees working alongside experienced practitioners, so the work is professional and the training is real.</p>',
            'studio.services' => [
                ['item' => 'Event planning, staffing and coordination'],
                ['item' => 'Event decor, styling and set production'],
                ['item' => 'Branding, graphic design and print'],
                ['item' => 'Custom packaging and corporate gifting'],
                ['item' => 'Screen printing, heat press, vinyl cutting and finishing'],
                ['item' => 'A decor range made from reclaimed wood, fabric offcuts, glass, metal and packaging waste'],
            ],
            'studio.gallery' => ['images/landing/good-studio-work.jpg'],
            'connect.eyebrow' => 'Good Connect',
            'connect.title'   => 'Customer experience delivered by a trained Kenyan team.',
            'connect.body'    => '<p>Good Connect combines a training lab with a commercial call centre, making it the most direct route in our model from training into salaried work.</p>',
            'connect.services'=> [
                ['item' => 'Inbound and outbound call centre'],
                ['item' => 'Customer experience and support desk'],
                ['item' => 'Back office operations and data processing'],
            ],
            'connect.gallery' => ['images/landing/good-connect-work.jpg'],
        ]);
    }

    /* ------------------------------ Stories ------------------------------ */

    protected function seedStories(): void
    {
        $this->write('stories', [
            'hero.eyebrow'        => 'Our Stories',
            'hero.title'          => 'Named journeys, real outcomes.',
            'hero.subtitle'       => 'The people we work with tell the story better than we can. Read them in their own words.',
            'hero.images'         => ['images/landing/stories-hero.jpg'],
            'sidebar.footer_note' => 'Every story here is shared with the person\'s consent. If you want to add your own, we would love to hear it.',
        ]);
    }

    /* ------------------------------ Partners ----------------------------- */

    protected function seedPartners(): void
    {
        $this->write('partners', [
            'hero.eyebrow' => 'In good company',
            'hero.title'   => 'The organisations that walk with us.',
            'hero.subtitle'=> 'Funders, industry partners and mentors who make a young person\'s next step possible.',
            'hero.images'  => ['images/landing/partners-hero.jpg'],
            'footer_note'  => 'If your organisation would like to walk with us, we would love to hear from you.',
        ]);
    }

    /* ---------------------------- Get Involved --------------------------- */

    protected function seedGetInvolved(): void
    {
        $this->write('get-involved', [
            'hero.eyebrow'      => 'Get involved',
            'hero.title'        => 'Four ways to walk with us.',
            'hero.subtitle'     => 'Donate, mentor, fund a scholarship, or send a young person to the next intake.',
            'hero.images'       => ['images/landing/get-involved-hero.jpg'],
            'donate.title'      => 'Give once, or set up a monthly gift.',
            'donate.body'       => 'Donations go through our verified Keela page. USA tax receipts issued instantly.',
            'scholarship.title' => 'Name a scholarship for a young person.',
            'scholarship.body'  => 'Cover the six month Imarisha training or the one year Stawi placement. We report back on how it went.',
            'mentor.title'      => 'Become a mentor.',
            'mentor.intro'      => 'A few hours a month. Real conversations. Real outcomes.',
            'register.title'    => 'Apply to a programme.',
            'register.intro'    => 'For young people who want to join the next Msingi, Imarisha, Stawi or Daraja cohort.',
        ]);
    }

    /* ------------------------------- Contact ----------------------------- */

    protected function seedContact(): void
    {
        $this->write('contact', [
            'hero.eyebrow'  => 'Contact',
            'hero.title'    => 'Say hello.',
            'hero.subtitle' => 'For quotes, partnerships, press or a general enquiry, drop us a note. We reply within two working days.',
            'hero.images'   => ['images/landing/contact-hero.jpg'],
            'left.eyebrow'  => 'Direct',
            'left.title'    => 'Reach us any time.',
            'form.title'    => 'Send us a message',
        ]);
    }

    /* --------------------------------------------------------------------- */

    protected function write(string $page, array $blocks): void
    {
        foreach ($blocks as $key => $value) {
            ContentBlock::set($page, $key, $value);
        }
    }
}
