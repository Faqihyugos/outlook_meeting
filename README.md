# Outlook Meeting Tracker

This repository contains a small demo application for syncing Outlook meetings and tracking attendance.

## New API endpoints

The backend now exposes two additional endpoints:

- `POST /api/meetings` – Create a new meeting if the requested room and time are available.
- `GET /api/rooms/:room/availability?start=YYYY-MM-DD&end=YYYY-MM-DD` – Check a room's bookings and report any days that are fully booked.

These endpoints can be used by the internal application to schedule meetings without relying on Outlook.
