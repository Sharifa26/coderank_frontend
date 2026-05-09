# CodeNova

CodeNova is a modern online code compiler and sharing platform built for writing, running, saving, and improving code from the browser.
It supports authenticated user accounts, Google login, code history, public code sharing, and AI-assisted code optimization.
The frontend is built with Next.js and communicates with a live backend API for authentication, code storage, execution workflows, and optimization features.

## Live Links

| Service | Link |
| --- | --- |
| Frontend Deployment | https://coderuns.vercel.app/ |
| Backend Deployment | https://coderunsapi.duckdns.org/ |
| Frontend Repository | https://github.com/Sharifa26/coderank_frontend.git |
| Backend Repository | https://github.com/Sharifa26/codeRank_backend.git |

## Features

- User signup, login, logout, and session handling
- Google authentication
- Forgot password and reset password flow
- Online code editor with language selection
- Code execution workflow with output display
- Save code snippets with title, language, input, output, and status
- View saved code history
- Delete saved snippets
- Share code through public share links
- AI code optimization with suggestions and improvements
- Responsive UI for desktop, tablet, and mobile screens
- Toast notifications for user feedback

## Tech Stack Used

| Area | Technologies |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS, shadcn/ui-style components, Radix UI |
| Forms and Validation | React Hook Form, Zod |
| State Management | Zustand |
| API Client | Axios |
| Code Editor | Monaco Editor |
| Realtime Connection | Socket.IO Client |
| Notifications | Sonner |
| Icons | Lucide React |
| Deployment | Vercel frontend, DuckDNS-hosted backend |

## Prerequisites

Before running the project locally, install:

- Node.js 20 or newer
- npm
- Git
- Docker and Docker Compose, if you want to run with Docker
- Access to the backend project and its required environment variables
- A Google OAuth Client ID, if Google login is enabled

## Installation

Clone the frontend repository:

```bash
git clone https://github.com/Sharifa26/coderank_frontend.git
cd coderank_frontend
```

Install frontend dependencies:

```bash
npm install
```

Clone the backend repository in a separate folder:

```bash
git clone https://github.com/Sharifa26/codeRank_backend.git
cd codeRank_backend
npm install
```

For more information on the backend setup, see the [backend repository](https://github.com/Sharifa26/codeRank_backend).

## Environment Variables Setup

Create a `.env.local` file in the frontend root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

For production, the frontend API URL should point to the deployed backend:

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_SOCKET_URL=your_backend_socket_url
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## How to Run Frontend

From the frontend project folder:

```bash
npm install
npm run dev
```

Open the frontend in your browser:

```text
http://localhost:3000
```

To create a production build:

```bash
npm run build
npm run start
```

## Project Structure

```text
app/                  Next.js app routes and layouts
components/           Reusable UI and feature components
components/ui/        Shared UI primitives
hooks/                Custom React hooks
lib/                  Utilities, socket client, and default code
services/             API service functions
store/                Zustand state stores
types/                Shared TypeScript interfaces
public/               Static assets
```

## Useful Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the frontend development server |
| `npm run build` | Build the frontend for production |
| `npm run start` | Start the production frontend server |
| `npm run lint` | Run ESLint |

## Notes

- Make sure the backend is running before using login, signup, code saving, sharing, or AI optimization locally.
- Make sure `NEXT_PUBLIC_API_URL` matches the backend API prefix.
- Add the frontend URL to the allowed origins in the backend CORS configuration.
- Add the deployed frontend domain to the Google OAuth authorized origins if Google login is enabled.


## 👤 Author

**Sharifa**

- Project: CodeRank Backend Engineering Case Study
- Role: Backend Developer
- GitHub: [https://github.com/Sharifa26](https://github.com/Sharifa26)
- LinkedIn: [https://www.linkedin.com/in/sharifa-sheriff/](https://www.linkedin.com/in/sharifa-sheriff/)



