"""
Pydantic models for request/response validation and MongoDB documents.
"""
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Any, Dict
from enum import Enum

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
    name: str
    email: EmailStr
    role: UserRole
    organization: Optional[str] = None
    avatarUrl: Optional[str] = None

class UserCreate(UserBase):
    """User creation model."""
    password: str

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
    totalRepositories: int
    publicRepos: int
    privateRepos: int
    archivedRepos: int
    totalSizeGB: float
    languages: List[str] = []
    hasLFS: bool = False
    hasSubmodules: bool = False
    averageRepoSizeMB: float = 0.0
    usersToMigrate: Optional[int] = None

# Migration Stage Models
class MigrationStageDetail(BaseModel):
    """Migration stage detail model."""
    stage: MigrationStage
    description: str
    technicalDetails: str
    timelineWeeks: int
    automated: bool
    githubMigrationType: Optional[GitHubMigrationType] = None
    repositoryInventory: Optional[RepositoryInventory] = None
    estimatedManHours: Optional[float] = None
    includeCICDMigration: Optional[bool] = None
    cicdPlatform: Optional[str] = None
    cicdDetails: Optional[str] = None

# Training Models
class TrainingModule(BaseModel):
    """Training module model."""
    id: str
    track: TrainingTrack
    level: TrainingLevel
    title: str
    description: str
    durationHours: float
    agenda: List[str] = []

class SelectedTraining(BaseModel):
    """Selected training model."""
    moduleId: str
    participantCount: int

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
    projectName: str
    projectDescription: str
    clientOrganization: str
    includeMigration: bool = False
    includeTraining: bool = False
    migrationStages: List[MigrationStageDetail] = []
    selectedTrainings: List[SelectedTraining] = []

class SOWCreate(SOWBase):
    """SOW creation model."""
    clientId: str
    clientName: str

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
