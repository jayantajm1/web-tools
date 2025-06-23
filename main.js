// Initialize the app
document.addEventListener("DOMContentLoaded", function () {
  // Load recent tools from localStorage
  loadRecentTools();

  // Set up event listeners (for initial dashboard and common elements)
  setupEventListeners();

  // Check for dark mode preference
  checkDarkModePreference();

  // Initial load of the dashboard view
  showDashboard();
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
    title: "JS Minifier",
    description: "Minify JavaScript code",
  },
  "sql-formatter": {
    title: "SQL Formatter",
    description: "Format and beautify SQL queries",
  },
  "html-entity-converter": {
    title: "HTML Entity Converter",
    description: "Convert between HTML entities and regular characters",
  },
  "bbcode-to-html": {
    title: "BBCode to HTML",
    description: "Convert BBCode markup to HTML",
  },
  "markdown-to-html": {
    title: "Markdown to HTML",
    description: "Convert Markdown text to HTML",
  },
  "html-tags-remover": {
    title: "HTML Tags Remover",
    description: "Remove HTML tags from text while preserving content",
  },
  "user-agent-parser": {
    title: "User Agent Parser",
    description: "Parse and analyze user agent strings",
  },
  "url-parser": {
    title: "URL Parser",
    description: "Parse URLs into their components",
  },
  // New tools
  "time-tool": {
    title: "Time Tool",
    description: "Display current time and date with timezone options.",
  },
  "weight-converter": {
    title: "Weight Converter",
    description: "Convert weights between different units (kg, lbs, g, oz).",
  },
  "image-converter": {
    title: "Image Converter",
    description: "Convert image formats (basic placeholder).",
  },
  "image-to-doc": {
    title: "Image to Document",
    description:
      "Convert images to document formats like PDF or Word (complex, placeholder).",
  },
  "pdf-converter": {
    title: "PDF Converter",
    description: "Convert files to/from PDF (complex, placeholder).",
  },
};

// Global interval ID for the time tool to manage it
let timeToolInterval = null;

// Function to show the dashboard and hide tool views
function showDashboard() {
  document.getElementById("dashboardView").classList.remove("hidden");
  document.getElementById("toolViews").classList.add("hidden");
  document.getElementById("currentToolTitle").textContent =
    "Welcome to Web Tools";
  document.getElementById("currentToolDescription").textContent =
    "Select a tool from the sidebar to get started";
  updateActiveTool(null); // Clear active tool in sidebar
  loadRecentTools(); // Refresh recent tools on dashboard view

  // Clear time tool interval if dashboard is shown
  if (timeToolInterval) {
    clearInterval(timeToolInterval);
    timeToolInterval = null;
  }
}

// Function to load a specific tool view
function loadTool(toolId) {
  // Hide dashboard and all tool views first
  document.getElementById("dashboardView").classList.add("hidden");
  const toolViews = document.getElementById("toolViews");
  toolViews.classList.remove("hidden"); // Ensure toolViews container is visible

  // Hide all individual tool sections
  const sections = toolViews.children;
  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.add("hidden");
  }

  // Show the requested tool
  const toolElement = document.getElementById(toolId);
  if (toolElement) {
    toolElement.classList.remove("hidden");

    // Update header with tool info
    const toolInfo = tools[toolId];
    if (toolInfo) {
      document.getElementById("currentToolTitle").textContent = toolInfo.title;
      document.getElementById("currentToolDescription").textContent =
        toolInfo.description;
    }

    // Add to recent tools
    addRecentTool(toolId);

    // Update active tool in sidebar
    updateActiveTool(toolId);

    // Specific initializations for certain tools
    if (toolId === "time-tool") {
      // Ensure time display updates every second
      updateTime(); // Initial update
      if (timeToolInterval) {
        clearInterval(timeToolInterval); // Clear any existing interval
      }
      timeToolInterval = setInterval(updateTime, 1000);
      document
        .getElementById("timeZoneSelect")
        .addEventListener("change", updateTime);
    } else {
      // Clear interval if switching away from time tool
      if (timeToolInterval) {
        clearInterval(timeToolInterval);
        timeToolInterval = null;
      }
    }

    if (toolId === "weight-converter") {
      // Initial conversion on load
      convertWeight();
      // Add event listeners for input and select changes
      document
        .getElementById("weightInput")
        .addEventListener("input", convertWeight);
      document
        .getElementById("fromUnit")
        .addEventListener("change", convertWeight);
      document
        .getElementById("toUnit")
        .addEventListener("change", convertWeight);
    }

    // JSON Formatter setup
    if (toolId === "json-formatter") {
      document
        .getElementById("jsonInput")
        .addEventListener("input", formatJson);
      formatJson(); // Initial format
    }

    // Password Generator setup
    if (toolId === "password-generator") {
      document
        .getElementById("passwordLength")
        .addEventListener("input", function () {
          document.getElementById("passwordLengthValue").textContent =
            this.value;
          generatePassword();
        });
      document
        .getElementById("includeUppercase")
        .addEventListener("change", generatePassword);
      document
        .getElementById("includeLowercase")
        .addEventListener("change", generatePassword);
      document
        .getElementById("includeNumbers")
        .addEventListener("change", generatePassword);
      document
        .getElementById("includeSymbols")
        .addEventListener("change", generatePassword);
      generatePassword(); // Initial generate
    }

    // Base64 Converter setup
    if (toolId === "base64-converter") {
      document.getElementById("encodeTab").addEventListener("click", () => {
        document.getElementById("encodeSection").classList.remove("hidden");
        document.getElementById("decodeSection").classList.add("hidden");
        document
          .getElementById("encodeTab")
          .classList.add("border-green-500", "text-green-600");
        document
          .getElementById("encodeTab")
          .classList.remove(
            "border-transparent",
            "text-gray-500",
            "hover:text-gray-700"
          );
        document
          .getElementById("decodeTab")
          .classList.remove("border-green-500", "text-green-600");
        document
          .getElementById("decodeTab")
          .classList.add(
            "border-transparent",
            "text-gray-500",
            "hover:text-gray-700"
          );
        encodeBase64(); // Re-encode if input exists
      });
      document.getElementById("decodeTab").addEventListener("click", () => {
        document.getElementById("decodeSection").classList.remove("hidden");
        document.getElementById("encodeSection").classList.add("hidden");
        document
          .getElementById("decodeTab")
          .classList.add("border-green-500", "text-green-600");
        document
          .getElementById("decodeTab")
          .classList.remove(
            "border-transparent",
            "text-gray-500",
            "hover:text-gray-700"
          );
        document
          .getElementById("encodeTab")
          .classList.remove("border-green-500", "text-green-600");
        document
          .getElementById("encodeTab")
          .classList.add(
            "border-transparent",
            "text-gray-500",
            "hover:text-gray-700"
          );
        decodeBase64(); // Re-decode if input exists
      });
      document
        .getElementById("base64Input")
        .addEventListener("input", encodeBase64);
      document
        .getElementById("base64DecodeInput")
        .addEventListener("input", decodeBase64);
      encodeBase64(); // Initial state for Base64 converter
    }

    // UUID Generator setup
    if (toolId === "uuid-generator") {
      document
        .getElementById("uuidV1")
        .addEventListener("change", generateUUID);
      document
        .getElementById("uuidV4")
        .addEventListener("change", generateUUID);
      generateUUID(); // Initial generate
    }

    // Text Diff setup
    if (toolId === "text-diff") {
      document
        .getElementById("diffOriginal")
        .addEventListener("input", showDiff);
      document
        .getElementById("diffModified")
        .addEventListener("input", showDiff);
      showDiff(); // Initial diff
    }

    // HTML Minifier setup
    if (toolId === "html-minifier") {
      document
        .getElementById("htmlInput")
        .addEventListener("input", minifyHTML);
      minifyHTML(); // Initial minify
    }

    // CSS Minifier setup
    if (toolId === "css-minifier") {
      document.getElementById("cssInput").addEventListener("input", minifyCSS);
      minifyCSS(); // Initial minify
    }

    // JS Minifier setup
    if (toolId === "js-minifier") {
      document.getElementById("jsInput").addEventListener("input", minifyJS);
      minifyJS(); // Initial minify
    }

    // SQL Formatter setup
    if (toolId === "sql-formatter") {
      document.getElementById("sqlInput").addEventListener("input", formatSQL);
      formatSQL(); // Initial format
    }

    // HTML Entity Converter setup
    if (toolId === "html-entity-converter") {
      document
        .getElementById("htmlEntityInput")
        .addEventListener("input", encodeHtmlEntities); // Default to encode on input
      encodeHtmlEntities(); // Initial state
    }

    // BBCode to HTML setup
    if (toolId === "bbcode-to-html") {
      document
        .getElementById("bbcodeInput")
        .addEventListener("input", convertBbcodeToHtml);
      convertBbcodeToHtml(); // Initial convert
    }

    // Markdown to HTML setup
    if (toolId === "markdown-to-html") {
      document
        .getElementById("markdownInput")
        .addEventListener("input", convertMarkdownToHtml);
      convertMarkdownToHtml(); // Initial convert
    }

    // HTML Tags Remover setup
    if (toolId === "html-tags-remover") {
      document
        .getElementById("htmlTagsInput")
        .addEventListener("input", removeHtmlTags);
      removeHtmlTags(); // Initial remove
    }

    // User Agent Parser setup
    if (toolId === "user-agent-parser") {
      // No live input, relies on button click, so no listener needed here
      // But ensure result div is hidden on load
      document.getElementById("userAgentResult").classList.add("hidden");
    }

    // URL Parser setup
    if (toolId === "url-parser") {
      // No live input, relies on button click, so no listener needed here
      // But ensure result div is hidden on load
      document.getElementById("urlResult").classList.add("hidden");
    }
  } else {
    console.error("Tool not found:", toolId);
    showDashboard(); // Fallback to dashboard if tool not found
  }
}

// Manages the 'active' class on sidebar navigation buttons
function updateActiveTool(activeToolId) {
  const navButtons = document.querySelectorAll(".tool-nav");
  navButtons.forEach((button) => {
    // Check if the button's onclick attribute contains the activeToolId
    if (
      button.getAttribute("onclick").includes(`loadTool('${activeToolId}')`)
    ) {
      button.classList.add("active-tool");
    } else {
      button.classList.remove("active-tool");
    }
  });
}

// Function to copy text to clipboard
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  let textToCopy = "";

  if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {
    textToCopy = element.value;
  } else if (element.tagName === "PRE" || element.tagName === "DIV") {
    textToCopy = element.textContent;
  }

  // Use a temporary textarea for copying to clipboard
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = textToCopy;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  try {
    document.execCommand("copy");
    // You might want to show a small "Copied!" message here
    console.log("Text copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
  document.body.removeChild(tempTextArea);
}

// Function to clear text in input/output fields
function clearText(...elementIds) {
  elementIds.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      if (element.tagName === "TEXTAREA" || element.tagName === "INPUT") {
        element.value = "";
      } else if (element.tagName === "PRE" || element.tagName === "DIV") {
        element.textContent = "";
      }
      // Special handling for JSON error message if clearing JSON input
      if (id === "jsonInput") {
        document.getElementById("jsonError").classList.add("hidden");
        document.getElementById("jsonOutput").textContent = "{}"; // Reset JSON output
      }
      // Special handling for user agent and URL parser results
      if (id === "userAgentInput") {
        document.getElementById("userAgentResult").classList.add("hidden");
      }
      if (id === "urlInput") {
        document.getElementById("urlResult").classList.add("hidden");
      }
      // For character counter, reset counts
      if (id === "counterInput") {
        document.getElementById("totalChars").textContent = "0";
        document.getElementById("totalWords").textContent = "0";
        document.getElementById("totalLines").textContent = "0";
        document.getElementById("totalSentences").textContent = "0";
        document.getElementById("lastUpdated").textContent = "Never";
      }
    }
  });
}

// Dark Mode Toggle
function setupEventListeners() {
  document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    // Save preference to localStorage
    if (document.body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });

  // Event listener for Character Counter input
  const counterInput = document.getElementById("counterInput");
  if (counterInput) {
    counterInput.addEventListener("input", updateCharacterCount);
  }
}

// Check Dark Mode Preference
function checkDarkModePreference() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
  }
}

// Recent Tools Logic
function getRecentTools() {
  const recentTools = JSON.parse(localStorage.getItem("recentTools")) || [];
  return recentTools;
}

function addRecentTool(toolId) {
  let recentTools = getRecentTools();
  // Remove if already exists to move it to the front
  recentTools = recentTools.filter((id) => id !== toolId);
  // Add to the front
  recentTools.unshift(toolId);
  // Keep only the last 6 tools
  recentTools = recentTools.slice(0, 6);
  localStorage.setItem("recentTools", JSON.stringify(recentTools));
}

function loadRecentTools() {
  const recentToolsContainer = document.getElementById("recentTools");
  if (!recentToolsContainer) return;

  recentToolsContainer.innerHTML = ""; // Clear existing

  const recentTools = getRecentTools();
  if (recentTools.length === 0) {
    recentToolsContainer.innerHTML =
      '<p class="text-gray-500 col-span-full">No recently used tools. Select a tool from the sidebar to add it here.</p>';
    return;
  }

  recentTools.forEach((toolId) => {
    const toolInfo = tools[toolId];
    if (toolInfo) {
      const toolCard = document.createElement("div");
      toolCard.className =
        "tool-card bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all duration-300";
      toolCard.setAttribute("onclick", `loadTool('${toolId}')`);

      // Determine icon based on tool category or specific tool
      let iconClass = "fas fa-tools"; // Default icon
      let iconColorClass = "text-gray-600"; // Default color

      if (
        toolId.includes("text-case") ||
        toolId.includes("text-count") ||
        toolId.includes("text-diff")
      ) {
        iconClass = "fas fa-font";
        iconColorClass = "text-blue-600";
      } else if (
        toolId.includes("json") ||
        toolId.includes("base64") ||
        toolId.includes("sql")
      ) {
        iconClass = "fas fa-code";
        iconColorClass = "text-green-600";
      } else if (toolId.includes("password") || toolId.includes("uuid")) {
        iconClass = "fas fa-key";
        iconColorClass = "text-purple-600";
      } else if (toolId.includes("minifier")) {
        iconClass = "fas fa-compress-alt";
        iconColorClass = "text-blue-600";
      } else if (
        toolId.includes("entity") ||
        toolId.includes("bbcode") ||
        toolId.includes("markdown") ||
        toolId.includes("tags-remover")
      ) {
        iconClass = "fas fa-exchange-alt";
        iconColorClass = "text-purple-600";
      } else if (toolId.includes("user-agent") || toolId.includes("url")) {
        iconClass = "fas fa-globe";
        iconColorClass = "text-yellow-600";
      } else if (toolId === "time-tool") {
        iconClass = "fas fa-clock";
        iconColorClass = "text-indigo-600";
      } else if (toolId === "weight-converter") {
        iconClass = "fas fa-weight-hanging";
        iconColorClass = "text-red-600";
      } else if (toolId.includes("image") || toolId.includes("pdf")) {
        iconClass = "fas fa-file"; // Generic file icon for now
        iconColorClass = "text-teal-600";
        if (toolId === "image-converter") iconClass = "fas fa-image";
        if (toolId === "image-to-doc") iconClass = "fas fa-file-image";
        if (toolId === "pdf-converter") iconClass = "fas fa-file-pdf";
      }

      toolCard.innerHTML = `
                <div class="flex items-center mb-4">
                    <div class="bg-gray-100 p-3 rounded-full mr-4">
                        <i class="${iconClass} ${iconColorClass}"></i>
                    </div>
                    <h3 class="font-semibold">${toolInfo.title}</h3>
                </div>
                <p class="text-gray-600 text-sm">${toolInfo.description}</p>
            `;
      recentToolsContainer.appendChild(toolCard);
    }
  });
}

// Text Case Converter Functions
function convertCase(caseType) {
  const inputText = document.getElementById("caseInput").value;
  let outputText = "";

  switch (caseType) {
    case "uppercase":
      outputText = inputText.toUpperCase();
      break;
    case "lowercase":
      outputText = inputText.toLowerCase();
      break;
    case "titlecase":
      outputText = inputText.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
      break;
    case "sentencecase":
      outputText = inputText
        .toLowerCase()
        .replace(/(^\s*\w|[.?!]\s*\w)/g, function (c) {
          return c.toUpperCase();
        });
      break;
    case "camelcase":
      outputText = inputText
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, "");
      break;
    case "pascalcase":
      outputText = inputText
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word) {
          return word.toUpperCase();
        })
        .replace(/\s+/g, "");
      break;
    case "snakecase":
      outputText = inputText.replace(/\s+/g, "_").toLowerCase();
      break;
    case "kebabcase":
      outputText = inputText.replace(/\s+/g, "-").toLowerCase();
      break;
    case "invertcase":
      outputText = inputText
        .split("")
        .map((char) => {
          return char === char.toUpperCase()
            ? char.toLowerCase()
            : char.toUpperCase();
        })
        .join("");
      break;
    case "alternatingcase":
      outputText = inputText
        .split("")
        .map((char, index) => {
          return index % 2 === 0 ? char.toLowerCase() : char.toUpperCase();
        })
        .join("");
      break;
    default:
      outputText = inputText;
  }

  document.getElementById("caseOutput").value = outputText;
  updateCharCount();
}

function updateCharCount() {
  const inputText = document.getElementById("caseInput").value;
  document.getElementById("charCount").textContent = inputText.length;
}

// Character Counter Functions
function updateCharacterCount() {
  const inputText = document.getElementById("counterInput").value;
  const chars = inputText.length;
  const words = inputText.split(/\s+/).filter((word) => word.length > 0).length;
  const lines = inputText.split(/\r\n|\r|\n/).length;
  const sentences = inputText
    .split(/[.?!]\s*|\n/)
    .filter((s) => s.length > 0).length;

  document.getElementById("totalChars").textContent = chars;
  document.getElementById("totalWords").textContent = words;
  document.getElementById("totalLines").textContent = lines;
  document.getElementById("totalSentences").textContent = sentences;
  document.getElementById("lastUpdated").textContent =
    new Date().toLocaleTimeString();
}

// JSON Formatter Functions
function formatJson() {
  const jsonInput = document.getElementById("jsonInput");
  const jsonOutput = document.getElementById("jsonOutput");
  const jsonError = document.getElementById("jsonError");
  const jsonErrorMessage = document.getElementById("jsonErrorMessage");

  try {
    const parsedJson = JSON.parse(jsonInput.value);
    jsonOutput.textContent = JSON.stringify(parsedJson, null, 2); // Pretty print
    jsonError.classList.add("hidden");
    highlightJsonSyntax(jsonOutput);
  } catch (e) {
    jsonOutput.textContent = ""; // Clear output on error
    jsonErrorMessage.textContent = "Invalid JSON: " + e.message;
    jsonError.classList.remove("hidden");
  }
}

function minifyJson() {
  const jsonInput = document.getElementById("jsonInput");
  const jsonOutput = document.getElementById("jsonOutput");
  const jsonError = document.getElementById("jsonError");
  const jsonErrorMessage = document.getElementById("jsonErrorMessage");

  try {
    const parsedJson = JSON.parse(jsonInput.value);
    jsonOutput.textContent = JSON.stringify(parsedJson); // Minify
    jsonError.classList.add("hidden");
    highlightJsonSyntax(jsonOutput);
  } catch (e) {
    jsonOutput.textContent = ""; // Clear output on error
    jsonErrorMessage.textContent = "Invalid JSON: " + e.message;
    jsonError.classList.remove("hidden");
  }
}

function highlightJsonSyntax(element) {
  let jsonString = element.textContent;
  if (!jsonString) return;

  jsonString = jsonString
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Keywords (true, false, null)
  jsonString = jsonString.replace(
    /\b(true|false|null)\b/g,
    '<span class="text-blue-600">$&</span>'
  );
  // Numbers
  jsonString = jsonString.replace(
    /\b(\d+(\.\d+)?([eE][+-]?\d+)?)\b/g,
    '<span class="text-purple-600">$&</span>'
  );
  // Strings
  jsonString = jsonString.replace(
    /"([^"\\]*(\\.[^"\\]*)*)"/g,
    '<span class="text-green-600">"$&1"</span>'
  );
  // Keys (unquoted strings before a colon, if any)
  jsonString = jsonString.replace(
    /"(\w+)":/g,
    '<span class="text-yellow-600">"$1"</span>:'
  );

  element.innerHTML = jsonString;
}

// Password Generator Functions
function generatePassword() {
  const length = document.getElementById("passwordLength").value;
  const includeUppercase = document.getElementById("includeUppercase").checked;
  const includeLowercase = document.getElementById("includeLowercase").checked;
  const includeNumbers = document.getElementById("includeNumbers").checked;
  const includeSymbols = document.getElementById("includeSymbols").checked;
  const generatedPasswordInput = document.getElementById("generatedPassword");
  const passwordStrengthDisplay = document.getElementById("passwordStrength");

  let charset = "";
  let password = "";
  if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
  if (includeNumbers) charset += "0123456789";
  if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

  if (charset === "") {
    generatedPasswordInput.value = "Select at least one character type.";
    passwordStrengthDisplay.textContent = "N/A";
    return;
  }

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  generatedPasswordInput.value = password;
  updatePasswordStrength(password);
}

function updatePasswordStrength(password) {
  const strengthDisplay = document.getElementById("passwordStrength");
  let strength = "Weak";
  let score = 0;

  if (password.length >= 8) score++;
  if (password.match(/[A-Z]/)) score++;
  if (password.match(/[a-z]/)) score++;
  if (password.match(/[0-9]/)) score++;
  if (password.match(/[^A-Za-z0-9]/)) score++;

  if (score === 5) {
    strength = "Very Strong";
    strengthDisplay.className = "text-sm text-green-500";
  } else if (score >= 3) {
    strength = "Strong";
    strengthDisplay.className = "text-sm text-yellow-500";
  } else if (score >= 1) {
    strength = "Moderate";
    strengthDisplay.className = "text-sm text-orange-500";
  } else {
    strength = "Weak";
    strengthDisplay.className = "text-sm text-red-500";
  }
  strengthDisplay.textContent = strength;
}

function generateMultiplePasswords() {
  const passwordList = document.getElementById("passwordList");
  const savedPasswordsDiv = document.getElementById("savedPasswords");
  passwordList.innerHTML = ""; // Clear previous list
  savedPasswordsDiv.classList.remove("hidden");

  for (let i = 0; i < 5; i++) {
    generatePassword(); // Generate a single password
    const password = document.getElementById("generatedPassword").value;
    const listItem = document.createElement("li");
    listItem.className = "py-2 flex justify-between items-center";
    listItem.innerHTML = `
      <span class="font-mono text-sm">${password}</span>
      <button onclick="copyToClipboardText('${password}')" class="text-blue-500 hover:text-blue-700 text-xs">Copy</button>
    `;
    passwordList.appendChild(listItem);
  }
}

// A helper for copying raw text directly, for dynamically created elements
function copyToClipboardText(text) {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  try {
    document.execCommand("copy");
    console.log("Text copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
  document.body.removeChild(tempTextArea);
}

function savePassword() {
  const password = document.getElementById("generatedPassword").value;
  if (password && password !== "Select at least one character type.") {
    const passwordList = document.getElementById("passwordList");
    const savedPasswordsDiv = document.getElementById("savedPasswords");
    savedPasswordsDiv.classList.remove("hidden");

    const listItem = document.createElement("li");
    listItem.className = "py-2 flex justify-between items-center";
    listItem.innerHTML = `
            <span class="font-mono text-sm">${password}</span>
            <button onclick="copyToClipboardText('${password}')" class="text-blue-500 hover:text-blue-700 text-xs">Copy</button>
        `;
    passwordList.appendChild(listItem);
  }
}

// Base64 Converter Functions
function encodeBase64() {
  const inputText = document.getElementById("base64Input").value;
  const outputTextarea = document.getElementById("base64Output");
  const charCount = document.getElementById("base64CharCount");

  try {
    outputTextarea.value = btoa(unescape(encodeURIComponent(inputText)));
    charCount.textContent = inputText.length;
  } catch (e) {
    outputTextarea.value = "Error: Invalid characters for Base64 encoding.";
    charCount.textContent = "0";
  }
}

function decodeBase64() {
  const inputText = document.getElementById("base64DecodeInput").value;
  const outputTextarea = document.getElementById("base64DecodeOutput");
  const charCount = document.getElementById("base64DecodeCharCount");

  try {
    outputTextarea.value = decodeURIComponent(escape(atob(inputText)));
    charCount.textContent = inputText.length;
  } catch (e) {
    outputTextarea.value = "Error: Invalid Base64 string.";
    charCount.textContent = "0";
  }
}

// UUID Generator Functions
function generateUUID() {
  const uuidOutput = document.getElementById("uuidOutput");
  const uuidV1 = document.getElementById("uuidV1").checked;

  let uuid;
  if (uuidV1) {
    uuid = uuidv1();
  } else {
    uuid = uuidv4();
  }
  uuidOutput.value = uuid;
}

function generateMultipleUUIDs() {
  const uuidList = document.getElementById("uuidList");
  const multipleUUIDsDiv = document.getElementById("multipleUUIDs");
  uuidList.innerHTML = ""; // Clear previous list
  multipleUUIDsDiv.classList.remove("hidden");

  for (let i = 0; i < 5; i++) {
    const uuid = document.getElementById("uuidV1").checked
      ? uuidv1()
      : uuidv4();
    const listItem = document.createElement("li");
    listItem.className = "py-2 flex justify-between items-center";
    listItem.innerHTML = `
      <span class="font-mono text-sm">${uuid}</span>
      <button onclick="copyToClipboardText('${uuid}')" class="text-purple-500 hover:text-purple-700 text-xs">Copy</button>
    `;
    uuidList.appendChild(listItem);
  }
}

// UUID v4 (Random)
function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// UUID v1 (Time-based) - A simplified mock, true v1 is more complex involving MAC address
function uuidv1() {
  // This is a simplified mock for demonstration.
  // A true UUID v1 requires more precise time and potentially MAC address.
  const d = new Date().getTime();
  const uuid = "xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      const r = (d + Math.random() * 16) % 16 | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
  return uuid;
}

// Text Diff Functions (Simplified, using a basic character-by-character diff)
function showDiff() {
  const originalText = document.getElementById("diffOriginal").value;
  const modifiedText = document.getElementById("diffModified").value;
  const diffOutput = document.getElementById("diffOutput");
  const diffResultDiv = document.getElementById("diffResult");

  if (originalText === "" && modifiedText === "") {
    diffResultDiv.classList.add("hidden");
    return;
  }

  diffResultDiv.classList.remove("hidden");
  let outputHtml = "";
  const maxLength = Math.max(originalText.length, modifiedText.length);

  for (let i = 0; i < maxLength; i++) {
    const charOriginal = originalText[i] || "";
    const charModified = modifiedText[i] || "";

    if (charOriginal === charModified) {
      outputHtml += `<span>${charOriginal}</span>`;
    } else {
      if (charOriginal !== "") {
        outputHtml += `<span class="bg-red-200 line-through">${charOriginal}</span>`;
      }
      if (charModified !== "") {
        outputHtml += `<span class="bg-green-200">${charModified}</span>`;
      }
    }
  }

  if (outputHtml === "") {
    diffOutput.innerHTML = "<p class='text-gray-500'>No differences found.</p>";
  } else {
    diffOutput.innerHTML = outputHtml;
  }
}

// HTML Minifier
function minifyHTML() {
  const htmlInput = document.getElementById("htmlInput").value;
  const htmlOutput = document.getElementById("htmlOutput");
  let minifiedHtml = htmlInput
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .replace(/<!--[\s\S]*?-->/g, "") // Remove HTML comments
    .replace(/>\s*</g, "><") // Remove whitespace between tags
    .trim(); // Trim leading/trailing whitespace

  htmlOutput.value = minifiedHtml;
}

// CSS Minifier
function minifyCSS() {
  const cssInput = document.getElementById("cssInput").value;
  const cssOutput = document.getElementById("cssOutput");
  let minifiedCss = cssInput
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove comments
    .replace(/\s*([{};:,])\s*/g, "$1") // Remove whitespace around selectors, properties, etc.
    .replace(/;\s*}/g, "}") // Remove trailing semicolons before closing braces
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim(); // Trim leading/trailing whitespace

  cssOutput.value = minifiedCss;
}

// JS Minifier (basic)
function minifyJS() {
  const jsInput = document.getElementById("jsInput").value;
  const jsOutput = document.getElementById("jsOutput");
  let minifiedJs = jsInput
    .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
    .replace(/\/\/[^\n]*/g, "") // Remove single-line comments
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .replace(/;\s*([}\]])/g, "$1") // Remove semicolons before closing braces/brackets
    .replace(/([{}\]();,=:])\s*/g, "$1") // Remove spaces after certain characters
    .replace(/\s*([{}\]();,=:])/g, "$1") // Remove spaces before certain characters
    .trim(); // Trim leading/trailing whitespace

  jsOutput.value = minifiedJs;
}

// SQL Formatter (basic)
function formatSQL() {
  const sqlInput = document.getElementById("sqlInput").value;
  const sqlOutput = document.getElementById("sqlOutput");
  // A very basic formatter: adds new lines after common SQL keywords for readability
  let formattedSql = sqlInput
    .replace(
      /SELECT|FROM|WHERE|AND|OR|GROUP BY|ORDER BY|LIMIT|INSERT INTO|VALUES|UPDATE|SET|DELETE FROM|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN|ON/gi,
      "\n$& "
    )
    .replace(/\s{2,}/g, " ") // Replace multiple spaces with one
    .trim();

  sqlOutput.value = formattedSql;
}

// HTML Entity Converter
function encodeHtmlEntities() {
  const input = document.getElementById("htmlEntityInput").value;
  const output = document.getElementById("htmlEntityOutput");
  output.value = input.replace(/[\u00A0-\u9999<>&]/gim, function (i) {
    return "&#" + i.charCodeAt(0) + ";";
  });
}

function decodeHtmlEntities() {
  const input = document.getElementById("htmlEntityInput").value;
  const output = document.getElementById("htmlEntityOutput");
  const doc = new DOMParser().parseFromString(input, "text/html");
  output.value = doc.documentElement.textContent;
}

// BBCode to HTML
function convertBbcodeToHtml() {
  const input = document.getElementById("bbcodeInput").value;
  const output = document.getElementById("bbcodeOutput");
  let html = input;

  // Simple BBCode replacements
  html = html.replace(/\[b\](.*?)\[\/b\]/gi, "<strong>$1</strong>");
  html = html.replace(/\[i\](.*?)\[\/i\]/gi, "<em>$1</em>");
  html = html.replace(/\[u\](.*?)\[\/u\]/gi, "<u>$1</u>");
  html = html.replace(/\[s\](.*?)\[\/s\]/gi, "<s>$1</s>");
  html = html.replace(
    /\[url=(.*?)\](.*?)\[\/url\]/gi,
    '<a href="$1" target="_blank">$2</a>'
  );
  html = html.replace(
    /\[code\](.*?)\[\/code\]/gi,
    "<pre><code>$1</code></pre>"
  );
  html = html.replace(
    /\[img\](.*?)\[\/img\]/gi,
    '<img src="$1" alt="Image" />'
  );
  html = html.replace(
    /\[quote\](.*?)\[\/quote\]/gi,
    "<blockquote>$1</blockquote>"
  );
  html = html.replace(
    /\[color=(.*?)\](.*?)\[\/color\]/gi,
    '<span style="color:$1;">$2</span>'
  );
  html = html.replace(
    /\[size=(.*?)\](.*?)\[\/size\]/gi,
    '<span style="font-size:$1;">$2</span>'
  );

  // Handle new lines
  html = html.replace(/\r\n|\r|\n/g, "<br />");

  output.value = html;
}

// Markdown to HTML (very basic conversion)
function convertMarkdownToHtml() {
  const input = document.getElementById("markdownInput").value;
  const output = document.getElementById("markdownOutput");
  let html = input;

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");

  // Links
  html = html.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank">$1</a>'
  );

  // Unordered lists (basic, handles single level)
  html = html.replace(/^\s*[\-\*]\s+(.*)$/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>)/gs, "<ul>\n$1\n</ul>");

  // Paragraphs and line breaks
  html = html.replace(/\n\n/g, "<p>"); // Replace double newlines with paragraph tags
  html = html.replace(/\n/g, "<br />"); // Replace single newlines with <br>

  output.value = html;
}

// HTML Tags Remover
function removeHtmlTags() {
  const input = document.getElementById("htmlTagsInput").value;
  const output = document.getElementById("htmlTagsOutput");
  // Use DOMParser to safely parse HTML and extract text content
  const doc = new DOMParser().parseFromString(input, "text/html");
  output.value = doc.body.textContent || "";
}

// User Agent Parser
function parseUserAgent() {
  const userAgentString = document.getElementById("userAgentInput").value;
  const resultDiv = document.getElementById("userAgentResult");
  resultDiv.innerHTML = "";
  resultDiv.classList.remove("hidden");

  if (!userAgentString) {
    resultDiv.innerHTML =
      "<p class='text-red-500'>Please enter a User Agent string.</p>";
    return;
  }

  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  let html = `<h3 class="font-medium mb-2">Parsed User Agent:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">`;

  // OS Info
  if (result.os.name) {
    html += `<div class="bg-white p-2 rounded">
                <span class="text-sm text-gray-500">OS:</span>
                <div class="font-mono">${result.os.name} ${
      result.os.version || ""
    }</div>
             </div>`;
  }
  // Browser Info
  if (result.browser.name) {
    html += `<div class="bg-white p-2 rounded">
                <span class="text-sm text-gray-500">Browser:</span>
                <div class="font-mono">${result.browser.name} ${
      result.browser.version || ""
    }</div>
             </div>`;
  }
  // Device Info
  if (result.device.vendor || result.device.model || result.device.type) {
    html += `<div class="bg-white p-2 rounded">
                <span class="text-sm text-gray-500">Device:</span>
                <div class="font-mono">${result.device.vendor || ""} ${
      result.device.model || ""
    } (${result.device.type || "Unknown Type"})</div>
             </div>`;
  }
  // CPU Info (less common but can be present)
  if (result.cpu.architecture) {
    html += `<div class="bg-white p-2 rounded">
                <span class="text-sm text-gray-500">CPU Arch:</span>
                <div class="font-mono">${result.cpu.architecture}</div>
             </div>`;
  }
  // Engine Info
  if (result.engine.name) {
    html += `<div class="bg-white p-2 rounded">
                <span class="text-sm text-gray-500">Engine:</span>
                <div class="font-mono">${result.engine.name} ${
      result.engine.version || ""
    }</div>
             </div>`;
  }
  html += `</div>`;
  resultDiv.innerHTML = html;
}

// Simple UAParser-like structure for demonstration, actual UAParser.js is much larger
class UAParser {
  constructor(uaString) {
    this.ua = uaString;
    this.result = {
      os: {},
      browser: {},
      device: {},
      cpu: {},
      engine: {},
    };
    this.parse();
  }

  parse() {
    this.parseOS();
    this.parseBrowser();
    this.parseDevice();
    this.parseCPU();
    this.parseEngine();
  }

  parseOS() {
    const osPatterns = [
      {
        name: "Windows",
        pattern: /(Windows NT|Win(dows)?)(?: (\d+\.\d+))?/,
      },
      {
        name: "macOS",
        pattern: /(Mac OS X|Macintosh);? ([\d._]+)/,
      },
      {
        name: "Android",
        pattern: /(Android) ?([\d.]+)?/,
      },
      {
        name: "iOS",
        pattern: /(iPhone|iPad|iPod).*OS ([\d_]+)/,
      },
      {
        name: "Linux",
        pattern: /(Linux)/,
      },
    ];

    for (const os of osPatterns) {
      const match = this.ua.match(os.pattern);
      if (match) {
        this.result.os.name = os.name;
        this.result.os.version = match[2] ? match[2].replace(/_/g, ".") : "";
        return;
      }
    }
  }

  parseBrowser() {
    const browserPatterns = [
      {
        name: "Chrome",
        pattern: /(Chrome|CriOS)\/([\d.]+)/,
      },
      {
        name: "Firefox",
        pattern: /(Firefox)\/([\d.]+)/,
      },
      {
        name: "Safari",
        pattern: /(Safari)\/([\d.]+)/,
      },
      {
        name: "Edge",
        pattern: /(Edge|Edg)\/([\d.]+)/,
      },
      {
        name: "IE",
        pattern: /(MSIE |Trident.*rv:)([\d.]+)/,
      },
      {
        name: "Opera",
        pattern: /(Opera|OPR)\/([\d.]+)/,
      },
    ];

    for (const browser of browserPatterns) {
      const match = this.ua.match(browser.pattern);
      if (match) {
        this.result.browser.name = browser.name;
        this.result.browser.version = match[2];
        return;
      }
    }
  }

  parseDevice() {
    const devicePatterns = [
      {
        type: "mobile",
        pattern:
          /(Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini)/i,
      },
      {
        type: "tablet",
        pattern: /(Tablet|iPad|PlayBook)/i,
      },
    ];

    for (const device of devicePatterns) {
      if (this.ua.match(device.pattern)) {
        this.result.device.type = device.type;
        // Basic vendor/model detection (can be expanded)
        const vendorMatch = this.ua.match(
          /(Samsung|LG|HTC|Sony|Motorola|Huawei|Xiaomi)/i
        );
        if (vendorMatch) this.result.device.vendor = vendorMatch[1];
        const modelMatch = this.ua.match(/Build\/([a-zA-Z0-9]+)/); // Android build ID
        if (this.result.os.name === "iOS") {
          const iOSModel = this.ua.match(/(iPhone|iPad|iPod)/);
          if (iOSModel) this.result.device.model = iOSModel[1];
        } else if (modelMatch) {
          this.result.device.model = modelMatch[1];
        } else {
          // Fallback to general model based on user agent substrings
          const genericModelMatch = this.ua.match(
            /([^;]+)\)?\s*(Build|Version)/
          );
          if (
            genericModelMatch &&
            !genericModelMatch[1].includes("Android") &&
            !genericModelMatch[1].includes("Linux")
          ) {
            this.result.device.model = genericModelMatch[1].trim();
          }
        }
        return;
      }
    }
    this.result.device.type = "desktop";
  }

  parseCPU() {
    const cpuPatterns = [
      {
        architecture: "ARM",
        pattern: /(arm|aarch64)/i,
      },
      {
        architecture: "x86",
        pattern: /(x86|i686|i386)/i,
      },
      {
        architecture: "x64",
        pattern: /(x64|amd64|wow64)/i,
      },
    ];

    for (const cpu of cpuPatterns) {
      if (this.ua.match(cpu.pattern)) {
        this.result.cpu.architecture = cpu.architecture;
        return;
      }
    }
  }

  parseEngine() {
    const enginePatterns = [
      {
        name: "WebKit",
        pattern: /(WebKit)\/([\d.]+)/,
      },
      {
        name: "Gecko",
        pattern: /(Gecko)\/([\d.]+)/,
      },
      {
        name: "Trident",
        pattern: /(Trident)\/([\d.]+)/,
      },
      {
        name: "Presto",
        pattern: /(Presto)\/([\d.]+)/,
      },
    ];

    for (const engine of enginePatterns) {
      const match = this.ua.match(engine.pattern);
      if (match) {
        this.result.engine.name = engine.name;
        this.result.engine.version = match[2];
        return;
      }
    }
  }

  getResult() {
    return this.result;
  }
}

// URL Parser
function parseURL() {
  const urlString = document.getElementById("urlInput").value;
  const result = document.getElementById("urlResult");
  result.innerHTML = "";
  result.classList.remove("hidden");

  if (!urlString) {
    result.innerHTML = "<p class='text-red-500'>Please enter a URL.</p>";
    return;
  }

  try {
    const url = new URL(urlString);
    let searchParamsHtml = "";
    if (url.searchParams.toString()) {
      searchParamsHtml = `<h4 class="font-medium mt-4 mb-2">Search Parameters:</h4><ul>`;
      for (const [key, value] of url.searchParams.entries()) {
        searchParamsHtml += `<li class="bg-white p-2 rounded mb-1"><span class="text-sm text-gray-500">${key}:</span> <div class="font-mono">${value}</div></li>`;
      }
      searchParamsHtml += `</ul>`;
    }

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
          <span class="text-sm text-gray-500">Port:</span>
          <div class="font-mono">${url.port || "None"}</div>
        </div>
        <div class="bg-white p-2 rounded">
          <span class="text-sm text-gray-500">Path:</span>
          <div class="font-mono">${url.pathname}</div>
        </div>
        <div class="bg-white p-2 rounded">
          <span class="text-sm text-gray-500">Query:</span>
          <div class="font-mono">${url.search || "None"}</div>
        </div>
        <div class="bg-white p-2 rounded">
          <span class="text-sm text-gray-500">Hash:</span>
          <div class="font-mono">${url.hash || "None"}</div>
        </div>
        <div class="bg-white p-2 rounded col-span-full">
          <span class="text-sm text-gray-500">Origin:</span>
          <div class="font-mono">${url.origin}</div>
        </div>
      </div>
      ${searchParamsHtml}
    `;
  } catch (e) {
    result.innerHTML = `<p class='text-red-500'>Invalid URL: ${e.message}</p>`;
  }
}

// New Tool Functions:

// Time Tool Function
function updateTime() {
  const timeDisplay = document.getElementById("currentTimeDisplay");
  const dateDisplay = document.getElementById("currentDateDisplay");
  const timeZoneSelect = document.getElementById("timeZoneSelect");

  if (!timeDisplay || !dateDisplay || !timeZoneSelect) return;

  const selectedTimeZone = timeZoneSelect.value;
  const now = new Date();

  const timeOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: selectedTimeZone,
  };
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: selectedTimeZone,
  };

  timeDisplay.textContent = now.toLocaleTimeString("en-US", timeOptions);
  dateDisplay.textContent = now.toLocaleDateString("en-US", dateOptions);
}

// Weight Converter Function
function convertWeight() {
  const weightInput = document.getElementById("weightInput");
  const fromUnit = document.getElementById("fromUnit");
  const toUnit = document.getElementById("toUnit");
  const weightOutput = document.getElementById("weightOutput");

  if (!weightInput || !fromUnit || !toUnit || !weightOutput) return;

  const inputValue = parseFloat(weightInput.value);
  const from = fromUnit.value;
  const to = toUnit.value;

  if (isNaN(inputValue)) {
    weightOutput.value = "Invalid input";
    return;
  }

  let grams = 0; // Convert everything to grams first

  switch (from) {
    case "kg":
      grams = inputValue * 1000;
      break;
    case "lbs":
      grams = inputValue * 453.592;
      break;
    case "g":
      grams = inputValue;
      break;
    case "oz":
      grams = inputValue * 28.3495;
      break;
    default:
      grams = inputValue;
  }

  let convertedValue = 0;

  switch (to) {
    case "kg":
      convertedValue = grams / 1000;
      break;
    case "lbs":
      convertedValue = grams / 453.592;
      break;
    case "g":
      convertedValue = grams;
      break;
    case "oz":
      convertedValue = grams / 28.3495;
      break;
    default:
      convertedValue = grams;
  }

  weightOutput.value = convertedValue.toFixed(4); // Display with 4 decimal places
}

// Placeholder functions for complex file tools
function handleImageConvert() {
  const imageInput = document.getElementById("imageInput");
  if (imageInput && imageInput.files.length > 0) {
    alert(
      "Image conversion is complex and typically requires server-side processing or advanced client-side libraries. This is a placeholder function."
    );
    console.log("Attempting to convert image:", imageInput.files[0].name);
  } else {
    alert("Please upload an image first.");
  }
}

function handleImageToDoc() {
  const imageToDocInput = document.getElementById("imageToDocInput");
  if (imageToDocInput && imageToDocInput.files.length > 0) {
    alert(
      "Image to document conversion is highly complex and often requires server-side OCR and document generation. This is a placeholder function."
    );
    console.log(
      "Attempting to convert image to doc:",
      imageToDocInput.files[0].name
    );
  } else {
    alert("Please upload an image first.");
  }
}

function handlePdfConvert() {
  const pdfInput = document.getElementById("pdfInput");
  if (pdfInput && pdfInput.files.length > 0) {
    alert(
      "PDF conversion is highly complex and typically requires robust server-side libraries or dedicated online services. This is a placeholder function."
    );
    console.log("Attempting to convert PDF:", pdfInput.files[0].name);
  } else {
    alert("Please upload a file first.");
  }
}
