from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import requests
from typing import List

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:4200",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GetPopulationQueryParams:
    def __init__(
        self,
        targetStates: List[str] = Query(..., description="Target States to filter"),
    ):
        self.targetStates = targetStates
        
class GetPopulationItem(BaseModel):
    id_state: str = Field(..., alias="ID State")
    state: str = Field(..., alias="State")
    id_year: int = Field(..., alias="ID Year")
    year: int = Field(..., alias="Year")
    population: int = Field(..., alias="Population")
    slug_state: str = Field(..., alias="Slug State")
    
        
@app.get("/api/v1/population/")
async def getPopulation(params: GetPopulationQueryParams = Depends()) -> List[GetPopulationItem]:
    url = 'https://datausa.io/api/data?drilldowns=State&measures=Population'

    response = requests.get(url)
    
    if (response.status_code != 200):
        return []
    
    filtered_list = [item for item in response.json()["data"] if item["State"] in params.targetStates]
    return filtered_list

class GetHouseholdsQueryParams:
    def __init__(
        self,
        targetYears: List[str] = Query(..., description="Target Years to filter"),
    ):
        self.targetYears = targetYears

class GetHouseholdsItem(BaseModel):
    id_vehicles_available: int = Field(..., alias="ID Vehicles Available")
    vehicles_available: str = Field(..., alias="Vehicles Available")
    id_year: int = Field(..., alias="ID Year")
    year: int = Field(..., alias="Year")
    commute_means_by_gender: int = Field(..., alias="Commute Means by Gender")
    commute_means_by_gender_moe: float = Field(..., alias="Commute Means by Gender Moe")
    geography: str = Field(..., alias="Geography")
    id_geography: str = Field(..., alias="ID Geography")
    slug_geography: str = Field(..., alias="Slug Geography")
    

@app.get("/api/v1/households/")
async def getHouseholds(params: GetHouseholdsQueryParams = Depends()) -> List[GetHouseholdsItem]:
    url = 'https://zircon.datausa.io/api/data?measure=Commute%20Means%20by%20Gender,Commute%20Means%20by%20Gender%20Moe&geo=01000US,01000US&drilldowns=Vehicles%20Available'
    
    response = requests.get(url)
    
    if (response.status_code != 200):
        return []
    
    filtered_list = [item for item in response.json()["data"] if item["Year"] in params.targetYears]
    return filtered_list