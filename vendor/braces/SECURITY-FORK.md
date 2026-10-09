# Local braces security fork

This directory contains the MIT-licensed npm `braces@3.0.3` distribution, identified locally as `3.0.3-urai.1`. It is not an upstream fixed release. The upstream tarball integrity is `sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==` (SHA-1 `490332f40919452272d55a8480adc0c441358789`). The upstream LICENSE and README are retained.

GHSA-vfj7-8cjw-p6xm / CVE-2026-93687 has no published patched upstream version as observed on 2026-10-07. Both Tailwind CSS 3 and Firebase CLI 15 use this package. Replacing those consumers with incompatible major versions solely to change an audit result would not validate their behavior.

The local change fixes the maximum AST nesting depth at 128. The parser bounds both brace and parenthesis containers before descending. Compile, expand, and stringify also bound recursive traversal of caller-supplied ASTs. Inputs beyond the bound produce an explicit SyntaxError instead of exhausting the process stack. Existing length and expansion limits remain in force. Normal patterns below the bound retain the upstream behavior.

The canonical workspace pnpm lock binds Firebase CLI/chokidar and the Admin application's Tailwind/micromatch consumers to this directory. Regression tests resolve those actual installed consumers and check ordinary patterns, the nesting boundary, deeply nested attacks, and AST traversal. This fork is reused from `LifeLoggerAI/urai-investors@1ecff671d6fd2eb095828e5ab47a4bf7726aeb33/vendor/braces`; the source, original license and provenance remain intact. Reuse does not transfer independent review or release acceptance to an Admin successor SHA.

Scanners can omit local file dependencies from registry advisory queries. Therefore a zero registry count must not be described as an upstream fix: this GHSA remains explicitly recorded as locally mitigated and requires exact-head tests and reviewer examination. Remove this fork only after a compatible upstream fixed release is available and its acceptance is rerun.

Sources:

- https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- https://github.com/micromatch/braces/issues/70
- https://registry.npmjs.org/braces/3.0.3
