# Sitemap and Robots Public Wiring Guide

## Goal

Make the public URAI footprint easy for search engines and human visitors to discover.

## Public routes that should be indexable

- `/`
- `/founder`
- `/adam-clamp`
- `/adam-cohagen-clamp`
- `/technology`
- `/ecosystem`
- `/receipts`
- `/privacy`
- `/terms`
- `/press`
- `/contact`
- `/waitlist`

## Sitemap requirements

The sitemap should list canonical public pages with absolute URLs and current last-modified dates after deployment.

Required canonical domains should be checked before publication:

- `https://www.urailabs.com` for company/founder/public footprint pages
- `https://urai.app` for the public product demo

## Robots requirements

Public pages should be allowed for indexing.

Private, admin, staging, dashboard, raw proof artifact, and authenticated routes should not be indexed unless explicitly reviewed.

## Meta requirements

Each public page should have:

- unique title;
- useful meta description;
- canonical link;
- indexable robots meta tag;
- links to receipts, privacy, technology, and contact routes where appropriate.

## Founder metadata standard

Title candidate:

`Adam Clamp - Founder of URAI Labs`

Description candidate:

`Adam Clamp is the founder and system architect behind URAI Labs, building spatial AI memory systems and user-owned personal intelligence infrastructure.`

## Receipts metadata standard

Title candidate:

`URAI Receipts - Public Proof and Launch Evidence`

Description candidate:

`Public proof, system maps, release gates, privacy boundaries, and evidence status for URAI Labs and URAI Spatial.`

## Safety boundary

Never expose raw private user data, secrets, exact private documents, unreviewed advisor details, or authenticated evidence artifacts through public sitemap entries.
