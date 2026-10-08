# Legacy dual-lock dependency repair

This candidate repairs the active dependency consumers while retaining UrAi's
paid-runtime quarantine. It preserves the external Next 15.5.27 pin and the
subsequent retirement of r3f-perf into local frame-cadence/renderer diagnostics.
No application, provider admission, deployment or account authority is widened.

## Actual graph changes

The literal ac227 npm lock reported 48 high and 16 moderate findings. The
separately supported pnpm graph still reported one critical, 16 high, seven
moderate and one low finding after the first npm-oriented repair. Each manager
now has the same explicit leaf override intent, with independently resolved
lock bytes. Compatible maintained patches address gRPC, PostCSS and its selector
parser, Sharp, UUID and the remaining affected leaf packages. NYC's actual
`js-yaml.load` consumer accepts js-yaml 4.3.2; this removes its old argparse /
sprintf-js chain without migrating the entire Jest/Tailwind/Firebase stack.
The actual gaxios 6 multipart adapter still consumes UUID's CommonJS v4 API.

The brace recursion advisory
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
has no maintained upstream fix for the affected 3.0.3 release. The admitted
local mitigation is the exact canonical
[Privacy fork](https://github.com/LifeLoggerAI/urai-privacy/tree/6e924f765dba68b1c5ae768c74df0df7e066a2c6/vendor/braces).
All twelve source, license and provenance files are preserved. Parsing braces
and parentheses has a fixed 128-depth ceiling; compile, expand and stringify
independently bound caller-supplied ASTs. A package version suffix and a zero
scanner result do not constitute upstream remediation or independent security
approval. The raw advisory, local-fork provenance and source-review requirement
remain explicit. The removed sprintf-js chain also had an unpatched advisory,
[GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c).

## Proof and its limits

Both literal repaired locks report zero known audit findings. Npm's frozen
offline dry run and pnpm 9.15.9's frozen offline lock-only check passed without
changing any manifest or lock bytes. These prove metadata coherence; they do
not prove an installed full graph, lifecycle scripts or the application build.

An ordinary install, with lifecycle scripts enabled, of eleven exact direct
library consumers passed. All seventeen installed consumer cases passed:
exact locked versions and canonical fork bytes; recursive parser/AST denial;
ordinary brace/micromatch and Chokidar behavior; the actual existing Tailwind
config and stylesheet through PostCSS/Autoprefixer; selector handling; NYC YAML
loading and unsafe-tag denial; gaxios multipart UUID generation through an
intercepted adapter; an idle gRPC constructor; and Next's Sharp optimizer on a
bounded synthetic PNG and malformed image bytes. No adapter sent a network
request or used private inputs.

The Next cases used an existing installed Next 15.5.27 and Sharp 0.35.5 closure
read-only, after checking those versions. The actual 40,071-byte optimizer is
identical to the optimizer in the official tar whose SHA512 integrity matches
the repaired npm lock; its SHA256 is
`bf2e6f1961dd49c8928a9671319f1f623478a868cc460b979ba414f19e82f48b`.
This is real installed optimizer execution, not a full UrAi frontend install or
build. The failed larger local subset install and a later tiny upstream fixture
install both hit ENOSPC; their original logs are retained, with no transferred
install or predecessor security acceptance.

The new exact-head native workflow requires a clean literal checkout, an
ordinary full `npm ci` with lifecycle scripts enabled, these installed consumer
cases, the installed npm audit, separately frozen pnpm metadata/audit and
unchanged locks. Test-only local module-location options remain unset there;
no fallback graph or generated source is used. Existing acceptance gates and
independent review remain required. Hosted proof, confidential runtime,
protected authority, paid execution and release approval are separate from the
bounded local evidence. No deployment, spend or Golden Master is claimed.
