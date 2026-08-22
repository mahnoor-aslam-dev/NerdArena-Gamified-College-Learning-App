from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Boolean, ForeignKey, DateTime, or_
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from google import genai
from google.oauth2 import id_token
from google.auth.transport import requests

# ---------------------------------------------------------------------------
# APP SETUP & MIDDLEWARE
# ---------------------------------------------------------------------------
app = FastAPI(title="NerdArena API", version="1.5")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# GEMINI AI SETUP
# ---------------------------------------------------------------------------
client = genai.Client(api_key="AQ.Ab8RN6LGxTMpEb2tNo2JL5GSgGTyBm6OHiomhmZ-6N_Z4sS8lQ")

# ---------------------------------------------------------------------------
# DATABASE SETUP
# ---------------------------------------------------------------------------
DATABASE_URL = "sqlite:///./nerdarena.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ---------------------------------------------------------------------------
# MODELS (SQLALCHEMY)
# ---------------------------------------------------------------------------
class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    student_id = Column(String, default="L1S23BSCS0342")
    email = Column(String, unique=True, index=True, default="abc@ucp.edu.pk")
    github = Column(String, default="github.com/abc")
    education = Column(String, default="Bachelor of Science in Computer Science | University of Central Punjab (2023 -- 2027)")
    skills = Column(String, default="C++, React, TypeScript, Tailwind, FastAPI, WebAssembly, Git, Docker")
    project = Column(String, default="DocuMend (Final Year Project): Engineered a local-first document processing pipeline using Rust and WebAssembly with zero data leakage.")
    current_level = Column(Integer, default=1)
    total_xp = Column(Integer, default=0)
    role = Column(String, default="Student Developer")
    tech_stack = Column(String, default="C++, Python, React")
    is_dark_mode = Column(Boolean, default=False)

class TaskModel(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    level_id = Column(Integer, index=True)
    title = Column(String)
    xp = Column(Integer)

class SubmissionModel(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    level_id = Column(Integer)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    proof_url = Column(String)
    is_verified = Column(Boolean, default=True)

class MessageModel(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer)
    receiver_id = Column(Integer)
    text = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# ---------------------------------------------------------------------------
# SCHEMAS (PYDANTIC)
# ---------------------------------------------------------------------------
class GoogleLoginRequest(BaseModel):
    credential: str

class UserResponse(BaseModel):
    id: int
    name: str
    student_id: Optional[str] = "L1S23BSCS0342"
    email: Optional[str] = "mahnoor@ucp.edu.pk"
    github: Optional[str] = "github.com/mahnoor"
    education: Optional[str] = ""
    skills: Optional[str] = ""
    project: Optional[str] = ""
    current_level: int
    total_xp: int
    role: str
    tech_stack: str

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: Optional[str] = ""

class ResumeUpdateRequest(BaseModel):
    user_id: int
    name: str
    student_id: str
    email: str
    github: str
    education: str
    skills: str
    project: str
    is_dark_mode: bool

class TaskResponse(BaseModel):
    id: int
    level_id: int
    title: str
    xp: int

    class Config:
        from_attributes = True

class SubmissionRequest(BaseModel):
    user_id: Optional[int] = 1
    task_id: int
    level_id: int
    proof_url: str

class SubmissionResponse(BaseModel):
    message: str
    status: str
    xp_gained: int
    new_total_xp: int
    current_level: int

class MessageCreate(BaseModel):
    sender_id: int = 1
    receiver_id: int
    text: str

class MessageResponse(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    text: str
    timestamp: datetime

    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def seed_initial_data(db: Session):
    if not db.query(UserModel).filter(UserModel.id == 1).first():
        db.add(UserModel(
            id=1, 
            name="Mahnoor", 
            student_id="L1S23BSCS0342", 
            email="mahnoor@ucp.edu.pk", 
            current_level=1, 
            total_xp=0, 
            role="Student Developer", 
            tech_stack="C++, Python, React"
        ))
    
    if not db.query(UserModel).filter(UserModel.id == 999).first():
        db.add(UserModel(
            id=999, 
            name="NerdArena Support Bot", 
            email="support@nerdarena.bot", 
            student_id="BOT0001",
            current_level=7, 
            total_xp=9999, 
            role="24/7 Official Support", 
            tech_stack="Roadmap Help & Guidance"
        ))

    peers_sample = [
        UserModel(id=2, name="Olivia", current_level=6, total_xp=1450, role="Senior Mentor", tech_stack="System Design, C++, Redis", email="sara@ucp.edu.pk"),
        UserModel(id=3, name="Ayesha", current_level=2, total_xp=320, role="Peer Developer", tech_stack="React, JavaScript, UI/UX", email="laiba@ucp.edu.pk"),
        UserModel(id=4, name="Zara", current_level=4, total_xp=780, role="Peer Developer", tech_stack="Python, Machine Learning, FastAPI", email="umair@ucp.edu.pk"),
    ]
    for peer in peers_sample:
        if not db.query(UserModel).filter(UserModel.id == peer.id).first():
            db.add(peer)

    if not db.query(TaskModel).first():
        initial_tasks = [
            TaskModel(level_id=1, title="Configure Git SSH Key & Verify Signed Commits", xp=50),
            TaskModel(level_id=1, title="Write Memory Allocation & Pointer Manipulation in C++", xp=70),
            TaskModel(level_id=1, title="Set up Local Linux/WSL Development Environment", xp=80),
            TaskModel(level_id=2, title="Implement BFS and DFS Graph Traversals", xp=60),
            TaskModel(level_id=2, title="Solve Dynamic Programming Problems (Knapsack / LCS)", xp=80),
            TaskModel(level_id=2, title="Build O(1) LRU Cache in C++ or Python", xp=90),
            TaskModel(level_id=3, title="Build and Connect Full-Stack Application (FastAPI & React)", xp=100),
            TaskModel(level_id=3, title="Set up GitHub Actions CI/CD Automated Pipeline", xp=100),
            TaskModel(level_id=4, title="Contribute an Open Source Pull Request on GitHub", xp=120),
            TaskModel(level_id=4, title="Design Component Wireframes and System Interactions in Figma", xp=80),
            TaskModel(level_id=5, title="Design Distributed System Architecture & Caching Layer with Redis", xp=150),
            TaskModel(level_id=5, title="Implement L4/L7 Load Balancer and Rate Limiter Concept", xp=100),
            TaskModel(level_id=6, title="Build ATS-Optimized LaTeX Resume Source Code", xp=100),
            TaskModel(level_id=6, title="Draft and Submit Job Application Tracking Pipeline", xp=80),
            TaskModel(level_id=7, title="Pass Timed Technical Assessment Test", xp=200),
            TaskModel(level_id=7, title="Clear Mock Panel Review with Senior Mentor", xp=150),
        ]
        db.add_all(initial_tasks)

    db.commit()

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        seed_initial_data(db)
        print("Database seeded successfully!")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

# ---------------------------------------------------------------------------
# API ENDPOINTS
# ---------------------------------------------------------------------------

@app.post("/auth/google")
def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        idinfo = id_token.verify_oauth2_token(
            payload.credential, 
            requests.Request(), 
           "982892849647-668mnacv8lfd9864hjb24ki1k982spnm.apps.googleusercontent.com"
        )

        email = idinfo['email']
        name = idinfo.get('name', email.split("@")[0].capitalize())

        user = db.query(UserModel).filter(UserModel.email == email).first()
        if user:
            return {"status": "success", "message": "Welcome back!", "user": user}

        max_id = db.query(UserModel).order_by(UserModel.id.desc()).first()
        new_id = (max_id.id + 1) if max_id else 1
        if new_id == 999: 
            new_id = 1000

        new_user = UserModel(
            id=new_id,
            name=name,
            student_id=f"L1S26BSCS{new_id:04d}",
            email=email,
            github=f"github.com/{email.split('@')[0]}",
            education="University of Central Punjab",
            skills="C++, Python, React",
            project="Initial Capstone Project",
            current_level=1,
            total_xp=0,
            role="Student Developer",
            tech_stack="C++, React"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"status": "success", "message": "Google user registered successfully!", "user": new_user}

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid Google Token: {str(e)}")

@app.post("/auth/login")
def login_or_register(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.email == payload.email).first()
    if user:
        return {"status": "success", "message": "Welcome back!", "user": user}
    
    max_id = db.query(UserModel).order_by(UserModel.id.desc()).first()
    new_id = (max_id.id + 1) if max_id else 1
    if new_id == 999:
        new_id = 1000

    prefix = payload.email.split("@")[0].capitalize()
    new_user = UserModel(
        id=new_id,
        name=prefix,
        student_id=f"L1S26BSCS{new_id:04d}",
        email=payload.email,
        github=f"github.com/{payload.email.split('@')[0]}",
        education="University of Central Punjab",
        skills="C++, Python, React",
        project="Initial Capstone Project",
        current_level=1,
        total_xp=0,
        role="Student Developer",
        tech_stack="C++, React"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"status": "success", "message": "New user dynamically registered!", "user": new_user}

@app.get("/user", response_model=UserResponse)
def get_user(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/user/update-resume")
def update_resume_profile(payload: ResumeUpdateRequest, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.name = payload.name
    user.student_id = payload.student_id
    user.email = payload.email
    user.github = payload.github
    user.education = payload.education
    user.skills = payload.skills
    user.project = payload.project
    user.is_dark_mode = payload.is_dark_mode

    db.commit()
    db.refresh(user)
    return {"status": "success", "message": "Preferences updated successfully!", "user": user}

@app.get("/tasks/{level_id}", response_model=List[TaskResponse])
def get_tasks_by_level(level_id: int, db: Session = Depends(get_db)):
    return db.query(TaskModel).filter(TaskModel.level_id == level_id).all()

@app.post("/submit-proof", response_model=SubmissionResponse)
def submit_proof(payload: SubmissionRequest, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.id == payload.user_id).first()
    task = db.query(TaskModel).filter(TaskModel.id == payload.task_id).first()

    if not user or not task:
        raise HTTPException(status_code=404, detail="User or Task not found")

    submission = SubmissionModel(
        user_id=user.id,
        level_id=payload.level_id,
        task_id=payload.task_id,
        proof_url=payload.proof_url,
        is_verified=True
    )
    db.add(submission)
    user.total_xp += task.xp

    new_calculated_level = max(1, (user.total_xp // 200) + 1)
    if new_calculated_level > user.current_level and new_calculated_level <= 7:
        user.current_level = new_calculated_level

    db.commit()
    db.refresh(user)

    return SubmissionResponse(
        message="Proof verified!",
        status="success",
        xp_gained=task.xp,
        new_total_xp=user.total_xp,
        current_level=user.current_level
    )

@app.get("/peers/search", response_model=List[UserResponse])
def search_peers(query: str = "", current_user_id: int = 1, db: Session = Depends(get_db)):
    users = db.query(UserModel).filter(
        UserModel.id != current_user_id,
        UserModel.id != 999,
        or_(
            UserModel.name.ilike(f"%{query}%"),
            UserModel.tech_stack.ilike(f"%{query}%"),
            UserModel.role.ilike(f"%{query}%")
        )
    ).all()
    return users

@app.post("/messages/send", response_model=MessageResponse)
def send_message(payload: MessageCreate, db: Session = Depends(get_db)):
    msg = MessageModel(
        sender_id=payload.sender_id,
        receiver_id=payload.receiver_id,
        text=payload.text
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    if payload.receiver_id == 999:
        try:
            print("Sending request to Gemini...")
            response = client.models.generate_content(
                model="gemini-3.6-flash",
                contents=f"Answer: {payload.text}",
            )
            reply_text = response.text
        except Exception as e:
            reply_text = f"API Error Detail: {str(e)}"
            print("GEMINI API ERROR:", str(e))

        bot_reply = MessageModel(
            sender_id=999,
            receiver_id=payload.sender_id,
            text=reply_text
        )
        db.add(bot_reply)
        db.commit()

    return msg

@app.get("/messages/{user1_id}/{user2_id}", response_model=List[MessageResponse])
def get_chat_history(user1_id: int, user2_id: int, db: Session = Depends(get_db)):
    messages = db.query(MessageModel).filter(
        or_(
            (MessageModel.sender_id == user1_id) & (MessageModel.receiver_id == user2_id),
            (MessageModel.sender_id == user2_id) & (MessageModel.receiver_id == user1_id)
        )
    ).order_by(MessageModel.timestamp.asc()).all()
    return messages