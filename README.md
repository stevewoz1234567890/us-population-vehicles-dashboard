# us-population-vehicles-dashboard

Single-page **Angular** dashboard with **Chart.js** visualizations, backed by **FastAPI** that integrates with the [Data USA](https://datausa.io/about/api) Tesseract API. The UI focuses on **U.S. population trends** (selected states) and **household vehicle availability** (national, 2021).

## Features

- **Line chart:** Population for Alabama, Florida, and California (2013–2021).
- **Pie chart:** U.S. vehicle-availability buckets (2021), ACS-style data via Data USA.
- Layout aligned with the design template (Open Sans, palette, sidebar, assets).
- **Docker Compose** runs the API and static front end (nginx proxies `/api` to FastAPI).

## Run with Docker

```bash
docker compose up --build
```

- **App:** http://localhost:8080  
- **API docs:** http://localhost:8001/docs (host port `8001` avoids common conflicts with `8000`)  

## Local development

**Terminal 1 — API**

```bash
cd server
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 2 — Angular** (dev server proxies `/api` to `localhost:8000`)

```bash
cd client
npm install
npm start
```

Open http://localhost:4200

## Project layout

| Path | Description |
|------|-------------|
| `client/` | Angular 19 application |
| `server/` | FastAPI intermediary for Data USA |
| `Assets/`, `Dashboard-Template.png`, `Guidelines/` | Design references (not served by the app by default) |

## API endpoints (FastAPI)

- `GET /api/charts/population-by-state` — JSON for the multi-line chart.
- `GET /api/charts/vehicles-by-household` — JSON for the pie chart.
- `GET /health` — health check.

Upstream data uses `https://api.datausa.io/tesseract/...` (the legacy `datausa.io/api/data` URL from some exercise briefs returns HTML in many environments; this backend uses the documented Tesseract API with equivalent cubes/measures).
