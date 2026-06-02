# sample_users.py [CLEANUP]
# Description: Pre-defined sample users for demo/E2E — pre-fills rooms after organizer saves event config
# ====
import logging

logger = logging.getLogger(__name__)

SAMPLE_USERS = [
    {"name": "Alex_Coder", "available": False, "status": "Busy coding", "linkedin_url": "https://linkedin.com/in/alexcoder", "slack_handle": "@alexcoder"},
    {"name": "Sarah_Dev", "available": True, "status": "Looking to chat", "linkedin_url": "https://linkedin.com/in/sarahdev", "slack_handle": "@sarahdev"},
    {"name": "Mike_Hacker", "available": False, "status": "In deep focus"},
    {"name": "Emma_Tech", "available": True, "status": "Open to talk", "linkedin_url": "https://linkedin.com/in/emmatech"},
    {"name": "Jake_Python", "available": True, "status": "Ready to chat", "slack_handle": "@jakepython"},
    {"name": "Lisa_JS", "available": False, "status": "Taking notes"},
    {"name": "Olga_Rust", "available": True, "status": "Happy to meet", "linkedin_url": "https://linkedin.com/in/olgarust"},
    {"name": "Tom_Swift", "available": False, "status": "On a call"},
    {"name": "Diana_Go", "available": True, "status": "Just arrived", "slack_handle": "@dianago"},
    {"name": "Raj_Java", "available": False, "status": "Debugging", "linkedin_url": "https://linkedin.com/in/rajjava"},
    {"name": "Ella_Ruby", "available": True, "status": "Excited to chat", "linkedin_url": "https://linkedin.com/in/ellaruby", "slack_handle": "@ellaruby"},
    {"name": "Finn_Web3", "available": True, "status": "Browsing"},
    {"name": "Nina_ML", "available": False, "status": "Training model"},
    {"name": "Omar_Scala", "available": True, "status": "Open for chat", "slack_handle": "@omarscala"},
    {"name": "Zara_Read", "available": False, "status": "Reading docs", "linkedin_url": "https://linkedin.com/in/zararead"},
    {"name": "Kai_Write", "available": True, "status": "Taking a break"},
    {"name": "Liam_Chat", "available": True, "status": "Grabbing coffee", "linkedin_url": "https://linkedin.com/in/liamchat"},
    {"name": "Sara_Design", "available": False, "status": "Sketching UI"},
    {"name": "Noah_Ops", "available": True, "status": "Ready to connect", "slack_handle": "@noahops"},
    {"name": "Dan_DevOps", "available": True, "status": "Automating things", "linkedin_url": "https://linkedin.com/in/dandevops", "slack_handle": "@dandevops"},
    {"name": "Anna_Vue", "available": False, "status": "Building components"},
    {"name": "Sam_AI", "available": True, "status": "Training a model", "linkedin_url": "https://linkedin.com/in/samai"},
    {"name": "Zoe_Flutter", "available": True, "status": "Cross-platform dev", "slack_handle": "@zoeflutter"},
    {"name": "Max_Cloud", "available": False, "status": "Deploying services", "linkedin_url": "https://linkedin.com/in/maxcloud"},
    {"name": "Eve_Designer", "available": True, "status": "Wireframing", "slack_handle": "@evedesigner"},
    {"name": "Ben_Data", "available": False, "status": "Cleaning datasets"},
    {"name": "Ivy_Sec", "available": True, "status": "Pen testing", "linkedin_url": "https://linkedin.com/in/ivysec"},
    {"name": "Leo_Game", "available": False, "status": "Building a game"},
    {"name": "Mia_Test", "available": True, "status": "Writing tests", "slack_handle": "@miatest"},
    {"name": "Ryan_Fullstack", "available": False, "status": "Full stack dev"},
]
