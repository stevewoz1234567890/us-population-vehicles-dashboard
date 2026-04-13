"""FastAPI intermediary for Data USA → Angular charts."""

from __future__ import annotations

import logging
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATAUSA_BASE = "https://api.datausa.io/tesseract"

POPULATION_QUERY = (
    f"{DATAUSA_BASE}/data.jsonrecords"
    "?cube=acs_yg_total_population_5"
    "&drilldowns=State,Year"
    "&measures=Population"
    "&Year=2013,2014,2015,2016,2017,2018,2019,2020,2021"
    "&State=04000US01,04000US12,04000US06"
)

# Mirrors exercise intent: US households by vehicles available (ACS B08014-style),
# 2021, national. Official zircon URL from the brief returns 404; this uses the
# public Tesseract API with the same cube/measures.
VEHICLES_QUERY = (
    f"{DATAUSA_BASE}/data.jsonrecords"
    "?cube=acs_ygsv_gender_of_workers_by_vehicles_available_5"
    "&drilldowns=Vehicles%20Available,Year"
    "&measures=Commute%20Means%20by%20Gender"
    "&Year=2021"
    "&Nation=01000US"
)

STATES_ORDER = ["Alabama", "Florida", "California"]
YEARS = list(range(2013, 2022))

app = FastAPI(title="THG Exercise API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LineSeries(BaseModel):
    label: str
    data: list[float]


class PopulationResponse(BaseModel):
    labels: list[int]
    datasets: list[LineSeries]


class PieSlice(BaseModel):
    label: str
    value: float


class VehiclesResponse(BaseModel):
    slices: list[PieSlice]


async def _fetch_jsonrecords(url: str) -> dict[str, Any]:
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            r = await client.get(url)
            r.raise_for_status()
        except httpx.HTTPError as e:
            logger.exception("Upstream request failed: %s", url)
            raise HTTPException(status_code=502, detail=f"Data USA request failed: {e}") from e

    try:
        payload = r.json()
    except ValueError as e:
        raise HTTPException(status_code=502, detail="Invalid JSON from Data USA") from e

    if payload.get("error"):
        raise HTTPException(
            status_code=502,
            detail=payload.get("detail", "Data USA returned an error"),
        )
    return payload


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/charts/population-by-state", response_model=PopulationResponse)
async def population_by_state() -> PopulationResponse:
    payload = await _fetch_jsonrecords(POPULATION_QUERY)
    rows = payload.get("data") or []
    if not rows:
        raise HTTPException(status_code=502, detail="Empty population dataset")

    # state -> year -> population
    grid: dict[str, dict[int, float]] = {s: {} for s in STATES_ORDER}
    for row in rows:
        state = row.get("State")
        year = row.get("Year")
        pop = row.get("Population")
        if state not in grid or year not in YEARS or pop is None:
            continue
        grid[state][int(year)] = float(pop)

    datasets: list[LineSeries] = []
    for state in STATES_ORDER:
        data = [grid[state].get(y, 0.0) for y in YEARS]
        datasets.append(LineSeries(label=state, data=data))

    return PopulationResponse(labels=YEARS, datasets=datasets)


@app.get("/api/charts/vehicles-by-household", response_model=VehiclesResponse)
async def vehicles_by_household() -> VehiclesResponse:
    payload = await _fetch_jsonrecords(VEHICLES_QUERY)
    rows = payload.get("data") or []
    if not rows:
        raise HTTPException(status_code=502, detail="Empty vehicles dataset")

    slices: list[PieSlice] = []
    for row in sorted(rows, key=lambda x: x.get("Vehicles Available ID", 0)):
        label = row.get("Vehicles Available")
        val = row.get("Commute Means by Gender")
        if label is None or val is None:
            continue
        slices.append(PieSlice(label=str(label), value=float(val)))

    if not slices:
        raise HTTPException(status_code=502, detail="Could not parse vehicles data")

    return VehiclesResponse(slices=slices)
