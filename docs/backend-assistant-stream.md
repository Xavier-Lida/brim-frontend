# Assistant streaming API contract

Backend base URL: `NEXT_PUBLIC_API_URL` (default `http://127.0.0.1:8000`).

Enable SSE on the frontend with:

```bash
NEXT_PUBLIC_ASSISTANT_STREAM=true
```

When disabled or when the stream endpoint fails, the client falls back to `POST /api/assistant` and simulates typing word-by-word.

---

## `POST /api/assistant`

Existing JSON endpoint. Request body:

```json
{
  "question": "Show spend by department this quarter",
  "history": [
    { "question": "...", "summary": "..." }
  ],
  "context": {
    "date_from": "2026-04-01",
    "date_to": "2026-06-30",
    "departments": []
  }
}
```

Query param: `mock_llm=true|false`

Response:

```json
{
  "text": "Markdown-friendly answer...",
  "visualization": {
    "type": "bar",
    "title": "Q2 spend by department",
    "data": { "labels": [], "values": [] }
  },
  "followUpSuggestions": ["...", "..."],
  "sql": "SELECT ..."
}
```

`sql` is accepted but **not rendered** in the Brim UI.

---

## `POST /api/assistant/stream` (new)

Server-Sent Events endpoint for real-time assistant responses.

### Request

```
POST /api/assistant/stream?mock_llm=true
Content-Type: application/json
Accept: text/event-stream
```

Body: same as `/api/assistant`.

### Response

`Content-Type: text/event-stream`

Each event is a single SSE `data:` line containing JSON:

```
data: {"type":"text_delta","delta":"Here "}

data: {"type":"text_delta","delta":"is your "}

data: {"type":"visualization","visualization":{"type":"bar","title":"...","data":{...}}}

data: {"type":"follow_up","suggestions":["Show flags","Compare Q1"]}

data: {"type":"done"}
```

### Event types

| type | payload | UI behavior |
|---|---|---|
| `text_delta` | `{ "delta": string }` | Append to streaming assistant bubble |
| `visualization` | `{ "visualization": Visualization }` | Switch layout to split; render chart in center stage |
| `follow_up` | `{ "suggestions": string[] }` | Show clickable chips under last message |
| `done` | — | Finalize message (`streaming: false`) |
| `error` | `{ "message": string }` | Show error text; finalize message |

### Recommended server order

1. Stream `text_delta` events (optional if answer is viz-only)
2. Emit `visualization` when structured data is ready
3. Emit `follow_up` with 2–4 suggestions
4. Emit `done`

### Context usage

The backend should filter Supabase queries using:

- `context.date_from` / `context.date_to`
- `context.departments` (empty array = all departments)

---

## Visualization types

| type | `data` shape |
|---|---|
| `bar` | `{ "labels": string[], "values": number[] }` **or** `Record<string, unknown>[]` (row objects, e.g. `{ "department": "Sales", "total": 256431.43 }`) |
| `line` | Same as `bar` |
| `pie` | `{ "segments": { "name": string, "value": number }[] }` **or** row object array |
| `table` | `{ "columns": string[], "rows": string[][] }` **or** row object array |
| `kpi` | `{ "value": string, "label": string, "change"?: string }` |

---

## Frontend persistence

Conversation state is stored in `localStorage` key `brim-assistant-session`:

- messages (including `streaming` flag)
- context presets
- layout mode (`centered` | `split`)
- active visualization message id

---

## FastAPI implementation sketch

```python
from fastapi.responses import StreamingResponse

@app.post("/api/assistant/stream")
async def assistant_stream(body: AssistantRequest, mock_llm: bool = True):
    async def event_generator():
        async for chunk in gemini_stream(body):
            yield f"data: {json.dumps(chunk)}\n\n"
        yield f'data: {json.dumps({"type": "done"})}\n\n'
    return StreamingResponse(event_generator(), media_type="text/event-stream")
```

Ensure CORS allows the Next.js origin when calling the API directly from the browser.
