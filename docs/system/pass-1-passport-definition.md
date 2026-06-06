# URAI Pass 1 Passport Definition

## Purpose

Passport is URAI’s privacy and consent authority. It controls which layers are open, which layers are closed, and what AI, passive data, exports, Shadow, Legacy, Companion, Intelligence, Spatial, and Notifications may use.

## Required Passport Model

A single hasConsent boolean is not sufficient.

Passport must support layer-level permissions, including:

* passive_data
* intelligence
* companion_context
* lifemap
* ground
* mirror
* shadow
* legacy
* export
* notifications
* spatial
* audio
* location
* health
* gmail
* calendar
* contacts
* motion
* camera
* admin
* system

## Required Defaults

All sensitive layers default closed:

* Shadow closed
* Legacy closed
* Export closed
* Notifications closed
* Companion memory closed
* Passive data closed
* Sensitive cloud sync closed
* Audio capture closed
* Transcripts closed
* Location closed
* Gmail closed
* Calendar closed
* Health closed
* Relationships closed
* Camera closed
* Motion closed

## Required API

Future Passport provider should expose:

* getLayerStatus(layerId)
* isLayerOpen(layerId)
* openLayer(layerId)
* closeLayer(layerId)
* requireLayer(layerId)
* listOpenLayers()
* listClosedLayers()
* explainLayer(layerId)
* resetPassport()
* exportPassportState()
* importPassportState()

## Required Safety Rules

* No permission prompt on first load.
* No sensitive layer opens automatically.
* No Pro tier bypass.
* No AI can use closed layers.
* No passive data source can ingest while its layer is closed.
* Shadow and Legacy require explicit separate approval.
* Export requires review.
* Demo mode uses sample data only.

## Required Persistence

Define but do not implement yet:

* local-first state
* optional cloud sync only after explicit consent
* user-scoped Firestore path
* audit trail for opens/closes
* deletion/reset behavior

## Required UI

Define but do not implement yet:

* Passport Control Center
* grouped layer toggles
* open/closed indicators
* “Why is this needed?” copy
* reset controls
* export/import controls
* demo-safe state

## Required Tests

Future implementation must test:

* all sensitive defaults closed
* open/close per layer
* AI closed-layer blocking
* passive data closed-layer blocking
* Shadow/Legacy separate gates
* Export review gate
* no first-load permission prompt
* no Pro bypass

## Pass 1 Decision

Status: DEFERRED
Reason: Passport must be specified before implementation.
Safe fallback: Existing app remains unchanged; accidental provider is not integrated.
Next action: Adam approves a dedicated Passport implementation pass.
