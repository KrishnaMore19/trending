# 🐦 X (Twitter) Trending Topics Scraper

A **full-stack project** to scrape trending topics from Twitter (X) using **Selenium**, store them in a **PostgreSQL database**, and display/manage them with a **React (Vite + Tailwind) frontend** and **FastAPI backend**.  

---

## 📌 Features
- ✅ Scrapes top 5 trending topics from Twitter (X) using **Selenium WebDriver**  
- ✅ Stores results in **PostgreSQL** with a unique ID and timestamp  
- ✅ REST API built with **FastAPI**  
- ✅ Modern frontend with **React (Vite + Tailwind)**  
- ✅ Dockerized setup for **easy deployment**  
- ✅ pgAdmin support for managing PostgreSQL data  

---

## 🏗️ Tech Stack
- **Backend:** FastAPI, SQLAlchemy, Selenium, Python  
- **Frontend:** React (Vite), Tailwind CSS, Axios  
- **Database:** PostgreSQL  
- **Deployment:** Docker & Docker Compose  

---
## 🔑 Environment Variables
Create a `.env` file in the backend folder:  

```env
# Twitter credentials
TWITTER_USERNAME=your_username
TWITTER_PASSWORD=your_password
TWITTER_EMAIL=your_email

# Database
DATABASE_URL=postgresql://postgres:123456@db:5432/trending_db

# Backend host/port
PORT=8000
HOST=0.0.0.0
```

---

## 🐳 Running with Docker
1. **Build containers**
   ```bash
   docker-compose build --no-cache
   ```
2. **Start containers**
   ```bash
   docker-compose up
   ```
3. Services available:
   - Backend (FastAPI): [http://localhost:8000](http://localhost:8000)
   - API Docs (Swagger): [http://localhost:8000/docs](http://localhost:8000/docs)
   - Frontend (React): [http://localhost:5173](http://localhost:5173)
   - PostgreSQL: `localhost:5432`  

---

## 🛠️ API Endpoints
| Method | Endpoint             | Description |
|--------|----------------------|-------------|
| GET    | `/`                  | Health check |
| POST   | `/scrape`            | Scrape new trends & save |
| GET    | `/trends`            | Get latest trend |
| GET    | `/trends/{trend_id}` | Get trend by ID |
| DELETE | `/trends/{trend_id}` | Delete trend by ID |
| GET    | `/health`            | DB health check |

---

## 🎨 Frontend Features
- Manual **Scraping Button** → starts Selenium scraping  
- **Progress bar & timer** → shows scraping steps  
- **Error handling** → alerts when scraping fails  
- **Trend Cards** → display results stored in DB  

---

## 🗄️ Database Schema
Table: **trends**  
| Column   | Type      | Description |
|----------|-----------|-------------|
| id       | UUID      | Unique ID per scrape |
| trend1–5 | VARCHAR   | Scraped trending topics |
| datetime | TIMESTAMP | End time of Selenium script |
| ip       | VARCHAR   | Scraper IP used |

---

## 🧹 Database Management
- View tables in **pgAdmin** or using `psql` CLI  
- Delete old records via API:  
  ```bash
  curl -X DELETE http://localhost:8000/trends/{trend_id}
  ```

---

## 👨‍💻 Author
- **Krishna More**  
- Full Stack + Generative AI Engineer  
- GitHub: [your-link]  
