import os
import sys
import csv
import glob
import urllib.request
import json
import re

sys.stdout.reconfigure(encoding='utf-8')

out_dir = r"d:\Web Development\MY PORTFOLIO\assets\images\gallery"
os.makedirs(out_dir, exist_ok=True)

# Read Rich_Media.csv
candidates = glob.glob(r"C:\Users\kavis\OneDrive\*\linkdin\Rich_Media.csv")
if not candidates:
    print("No Rich_Media.csv found")
    sys.exit(1)

with open(candidates[0], mode="r", encoding="utf-8-sig", errors="replace") as f:
    rows = list(csv.DictReader(f))

# Group by description
posts_dict = {}
current_desc = ""
current_date = ""

for r in rows:
    date = r.get("Date/Time", "").strip()
    desc = r.get("Media Description", "").strip()
    link = r.get("Media Link", "").strip()

    if desc and desc != "-":
        current_desc = desc
    if date:
        current_date = date

    if not link.startswith("http"):
        continue
    if "shrink_20" in link or "shrink_100" in link or "shrink_160" in link:
        continue

    score = 1
    if "high-res" in link:
        score = 5
    elif "shrink_1280" in link:
        score = 4
    elif "shrink_800" in link:
        score = 3
    elif "original" in link:
        score = 5

    post_key = current_desc if current_desc else f"asset_{date}"
    if post_key not in posts_dict:
        posts_dict[post_key] = {"date": current_date, "desc": current_desc, "links": []}
    posts_dict[post_key]["links"].append((score, link))

print(f"Total post groups identified: {len(posts_dict)}")

# The exact 26 approved items to keep
milestones_config = [
    # --- Hackathons & Competitions ---
    {
        "id": "ai-agents-hackathon-top5",
        "keyword": "top 5 finish among 2,300+",
        "title": "National AI Agents Hackathon",
        "badge": "HACKATHON · TOP 5 FINISH",
        "category": "Hackathons",
        "caption": "Ranked 5th out of 2,300+ teams nationwide building an autonomous multi-agent prototype.",
        "slug": "ai-agents-hackathon-top5"
    },
    {
        "id": "bugslayer-24h-hackathon",
        "keyword": "bugslayer",
        "title": "BUGSLAYER '26 24h Hackathon",
        "badge": "HACKATHON · 24-HOUR SPRINT",
        "category": "Hackathons",
        "caption": "Engineered a low-bandwidth Telemedicine Access Platform across 5 intense review rounds.",
        "slug": "bugslayer-24h-hackathon"
    },
    {
        "id": "devforge-hackathon-final",
        "keyword": "devforge hackathon, kpr",
        "title": "DevForge Hackathon — Final Review",
        "badge": "HACKATHON · KPR INSTITUTE",
        "category": "Hackathons",
        "caption": "Built the full frontend and connected n8n backend workflows in an overnight sprint.",
        "slug": "devforge-hackathon-kpr"
    },
    {
        "id": "devforge-hackathon-day1",
        "keyword": "past 24 hours, my teammate bharath",
        "title": "DevForge Hackathon — AI Sprint",
        "badge": "HACKATHON · 24H SPRINT",
        "category": "Hackathons",
        "caption": "Brainstormed and cleared initial technical reviews for rapid AI system delivery.",
        "slug": "devforge-hackathon-day1"
    },
    {
        "id": "msme-hackathon-round2",
        "keyword": "round 2: done",
        "title": "MSME Hackathon 2025 — Round 2",
        "badge": "HACKATHON · ROUND 2 PITCH",
        "category": "Hackathons",
        "caption": "Pitched our prototype in the second evaluation round before panel judges.",
        "slug": "msme-hackathon-round2"
    },
    {
        "id": "msme-hackathon-round1",
        "keyword": "first round of the msme hackathon",
        "title": "MSME Hackathon 2025 — Round 1",
        "badge": "HACKATHON · QUALIFIED",
        "category": "Hackathons",
        "caption": "Successfully qualified through the national Idea Submission stage.",
        "slug": "msme-hackathon-round1"
    },
    {
        "id": "adobe-india-hackathon",
        "keyword": "adobe india hackathon",
        "title": "Adobe India Hackathon 2025",
        "badge": "HACKATHON · ADOBE & UNSTOP",
        "category": "Hackathons",
        "caption": "Competed in the national algorithmic coding and MCQ evaluation track on Unstop.",
        "slug": "adobe-india-hackathon"
    },
    {
        "id": "intern2innovate-hackathon",
        "keyword": "intern2innovate",
        "title": "Intern2Innovate Internal Hackathon",
        "badge": "HACKATHON · INNOVATION",
        "category": "Hackathons",
        "caption": "Prototyped creative problem-solving applications during the internal college hackathon.",
        "slug": "intern2innovate-hackathon"
    },
    {
        "id": "college-ideathon",
        "keyword": "ideathon conducted at our college",
        "title": "College Ideathon Prototyping",
        "badge": "COMPETITION · IDEATHON",
        "category": "Hackathons",
        "caption": "Collaborated with teammates to design and present innovative tech product ideas.",
        "slug": "college-ideathon"
    },

    # --- Internships ---
    {
        "id": "lets-gametech-internship",
        "keyword": "gametech",
        "title": "Java Backend Development Internship",
        "badge": "INTERNSHIP · LET'S GAMETECH",
        "category": "Internships",
        "caption": "Completed 1-month intensive backend training building robust Core Java applications.",
        "slug": "lets-gametech-internship"
    },
    {
        "id": "dsignz-media-internship",
        "keyword": "dsignz media",
        "title": "Frontend Web Development Internship",
        "badge": "INTERNSHIP · DSIGNZ MEDIA",
        "category": "Internships",
        "caption": "21-day frontend sprint mastering responsive design, HTML, CSS, JavaScript, and rapid execution.",
        "slug": "dsignz-media-internship"
    },
    {
        "id": "circor-internship",
        "keyword": "circor",
        "title": "Website Development Internship",
        "badge": "INTERNSHIP · CIRCOR INTL",
        "category": "Internships",
        "caption": "Gained real-world IT web development experience at CIRCOR Flow Technologies.",
        "slug": "circor-web-internship"
    },

    # --- Bootcamps & Workshops ---
    {
        "id": "agentic-ai-bootcamp-day2",
        "keyword": "day 2",
        "title": "Agentic AI Bootcamp — Day 2",
        "badge": "BOOTCAMP · AGENTIC AI",
        "category": "Bootcamps",
        "caption": "Built production-ready AI agents and automated real-time workflows at SNS College of Technology.",
        "slug": "agentic-ai-bootcamp"
    },
    {
        "id": "agentic-ai-bootcamp-day1",
        "keyword": "day 1",
        "title": "Agentic AI Bootcamp — Day 1",
        "badge": "BOOTCAMP · AGENTIC AI",
        "category": "Bootcamps",
        "caption": "Configured autonomous agent environments and orchestrated pipelines using n8n.",
        "slug": "agentic-ai-bootcamp-day1"
    },
    {
        "id": "sns-ihub-bootcamp",
        "keyword": "sns ihub",
        "title": "SNS iHub Innovation Bootcamp",
        "badge": "BOOTCAMP · SNS IHUB",
        "category": "Bootcamps",
        "caption": "Built working n8n workflows and learned design thinking from Prof. Ulrich Weinberg (HPI Germany).",
        "slug": "sns-ihub-bootcamp"
    },

    # --- Honors, Leadership & Growth ---
    {
        "id": "all-round-performer-nominee",
        "keyword": "all round performer nominee",
        "title": "All-Round Performer Nominee",
        "badge": "HONOR · SNS COLLEGE",
        "category": "Leadership",
        "caption": "Nominated for the college-wide award honoring excellence in academics, hackathons, and leadership.",
        "slug": "all-round-performer-nominee"
    },
    {
        "id": "unstop-talent-awards",
        "keyword": "unstop talent awards",
        "title": "Unstop Talent Awards 2026",
        "badge": "RECOGNITION · UNSTOP",
        "category": "Leadership",
        "caption": "Recognized in the national Unstoppable Leaders cohort for competitive hackathon performance.",
        "slug": "unstop-talent-awards"
    },
    {
        "id": "texperia-paper-coordinator",
        "keyword": "texperia",
        "title": "Texperia Symposium Coordinator",
        "badge": "LEADERSHIP · COORDINATOR",
        "category": "Leadership",
        "caption": "Coordinated student research papers and facilitated technical presentations across domains.",
        "slug": "texperia-paper-coordinator"
    },
    {
        "id": "leetcode-training",
        "keyword": "leetcode training program",
        "title": "LeetCode 1-Month Daily Coding Program",
        "badge": "GROWTH · 30-DAY SPRINT",
        "category": "Leadership",
        "caption": "Completed 30 days of continuous data structures practice, meditation sessions, and technical reviews.",
        "slug": "leetcode-training-program"
    },
    {
        "id": "agentic-ai-discussion",
        "keyword": "agentic ai performance",
        "title": "Agentic AI Group Discussion",
        "badge": "LEADERSHIP · COLLABORATION",
        "category": "Leadership",
        "caption": "Led classroom debates analyzing autonomous agent decision-making and practical business automation.",
        "slug": "agentic-ai-group-discussion"
    },
    {
        "id": "goventures-bootcamp",
        "keyword": "goventures",
        "title": "GoVentures Software Demonstration",
        "badge": "SPEAKER · BOOTCAMP",
        "category": "Leadership",
        "caption": "Delivered a comprehensive software demonstration for participants at Sri Ramakrishna College.",
        "slug": "goventures-bootcamp-demo"
    },
    {
        "id": "microsoft-deloitte-meeting",
        "keyword": "rahul dey",
        "title": "Microsoft & Deloitte Industry Exchange",
        "badge": "NETWORKING · INDUSTRY LEADERS",
        "category": "Leadership",
        "caption": "Gained industry insights on software architecture from senior leaders at Microsoft and Deloitte.",
        "slug": "microsoft-deloitte-meeting"
    },
    {
        "id": "chennai-japan-expo",
        "keyword": "japan expo 2026",
        "title": "Chennai Japan Expo 2026",
        "badge": "CULTURE · EXPO",
        "category": "Leadership",
        "caption": "Represented and experienced international cultural exchange, technology showcases, and global networking.",
        "slug": "chennai-japan-expo"
    },
    {
        "id": "communication-journey",
        "keyword": "4th-year b.tech it student",
        "title": "Communication & Public Speaking Journey",
        "badge": "GROWTH · MILESTONE",
        "category": "Leadership",
        "caption": "Evolving from classroom stage fear to presenting confidently across national hackathons.",
        "slug": "communication-journey-it"
    },
    {
        "id": "data-analytics-seminar",
        "keyword": "seminar on data analytics",
        "title": "Data Analytics Seminar",
        "badge": "PRESENTATION · SEMINAR",
        "category": "Leadership",
        "caption": "Stepped onto the stage to deliver a technical seminar, conquering public speaking barriers.",
        "slug": "data-analytics-seminar"
    },
    {
        "id": "python-certification",
        "keyword": "basics of python",
        "title": "Python Certification — Infosys",
        "badge": "CERTIFICATE · INFOSYS",
        "category": "Leadership",
        "caption": "Earned official programming certification strengthening core Python foundations.",
        "slug": "python-infosys-certification"
    }
]

def download_file(url, target_path):
    if os.path.exists(target_path) and os.path.getsize(target_path) > 1000:
        return True
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            with open(target_path, 'wb') as f:
                f.write(data)
            return True
    except Exception as e:
        print(f"Failed {target_path}: {e}")
        return False

final_gallery = []

for item in milestones_config:
    matched = None
    for post_key, post_data in posts_dict.items():
        # Match by keyword
        if item["keyword"].lower() in post_key.lower():
            matched = post_data
            break

    if not matched:
        print(f"Could not match: {item['title']}")
        continue

    # Get best link
    best_link = None
    if matched["links"]:
        best_link = sorted(matched["links"], key=lambda x: x[0], reverse=True)[0][1]

    filename = f"{item['slug']}.jpg"
    target_path = os.path.join(out_dir, filename)

    if best_link:
        download_file(best_link, target_path)

    if os.path.exists(target_path):
        final_gallery.append({
            "id": item["id"],
            "title": item["title"],
            "badge": item["badge"],
            "category": item["category"],
            "caption": item["caption"],
            "image": f"assets/images/gallery/{filename}",
            "date": matched["date"]
        })
        print(f"Added [{len(final_gallery)}]: {item['title']}")
    else:
        print(f"Warning: No local image for {item['title']}")

# Save gallery data
json_path = r"d:\Web Development\MY PORTFOLIO\assets\data\gallery.json"
with open(json_path, "w", encoding="utf-8") as f:
    json.dump(final_gallery, f, indent=2)

print(f"\nSuccessfully compiled {len(final_gallery)} curated milestones into {json_path}")
