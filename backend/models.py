"""
Pydantic models for request/response validation and MongoDB documents.
"""
from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import List, Optional, Any, Dict
from enum import Enum
import re

class UserRole(str, Enum):
    """User role enumeration."""
    CLIENT = "client"
    XEBIA_ADMIN = "xebia-admin"
    APPROVER = "approver"

class SOWStatus(str, Enum):
    """SOW status enumeration."""
    DRAFT = "draft"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    CHANGES_REQUESTED = "changes-requested"

class MigrationStage(str, Enum):
    """Migration stage enumeration."""
    INITIAL_SETUP = "initial-setup"
    REPOSITORY_MIGRATION = "repository-migration"
    CICD_MIGRATION = "cicd-migration"
    CICD_IMPLEMENTATION = "cicd-implementation"
    TRAINING_SESSIONS = "training-sessions"

class GitHubMigrationType(str, Enum):
    """GitHub migration type enumeration."""
    GITHUB_CLASSIC = "github-classic"
    GITHUB_EMU = "github-emu"
    GHES = "ghes"

class TrainingTrack(str, Enum):
    """Training track enumeration."""
    GITHUB = "github"
    GITLAB = "gitlab"
    BITBUCKET = "bitbucket"
    AZURE_DEVOPS = "azure-devops"
    TFS = "tfs"
    AZURE = "azure"
    GCP = "gcp"
    AWS = "aws"
    AI_SAP = "ai-sap"

class TrainingLevel(str, Enum):
    """Training level enumeration."""
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

# User Models
class UserBase(BaseModel):
    """Base user model."""
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    role: UserRole
    organization: Optional[str] = Field(None, max_length=200)
    avatarUrl: Optional[str] = Field(None, max_length=500)

class UserCreate(UserBase):
    """User creation model."""
    password: str = Field(..., min_length=8, max_length=100)
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password complexity."""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one digit')
        return v

class UserUpdate(BaseModel):
    """User update model."""
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    organization: Optional[str] = None
    avatarUrl: Optional[str] = None

class User(UserBase):
    """User model with ID."""
    id: str

    class Config:
        from_attributes = True

# Repository Inventory Models
class RepositoryInventory(BaseModel):
    """Repository inventory model."""
    totalRepositories: int = Field(..., ge=0)
    publicRepos: int = Field(..., ge=0)
    privateRepos: int = Field(..., ge=0)
    archivedRepos: int = Field(..., ge=0)
    totalSizeGB: float = Field(..., ge=0)
    languages: List[str] = []
    hasLFS: bool = False
    hasSubmodules: bool = False
    averageRepoSizeMB: float = Field(0.0, ge=0)
    usersToMigrate: Optional[int] = Field(None, ge=0)

# Migration Stage Models
class MigrationStageDetail(BaseModel):
    """Migration stage detail model."""
    stage: MigrationStage
    description: str = Field(..., min_length=1, max_length=1000)
    technicalDetails: str = Field(..., min_length=1, max_length=2000)
    timelineWeeks: int = Field(..., ge=1, le=104)  # 1 week to 2 years
    automated: bool
    githubMigrationType: Optional[GitHubMigrationType] = None
    repositoryInventory: Optional[RepositoryInventory] = None
    estimatedManHours: Optional[float] = Field(None, ge=0)
    includeCICDMigration: Optional[bool] = None
    cicdPlatform: Optional[str] = Field(None, max_length=100)
    cicdDetails: Optional[str] = Field(None, max_length=1000)

# Training Models
class TrainingModule(BaseModel):
    """Training module model."""
    id: str
    track: TrainingTrack
    level: TrainingLevel
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=1000)
    durationHours: float = Field(..., gt=0, le=1000)
    agenda: List[str] = []

class SelectedTraining(BaseModel):
    """Selected training model."""
    moduleId: str
    participantCount: int = Field(..., ge=1, le=10000)

# Approval Models
class ApprovalComment(BaseModel):
    """Approval comment model."""
    id: str
    approverId: str
    approverName: str
    comment: str
    timestamp: int
    action: str  # 'comment' | 'approved' | 'rejected' | 'changes-requested'

# SOW Revision Models
class SOWRevisionChange(BaseModel):
    """SOW revision change model."""
    field: str
    oldValue: Any
    newValue: Any

class SOWRevision(BaseModel):
    """SOW revision model."""
    id: str
    version: int
    timestamp: int
    changedBy: str
    changedByName: str
    changeDescription: str
    changes: List[SOWRevisionChange] = []
    snapshot: Dict[str, Any]

# SOW Models
class SOWBase(BaseModel):
    """Base SOW model."""
    projectName: str = Field(..., min_length=1, max_length=200)
    projectDescription: str = Field(..., min_length=1, max_length=2000)
    clientOrganization: str = Field(..., min_length=1, max_length=200)
    includeMigration: bool = False
    includeTraining: bool = False
    migrationStages: List[MigrationStageDetail] = []
    selectedTrainings: List[SelectedTraining] = []

class SOWCreate(SOWBase):
    """SOW creation model."""
    clientId: str
    clientName: str = Field(..., min_length=1, max_length=100)

class SOWUpdate(BaseModel):
    """SOW update model."""
    projectName: Optional[str] = None
    projectDescription: Optional[str] = None
    status: Optional[SOWStatus] = None
    includeMigration: Optional[bool] = None
    includeTraining: Optional[bool] = None
    migrationStages: Optional[List[MigrationStageDetail]] = None
    selectedTrainings: Optional[List[SelectedTraining]] = None
    currentApproverId: Optional[str] = None
    estimatedValue: Optional[float] = None
    estimatedDuration: Optional[float] = None

class SOW(SOWBase):
    """Complete SOW model."""
    id: str
    clientId: str
    clientName: str
    clientOrganization: str
    status: SOWStatus = SOWStatus.DRAFT
    createdAt: int
    updatedAt: int
    submittedAt: Optional[int] = None
    approvedAt: Optional[int] = None
    approvalHistory: List[ApprovalComment] = []
    currentApproverId: Optional[str] = None
    estimatedValue: Optional[float] = None
    estimatedDuration: Optional[float] = None
    currentVersion: int = 1
    revisionHistory: List[SOWRevision] = []

    class Config:
        from_attributes = True

# Authentication Models
class Token(BaseModel):
    """Token model."""
    access_token: str
    token_type: str

class TokenData(BaseModel):
    """Token data model."""
    email: Optional[str] = None

class LoginRequest(BaseModel):
    """Login request model."""
    email: EmailStr
    password: str
