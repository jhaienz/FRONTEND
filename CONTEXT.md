# Frontend App Context

The frontend app context owns the user-facing Next.js experience for NCF Research Nexus and consumes the backend API contract to render public, authenticated, and admin workflows.

## Language

**API Contract**:
The shared boundary between the NestJS backend and the Next.js frontend: endpoint paths, request payloads, response envelopes, auth requirements, and error behavior.
_Avoid_: Backend/frontend integration, API connection

**Auth Boundary**:
The rule that the backend is the authority for authentication and authorization; frontend session state and roles are only hints for routing and presentation.
_Avoid_: Frontend auth enforcement, client-side permissions

**Token Refresh**:
The client behavior of requesting a new access token only after a protected API call returns `401`, then retrying that original request once.
_Avoid_: Proactive refresh timer, infinite retry

**Direct Object Upload**:
The upload model where the backend creates metadata and issues a presigned storage URL, while the frontend sends file bytes directly to object storage and then confirms completion with the backend.
_Avoid_: Backend-proxied upload, multipart research upload

**Private PDF**:
A research file whose metadata remains public but whose full PDF download URL is access-controlled by the backend; non-owners request the whole PDF from the owner.
_Avoid_: Private research, partial PDF request

**Owner**:
The authenticated user who uploaded a research record and is stored as its uploader; ownership is separate from bibliographic authorship.
_Avoid_: Author, creator

**Author**:
A bibliographic person credited on a research paper; an author is not necessarily a system user or the owner of the uploaded record.
_Avoid_: Owner, uploader

**Approval**:
The moderation decision that makes a research record eligible for public discovery; owners and admins can still see non-approved records in their private workflows.
_Avoid_: Upload completion, publication

**Research Record**:
The metadata entity created for a paper before or after its PDF file is uploaded; it can exist without a completed file upload.
_Avoid_: Uploaded paper, PDF

**Completed Upload**:
The state after a direct object upload succeeds and the backend confirms the file exists in storage.
_Avoid_: Metadata creation, approval

**Collection**:
A user's private saved-paper list containing references to research records; removing an item from a collection does not affect the research record.
_Avoid_: Public folder, curated playlist, citation library

**Analytics Event**:
An explicit user action that the frontend reports to a backend tracking endpoint, such as viewing a research detail, downloading a PDF, or citing a paper.
_Avoid_: Page prefetch, dashboard read, passive render

**Expected API Error**:
A documented API error status that represents a user-facing domain state, such as unauthenticated, forbidden, not found, validation failure, or conflict.
_Avoid_: Server failure, empty data

**Integration Smoke Path**:
The minimum end-to-end QA path proving public discovery, authentication, owner upload, admin moderation, private PDF requests, and expected API errors work against the real backend.
_Avoid_: Build verification, isolated page test
