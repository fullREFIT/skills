# Brand profile schema

A custom profile is JSON containing `id`, `label`, `name`, `wordmark`, optional `tagline`, `useWhen`, `rules`, `fonts`, and ten color roles.

Required color roles: `dark`, `dark2`, `canvas`, `surface`, `text`, `muted`, `primary`, `primaryHover`, `secondary`, and `border`. Use six-digit hex values.

Required font roles: `body`, `display`, `mono`, and `googleCss`. `googleCss` may be empty when fonts are local or system-provided.

Do not put credentials, private download URLs, or base64 assets in the profile.
