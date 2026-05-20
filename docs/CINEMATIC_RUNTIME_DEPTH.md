# Cinematic Runtime Depth

This document records the next implementation layer for URAI transitions.

## Runtime requirements

- Camera transitions must use deterministic interpolation.
- Mobile devices must use a lower particle and constellation budget.
- Reduced motion must use a static/short dissolve path.
- Loading, empty, and error states must exist before visual promotion.

## Next implementation targets

- Home to life map camera controller.
- Life map to focus transition state.
- Focus to replay evidence rail binding.
- Reflective floor fallback.
- Constellation level-of-detail budget.
