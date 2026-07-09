# URAI Deployment Rules

## Production

Production deploy requires:

- main branch only
- canonical repo only
- clean working tree
- recorded commit SHA
- build passing
- typecheck passing
- lint passing
- tests passing
- deploy receipt
- DNS/SSL proof
- smoke receipt
- rollback target
- monitoring receipt
- privacy gate receipt where applicable
- owner approval

## Staging

- staging or release-candidate branch only
- staging Firebase project only
- no production user data
- staging smoke receipt required

## Sandbox

- UrAi-Dev is sandbox only
- sandbox cannot deploy production domains

## Legacy

- UrAiProd is legacy/archive only
- no production deploys
- features must be ported to canonical repos through PRs
