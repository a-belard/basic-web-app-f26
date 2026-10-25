const SHAKESPEARE =
  "William Shakespeare (26 April 1564 - 23 April 1616) was an " +
  "English poet, playwright, and actor, widely regarded as the greatest " +
  "writer in the English language and the world's pre-eminent dramatist.";

const SCRABBLE: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5, l: 1, m: 3,
  n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1, v: 4, w: 4, x: 8, y: 4, z: 10,
};

// Numbers after the colon, e.g. "Which of the following numbers is the largest: 44, 64, 99?"
function numbersAfterColon(query: string): number[] {
  const list = query.includes(":") ? query.slice(query.indexOf(":") + 1) : query;
  return (list.match(/-?\d+/g) ?? []).map(Number);
}

function wordsAfterColon(query: string): string[] {
  return query
    .slice(query.indexOf(":") + 1)
    .replace(/[?.]/g, "")
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);
}

function isPerfectPower(n: number, power: number): boolean {
  if (n < 0) return false;
  const root = Math.round(Math.pow(n, 1 / power));
  return Math.pow(root, power) === n;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

function fibonacci(n: number): number {
  let previous = 0;
  let current = 1;
  for (let i = 1; i < n; i++) [previous, current] = [current, previous + current];
  return n === 0 ? 0 : current;
}

function sorted(word: string): string {
  return word.toLowerCase().split("").sort().join("");
}

const OPERATORS = /(-?\d+(?:\.\d+)?)|(plus|minus|multiplied by|times|divided by|to the power of)/gi;

// "What is 3 plus 4 multiplied by 5?" -> 23, with the usual operator precedence.
function evaluate(query: string): string | undefined {
  const body = query.replace(/^\s*what is\s+/i, "").replace(/\?\s*$/, "");
  const tokens = Array.from(body.matchAll(OPERATORS), (match) => match[0].toLowerCase());
  if (tokens.length < 3 || tokens.length % 2 === 0) return;
  if (body.replace(OPERATORS, "").trim() !== "") return;

  const isNumber = (token: string) => /^-?\d/.test(token);
  if (!tokens.every((token, index) => (index % 2 === 0) === isNumber(token))) return;

  const apply = (operators: string[]) => {
    for (let i = 1; i < tokens.length; ) {
      if (operators.includes(tokens[i])) {
        const a = Number(tokens[i - 1]);
        const b = Number(tokens[i + 1]);
        const result =
          tokens[i] === "plus" ? a + b
          : tokens[i] === "minus" ? a - b
          : tokens[i] === "divided by" ? a / b
          : tokens[i] === "to the power of" ? Math.pow(a, b)
          : a * b;
        tokens.splice(i - 1, 3, String(result));
      } else {
        i += 2;
      }
    }
  };
  apply(["to the power of"]);
  apply(["multiplied by", "times", "divided by"]);
  apply(["plus", "minus"]);

  const value = Number(tokens[0]);
  return Number.isFinite(value) ? String(Number.isInteger(value) ? value : Math.round(value * 1e6) / 1e6) : undefined;
}

export default function QueryProcessor(query: string): string {
  const text = query.toLowerCase();

  if (/andrew\s*id/.test(text)) return "brutayis";

  if (text.includes("shakespeare")) return SHAKESPEARE;

  if (/what is your name/.test(text)) return "hiProf";

  // Lists of numbers
  if (/largest|biggest|greatest/.test(text)) return String(Math.max(...numbersAfterColon(query)));
  if (/smallest|lowest/.test(text)) return String(Math.min(...numbersAfterColon(query)));
  if (/both a square and a cube/.test(text)) {
    return numbersAfterColon(query)
      .filter((n) => isPerfectPower(n, 2) && isPerfectPower(n, 3))
      .join(", ");
  }
  if (/prime/.test(text) && text.includes(":")) {
    return numbersAfterColon(query).filter(isPrime).join(", ");
  }
  if (/\bsquare\b/.test(text) && text.includes(":")) {
    return numbersAfterColon(query).filter((n) => isPerfectPower(n, 2)).join(", ");
  }
  if (/\bcube\b/.test(text) && text.includes(":")) {
    return numbersAfterColon(query).filter((n) => isPerfectPower(n, 3)).join(", ");
  }

  // Fibonacci: "What is the 10th number in the Fibonacci sequence?"
  const fib = text.match(/(\d+)(?:st|nd|rd|th)?[^.?]*fibonacci/);
  if (fib) return String(fibonacci(Number(fib[1])));

  // Anagram: "Which of the following is an anagram of listen: enlist, google?"
  const anagram = text.match(/anagram of\s+([a-z]+)/);
  if (anagram) {
    return wordsAfterColon(query)
      .filter((word) => sorted(word) === sorted(anagram[1]))
      .join(", ");
  }

  // Scrabble: "What is the english scrabble score of hello?"
  const scrabble = text.match(/scrabble score of\s+([a-z]+)/);
  if (scrabble) {
    return String(scrabble[1].split("").reduce((total, letter) => total + (SCRABBLE[letter] ?? 0), 0));
  }

  // Arithmetic: plus, minus, multiplied by, divided by, to the power of
  const arithmetic = evaluate(query);
  if (arithmetic !== undefined) return arithmetic;

  // General knowledge
  if (text.includes("eiffel")) return "Paris";
  if (text.includes("banana")) return "yellow";
  if (text.includes("spain") && text.includes("euro")) return "peseta";
  if (text.includes("james bond") && text.includes("dr no")) return "Sean Connery";
  if (text.includes("pragmatic bookshelf")) return "pragprog";

  if (/\bage\b/.test(text)) return "67";

  return "";
}
