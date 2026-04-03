from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pathlib import Path
import os
import logging
from typing import List, Optional
import shutil
import uuid

from models import (
    Profile, ProfileBase, Skill, SkillBase, Education, EducationBase,
    Certificate, CertificateBase, Project, ProjectBase,
    ContactMessage, ContactMessageDB, LoginRequest, LoginResponse
)
from auth import verify_password, create_access_token, verify_token
from database import (
    profile_collection, skills_collection, education_collection,
    certificates_collection, projects_collection, contact_collection,
    init_db, close_db
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

app = FastAPI()
api_router = APIRouter(prefix="/api")

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# ==================== AUTH ====================

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    if verify_password(request.password):
        token = create_access_token({"sub": "admin", "role": "admin"})
        return LoginResponse(success=True, token=token, message="Login successful")
    raise HTTPException(status_code=401, detail="Invalid password")

@api_router.post("/auth/verify")
async def verify_auth(payload: dict = Depends(verify_token)):
    return {"success": True, "user": payload}


# ==================== PROFILE ====================

@api_router.get("/profile")
async def get_profile():
    profile = await profile_collection.find_one()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile['_id'] = str(profile['_id'])
    return {"success": True, "data": profile}

@api_router.put("/profile")
async def update_profile(
    profile_data: ProfileBase,
    payload: dict = Depends(verify_token)
):
    await profile_collection.update_one(
        {},
        {"$set": profile_data.dict()},
        upsert=True
    )
    return {"success": True, "message": "Profile updated successfully"}


# ==================== SKILLS ====================

@api_router.get("/skills")
async def get_skills():
    skills = await skills_collection.find().sort("order", 1).to_list(100)
    for s in skills:
        s['_id'] = str(s['_id'])
    return {"success": True, "data": skills}

@api_router.post("/skills")
async def create_skill(
    skill_data: SkillBase,
    payload: dict = Depends(verify_token)
):
    skill = Skill(**skill_data.dict())
    result = await skills_collection.insert_one(skill.dict())
    data = skill.dict()
    data['_id'] = str(result.inserted_id)
    return {"success": True, "data": data}

@api_router.put("/skills/{skill_id}")
async def update_skill(
    skill_id: str,
    skill_data: SkillBase,
    payload: dict = Depends(verify_token)
):
    result = await skills_collection.update_one(
        {"id": skill_id},
        {"$set": skill_data.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"success": True, "message": "Skill updated successfully"}

@api_router.delete("/skills/{skill_id}")
async def delete_skill(
    skill_id: str,
    payload: dict = Depends(verify_token)
):
    result = await skills_collection.delete_one({"id": skill_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"success": True, "message": "Skill deleted successfully"}


# ==================== EDUCATION ====================

@api_router.get("/education")
async def get_education():
    education = await education_collection.find().sort("order", 1).to_list(100)
    for e in education:
        e['_id'] = str(e['_id'])
    return {"success": True, "data": education}

@api_router.post("/education")
async def create_education(
    edu_data: EducationBase,
    payload: dict = Depends(verify_token)
):
    education = Education(**edu_data.dict())
    result = await education_collection.insert_one(education.dict())
    data = education.dict()
    data['_id'] = str(result.inserted_id)
    return {"success": True, "data": data}

@api_router.put("/education/{edu_id}")
async def update_education(
    edu_id: str,
    edu_data: EducationBase,
    payload: dict = Depends(verify_token)
):
    result = await education_collection.update_one(
        {"id": edu_id},
        {"$set": edu_data.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Education not found")
    return {"success": True, "message": "Education updated successfully"}

@api_router.delete("/education/{edu_id}")
async def delete_education(
    edu_id: str,
    payload: dict = Depends(verify_token)
):
    result = await education_collection.delete_one({"id": edu_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Education not found")
    return {"success": True, "message": "Education deleted successfully"}


# ==================== CERTIFICATES ====================

@api_router.get("/certificates")
async def get_certificates():
    certs = await certificates_collection.find().sort("order", 1).to_list(100)
    for c in certs:
        c['_id'] = str(c['_id'])
    return {"success": True, "data": certs}

@api_router.post("/certificates")
async def create_certificate(
    cert_data: CertificateBase,
    payload: dict = Depends(verify_token)
):
    cert = Certificate(**cert_data.dict())
    result = await certificates_collection.insert_one(cert.dict())
    data = cert.dict()
    data['_id'] = str(result.inserted_id)
    return {"success": True, "data": data}

@api_router.put("/certificates/{cert_id}")
async def update_certificate(
    cert_id: str,
    cert_data: CertificateBase,
    payload: dict = Depends(verify_token)
):
    result = await certificates_collection.update_one(
        {"id": cert_id},
        {"$set": cert_data.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return {"success": True, "message": "Certificate updated successfully"}

@api_router.delete("/certificates/{cert_id}")
async def delete_certificate(
    cert_id: str,
    payload: dict = Depends(verify_token)
):
    result = await certificates_collection.delete_one({"id": cert_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return {"success": True, "message": "Certificate deleted successfully"}


# ==================== PROJECTS ====================

@api_router.get("/projects")
async def get_projects(category: Optional[str] = None):
    query = {}
    if category and category != "All":
        query["category"] = category
    projects = await projects_collection.find(query).sort("order", 1).to_list(100)
    for p in projects:
        p['_id'] = str(p['_id'])
    return {"success": True, "data": projects}

@api_router.get("/projects/{project_id}")
async def get_project(project_id: str):
    project = await projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project['_id'] = str(project['_id'])
    return {"success": True, "data": project}

@api_router.post("/projects")
async def create_project(
    project_data: ProjectBase,
    payload: dict = Depends(verify_token)
):
    project = Project(**project_data.dict())
    result = await projects_collection.insert_one(project.dict())
    data = project.dict()
    data['_id'] = str(result.inserted_id)
    return {"success": True, "data": data}

@api_router.put("/projects/{project_id}")
async def update_project(
    project_id: str,
    project_data: ProjectBase,
    payload: dict = Depends(verify_token)
):
    result = await projects_collection.update_one(
        {"id": project_id},
        {"$set": project_data.dict()}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"success": True, "message": "Project updated successfully"}

@api_router.delete("/projects/{project_id}")
async def delete_project(
    project_id: str,
    payload: dict = Depends(verify_token)
):
    result = await projects_collection.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"success": True, "message": "Project deleted successfully"}


# ==================== CONTACT ====================

@api_router.post("/contact")
async def submit_contact(message: ContactMessage):
    message_db = ContactMessageDB(**message.dict())
    await contact_collection.insert_one(message_db.dict())
    return {"success": True, "message": "Message sent successfully"}

@api_router.get("/contact")
async def get_contact_messages(payload: dict = Depends(verify_token)):
    messages = await contact_collection.find().sort("createdAt", -1).to_list(100)
    for m in messages:
        m['_id'] = str(m['_id'])
    return {"success": True, "data": messages}


# ==================== UPLOAD ====================

@api_router.post("/upload/image")
async def upload_image(
    file: UploadFile = File(...),
    payload: dict = Depends(verify_token)
):
    allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if file.content_type not in allowed:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only JPEG, PNG, and WebP allowed."
        )
    file_ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = UPLOAD_DIR / filename
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"success": True, "url": f"/uploads/{filename}",
            "message": "Image uploaded successfully"}


# ==================== SEED ====================

@api_router.post("/seed")
async def seed_database(payload: dict = Depends(verify_token)):
    # Skills
    await skills_collection.delete_many({})
    await skills_collection.insert_many([
        {"id": "1", "category": "CAD & Design",
         "items": ["SolidWorks", "AutoCAD", "CATIA", "Fusion 360"], "order": 1},
        {"id": "2", "category": "Programming",
         "items": ["Python", "C++", "Java", "MATLAB", "JavaScript"], "order": 2},
        {"id": "3", "category": "Hardware & Systems",
         "items": ["Microcontrollers", "Arduino", "Raspberry Pi", "PCB Design"], "order": 3},
        {"id": "4", "category": "Software & Tools",
         "items": ["Git", "Linux", "ANSYS", "LabVIEW", "MS Office"], "order": 4},
        {"id": "5", "category": "Soft Skills",
         "items": ["Problem Solving", "Team Collaboration",
                   "Project Management", "Technical Documentation"], "order": 5},
    ])

    # Education
    await education_collection.delete_many({})
    await education_collection.insert_many([
        {"id": "1", "degree": "Bachelor of Science in Computer Engineering",
         "institution": "University Name", "year": "2018 - 2022",
         "description": "Focused on hardware-software integration, embedded systems, and digital design.",
         "order": 1},
        {"id": "2", "degree": "Advanced CAD Design Course",
         "institution": "Technical Institute", "year": "2022",
         "description": "Specialized training in SolidWorks and advanced 3D modeling techniques.",
         "order": 2},
    ])

    # Certificates
    await certificates_collection.delete_many({})
    await certificates_collection.insert_many([
        {"id": "1", "title": "SolidWorks Professional Certification",
         "issuer": "Dassault Systèmes", "date": "2023",
         "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
         "order": 1},
        {"id": "2", "title": "Python Programming Certificate",
         "issuer": "Coursera", "date": "2023",
         "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop",
         "order": 2},
        {"id": "3", "title": "Embedded Systems Design",
         "issuer": "IEEE", "date": "2022",
         "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
         "order": 3},
        {"id": "4", "title": "AutoCAD Professional",
         "issuer": "Autodesk", "date": "2022",
         "image": "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&h=400&fit=crop",
         "order": 4},
        {"id": "5", "title": "Project Management Essentials",
         "issuer": "PMI", "date": "2023",
         "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
         "order": 5},
        {"id": "6", "title": "C++ Advanced Programming",
         "issuer": "Udemy", "date": "2021",
         "image": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&h=400&fit=crop",
         "order": 6},
    ])

    # Projects — all 12 from mock data
    await projects_collection.delete_many({})
    await projects_collection.insert_many([
        {"id": "1", "title": "Industrial Robot Arm Design", "category": "Mechanical Design",
         "description": "Complete 3D model and assembly of a 6-axis industrial robot arm with kinematic analysis and structural simulations.",
         "software": "SolidWorks, ANSYS", "year": "2023",
         "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
         "specs": ["6 degrees of freedom","Payload capacity: 10kg","Reach: 1200mm","FEA stress analysis completed"], "order": 1},
        {"id": "2", "title": "Automotive Gear Assembly", "category": "Product Design",
         "description": "Detailed gear train system for automotive transmission with tolerance analysis and manufacturing drawings.",
         "software": "SolidWorks, AutoCAD", "year": "2023",
         "image": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
         "specs": ["4-speed transmission design","Gear ratio optimization","Complete technical drawings","Material: Hardened steel"], "order": 2},
        {"id": "3", "title": "PCB Design for IoT Device", "category": "Electronics",
         "description": "Multi-layer PCB design for IoT sensor node with low-power optimization and wireless connectivity.",
         "software": "Eagle CAD, KiCAD", "year": "2023",
         "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
         "specs": ["4-layer PCB design","ESP32 microcontroller","Bluetooth & WiFi enabled","Low power consumption < 100mA"], "order": 3},
        {"id": "4", "title": "Hydraulic Press System", "category": "Mechanical Design",
         "description": "Industrial hydraulic press with force analysis, safety mechanisms, and automation control system.",
         "software": "SolidWorks, MATLAB", "year": "2022",
         "image": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
         "specs": ["Force capacity: 50 tons","Automated control system","Safety interlock mechanisms","Hydraulic circuit design"], "order": 4},
        {"id": "5", "title": "Drone Frame Design", "category": "Aerospace",
         "description": "Lightweight carbon fiber drone frame with aerodynamic optimization and structural integrity analysis.",
         "software": "SolidWorks, CATIA", "year": "2023",
         "image": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=600&fit=crop",
         "specs": ["Weight: 450g","Quadcopter configuration","Carbon fiber construction","Payload: 2kg"], "order": 5},
        {"id": "6", "title": "3D Printer Extruder Assembly", "category": "Product Design",
         "description": "Custom dual-extruder hotend assembly for high-temperature 3D printing with precise thermal management.",
         "software": "SolidWorks, Fusion 360", "year": "2022",
         "image": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
         "specs": ["Dual extrusion capability","Max temp: 300°C","All-metal hotend","0.1mm layer precision"], "order": 6},
        {"id": "7", "title": "Conveyor Belt System", "category": "Industrial Design",
         "description": "Automated conveyor belt system with motor selection, drive mechanism, and control interface.",
         "software": "SolidWorks, LabVIEW", "year": "2023",
         "image": "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop",
         "specs": ["Length: 10 meters","Speed: 0.5 m/s","Load capacity: 500kg","Automated control system"], "order": 7},
        {"id": "8", "title": "Electric Motor Housing", "category": "Mechanical Design",
         "description": "Precision motor housing with thermal dissipation analysis, mounting features, and weatherproof sealing.",
         "software": "SolidWorks, ANSYS", "year": "2022",
         "image": "https://images.unsplash.com/photo-1580894894513-541e068a3e2b?w=800&h=600&fit=crop",
         "specs": ["Aluminum alloy construction","IP65 protection rating","Thermal analysis completed","Vibration dampening"], "order": 8},
        {"id": "9", "title": "Robotic Gripper Mechanism", "category": "Robotics",
         "description": "Adaptive robotic gripper with force sensing, multiple grip modes, and servo control integration.",
         "software": "SolidWorks, Arduino IDE", "year": "2023",
         "image": "https://images.unsplash.com/photo-1561557944-6e7860d1a7eb?w=800&h=600&fit=crop",
         "specs": ["Grip force: 0-50N","Opening: 0-120mm","Force feedback sensors","3 grip modes"], "order": 9},
        {"id": "10", "title": "HVAC Duct Design", "category": "MEP Engineering",
         "description": "Complete HVAC ductwork design for commercial building with airflow simulation and optimization.",
         "software": "SolidWorks, AutoCAD MEP", "year": "2022",
         "image": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
         "specs": ["Building area: 5000 sq ft","CFD analysis completed","Energy efficiency optimized","Noise reduction design"], "order": 10},
        {"id": "11", "title": "Automotive Suspension Component", "category": "Automotive",
         "description": "Front suspension control arm with FEA, fatigue analysis, and manufacturing process planning.",
         "software": "SolidWorks, CATIA", "year": "2023",
         "image": "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
         "specs": ["Forged aluminum construction","Load capacity: 2000kg","Fatigue life: 1M cycles","Weight optimized"], "order": 11},
        {"id": "12", "title": "Smart Home Automation Hub", "category": "Electronics",
         "description": "Central control unit for smart home with wireless connectivity, sensor integration, and mobile app interface.",
         "software": "Eagle CAD, Arduino IDE", "year": "2023",
         "image": "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop",
         "specs": ["ESP32 based controller","20+ device support","WiFi & Zigbee protocol","Mobile app integration"], "order": 12},
    ])

    return {"success": True, "message": "Database seeded successfully"}


# ==================== APP SETUP ====================

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db():
    await init_db()
    logger.info("✅ SQLite database initialized")

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_db()
    logger.info("Database closed")