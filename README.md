# Vistula Task Manager

Practical Assignment 1 – Team Project IT, Vistula University.

A simple Task Manager built with plain HTML, CSS and JavaScript. Tasks are stored in a Supabase (PostgreSQL) database and accessed through the Supabase auto-generated REST API. The site is hosted on GitHub Pages.

- **Student ID:** 73180
- **Live application:** https://vistula-team-project-73180.github.io/vistula-task-manager/
- **Repository:** https://github.com/vistula-team-project-73180/vistula-task-manager
- **Contributor page:** https://vistula-team-project-73180.github.io/vistula-task-manager/contribution.html
- **Contributor JSON:** https://vistula-team-project-73180.github.io/vistula-task-manager/contribution.json

## Features

- Display all tasks from the database
- Add, edit and delete tasks
- Mark tasks as completed / incomplete
- Changes persist after page refresh
- Error messages shown when an operation fails

## REST API

Base URL: `https://PROJECT_ID.supabase.co/rest/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks?select=*` | Get all tasks |
| GET | `/tasks?id=eq.1&select=*` | Get a task by ID |
| POST | `/tasks` | Create a task |
| PATCH | `/tasks?id=eq.1` | Update a task |
| DELETE | `/tasks?id=eq.1` | Delete a task |

## Team Collaboration (Pull Requests)

- **My Pull Request to my partner's repository:** PASTE_LINK_HERE
- **My partner's Pull Request to my repository:** PASTE_LINK_HERE

## Files

- `index.html` – main page
- `app.js` – application logic (fetch + Supabase REST API)
- `style.css` – styling
- `config.json` – public Supabase configuration
- `contribution.html`, `contribution.json` – added by my partner via Pull Request
