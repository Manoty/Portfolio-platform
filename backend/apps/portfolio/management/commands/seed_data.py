# =============================================================================
# MANAGEMENT COMMAND — Seed realistic placeholder content
# Run: python manage.py seed_data
# Safe to run multiple times — checks before creating
# =============================================================================
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class Command(BaseCommand):
    help = "Seed the database with realistic placeholder content"

    def handle(self, *args, **options):
        self.stdout.write("🌱 Seeding placeholder content...\n")
        self._seed_technologies()
        self._seed_skills()
        self._seed_experience()
        self._seed_projects()
        self._seed_blog()
        self._seed_testimonials()
        self.stdout.write(self.style.SUCCESS("\n✅ Seed complete!"))

    # -------------------------------------------------------------------------
    def _seed_technologies(self):
        from apps.portfolio.models import Technology
        techs = [
            {"name": "Python", "color": "#3776AB"},
            {"name": "Django", "color": "#092E20"},
            {"name": "Django REST Framework", "color": "#A30000"},
            {"name": "React", "color": "#61DAFB"},
            {"name": "TypeScript", "color": "#3178C6"},
            {"name": "Tailwind CSS", "color": "#06B6D4"},
            {"name": "PostgreSQL", "color": "#336791"},
            {"name": "Redis", "color": "#DC382D"},
            {"name": "Docker", "color": "#2496ED"},
            {"name": "GitHub Actions", "color": "#2088FF"},
            {"name": "Celery", "color": "#37814A"},
            {"name": "FastAPI", "color": "#009688"},
            {"name": "Node.js", "color": "#339933"},
            {"name": "AWS S3", "color": "#FF9900"},
            {"name": "Nginx", "color": "#009639"},
            {"name": "Whisper AI", "color": "#412991"},
            {"name": "OpenAI API", "color": "#412991"},
            {"name": "Vite", "color": "#646CFF"},
            {"name": "Pytest", "color": "#0A9EDC"},
            {"name": "Zustand", "color": "#FF4154"},
        ]
        count = 0
        for t in techs:
            _, created = Technology.objects.get_or_create(name=t["name"], defaults=t)
            if created:
                count += 1
        self.stdout.write(f"  ✓ Technologies: {count} created")

    # -------------------------------------------------------------------------
    def _seed_skills(self):
        from apps.portfolio.models import Skill
        skills = [
            # Languages
            {"name": "Python", "category": "Languages", "proficiency": 5},
            {"name": "TypeScript", "category": "Languages", "proficiency": 5},
            {"name": "JavaScript", "category": "Languages", "proficiency": 4},
            {"name": "SQL", "category": "Languages", "proficiency": 5},
            {"name": "Bash", "category": "Languages", "proficiency": 3},
            # Frameworks
            {"name": "Django", "category": "Frameworks", "proficiency": 5},
            {"name": "Django REST Framework", "category": "Frameworks", "proficiency": 5},
            {"name": "React", "category": "Frameworks", "proficiency": 5},
            {"name": "FastAPI", "category": "Frameworks", "proficiency": 4},
            {"name": "Celery", "category": "Frameworks", "proficiency": 4},
            # Databases
            {"name": "PostgreSQL", "category": "Databases", "proficiency": 5},
            {"name": "Redis", "category": "Databases", "proficiency": 4},
            {"name": "SQLite", "category": "Databases", "proficiency": 4},
            # Tools
            {"name": "Git", "category": "Tools", "proficiency": 5},
            {"name": "VS Code", "category": "Tools", "proficiency": 5},
            {"name": "Postman", "category": "Tools", "proficiency": 4},
            {"name": "Figma", "category": "Tools", "proficiency": 3},
            # DevOps
            {"name": "Docker", "category": "DevOps", "proficiency": 4},
            {"name": "GitHub Actions", "category": "DevOps", "proficiency": 4},
            {"name": "Nginx", "category": "DevOps", "proficiency": 3},
            {"name": "Linux", "category": "DevOps", "proficiency": 4},
        ]
        count = 0
        for s in skills:
            _, created = Skill.objects.get_or_create(name=s["name"], category=s["category"], defaults=s)
            if created:
                count += 1
        self.stdout.write(f"  ✓ Skills: {count} created")

    # -------------------------------------------------------------------------
    def _seed_experience(self):
        from apps.portfolio.models import Experience
        entries = [
            {
                "company": "Freelance",
                "role": "Senior Full Stack Engineer",
                "location": "Nairobi, Kenya (Remote)",
                "start_date": "2022-01-01",
                "is_current": True,
                "order": 0,
                "description": (
                    "Designing and shipping production-grade web applications for clients across Africa "
                    "and Europe. Stack: Django REST Framework + React + PostgreSQL.\n\n"
                    "• Architected a multi-tenant SaaS delivery platform handling 10,000+ daily orders\n"
                    "• Built a real-time speech-to-text transcription service using OpenAI Whisper\n"
                    "• Implemented JWT auth, role-based permissions, and CI/CD pipelines\n"
                    "• Reduced API response times by 60% through query optimization and caching"
                ),
            },
            {
                "company": "TechBridge Africa",
                "role": "Full Stack Developer",
                "location": "Nairobi, Kenya",
                "start_date": "2020-03-01",
                "end_date": "2021-12-31",
                "is_current": False,
                "order": 1,
                "description": (
                    "Built and maintained internal tools and client-facing web applications "
                    "for a pan-African technology consulting firm.\n\n"
                    "• Developed a comment moderation dashboard processing 50,000+ comments/day\n"
                    "• Migrated legacy PHP monolith to a Django microservices architecture\n"
                    "• Mentored 3 junior developers and established code review practices"
                ),
            },
            {
                "company": "Andela",
                "role": "Software Engineer (Apprentice → Mid-level)",
                "location": "Nairobi, Kenya",
                "start_date": "2018-06-01",
                "end_date": "2020-02-28",
                "is_current": False,
                "order": 2,
                "description": (
                    "Grew from apprentice to mid-level engineer through Andela's intensive "
                    "training programme, embedded with US-based product teams.\n\n"
                    "• Contributed to a Node.js/React e-commerce platform serving 200K+ users\n"
                    "• Wrote comprehensive test suites achieving 85%+ code coverage\n"
                    "• Shipped features in 2-week sprint cycles with daily standups"
                ),
            },
        ]
        count = 0
        for e in entries:
            _, created = Experience.objects.get_or_create(
                company=e["company"], role=e["role"], defaults=e
            )
            if created:
                count += 1
        self.stdout.write(f"  ✓ Experience: {count} created")

    # -------------------------------------------------------------------------
    def _seed_projects(self):
        from apps.portfolio.models import Project, Technology

        admin_user = User.objects.filter(is_superuser=True).first()

        projects_data = [
            {
                "title": "Scott Delivery Platform",
                "summary": (
                    "A multi-tenant SaaS platform managing end-to-end delivery operations "
                    "for logistics companies across East Africa, handling 10,000+ daily orders."
                ),
                "description": (
                    "Scott Delivery Platform is a production-grade, multi-tenant logistics SaaS "
                    "built to modernise last-mile delivery operations across East Africa.\n\n"
                    "The platform serves multiple logistics companies from a single deployment, "
                    "with strict data isolation per tenant. Dispatchers use a real-time dashboard "
                    "to assign riders, track deliveries, and manage routes. Customers receive "
                    "live SMS/email updates at each delivery milestone.\n\n"
                    "Key Engineering Decisions:\n"
                    "• Multi-tenancy implemented via tenant-scoped querysets and middleware "
                    "rather than separate databases — reducing infrastructure cost by 70%\n"
                    "• Real-time rider tracking using Django Channels + WebSockets\n"
                    "• Celery + Redis for async order processing and notification dispatch\n"
                    "• Custom JWT auth with tenant-aware permissions\n"
                    "• PostgreSQL row-level security for additional data isolation\n"
                    "• Deployed on a single VPS with Nginx + Gunicorn + Docker Compose\n\n"
                    "The platform currently processes 10,000+ orders daily with 99.8% uptime."
                ),
                "github_url": "https://github.com/kevinmanoti/scott-delivery",
                "live_url": "https://scott-delivery.kevinmanoti.dev",
                "is_featured": True,
                "status": "published",
                "project_start": "2022-06-01",
                "technologies": [
                    "Django", "Django REST Framework", "React", "TypeScript",
                    "PostgreSQL", "Redis", "Celery", "Docker", "Tailwind CSS",
                ],
            },
            {
                "title": "Comment Intelligence API",
                "summary": (
                    "A high-throughput REST API for automated comment moderation, sentiment "
                    "analysis, and toxicity detection — processing 50,000+ comments per day."
                ),
                "description": (
                    "Comment Intelligence API is a standalone Django REST Framework service "
                    "that provides comment moderation capabilities via a clean REST interface.\n\n"
                    "Media companies and content platforms integrate the API to automatically "
                    "classify user comments as safe, spam, toxic, or requiring human review. "
                    "The service also provides sentiment scoring and keyword extraction.\n\n"
                    "Architecture Overview:\n"
                    "• Stateless API designed for horizontal scaling behind a load balancer\n"
                    "• Async processing pipeline using Celery workers — API responds immediately "
                    "with a task ID, result fetched via webhook or polling\n"
                    "• Rate limiting per API key using Redis sliding window algorithm\n"
                    "• Moderation rules engine — configurable per client via admin dashboard\n"
                    "• Comprehensive audit log for every moderation decision\n"
                    "• OpenAPI 3.0 spec auto-generated via drf-spectacular\n"
                    "• 94% test coverage with pytest and factory_boy\n\n"
                    "Deployed as a containerised service with GitHub Actions CI/CD. "
                    "P99 latency under 120ms on commodity hardware."
                ),
                "github_url": "https://github.com/kevinmanoti/comment-intelligence-api",
                "live_url": "https://comment-api.kevinmanoti.dev/docs",
                "is_featured": True,
                "status": "published",
                "project_start": "2021-09-01",
                "project_end": "2022-03-31",
                "technologies": [
                    "Python", "Django REST Framework", "PostgreSQL", "Redis",
                    "Celery", "Docker", "GitHub Actions", "Pytest", "FastAPI",
                ],
            },
            {
                "title": "Speech-to-Text Platform",
                "summary": (
                    "A web application that transcribes audio and video files using OpenAI "
                    "Whisper, with speaker diarisation, export options, and a clean editor UI."
                ),
                "description": (
                    "Speech-to-Text Platform is a full-stack application that makes "
                    "professional audio transcription accessible via a simple web interface.\n\n"
                    "Users upload audio or video files (MP3, MP4, WAV, M4A) and receive "
                    "accurate transcripts with timestamps and speaker labels. Transcripts can "
                    "be edited inline, then exported as TXT, SRT, or DOCX.\n\n"
                    "Technical Highlights:\n"
                    "• OpenAI Whisper (large-v2 model) running on a GPU-enabled backend worker\n"
                    "• Async job queue — uploads processed in background, user notified on completion\n"
                    "• Chunked file upload handling files up to 2GB\n"
                    "• Speaker diarisation using pyannote.audio library\n"
                    "• React-based transcript editor with keyboard shortcuts and undo/redo\n"
                    "• SRT export for subtitle generation\n"
                    "• Django Channels for real-time transcription progress updates\n\n"
                    "Processing time: approximately 1 minute per 10 minutes of audio on T4 GPU."
                ),
                "github_url": "https://github.com/kevinmanoti/speech-to-text-platform",
                "live_url": "https://transcribe.kevinmanoti.dev",
                "is_featured": False,
                "status": "published",
                "project_start": "2023-01-01",
                "project_end": "2023-08-31",
                "technologies": [
                    "Python", "Django", "Django REST Framework", "React",
                    "TypeScript", "PostgreSQL", "Celery", "Redis",
                    "Whisper AI", "OpenAI API", "Tailwind CSS", "Docker",
                ],
            },
        ]

        count = 0
        for pd in projects_data:
            tech_names = pd.pop("technologies")
            if not Project.objects.filter(title=pd["title"]).exists():
                project = Project.objects.create(**pd)
                techs = Technology.objects.filter(name__in=tech_names)
                project.technologies.set(techs)
                count += 1

        self.stdout.write(f"  ✓ Projects: {count} created")

    # -------------------------------------------------------------------------
    def _seed_blog(self):
        from apps.blog.models import Post, Category, Tag

        admin_user = User.objects.filter(is_superuser=True).first()
        if not admin_user:
            self.stdout.write("  ⚠ No superuser found — skipping blog seed")
            return

        # Categories
        cat_engineering, _ = Category.objects.get_or_create(
            name="Engineering",
            defaults={"description": "Software engineering patterns, architecture, and practices"},
        )
        cat_backend, _ = Category.objects.get_or_create(
            name="Backend",
            defaults={"description": "Django, APIs, databases, and server-side development"},
        )

        # Tags
        tag_names = ["Django", "PostgreSQL", "React", "API Design", "Performance", "Architecture", "Python"]
        tags = {}
        for name in tag_names:
            tag, _ = Tag.objects.get_or_create(name=name)
            tags[name] = tag

        posts_data = [
            {
                "title": "Building Multi-Tenant SaaS with Django: A Production Architecture Guide",
                "excerpt": (
                    "How to architect a multi-tenant Django application that isolates tenant data "
                    "at the query level — without the complexity of separate databases per tenant."
                ),
                "content": (
                    "Multi-tenancy is one of the first architectural decisions you face when building "
                    "a SaaS product. Get it wrong and you'll be refactoring under production pressure. "
                    "Get it right and you have a foundation that scales cleanly.\n\n"
                    "This post covers the approach I used for the Scott Delivery Platform: "
                    "query-level tenant isolation in a shared database schema.\n\n"
                    "THE THREE APPROACHES\n\n"
                    "1. Separate databases per tenant — maximum isolation, maximum ops overhead\n"
                    "2. Separate schemas per tenant — good isolation, moderate complexity\n"
                    "3. Shared schema with tenant_id column — lowest overhead, requires discipline\n\n"
                    "For most early-stage SaaS products, option 3 is the right call. "
                    "Here's how to implement it cleanly in Django.\n\n"
                    "THE TENANT MODEL\n\n"
                    "Start with a Tenant model and a middleware that resolves the current tenant "
                    "from the request (subdomain, JWT claim, or API key).\n\n"
                    "class Tenant(models.Model):\n"
                    "    name = models.CharField(max_length=200)\n"
                    "    slug = models.SlugField(unique=True)\n"
                    "    is_active = models.BooleanField(default=True)\n"
                    "    created_at = models.DateTimeField(auto_now_add=True)\n\n"
                    "TENANT-SCOPED QUERYSETS\n\n"
                    "The key is a custom Manager that automatically scopes every query to the "
                    "current tenant. Store the tenant on a thread-local in middleware, then read it "
                    "in the manager.\n\n"
                    "This approach means you never forget to filter by tenant — it's automatic. "
                    "The risk is that you DO need to bypass it for admin/cross-tenant operations, "
                    "which requires an explicit .unscoped() escape hatch.\n\n"
                    "PERFORMANCE CONSIDERATIONS\n\n"
                    "Always index tenant_id. Composite indexes on (tenant_id, created_at) and "
                    "(tenant_id, status) are worth adding early — you'll query on both constantly.\n\n"
                    "With this architecture, the Scott platform serves 15 tenants from a single "
                    "PostgreSQL instance on a 4GB VPS with p99 latency under 80ms.\n\n"
                    "The full implementation with middleware, managers, and tests is on GitHub."
                ),
                "status": "published",
                "is_featured": True,
                "category": cat_backend,
                "tags": ["Django", "PostgreSQL", "Architecture", "Python"],
            },
            {
                "title": "PostgreSQL Query Optimization: How I Cut API Response Time by 60%",
                "excerpt": (
                    "A practical walkthrough of the techniques I use to diagnose and fix "
                    "slow Django ORM queries — EXPLAIN ANALYZE, N+1 problems, and index strategy."
                ),
                "content": (
                    "Performance problems in Django usually come from the database layer. "
                    "After profiling dozens of APIs, the culprits are almost always the same: "
                    "N+1 queries, missing indexes, and over-fetching columns.\n\n"
                    "This post is a practical guide to diagnosing and fixing these problems "
                    "using tools already available to you.\n\n"
                    "STEP 1: TURN ON QUERY LOGGING\n\n"
                    "In development, add django-debug-toolbar or log all queries to the console:\n\n"
                    "LOGGING = {\n"
                    "    'loggers': {\n"
                    "        'django.db.backends': {\n"
                    "            'level': 'DEBUG',\n"
                    "        }\n"
                    "    }\n"
                    "}\n\n"
                    "Count the queries per request. If a list endpoint is making 50 queries "
                    "to return 20 records, you have an N+1 problem.\n\n"
                    "STEP 2: FIX N+1 WITH SELECT_RELATED AND PREFETCH_RELATED\n\n"
                    "The Django ORM makes N+1 easy to accidentally create and easy to fix:\n\n"
                    "# N+1 — one query per project to fetch technologies\n"
                    "projects = Project.objects.filter(status='published')\n\n"
                    "# Fixed — 2 queries total\n"
                    "projects = Project.objects.filter(\n"
                    "    status='published'\n"
                    ").prefetch_related('technologies')\n\n"
                    "STEP 3: USE EXPLAIN ANALYZE\n\n"
                    "For complex queries, run EXPLAIN ANALYZE directly in psql. "
                    "Look for Seq Scan on large tables — that's your missing index.\n\n"
                    "STEP 4: INDEX STRATEGICALLY\n\n"
                    "Don't add indexes blindly. Add them on columns you filter, sort, or join on. "
                    "Composite indexes beat multiple single-column indexes when you always "
                    "filter on both columns together.\n\n"
                    "RESULTS\n\n"
                    "On the Comment Intelligence API, applying these techniques reduced "
                    "the dashboard query from 340ms to 45ms — a 87% improvement "
                    "without touching the business logic."
                ),
                "status": "published",
                "is_featured": False,
                "category": cat_backend,
                "tags": ["PostgreSQL", "Django", "Performance", "Python"],
            },
            {
                "title": "API Design Principles I Follow on Every Django Project",
                "excerpt": (
                    "The conventions, patterns, and non-negotiable rules I apply when "
                    "designing REST APIs with Django REST Framework — learned from "
                    "building and maintaining production APIs."
                ),
                "content": (
                    "Good API design is mostly about consistency and predictability. "
                    "A developer integrating your API should never have to guess.\n\n"
                    "These are the principles I follow on every project. They're opinionated — "
                    "some teams do things differently — but they've served me well.\n\n"
                    "1. RESOURCE NAMES ARE NOUNS, NOT VERBS\n\n"
                    "Bad:  POST /api/createProject\n"
                    "Good: POST /api/projects/\n\n"
                    "The HTTP method IS the verb. Your URL should identify the resource.\n\n"
                    "2. CONSISTENT ERROR RESPONSES\n\n"
                    "Every error response should have the same shape:\n\n"
                    "{\n"
                    '  "detail": "Human readable message",\n'
                    '  "code": "machine_readable_code",\n'
                    '  "field_errors": { "email": ["This field is required."] }\n'
                    "}\n\n"
                    "DRF gives you most of this out of the box with a custom exception handler.\n\n"
                    "3. USE HTTP STATUS CODES CORRECTLY\n\n"
                    "200 — success with body\n"
                    "201 — created\n"
                    "204 — success, no body (DELETE)\n"
                    "400 — client validation error\n"
                    "401 — not authenticated\n"
                    "403 — authenticated but forbidden\n"
                    "404 — resource not found\n"
                    "429 — rate limited\n\n"
                    "4. ALWAYS PAGINATE LIST ENDPOINTS\n\n"
                    "Even if you only have 10 records today. Removing pagination later "
                    "is a breaking change. Adding it is a breaking change.\n\n"
                    "5. SEPARATE READ AND WRITE SERIALIZERS\n\n"
                    "Your input shape rarely equals your output shape. "
                    "Using the same serializer for both creates awkward `read_only` "
                    "field juggling. Use ListSerializer, DetailSerializer, and CreateSerializer.\n\n"
                    "6. VERSION YOUR API FROM DAY ONE\n\n"
                    "/api/v1/ is a small upfront cost that saves enormous pain later.\n\n"
                    "These aren't radical ideas — they're the boring, battle-tested conventions "
                    "that make APIs maintainable. Follow them consistently and your API "
                    "becomes self-documenting."
                ),
                "status": "published",
                "is_featured": False,
                "category": cat_engineering,
                "tags": ["API Design", "Django", "Architecture"],
            },
        ]

        count = 0
        for pd in posts_data:
            tag_names = pd.pop("tags")
            if not Post.objects.filter(title=pd["title"]).exists():
                post = Post.objects.create(author=admin_user, **pd)
                post.tags.set([tags[n] for n in tag_names if n in tags])
                count += 1

        self.stdout.write(f"  ✓ Blog posts: {count} created")

    # -------------------------------------------------------------------------
    def _seed_testimonials(self):
        from apps.testimonials.models import Testimonial

        testimonials_data = [
            {
                "name": "Sarah Odhiambo",
                "role": "CTO",
                "company": "Scott Logistics Ltd",
                "testimonial": (
                    "Kevin architected our entire delivery platform from scratch. "
                    "He didn't just write clean code — he asked the right questions, "
                    "challenged assumptions, and delivered a system our team has been "
                    "able to extend confidently for two years. Genuinely one of the best "
                    "engineers I've worked with."
                ),
                "is_featured": True,
                "is_published": True,
                "order": 0,
            },
            {
                "name": "James Kamau",
                "role": "Head of Engineering",
                "company": "TechBridge Africa",
                "testimonial": (
                    "Kevin joined us as a mid-level developer and immediately operated "
                    "at a senior level. He refactored a critical data pipeline that had "
                    "been causing production incidents for months, and had it stable within "
                    "two weeks. He also mentored two of our junior engineers who are now "
                    "thriving. A rare combination of technical depth and communication skills."
                ),
                "is_featured": True,
                "is_published": True,
                "order": 1,
            },
            {
                "name": "Mia Hoffmann",
                "role": "Product Manager",
                "company": "Mediahouse GmbH",
                "testimonial": (
                    "We hired Kevin to build our comment moderation API under a tight "
                    "deadline. He delivered a week early, with documentation that our "
                    "integration team praised as the clearest they'd ever seen. "
                    "The API has been running in production for 18 months without a "
                    "single critical incident. Highly recommend."
                ),
                "is_featured": True,
                "is_published": True,
                "order": 2,
            },
        ]

        count = 0
        for td in testimonials_data:
            _, created = Testimonial.objects.get_or_create(
                name=td["name"], company=td["company"], defaults=td
            )
            if created:
                count += 1

        self.stdout.write(f"  ✓ Testimonials: {count} created")