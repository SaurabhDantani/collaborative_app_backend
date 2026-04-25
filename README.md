# Collaborative App Backend

A real-time collaboration backend built with Node.js, TypeScript, Express, and Socket.IO. It supports session creation and joining, live chat, shared editor updates, user presence, and activity events using in-memory storage and WebSocket rooms.

## Features

- Session management: create and join collaboration sessions
- Real-time chat with instant message delivery
- Shared editor updates using a last-write-wins strategy
- Presence system for active user tracking
- Activity feed for collaboration events

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Socket.IO
- In-memory storage (no database)
- PM2 process manager
- Nginx reverse proxy
- AWS EC2 deployment

## Project Structure

- `src/` - application entrypoints and configuration
- `src/controllers/` - REST endpoint handlers
- `src/services/` - business logic and state management
- `src/sockets/` - Socket.IO event handling and room coordination
- `src/routes/` - API route definitions
- `src/models/` - domain definitions and data shape concepts
- `src/utils/` - shared utilities such as logging

## API Endpoints

### POST /session/create

Create a new collaboration session.

Request example:

```json
{
  "name": "Design Session",
  "host": "alice"
}
```

Response example:

```json
{
  "sessionId": "abc123",
  "name": "Design Session",
  "host": "alice"
}
```

### POST /session/join

Join an existing collaboration session.

Request example:

```json
{
  "sessionId": "abc123",
  "user": "bob"
}
```

Response example:

```json
{
  "sessionId": "abc123",
  "user": "bob",
  "joined": true
}
```

### GET /session/:id

Retrieve session metadata and current state.

Response example:

```json
{
  "sessionId": "abc123",
  "name": "Design Session",
  "users": ["alice", "bob"],
  "activity": [
    { "type": "join", "user": "bob", "timestamp": "2026-04-25T12:00:00Z" }
  ]
}
```

## WebSocket Events ⭐

### Client → Server

- `join_session`
  - Purpose: add a user to a Socket.IO room and start presence tracking for the session.
- `leave_session`
  - Purpose: remove a user from the session room and broadcast updated presence.
- `send_message`
  - Purpose: broadcast chat messages to session participants in real time.
- `editor_update`
  - Purpose: send shared editor changes to other users in the session.

### Server → Client

- `users_update`
  - Purpose: broadcast current active users for a session.
- `new_message`
  - Purpose: deliver chat messages to connected clients.
- `editor_update`
  - Purpose: propagate editor changes to all session members.
- `activity`
  - Purpose: notify clients about session events such as joins, leaves, and edits.

## Setup Instructions

1. Clone the repository:

```bash
git clone <repo-url>
cd collaborative_app_backend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

## Deployment Details ⭐

This backend is intended to run on AWS EC2 behind Nginx with PM2 managing the Node process.

- AWS EC2: provision an instance, install Node.js, and deploy the application code.
- Nginx: configure a reverse proxy to forward HTTP and WebSocket traffic to the Node.js app.
- PM2: keep the backend running, manage restarts, and handle process logging.

## Architecture Explanation ⭐

- REST vs WebSocket: REST endpoints handle session lifecycle operations and metadata retrieval, while Socket.IO handles low-latency collaboration events.
- Session-based architecture: each collaboration session is tracked in memory with a session ID, active users, messages, and editor state.
- Socket.IO rooms: sessions are mapped to WebSocket rooms so only relevant clients receive live updates.

## Scaling Approach ⭐

- WebSocket scaling challenges: a single instance can only manage connected sockets for one process, so multi-instance setups require coordination.
- Redis Pub/Sub: distribute Socket.IO events across multiple server instances and keep shared session state synchronized.
- Load balancing: use a load balancer to route traffic to multiple EC2 instances.
- Sticky sessions: preserve WebSocket connections on the same backend instance when necessary for stateful socket handling.

## Limitations

- No database persistence: all session state is stored in memory and resets on service restart.
- Last-write-wins editor: concurrent edits are not merged using CRDT or OT, so the latest update overrides prior content.

## Future Improvements

- Add MongoDB or another persistent store for sessions, users, and message history.
- Implement a CRDT or OT-based editor sync algorithm for conflict-free collaboration.
- Add authentication and authorization for user identity and session access control.
- Improve session recovery and persistence for reconnect scenarios.

## Contact

For architecture questions or walkthroughs, review the source in `src/` and the Socket.IO event flow in `src/sockets/`.
