# Frontend - AI Learning Platform

Angular 17 frontend for the AI-Driven Learning Platform.

## Requirements

- Node.js 18+
- Angular CLI 17

## Setup

```bash
npm install
ng serve
```

Runs on **http://localhost:4200**

## Build

```bash
ng build
```

## Structure

```
src/app/
├── components/
│   ├── auth/        # Login & Register
│   ├── dashboard/   # Main learning interface
│   └── admin/       # Admin panel
├── services/        # AuthService, ApiService
├── guards/          # Route protection
├── interceptors/    # JWT token injection
└── models/          # TypeScript interfaces
```
