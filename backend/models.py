from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

class ProfileBase(BaseModel):
    name: str
    title: str
    tagline: str
    bio: str
    email: str
    phone: str
    location: str
    profileImage: str
    resumeUrl: Optional[str] = ""

class Profile(ProfileBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class SkillBase(BaseModel):
    category: str
    items: List[str]
    order: int = 0

class Skill(SkillBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class EducationBase(BaseModel):
    degree: str
    institution: str
    year: str
    description: str
    order: int = 0

class Education(EducationBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class CertificateBase(BaseModel):
    title: str
    issuer: str
    date: str
    image: str
    order: int = 0

class Certificate(CertificateBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class ProjectBase(BaseModel):
    title: str
    category: str
    description: str
    software: Optional[str] = ""
    year: Optional[str] = ""
    image: Optional[str] = ""
    demoLink: Optional[str] = ""
    galleryImages: Optional[List[str]] = []
    specs: Optional[List[str]] = []
    order: int = 0

class Project(ProjectBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class ContactMessage(BaseModel):
    name: str
    email: str
    subject: str
    message: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    isRead: bool = False

class ContactMessageDB(ContactMessage):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

class LoginRequest(BaseModel):
    password: str

class LoginResponse(BaseModel):
    success: bool
    token: str
    message: str