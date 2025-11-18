const terminal = document.getElementById('terminal');
let history = [];
let historyIndex = -1;

const commands = {
  cv: () => {
    const link = document.createElement('a');
    link.href = 'JoshuaPaulBirdCV.pdf';  // ← place your PDF in the same folder
    link.download = 'JoshuaPaulBirdCV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return "Downloading JoshuaPaulBirdCV.pdf …";
  },
  help: () => [
    "Available commands:",
    "  <span class=\"cmd\">whoami</span>          about",
    "  <span class=\"cmd\">ls</span>              list projects",
    "  <span class=\"cmd\">cat</span> &lt;name&gt;        (use Tab for autocomplete)",
    "  <span class=\"cmd\">skills</span>          full tech stack",
    "  <span class=\"cmd\">social</span>          links",
    "  <span class=\"cmd\">contact</span>         reach me",
    "  <span class=\"cmd\">clear</span>           clear screen",
    "  <span class=\"cmd\">cv</span>           download my cv",
    "  <span class=\"cmd\">repo</span>           check out the repo for this site",
    ""
  ].join("<br>"),

  whoami: () => "Joshua Paul Bird\nBSc Computer Science (Security & Forensics) – Cardiff University 2025 (2:1)\nWolverhampton, UK • Looking for graduate schemes for the coming year",

  ls: () => [
    "<span style=\"color:#bb9af7\">---Projects & Experience---</span>",
    "<span class=\"cmd\">Network-Intrusion-Detection-App</span>",
    "<span class=\"cmd\">Night-Journey-Safety-App</span>",
    "<span class=\"cmd\">Homelab-And-Selfhosting</span>",
    ""
  ].join("<br>"),

  "cat Network-Intrusion-Detection-App": () => [
    "Android Network Intrusion Detection System (Final Year Project • 2025)",
    "",
    "• Solo 40-credit project with 10,000-word dissertation",
    "• Trained scikit-learn model in Python on CIC-IDS2017 dataset",
    "• Converted model to TensorFlow Lite for on-device inference",
    "• Native Java Android app performing real-time packet analysis and alerts",
    "• Measured accuracy, false positive rate, and device overhead",
    "",
    "<span style=\"color:#9ece6a\">Key skills demonstrated:</span>",
    "Machine Learning • Python (pandas, scikit-learn) • TensorFlow Lite • Java Android • Technical writing • Performance profiling",
    ""
  ].join("<br>"),

  "cat Night-Journey-Safety-App": () => [
    "Night-Time Safety Companion App (Group Project • 2024)",
    "",
    "• 6-person team delivering full-stack Android safety solution for Cardiff students",
    "• Java Android + Mapbox SDK for route planning and live tracking",
    "• Fall detection via accelerometer, route deviation & timer-based alerts",
    "• Emergency flow: vibration warning → automatic call/SMS to trusted contacts",
    "• Flask + Python REST API, MariaDB backend, deployed on Red Hat OpenShift",
    "• Full Agile: weekly supervisor meetings, mock client (Cardiff Police), real-world testing, 80+ page report",
    "",
    "<span style=\"color:#9ece6a\">Key skills demonstrated:</span>",
    "Java Android • Flask • MariaDB • OpenShift • Mapbox API • Agile • Team leadership • Client communication • Sensor fusion",
    ""
  ].join("<br>"),

  "cat Homelab-And-Selfhosting": () => [
    "Personal Homelab & Self-Hosted Services (Ongoing)",
    "",
    "• Proxmox VE cluster running Ubuntu/Debian VMs and LXCs",
    "• Docker + Docker Compose for 20+ services (Nextcloud, Jellyfin, Actual Budget…)",
    "• Caddy reverse proxy with automatic Let's Encrypt on personal domain",
    "• Headscale server + Tailscale mesh VPN for secure friend/family access",
    "• Monitoring with Netdata, Portainer/Komodo, Samba shares, etc.",
    "• Virtual Private Server usage for off site backup and also mailcow email server",
    "",
    "<span style=\"color:#9ece6a\">Key skills demonstrated:</span>",
    "Linux • Proxmox • Docker • Caddy • Networking • WireGuard/Tailscale • Security hardening • Automation",
    ""
  ].join("<br>"),

  skills: () => [
    "Languages      → Python • Java • SQL • JavaScript • Bash",
    "Frameworks     → Flask • Android SDK",
    "Databases      → MariaDB • MongoDB • Neo4j",
    "DevOps         → Docker • Proxmox • Caddy • OpenShift • Tailscale/Headscale",
    "Tools          → Git • Wireshark • Netdata • Mapbox • TensorFlow Lite",
    "Security       → AES/RSA • SSL/TLS • Intrusion Detection • VPNs",
    ""
  ].join("<br>"),

  social: () => "LinkedIn → <a href=\"https://www.linkedin.com/in/joshua-p-bird/\" class=\"link\">linkedin.com/in/joshua-p-bird</a>",

  repo: () => "Repo for this site → <a href=\"https://github.com/JoshuaPaulBird/TerminalPortfolio\" class=\"link\">github.com/JoshuaPaulBird/TerminalPortfolio</a>",

  contact: () => [
    "Email    → <a href=\"mailto:sgjpb123@gmail.com\" class=\"link\">sgjpb123@gmail.com</a>",
    "Phone    → 07746 423612",
    "Location → Wolverhampton, WV10 8LB",
    ""
  ].join("<br>"),

  clear: () => { terminal.innerHTML = ''; newLine(); return ''; },
};

const allCommands = [
  'help','whoami','ls','skills','social','contact','clear', 'cv', 'repo',
  'cat Network-Intrusion-Detection-App','cat Night-Journey-Safety-App','cat Homelab-And-Selfhosting'
];

// ———————————————————————— CORE FUNCTIONS ————————————————————————

function newLine() {
  const line = document.createElement('div');
  line.className = 'input-line';
  line.innerHTML = `<span class="prompt">vistor@joshuabird.uk ➜</span> <span class="input" contenteditable="true" spellcheck="false"></span>`;
  terminal.appendChild(line);

  const input = line.querySelector('.input');
  input.classList.add('active');
  setupInput(input);
  setTimeout(() => input.focus(), 0);
  terminal.scrollTop = terminal.scrollHeight;
}

function addLine(text) {
  if (!text) return;
  const div = document.createElement('div');
  div.innerHTML = text;
  terminal.appendChild(div);
  terminal.scrollTop = terminal.scrollHeight;
}

function getCurrentInput() {
  return document.querySelector('.input.active');
}

function freezeCurrentLine() {
  const current = getCurrentInput();
  if (current) {
    current.contentEditable = false;
    current.classList.remove('active');
  }
}

function autocomplete(el) {
  const text = el.textContent.trim();
  const matches = allCommands.filter(c => c.startsWith(text));
  if (matches.length === 1) {
    el.textContent = matches[0];
    placeCaretAtEnd(el);
  } else if (matches.length > 1) {
    addLine(matches.join('   '));
    newLine();
  }
}

function placeCaretAtEnd(el) {
  el.focus();
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(el);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

function setupInput(el) {
  el.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') { e.preventDefault(); autocomplete(this); return; }
    if (e.key === 'ArrowUp' && historyIndex < history.length - 1) { e.preventDefault(); historyIndex++; this.textContent = history[historyIndex]; placeCaretAtEnd(this); }
    if (e.key === 'ArrowDown' && historyIndex > -1) { e.preventDefault(); historyIndex--; this.textContent = historyIndex >= 0 ? history[historyIndex] : ''; placeCaretAtEnd(this); }

    if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = this.textContent.trim();
      if (cmd) { history.unshift(cmd); historyIndex = -1; }

      freezeCurrentLine();
      this.parentNode.innerHTML = `<span class="prompt">vistor@joshuabird.uk ➜</span> ${cmd || ''}`;

      let output = '';
      if (cmd === 'clear') { commands.clear(); return; }
      if (commands[cmd]) output = commands[cmd]();
      else if (cmd.startsWith('cat ') && commands[cmd]) output = commands[cmd]();
      else if (cmd) output = `<span style="color:#f7768e">command not found:</span> ${cmd}`;

      if (output) addLine(output);
      addLine('');
      newLine();
    }
  });
}

// ———————————————————————— START ————————————————————————

document.addEventListener('DOMContentLoaded', () => {
  addLine(`<span style="color:#9ece6a">Joshua Paul Bird — Terminal Portfolio</span>`);
  addLine(`Type <span class="cmd">help</span> or <span class="cmd">ls</span> to begin or download my cv with <span class="cmd">cv</span>`);
  addLine('');
  newLine();
});

document.body.addEventListener('click', () => {
  const current = getCurrentInput();
  if (current) current.focus();
});