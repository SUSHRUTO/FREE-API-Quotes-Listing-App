const API_URL = "https://api.freeapi.app/api/v1/public/quotes";

const container =
  document.getElementById("quotes-container");

const loadingText =
  document.getElementById("loading");

const searchInput =
  document.getElementById("search-input");

const randomQuoteText =
  document.getElementById("random-quote");

const randomAuthorText =
  document.getElementById("random-author");

let allQuotes = [];
let currentCategory = "all";

// LOAD QUOTES
async function loadQuotes() {

  try {

    container.innerHTML = "";

    loadingText.classList.remove("hidden");

    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error("Failed to fetch quotes");
    }

    const result = await res.json();

    loadingText.classList.add("hidden");

    let quotes =
      result?.data?.data ||
      result?.data ||
      [];

    if (!Array.isArray(quotes)) {
      throw new Error("Invalid quote data");
    }

    quotes = shuffleArray(quotes);

    allQuotes = quotes.map((quote, index) => ({
      ...quote,

      category: detectCategory(
        quote.content || quote.quote || "",
        index
      )
    }));

    displayQuotes(allQuotes);

    generateRandomQuote();

  } catch (error) {

    console.error(error);

    loadingText.innerText =
      "⚠️ Failed to load quotes";

    showFallbackQuotes();
  }
}

// SHUFFLE
function shuffleArray(array) {

  for (
    let i = array.length - 1;
    i > 0;
    i--
  ) {

    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [array[i], array[j]] =
      [array[j], array[i]];
  }

  return array;
}

// RANDOM API QUOTE
function generateRandomQuote() {

  if (allQuotes.length === 0) return;

  const randomIndex =
    Math.floor(
      Math.random() * allQuotes.length
    );

  const quote =
    allQuotes[randomIndex];

  randomQuoteText.innerText =
    `"${quote.content || quote.quote}"`;

  randomAuthorText.innerText =
    `— ${quote.author || "Unknown Author"}`;
}

// GENERATE CUSTOM QUOTE
function generateCustomQuote() {

  const input =
    document
      .getElementById("user-words")
      .value
      .trim();

  const output =
    document.getElementById(
      "generated-user-quote"
    );

  if (input === "") {

    output.innerText =
      "Please enter some words.";

    return;
  }

  const words =
    input.split(" ");

  const templates = [

    `${words.join(" ")} can change your life if you believe in yourself.`,

    `Never stop chasing ${words[0]} because greatness comes from persistence.`,

    `${words.join(" ")} is the key to success and happiness.`,

    `Your future depends on how you use ${words[0]} today.`,

    `Great things begin with ${words.join(" ")} and determination.`,

    `Success starts when you believe in ${words[0]}.`,

    `Every dream connected to ${words.join(" ")} is possible.`,

    `Small steps in ${words[0]} create big achievements.`

  ];

  const randomQuote =
    templates[
      Math.floor(
        Math.random() * templates.length
      )
    ];

  output.innerText =
    `"${randomQuote}"`;
}

// DISPLAY
function displayQuotes(quotes) {

  container.innerHTML = "";

  quotes.forEach((quote) => {

    container.appendChild(
      createQuoteCard(quote)
    );

  });
}

// CREATE CARD
function createQuoteCard(quote) {

  const div =
    document.createElement("div");

  const content =
    quote.content ||
    quote.quote ||
    "No quote available";

  const author =
    quote.author ||
    "Unknown Author";

  div.className =
    "bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-1 transition duration-300 flex flex-col justify-between";

  div.innerHTML = `
    <div>

      <div class="text-5xl text-indigo-400 mb-4">
        ❝
      </div>

      <p class="text-lg leading-relaxed text-gray-200 min-h-[160px]">
        ${content}
      </p>

    </div>

    <div class="mt-8">

      <div class="flex items-center justify-between">

        <div>

          <p class="font-semibold text-indigo-300">
            ${author}
          </p>

          <p class="text-xs text-gray-500 capitalize mt-1">
            ${quote.category}
          </p>

        </div>

        <button
          onclick="copyQuote('${content.replace(/'/g, "\\'")}')"
          class="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg text-sm transition"
        >
          Copy
        </button>

      </div>

    </div>
  `;

  return div;
}

// CATEGORY
function detectCategory(text, index) {

  const lower =
    text.toLowerCase();

  if (
    lower.includes("success") ||
    lower.includes("goal") ||
    lower.includes("dream")
  ) {
    return "success";
  }

  if (
    lower.includes("life") ||
    lower.includes("living")
  ) {
    return "life";
  }

  if (
    lower.includes("wisdom") ||
    lower.includes("knowledge")
  ) {
    return "wisdom";
  }

  const categories = [
    "motivation",
    "success",
    "life",
    "wisdom"
  ];

  return categories[index % 4];
}

// FILTER
function filterQuotes(category, button) {

  currentCategory = category;

  document
    .querySelectorAll(".filter-btn")
    .forEach(btn => {
      btn.classList.remove("active-filter");
    });

  button.classList.add("active-filter");

  if (category === "all") {

    displayQuotes(allQuotes);

    return;
  }

  const filtered =
    allQuotes.filter(
      q => q.category === category
    );

  displayQuotes(filtered);
}

// SEARCH
searchInput.addEventListener(
  "input",
  (e) => {

    const value =
      e.target.value
        .trim()
        .toLowerCase();

    if (value === "") {

      displayQuotes(allQuotes);

      return;
    }

    const filtered =
      allQuotes.filter((quote) => {

        const content =
          (
            quote.content ||
            quote.quote ||
            ""
          ).toLowerCase();

        const author =
          (
            quote.author ||
            ""
          ).toLowerCase();

        const category =
          (
            quote.category ||
            ""
          ).toLowerCase();

        return (
          content.includes(value) ||
          author.includes(value) ||
          category.includes(value)
        );
      });

    displayQuotes(filtered);
  }
);

// COPY
function copyQuote(text) {

  navigator.clipboard.writeText(text);

  alert("Quote copied!");
}

// FALLBACK
function showFallbackQuotes() {

  allQuotes = [

    {
      content:
        "Success is not final, failure is not fatal.",
      author:
        "Winston Churchill",
      category:
        "success"
    },

    {
      content:
        "Life is what happens while you are busy making plans.",
      author:
        "John Lennon",
      category:
        "life"
    },

    {
      content:
        "Knowledge speaks, wisdom listens.",
      author:
        "Jimi Hendrix",
      category:
        "wisdom"
    }

  ];

  displayQuotes(allQuotes);

  generateRandomQuote();
}

// INITIAL LOAD
loadQuotes();