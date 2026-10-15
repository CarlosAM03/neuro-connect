# Implemented persistence — Avance 1

```mermaid
erDiagram
  User ||--o{ Goal : owns
  Goal ||--o{ CheckIn : records
  User ||--o{ AISummary : owns
```

UUID primary/foreign keys and UTC `TIMESTAMPTZ(3)` follow ADR-001. Email is normalized before persistence and unique. API projections exclude passwordHash. Goal belongs to one owner; CheckIn belongs to one Goal. Deleting User cascades to Goals, and deleting Goal cascades to CheckIns.

Goal starts ACTIVE with progress 0. Progress is an integer snapshot of the latest CheckIn. CheckIn creation and snapshot update are one transaction. Deleting the latest CheckIn restores the preceding progress, or zero with no history. Database CHECK constraints independently enforce progress 0..100 and difficulty 1..5. CheckIns cannot be edited.

Indexes cover ownerId, (ownerId,status), goalId and (goalId,createdAt). No history table or persisted analytics exists. SupportRelationship remains deferred.

AISummary scaffold follows ADR-001 §§27–33 and PLAN §7.4: UUID/userId FK cascading on user deletion, UTC periodStart/periodEnd/createdAt, JSONB inputSnapshot, nullable content/provider/model, PENDING default and COMPLETED/FAILED enum values. Indexes: userId and (userId,createdAt). SQL CHECK prevents reversed periods. Migration `20261014000200_ai_summary_scaffold` extends the MVP-0 chain without changing existing records. AI Preview and development mock never persist rows; future MVP-2 generation/history lifecycle is deferred.
