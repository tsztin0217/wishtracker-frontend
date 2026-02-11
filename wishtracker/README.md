# WishTracker

WishTracker is a personal wishlist dashboard that lets you save products from any site, organize them with tags, and quickly jump back to the original store page. It solves the problem of scattered "maybe later" links across tabs, screenshots, and notes by giving you a single place to track and revisit items you’re interested in.

## Application Overview

- Save items with a title, link, description, price, image, and custom tags.
- Use Google Login to securely sign in without managing passwords.
- Fetch rich link previews (title, description, image) for product URLs using the LinkPreview API.
- Upload and store custom images for items in Google Cloud Storage.
- Edit and delete items, including cleaning up their images from cloud storage.
- Filter and mentally organize your wishlist using user-defined tags (e.g., "Tech", "Gift", "High Priority").

The frontend is built with Vue 3 and Vite; the backend is a Flask API deployed on Google Cloud Run with a PostgreSQL database and Google Cloud Storage.


## Deployed Link
Access the live application at: [https://wishtracker-frontend-284687348047.us-central1.run.app](https://wishtracker-frontend-284687348047.us-central1.run.app)


## Screenshots
![lightmode-welcome-page](src/assets/screenshot-lightmode-welcome.png)
![darkmode-welcome-page](src/assets/screenshot-darkmode-welcome.png)
![item-form](src/assets/screenshot-item-form.png)
![item-detail](src/assets/screenshot-item-detail.png)
![dashboard](src/assets/screenshot-dashboard.png)

## Tech Stack & Dependencies

### Backend (wishtracker-backend)

**Core technologies**
- Python 3
- Flask
- SQLAlchemy & Alembic (ORM and migrations)
- Google Cloud Run (deployment)
- Google Cloud Storage (image uploads)
- Google OAuth (user authentication)
- LinkPreview API (URL metadata)

**Key dependencies**  
See `wishtracker-backend/requirements.txt` for exact versions. Major libraries include:
- `Flask`
- `Flask-Cors`
- `Flask-SQLAlchemy`
- `Authlib` (for Google OAuth)
- `psycopg2-binary` (PostgreSQL driver)
- `google-cloud-storage`
- `requests`
- `python-dotenv` (for local env management, if used)

### Frontend (wishtracker-frontend/wishtracker)

**Core technologies**
- Vue 3 (Composition API)
- Vite
- PrimeVue (UI components like Dialog)

**Key dependencies**  
See `wishtracker-frontend/wishtracker/package.json` for exact versions. Major libraries include:
- `vue`
- `vite`
- `primevue`, `primeicons`
- `axios` (for API calls)

---

## Local Setup Instructions

These steps assume macOS, Node.js, Python, and PostgreSQL are installed.

### 1. Clone the repository

```bash
git clone <your-repo-url> wishtracker
cd wishtracker
```

### 2. Backend setup (Flask API)

```bash
cd wishtracker-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in `wishtracker-backend` (or configure your environment) with values similar to:

```bash
FLASK_APP=app
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/wishtracker
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OAUTHLIB_INSECURE_TRANSPORT=1  # for local HTTP
LINKPREVIEW_API_KEY=your-linkpreview-api-key
GCS_BUCKET_NAME=your-gcs-bucket-name
GOOGLE_APPLICATION_CREDENTIALS=path/to/your-service-account.json
FRONTEND_ORIGIN=http://localhost:5173
```

Run database migrations:

```bash
flask db upgrade
```

Start the backend server:

```bash
flask run --debug
```

The API should now be available at `http://localhost:5000`.

### 3. Frontend setup (Vue app)

Open a new terminal and run:

```bash
cd wishtracker-frontend/wishtracker
npm install
npm run dev
```

By default, Vite will start on `http://localhost:5173`.

Ensure your backend CORS and redirect URIs allow this origin (`http://localhost:5173`).

---

## Basic Usage

1. Open the frontend in your browser at `http://localhost:5173`.
2. Click "Login" to sign in with Google. After successful OAuth, you will land on the main dashboard.
3. Click "Add Item" to create a new wish item:
   - Paste a product URL to fetch metadata via LinkPreview (title, description, image).
   - Optionally upload an image that will be stored in Google Cloud Storage.
   - Add a price and description.
   - Add one or more tags for organization.
4. Use the item cards to:
   - Open the original product page in one click.
   - Edit items (update fields, tags, or image).
   - Delete items (which also removes the associated image from cloud storage when possible).