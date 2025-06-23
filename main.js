// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  // Load recent tools from localStorage
  loadRecentTools();

  // Set up event listeners
  setupEventListeners();

  // Check for dark mode preference
  checkDarkModePreference();
});

// Tool information
const tools = {
  "text-case-converter": {
    title: "Case Converter",
    description:
      "Convert text between different cases like uppercase, lowercase, title case, etc.",
  },
  "text-counter": {
    title: "Character Counter",
    description:
      "Count characters, words, sentences, and paragraphs in your text.",
  },
  "json-formatter": {
    title: "JSON Formatter",
    description: "Format and validate JSON data with syntax highlighting.",
  },
  "password-generator": {
    title: "Password Generator",
    description: "Generate strong, random passwords with customizable options.",
  },
  "base64-converter": {
    title: "Base64 Converter",
    description: "Encode and decode Base64 strings and files.",
  },
  "uuid-generator": {
    title: "UUID Generator",
    description: "Generate universally unique identifiers (UUIDs).",
  },
  "text-diff": {
    title: "Text Diff",
    description: "Compare two texts and highlight the differences.",
  },
  "html-minifier": {
    title: "HTML Minifier",
    description: "Remove whitespace and compress HTML code",
  },
  "css-minifier": {
    title: "CSS Minifier",
    description: "Minify CSS code by removing whitespace and comments",
  },
  "js-minifier": {
    title: "JavaScript Minifier",
    description: "Minify JavaScript code",
  },
  "sql-formatter": {
    title: "SQL Formatter",
    description: "Beautify SQL queries with proper formatting",
  },
  "html-entity-converter": {
    title: "HTML Entity Converter",
    description: "Encode/decode HTML entities",
  },
  "bbcode-to-html": {
    title: "BBCode to HTML",
    description: "Convert forum BBCode to HTML",
  },
  "markdown-to-html": {
    title: "Markdown to HTML",
    description: "Convert Markdown formatted text to HTML",
  },
  "html-tags-remover": {
    title: "HTML Tags Remover",
    description: "Strip HTML tags from text",
  },
  "user-agent-parser": {
    title: "User Agent Parser",
    description: "Extract information from browser user-agent strings",
  },
  "url-parser": {
    title: "URL Parser",
    description: "Breakdown and analyze URL components",
  },
};

// Load a tool into the main view
function loadTool(toolId) {
  // Update the current tool title and description
  document.getElementById("currentToolTitle").textContent = tools[toolId].title;
  document.getElementById("currentToolDescription").textContent =
    tools[toolId].description;

  // Hide dashboard and show tool views
  document.getElementById("dashboardView").style.display = "none";
  document.getElementById("toolViews").classList.remove("hidden");

  // Hide all tool views
  const toolViews = document.querySelectorAll("#toolViews > div");
  toolViews.forEach((view) => {
    view.classList.add("hidden");
  });

  // Show the selected tool
  document.getElementById(toolId).classList.remove("hidden");

  // Highlight the active tool in sidebar
  const toolNavs = document.querySelectorAll(".tool-nav");
  toolNavs.forEach((nav) => {
    nav.classList.remove("active-tool");
  });

  // Find and highlight the clicked tool
  const clickedTool = Array.from(toolNavs).find((nav) =>
    nav.getAttribute("onclick").includes(toolId)
  );

  if (clickedTool) {
    clickedTool.classList.add("active-tool");
  }

  // Add to recent tools
  addToRecentTools(toolId);

  // Initialize tool-specific functionality
  initializeTool(toolId);
}

// Initialize tool-specific functionality
function initializeTool(toolId) {
  switch (toolId) {
    case "text-case-converter":
      document
        .getElementById("caseInput")
        .addEventListener("input", function () {
          updateCharCount("caseInput", "charCount");
        });
      break;

    case "text-counter":
      document
        .getElementById("counterInput")
        .addEventListener("input", function () {
          updateTextStats();
        });
      updateTextStats();
      break;

    case "json-formatter":
      // Try to format any existing JSON in the input
      if (document.getElementById("jsonInput").value.trim()) {
        formatJson();
      }
      break;

    case "password-generator":
      // Generate a password on first load
      generatePassword();

      // Update password length display
      document
        .getElementById("passwordLength")
        .addEventListener("input", function () {
          document.getElementById("passwordLengthValue").textContent =
            this.value;
          document.getElementById("passwordLengthDisplay").textContent =
            this.value;
        });

      // Load saved passwords if any
      loadSavedPasswords();
      break;

    case "base64-converter":
      // Set up tab switching
      document
        .getElementById("encodeTab")
        .addEventListener("click", function () {
          showEncodeSection();
        });

      document
        .getElementById("decodeTab")
        .addEventListener("click", function () {
          showDecodeSection();
        });

      // Update character counts
      document
        .getElementById("base64Input")
        .addEventListener("input", function () {
          updateCharCount("base64Input", "base64CharCount");
        });

      document
        .getElementById("base64DecodeInput")
        .addEventListener("input", function () {
          updateCharCount("base64DecodeInput", "base64DecodeCharCount");
        });
      break;

    case "uuid-generator":
      // Generate a UUID on first load
      generateUUID();
      break;
  }
}

// Show encode section in Base64 converter
function showEncodeSection() {
  document.getElementById("encodeSection").classList.remove("hidden");
  document.getElementById("decodeSection").classList.add("hidden");
  document
    .getElementById("encodeTab")
    .classList.add("border-green-500", "text-green-600");
  document
    .getElementById("encodeTab")
    .classList.remove("border-transparent", "text-gray-500");
  document
    .getElementById("decodeTab")
    .classList.add("border-transparent", "text-gray-500");
  document
    .getElementById("decodeTab")
    .classList.remove("border-green-500", "text-green-600");
}

// Show decode section in Base64 converter
function showDecodeSection() {
  document.getElementById("decodeSection").classList.remove("hidden");
  document.getElementById("encodeSection").classList.add("hidden");
  document
    .getElementById("decodeTab")
    .classList.add("border-green-500", "text-green-600");
  document
    .getElementById("decodeTab")
    .classList.remove("border-transparent", "text-gray-500");
  document
    .getElementById("encodeTab")
    .classList.add("border-transparent", "text-gray-500");
  document
    .getElementById("encodeTab")
    .classList.remove("border-green-500", "text-green-600");
}

// Add tool to recent tools list
function addToRecentTools(toolId) {
  let recentTools = JSON.parse(localStorage.getItem("recentTools")) || [];

  // Remove if already exists
  recentTools = recentTools.filter((id) => id !== toolId);

  // Add to beginning
  recentTools.unshift(toolId);

  // Keep only last 3 tools
  if (recentTools.length > 3) {
    recentTools = recentTools.slice(0, 3);
  }

  localStorage.setItem("recentTools", JSON.stringify(recentTools));
  loadRecentTools();
}

// Load recent tools from localStorage
function loadRecentTools() {
  const recentTools = JSON.parse(localStorage.getItem("recentTools")) || [];
  const container = document.getElementById("recentTools");

  container.innerHTML = "";

  if (recentTools.length === 0) {
    container.innerHTML = '<p class="text-gray-500">No recently used tools</p>';
    return;
  }

  recentTools.forEach((toolId) => {
    const tool = tools[toolId];
    if (tool) {
      const iconClass = toolId.includes("text-")
        ? "fa-font text-blue-600"
        : toolId.includes("json")
        ? "fa-code text-green-600"
        : toolId.includes("password")
        ? "fa-key text-purple-600"
        : toolId.includes("base64")
        ? "fa-lock text-green-600"
        : toolId.includes("uuid")
        ? "fa-fingerprint text-purple-600"
        : "fa-tools text-gray-600";

      container.innerHTML += `
                <div onclick="loadTool('${toolId}')" class="tool-card bg-white p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300">
                    <div class="flex items-center">
                        <div class="bg-gray-100 p-2 rounded-full mr-3">
                            <i class="fas ${iconClass}"></i>
                        </div>
                        <div>
                            <h3 class="font-semibold">${tool.title}</h3>
                            <p class="text-gray-600 text-sm">${tool.description.substring(
                              0,
                              50
                            )}...</p>
                        </div>
                    </div>
                </div>
            `;
    }
  });
}

// Set up event listeners
function setupEventListeners() {
  // Dark mode toggle
  document
    .getElementById("darkModeToggle")
    .addEventListener("click", toggleDarkMode);

  // Case converter functionality
  document.getElementById("caseInput")?.addEventListener("input", function () {
    updateCharCount("caseInput", "charCount");
  });

  // Text counter functionality
  document
    .getElementById("counterInput")
    ?.addEventListener("input", updateTextStats);

  // Password generator functionality
  const passwordLengthSlider = document.getElementById("passwordLength");
  if (passwordLengthSlider) {
    passwordLengthSlider.addEventListener("input", function () {
      document.getElementById("passwordLengthValue").textContent = this.value;
      document.getElementById("passwordLengthDisplay").textContent = this.value;
    });
  }
}

// Convert text case
function convertCase(caseType) {
  const input = document.getElementById("caseInput").value;
  let output = "";

  switch (caseType) {
    case "uppercase":
      output = input.toUpperCase();
      break;
    case "lowercase":
      output = input.toLowerCase();
      break;
    case "titlecase":
      output = input
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
      break;
    case "sentencecase":
      output = input
        .toLowerCase()
        .replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => char.toUpperCase());
      break;
    case "camelcase":
      output = input
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
        .replace(/^./, (char) => char.toLowerCase());
      break;
    case "pascalcase":
      output = input
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
        .replace(/^./, (char) => char.toUpperCase());
      break;
    case "snakecase":
      output = input.toLowerCase().replace(/\s+/g, "_");
      break;
    case "kebabcase":
      output = input.toLowerCase().replace(/\s+/g, "-");
      break;
    case "invertcase":
      output = input
        .split("")
        .map((char) =>
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        )
        .join("");
      break;
    case "alternatingcase":
      output = input
        .split("")
        .map((char, i) =>
          i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join("");
      break;
    default:
      output = input;
  }

  document.getElementById("caseOutput").value = output;
  updateCharCount("caseOutput", "charCount");
}

// Update character count
function updateCharCount(inputId, countId) {
  const text = document.getElementById(inputId).value;
  document.getElementById(countId).textContent = text.length;
}

// Update text statistics (words, lines, etc.)
function updateTextStats() {
  const text = document.getElementById("counterInput").value;

  // Character count
  document.getElementById("totalChars").textContent = text.length;

  // Word count (simplified)
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  document.getElementById("totalWords").textContent = words;

  // Line count
  const lines = text.trim() === "" ? 0 : text.split("\n").length;
  document.getElementById("totalLines").textContent = lines;

  // Sentence count (simplified)
  const sentences =
    text.trim() === ""
      ? 0
      : text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  document.getElementById("totalSentences").textContent = sentences;

  // Update timestamp
  document.getElementById("lastUpdated").textContent =
    new Date().toLocaleTimeString();
}

// Format JSON
function formatJson() {
  const input = document.getElementById("jsonInput").value;
  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);
    document.getElementById("jsonOutput").textContent = formatted;
    document.getElementById("jsonError").classList.add("hidden");

    // Add syntax highlighting (simplified)
    highlightJson();
  } catch (e) {
    document.getElementById("jsonErrorMessage").textContent = e.message;
    document.getElementById("jsonError").classList.remove("hidden");
  }
}

// Minify JSON
function minifyJson() {
  const input = document.getElementById("jsonInput").value;
  try {
    const parsed = JSON.parse(input);
    const minified = JSON.stringify(parsed);
    document.getElementById("jsonOutput").textContent = minified;
    document.getElementById("jsonError").classList.add("hidden");
  } catch (e) {
    document.getElementById("jsonErrorMessage").textContent = e.message;
    document.getElementById("jsonError").classList.remove("hidden");
  }
}

// Simple JSON syntax highlighting
function highlightJson() {
  const jsonOutput = document.getElementById("jsonOutput");
  let json = jsonOutput.textContent;

  // Simple highlighting (in a real app, use a proper library)
  json = json
    .replace(/"(\w+)":/g, '"<span class="text-purple-600">$1</span>":')
    .replace(/: ("[^"]*")/g, ': <span class="text-green-600">$1</span>')
    .replace(/: ([\d.]+)/g, ': <span class="text-blue-600">$1</span>')
    .replace(
      /: (true|false|null)/g,
      ': <span class="text-yellow-600">$1</span>'
    );

  jsonOutput.innerHTML = json;
}

// Generate password
function generatePassword() {
  const length = parseInt(document.getElementById("passwordLength").value);
  const includeUppercase = document.getElementById("includeUppercase").checked;
  const includeLowercase = document.getElementById("includeLowercase").checked;
  const includeNumbers = document.getElementById("includeNumbers").checked;
  const includeSymbols = document.getElementById("includeSymbols").checked;

  let charset = "";
  if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  if (charset === "") {
    alert("Please select at least one character type");
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  document.getElementById("generatedPassword").value = password;
  updatePasswordStrength(password);
}

// Generate multiple passwords
function generateMultiplePasswords() {
  const container = document.getElementById("passwordList");
  container.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    generatePassword();
    const password = document.getElementById("generatedPassword").value;

    const li = document.createElement("li");
    li.className = "py-2 flex justify-between items-center";
    li.innerHTML = `
              <span class="font-mono">${password}</span>
              <button onclick="copyPassword('${password}')" class="text-gray-500 hover:text-gray-700">
                  <i class="fas fa-copy"></i>
              </button>
          `;

    container.appendChild(li);
  }

  document.getElementById("savedPasswords").classList.remove("hidden");
}

// Update password strength indicator
function updatePasswordStrength(password) {
  let strength = "Weak";
  let color = "text-red-500";

  // Simple strength calculation
  if (password.length >= 12) {
    strength = "Strong";
    color = "text-green-500";
  } else if (password.length >= 8) {
    strength = "Medium";
    color = "text-yellow-500";
  }

  const strengthElement = document.getElementById("passwordStrength");
  strengthElement.textContent = strength;
  strengthElement.className = color;
}

// Save password to localStorage
function savePassword() {
  const password = document.getElementById("generatedPassword").value;
  if (!password) return;

  let savedPasswords = JSON.parse(localStorage.getItem("savedPasswords")) || [];
  savedPasswords.push({
    password: password,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 10 passwords
  if (savedPasswords.length > 10) {
    savedPasswords = savedPasswords.slice(-10);
  }

  localStorage.setItem("savedPasswords", JSON.stringify(savedPasswords));
  loadSavedPasswords();
}

// Load saved passwords from localStorage
function loadSavedPasswords() {
  const savedPasswords =
    JSON.parse(localStorage.getItem("savedPasswords")) || [];
  const container = document.getElementById("passwordList");

  container.innerHTML = "";

  if (savedPasswords.length === 0) {
    return;
  }

  savedPasswords.reverse().forEach((item) => {
    const li = document.createElement("li");
    li.className = "py-2 flex justify-between items-center";
    li.innerHTML = `
              <div>
                  <span class="font-mono">${item.password}</span>
                  <div class="text-xs text-gray-500">${new Date(
                    item.timestamp
                  ).toLocaleString()}</div>
              </div>
              <button onclick="copyPassword('${
                item.password
              }')" class="text-gray-500 hover:text-gray-700">
                  <i class="fas fa-copy"></i>
              </button>
          `;

    container.appendChild(li);
  });

  document.getElementById("savedPasswords").classList.remove("hidden");
}

// Copy password to clipboard
function copyPassword(password) {
  navigator.clipboard.writeText(password).then(() => {
    alert("Password copied to clipboard");
  });
}

// Encode to Base64
function encodeBase64() {
  const input = document.getElementById("base64Input").value;
  const encoded = btoa(unescape(encodeURIComponent(input)));
  document.getElementById("base64Output").value = encoded;
}

// Decode from Base64
function decodeBase64() {
  const input = document.getElementById("base64DecodeInput").value;
  try {
    const decoded = decodeURIComponent(escape(atob(input)));
    document.getElementById("base64DecodeOutput").value = decoded;
  } catch (e) {
    alert("Invalid Base64 input");
  }
}

// Generate UUID
function generateUUID() {
  let version = document.querySelector(
    'input[name="uuidVersion"]:checked'
  ).value;
  let uuid;

  if (version === "v1") {
    // Simplified v1 UUID (not actually time-based in this example)
    uuid = "xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  } else {
    // v4 UUID (random)
    uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  document.getElementById("uuidOutput").value = uuid;
}

// Generate multiple UUIDs
function generateMultipleUUIDs() {
  const container = document.getElementById("uuidList");
  container.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    generateUUID();
    const uuid = document.getElementById("uuidOutput").value;

    const li = document.createElement("li");
    li.className = "py-2";
    li.textContent = uuid;

    container.appendChild(li);
  }

  document.getElementById("multipleUUIDs").classList.remove("hidden");
}

// Show text differences
function showDiff() {
  const original = document.getElementById("diffOriginal").value;
  const modified = document.getElementById("diffModified").value;

  if (!original && !modified) {
    alert("Please enter both texts to compare");
    return;
  }

  // Simple diff implementation (in a real app, use a proper diff library)
  const diffOutput = document.getElementById("diffOutput");
  diffOutput.innerHTML = "";

  if (original === modified) {
    diffOutput.innerHTML =
      '<div class="text-green-600">Texts are identical</div>';
  } else {
    // Split into lines for comparison
    const originalLines = original.split("\n");
    const modifiedLines = modified.split("\n");

    const maxLines = Math.max(originalLines.length, modifiedLines.length);

    for (let i = 0; i < maxLines; i++) {
      const originalLine = originalLines[i] || "";
      const modifiedLine = modifiedLines[i] || "";

      if (originalLine === modifiedLine) {
        diffOutput.innerHTML += `<div class="text-gray-500">${
          i + 1
        }: ${originalLine}</div>`;
      } else {
        diffOutput.innerHTML += `<div class="text-red-500">${
          i + 1
        }: - ${originalLine}</div>`;
        diffOutput.innerHTML += `<div class="text-green-500">${
          i + 1
        }: + ${modifiedLine}</div>`;
      }
    }
  }

  document.getElementById("diffResult").classList.remove("hidden");
}

// Copy text to clipboard
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  let text = element.value || element.textContent;

  // For pre elements with syntax highlighting, we need to get the raw text
  if (element.tagName === "PRE" && element.innerHTML) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = element.innerHTML;
    text = tempDiv.textContent;
  }

  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard");
  });
}

// Clear text fields
function clearText(...elementIds) {
  elementIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {
      element.value = "";
    } else {
      element.textContent = "";
    }
  });

  // If clearing JSON input, also hide the error
  if (elementIds.includes("jsonInput")) {
    document.getElementById("jsonError").classList.add("hidden");
  }

  // If clearing diff inputs, hide the result
  if (
    elementIds.includes("diffOriginal") ||
    elementIds.includes("diffModified")
  ) {
    document.getElementById("diffResult").classList.add("hidden");
  }
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  document.querySelector(".sidebar").classList.toggle("dark-mode");

  // Toggle all tool cards
  document.querySelectorAll(".tool-card").forEach((card) => {
    card.classList.toggle("dark-mode");
  });

  // Update icon
  const icon = document.getElementById("darkModeToggle").querySelector("i");
  if (document.body.classList.contains("dark-mode")) {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    localStorage.setItem("darkMode", "enabled");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    localStorage.setItem("darkMode", "disabled");
  }
}

// Check for dark mode preference
function checkDarkModePreference() {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    toggleDarkMode(); // This will apply dark mode
  }
}

// HTML Minifier
function minifyHTML() {
  const input = document.getElementById("htmlInput").value;
  // Simple minification (replace with a proper library in production)
  const minified = input
    .replace(/\<!--.*?--\>/g, "") // Remove comments
    .replace(/\s+/g, " ") // Collapse whitespace
    .replace(/>\s+</g, "><"); // Remove spaces between tags
  document.getElementById("htmlOutput").value = minified;
}

// CSS Minifier
function minifyCSS() {
  const input = document.getElementById("cssInput").value;
  // Simple minification
  const minified = input
    .replace(/\/\*.*?\*\//g, "") // Remove comments
    .replace(/\s+/g, " ") // Collapse whitespace
    .replace(/\s*([{}:;,])\s*/g, "$1") // Remove spaces around special chars
    .replace(/;}/g, "}"); // Remove last semicolon in rules
  document.getElementById("cssOutput").value = minified;
}

// JS Minifier
function minifyJS() {
  const input = document.getElementById("jsInput").value;
  // Simple minification (use a proper minifier in production)
  const minified = input
    .replace(/\/\/.*/g, "") // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
    .replace(/\s+/g, " ") // Collapse whitespace
    .replace(/\s*([=+\-*\/%&|^~!<>?:,;{}()[\]])\s*/g, "$1"); // Remove spaces around operators
  document.getElementById("jsOutput").value = minified;
}

// User Agent Parser
function parseUserAgent() {
  const ua = document.getElementById("userAgentInput").value;
  if (!ua) return;

  // Simple parsing (use a proper library like ua-parser-js in production)
  const result = document.getElementById("userAgentResult");
  result.innerHTML = `
    <h3 class="font-medium mb-2">Parsed Information:</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div class="bg-white p-2 rounded">
        <span class="text-sm text-gray-500">Browser:</span>
        <div class="font-medium">${guessBrowser(ua)}</div>
      </div>
      <div class="bg-white p-2 rounded">
        <span class="text-sm text-gray-500">OS:</span>
        <div class="font-medium">${guessOS(ua)}</div>
      </div>
      <div class="bg-white p-2 rounded">
        <span class="text-sm text-gray-500">Device:</span>
        <div class="font-medium">${guessDevice(ua)}</div>
      </div>
      <div class="bg-white p-2 rounded">
        <span class="text-sm text-gray-500">Mobile:</span>
        <div class="font-medium">${isMobile(ua) ? "Yes" : "No"}</div>
      </div>
    </div>
  `;
  result.classList.remove("hidden");
}

// Helper functions for UA parsing
function guessBrowser(ua) {
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  if (ua.includes("Opera")) return "Opera";
  if (ua.includes("MSIE") || ua.includes("Trident/"))
    return "Internet Explorer";
  return "Unknown";
}

function guessOS(ua) {
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS") || ua.includes("iPhone")) return "iOS";
  return "Unknown";
}

function guessDevice(ua) {
  if (ua.includes("Mobile")) return "Mobile";
  if (ua.includes("Tablet")) return "Tablet";
  if (isMobile(ua)) return "Mobile";
  return "Desktop";
}

function isMobile(ua) {
  return /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
}

// URL Parser
function parseURL() {
  const urlString = document.getElementById("urlInput").value;
  if (!urlString) return;

  try {
    const url = new URL(urlString);
    const result = document.getElementById("urlResult");

    result.innerHTML = `
      <h3 class="font-medium mb-2">URL Components:</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div class="bg-white p-2 rounded">
          <span class="text-sm text-gray-500">Protocol:</span>
          <div class="font-mono">${url.protocol}</div>
        </div>
        <div class="bg-white p-2 rounded">
          <span class="text-sm text-gray-500">Hostname:</span>
          <div class="font-mono">${url.hostname}</div>
        </div>
        <div class="bg-white p-2 rounded">
          <span class="text-sm text-gray-500">Path:</span>
          <div class="font-mono">${url.pathname}</div>
        </div>
        <div class="bg-white p-2 rounded">
          <span class="text-sm text-gray-500">Search Params:</span>
          <div class="font-mono">${url.search || "None"}</div>
        </div>
        <div class="bg-white p-2 rounded">
          <span class="text-sm text-gray-500">Hash:</span>
          <div class="font-mono">${url.hash || "None"}</div>
        </div>
      </div>
    `;
    result.classList.remove("hidden");
  } catch (e) {
    alert("Invalid URL format");
  }
}
