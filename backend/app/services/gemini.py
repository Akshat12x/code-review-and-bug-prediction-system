import google.generativeai as genai
import json
import os
import re
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

REVIEW_PROMPT = """
You are an expert code reviewer and bug prediction system. Analyze the following {language} code thoroughly.

Return ONLY a valid JSON object with this exact structure (no markdown, no extra text):
{{
  "overall_score": <float 0-10>,
  "summary": "<2-3 sentence overall assessment>",
  "bugs": [
    {{
      "line": <int or null>,
      "severity": "<critical|high|medium|low>",
      "type": "<bug type e.g. NullPointerException, LogicError, etc>",
      "description": "<what the bug is>",
      "suggestion": "<how to fix it>"
    }}
  ],
  "security_issues": [
    {{
      "line": <int or null>,
      "severity": "<critical|high|medium|low>",
      "issue": "<security vulnerability name>",
      "recommendation": "<how to fix>"
    }}
  ],
  "performance_issues": [
    {{
      "description": "<performance problem>",
      "recommendation": "<optimization suggestion>"
    }}
  ],
  "suggestions": [
    {{
      "category": "<readability|maintainability|best_practice|naming>",
      "description": "<improvement suggestion>"
    }}
  ],
  "fixed_code": "<the complete corrected version of the code with all bugs fixed>"
}}

Code to analyze:
```{language}
{code}
```
"""


async def analyze_code(code: str, language: str) -> dict:
    prompt = REVIEW_PROMPT.format(language=language, code=code)
    response = model.generate_content(prompt)
    raw = response.text.strip()

    # Strip markdown code fences if present
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Attempt to extract JSON object from response
        match = re.search(r"\{.*\}", raw, re.DOTALL)
        if match:
            return json.loads(match.group())
        raise ValueError("AI returned invalid JSON response")


async def stream_review(code: str, language: str):
    prompt = REVIEW_PROMPT.format(language=language, code=code)
    response = model.generate_content(prompt, stream=True)
    for chunk in response:
        if chunk.text:
            yield chunk.text
