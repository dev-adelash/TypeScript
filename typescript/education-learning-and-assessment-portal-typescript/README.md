# Education Learning and Assessment Portal

Created NestJS assessment workflows with a React application component for submissions and instructor review. Kept scoring deterministic, validated deadlines and protected publication with role and version checks. Verified repeated submissions, unauthorized edits and stale approvals with Node tests.

## Run locally

Start from the `typescript/` directory of this repository.

```sh
npm start -- ../typescript/education-learning-and-assessment-portal-typescript/project.json
```

The browser console is available at `http://127.0.0.1:8000` for API applications. For frontend applications, use the frontend development server described in the setup below.

## Architecture

```mermaid
flowchart LR
    Client[Browser or API client] --> API[Validated API]
    API --> Rules[Business rules]
    Rules --> State[Application state]
    Rules --> Audit[Audit history]
```

## Workflow

Available actions: `submit`, `feedback`, `publish`.

Open `project.json` for the available commands and example inputs when present. Use the operator role to inspect state and audit history. Retry an accepted command with the same identifier to observe replay behavior; change its payload or expected version to exercise conflict handling.

## Verification

Run the automated checks from the stack directory:

```sh
npm ci && npm test && npm run build
```

The checks exercise business rules, permission boundaries and failure recovery. Sample records are synthetic. Development credentials are local examples; use managed identity, external secrets and your own deployment controls before exposing services publicly.

## Implementation notes

# Education Learning and Assessment Portal

Score a fixed three-answer rubric before a deadline. Reject duplicate submissions. An instructor reviews feedback and publishes it using the expected record version; feedback does not change the score.

## Purpose

Score a fixed three-answer rubric before a deadline. Reject duplicate submissions. An instructor reviews feedback and publishes it using the expected record version; feedback does not change the score.

## Run

See the family-level README one directory above for the installed runtime and command. Use this folder's `project.json` to select this application.

## Workflow

Domain: **education**. Available commands: submit, feedback, publish.

The configuration includes request examples. Inspect state and the audit log after a successful command, then retry it or change its version to observe duplicate and concurrency behavior.

## Configuration

Core workflow demo only. Local fixture authentication and local development storage. External cloud services, live AI model calls and production database/broker integrations from the broader CV descriptions are not configured here. Read the family-level README for the actual implemented stack and tests.

## Architecture

[Architecture and failure boundaries](ARCHITECTURE.md). Shared workflow modules and tests are in the parent stack folder.

