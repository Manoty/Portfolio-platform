// =============================================================================
// DEVELOPER WORKSPACE ILLUSTRATION
// Hand-crafted SVG — code editor + terminal + floating tech badges
// =============================================================================
export default function DeveloperIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Outer glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute w-60 h-60 bg-cyan-500/8 rounded-full blur-2xl translate-x-8 translate-y-4" />
      </div>

      {/* Main SVG illustration */}
      <svg
        viewBox="0 0 520 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full max-w-lg drop-shadow-2xl"
      >
        {/* ---------------------------------------------------------------- */}
        {/* MONITOR / SCREEN                                                   */}
        {/* ---------------------------------------------------------------- */}

        {/* Monitor stand */}
        <rect x="230" y="350" width="60" height="14" rx="4" fill="#1e293b" />
        <rect x="210" y="362" width="100" height="8" rx="4" fill="#1e293b" />

        {/* Monitor body */}
        <rect x="60" y="48" width="400" height="300" rx="16" fill="#0f172a" />
        <rect x="60" y="48" width="400" height="300" rx="16" stroke="#1e40af" strokeWidth="1.5" />

        {/* Screen bezel inner */}
        <rect x="72" y="60" width="376" height="278" rx="10" fill="#020617" />

        {/* Screen glow overlay */}
        <rect x="72" y="60" width="376" height="278" rx="10"
          fill="url(#screenGlow)" opacity="0.4" />

        {/* ---------------------------------------------------------------- */}
        {/* EDITOR TAB BAR                                                     */}
        {/* ---------------------------------------------------------------- */}

        {/* Tab bar bg */}
        <rect x="72" y="60" width="376" height="28" rx="0" fill="#0f172a" />
        <rect x="72" y="60" width="376" height="1" fill="#1e293b" />

        {/* Window controls */}
        <circle cx="90" cy="74" r="5" fill="#ef4444" opacity="0.9" />
        <circle cx="106" cy="74" r="5" fill="#eab308" opacity="0.9" />
        <circle cx="122" cy="74" r="5" fill="#22c55e" opacity="0.9" />

        {/* Active tab */}
        <rect x="138" y="62" width="110" height="26" rx="6" fill="#1e293b" />
        <rect x="138" y="62" width="110" height="26" rx="6"
          stroke="#334155" strokeWidth="0.5" />
        <text x="163" y="79" fontFamily="JetBrains Mono, monospace"
          fontSize="9" fill="#94a3b8" fontWeight="500">
          views.py
        </text>
        <circle cx="155" cy="75" r="3" fill="#3b82f6" />

        {/* Inactive tab */}
        <rect x="254" y="66" width="90" height="18" rx="4" fill="transparent" />
        <text x="268" y="79" fontFamily="JetBrains Mono, monospace"
          fontSize="9" fill="#475569">
          models.py
        </text>

        {/* ---------------------------------------------------------------- */}
        {/* EDITOR SIDEBAR (file tree)                                        */}
        {/* ---------------------------------------------------------------- */}

        <rect x="72" y="88" width="80" height="250" fill="#0a0f1e" />
        <rect x="152" y="88" width="1" fill="#1e293b" height="250" />

        {/* File tree items */}
        {[
          { y: 104, label: "📁 portfolio/", indent: 0, color: "#64748b" },
          { y: 120, label: "  views.py", indent: 8, color: "#3b82f6" },
          { y: 136, label: "  models.py", indent: 8, color: "#94a3b8" },
          { y: 152, label: "  urls.py", indent: 8, color: "#94a3b8" },
          { y: 168, label: "📁 blog/", indent: 0, color: "#64748b" },
          { y: 184, label: "  serializers.py", indent: 8, color: "#94a3b8" },
          { y: 200, label: "📁 frontend/", indent: 0, color: "#64748b" },
          { y: 216, label: "  App.tsx", indent: 8, color: "#94a3b8" },
        ].map(({ y, label, color }) => (
          <text key={y} x="80" y={y}
            fontFamily="JetBrains Mono, monospace"
            fontSize="7.5" fill={color}>
            {label}
          </text>
        ))}

        {/* ---------------------------------------------------------------- */}
        {/* MAIN EDITOR AREA                                                   */}
        {/* ---------------------------------------------------------------- */}

        {/* Line numbers */}
        {[100, 113, 126, 139, 152, 165, 178, 191, 204, 217, 230, 243, 256, 269, 282, 295, 308].map((y, i) => (
          <text key={y} x="162" y={y}
            fontFamily="JetBrains Mono, monospace"
            fontSize="8" fill="#334155" textAnchor="middle">
            {i + 1}
          </text>
        ))}

        {/* Active line highlight */}
        <rect x="172" y="158" width="266" height="13" fill="#1e40af" opacity="0.15" rx="2" />

        {/* Code lines */}
        {/* Line 1 */}
        <text x="180" y="100" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
          <tspan fill="#c084fc">class </tspan>
          <tspan fill="#67e8f9">ProjectListView</tspan>
          <tspan fill="#e2e8f0">(</tspan>
          <tspan fill="#67e8f9">APIView</tspan>
          <tspan fill="#e2e8f0">):</tspan>
        </text>
        {/* Line 2 */}
        <text x="180" y="113" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
          <tspan fill="#64748b">    """Public project list."""</tspan>
        </text>
        {/* Line 3 */}
        <text x="180" y="126" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
          <tspan fill="#94a3b8">    permission_classes </tspan>
          <tspan fill="#e2e8f0">= [</tspan>
          <tspan fill="#67e8f9">IsPublic</tspan>
          <tspan fill="#e2e8f0">]</tspan>
        </text>
        {/* Line 4 blank */}
        {/* Line 5 */}
        <text x="180" y="152" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
          <tspan fill="#c084fc">    def </tspan>
          <tspan fill="#86efac">get</tspan>
          <tspan fill="#e2e8f0">(</tspan>
          <tspan fill="#fb923c">self</tspan>
          <tspan fill="#e2e8f0">, </tspan>
          <tspan fill="#fb923c">request</tspan>
          <tspan fill="#e2e8f0">):</tspan>
        </text>
        {/* Line 6 — highlighted/active */}
        <text x="180" y="165" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
          <tspan fill="#94a3b8">        qs </tspan>
          <tspan fill="#e2e8f0">= </tspan>
          <tspan fill="#67e8f9">Project</tspan>
          <tspan fill="#e2e8f0">.</tspan>
          <tspan fill="#86efac">objects</tspan>
          <tspan fill="#e2e8f0">.</tspan>
          <tspan fill="#86efac">filter</tspan>
          <tspan fill="#e2e8f0">(</tspan>
        </text>
        {/* Line 7 */}
        <text x="180" y="178" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
          <tspan fill="#94a3b8">            status</tspan>
          <tspan fill="#e2e8f0">=</tspan>
          <tspan fill="#fbbf24">"published"</tspan>
          <tspan fill="#e2e8f0">,</tspan>
        </text>
        {/* Line 8 */}
        <text x="180" y="191" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
          <tspan fill="#94a3b8">        ).prefetch_related(</tspan>
        </text>
        {/* Line 9 */}
        <text x="180" y="204" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
          <tspan fill="#fbbf24">            "technologies"</tspan>
          <tspan fill="#94a3b8">,</tspan>
        </text>
        {/* Line 10 */}
        <text x="180" y="217" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
          <tspan fill="#94a3b8">        )</tspan>
        </text>
        {/* Line 11 */}
        <text x="180" y="230" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
          <tspan fill="#94a3b8">        serializer </tspan>
          <tspan fill="#e2e8f0">= </tspan>
          <tspan fill="#67e8f9">ProjectListSerializer</tspan>
        </text>
        {/* Line 12 */}
        <text x="180" y="243" fontFamily="JetBrains Mono, monospace" fontSize="8.5">
          <tspan fill="#94a3b8">        </tspan>
          <tspan fill="#c084fc">return </tspan>
          <tspan fill="#67e8f9">Response</tspan>
          <tspan fill="#e2e8f0">(serializer.data)</tspan>
        </text>

        {/* Cursor blink */}
        <rect x="180" y="253" width="6" height="11" fill="#3b82f6" opacity="0.9" rx="1">
          <animate attributeName="opacity" values="0.9;0;0.9" dur="1.2s" repeatCount="indefinite" />
        </rect>

        {/* ---------------------------------------------------------------- */}
        {/* TERMINAL PANEL at bottom                                           */}
        {/* ---------------------------------------------------------------- */}

        {/* Terminal background */}
        <rect x="72" y="300" width="376" height="38" fill="#020617" />
        <rect x="72" y="300" width="376" height="1" fill="#1e293b" />

        {/* Terminal tabs */}
        <rect x="80" y="304" width="60" height="16" rx="4" fill="#1e293b" />
        <text x="91" y="316" fontFamily="JetBrains Mono, monospace"
          fontSize="7.5" fill="#64748b">TERMINAL</text>

        {/* Terminal content */}
        <text x="84" y="330" fontFamily="JetBrains Mono, monospace" fontSize="8">
          <tspan fill="#22c55e">✓ </tspan>
          <tspan fill="#64748b">python manage.py runserver </tspan>
          <tspan fill="#22c55e">127.0.0.1:8000</tspan>
        </text>

        {/* ---------------------------------------------------------------- */}
        {/* STATUS BAR                                                         */}
        {/* ---------------------------------------------------------------- */}

        <rect x="72" y="338" width="376" height="0" rx="0" fill="#1d4ed8" />

        {/* ---------------------------------------------------------------- */}
        {/* FLOATING TECH BADGES                                               */}
        {/* ---------------------------------------------------------------- */}

        {/* Django badge — top left */}
        <g>
          <rect x="8" y="90" width="70" height="26" rx="8" fill="#092e20"
            stroke="#166534" strokeWidth="1" />
          <text x="23" y="107" fontFamily="Inter, sans-serif"
            fontSize="9" fill="#4ade80" fontWeight="700">Django</text>
          <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" />
        </g>

        {/* React badge — top right */}
        <g>
          <rect x="440" y="70" width="68" height="26" rx="8" fill="#0c1a3a"
            stroke="#1d4ed8" strokeWidth="1" />
          <text x="454" y="87" fontFamily="Inter, sans-serif"
            fontSize="9" fill="#60a5fa" fontWeight="700">React</text>
        </g>

        {/* PostgreSQL badge — bottom left */}
        <g>
          <rect x="4" y="295" width="90" height="26" rx="8" fill="#172554"
            stroke="#1e40af" strokeWidth="1" />
          <text x="14" y="312" fontFamily="Inter, sans-serif"
            fontSize="9" fill="#93c5fd" fontWeight="700">PostgreSQL</text>
        </g>

        {/* TypeScript badge — bottom right */}
        <g>
          <rect x="424" y="300" width="88" height="26" rx="8" fill="#1e3a5f"
            stroke="#3b82f6" strokeWidth="1" />
          <text x="438" y="317" fontFamily="Inter, sans-serif"
            fontSize="9" fill="#7dd3fc" fontWeight="700">TypeScript</text>
        </g>

        {/* Docker badge — far right mid */}
        <g>
          <rect x="448" y="185" width="64" height="26" rx="8" fill="#0c2a4a"
            stroke="#0ea5e9" strokeWidth="1" />
          <text x="460" y="202" fontFamily="Inter, sans-serif"
            fontSize="9" fill="#38bdf8" fontWeight="700">Docker</text>
        </g>

        {/* Python badge — far left mid */}
        <g>
          <rect x="0" y="185" width="60" height="26" rx="8" fill="#1a1a3e"
            stroke="#4f46e5" strokeWidth="1" />
          <text x="11" y="202" fontFamily="Inter, sans-serif"
            fontSize="9" fill="#a5b4fc" fontWeight="700">Python</text>
        </g>

        {/* ---------------------------------------------------------------- */}
        {/* DEFS — gradients                                                   */}
        {/* ---------------------------------------------------------------- */}
        <defs>
          <linearGradient id="screenGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
          </linearGradient>
        </defs>
      </svg>

      {/* Floating animated ring behind monitor */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-72 h-72 rounded-full border border-blue-500/10 animate-ping"
          style={{ animationDuration: "3s" }} />
        <div className="absolute w-56 h-56 rounded-full border border-cyan-500/8"
          style={{ animation: "ping 4s cubic-bezier(0,0,0.2,1) infinite", animationDelay: "1s" }} />
      </div>
    </div>
  );
}