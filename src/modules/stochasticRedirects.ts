/// Old Stochastic Studio URLs (`/stochastic-models/<lesson>`) and the lab page that now hosts each lesson.
export const STUDIO_MOVES: Record<string, string> = {
  "": "/random-walk",
  "random-walk": "/random-walk/symmetric",
  "rescaled-walk": "/random-walk/rescaled-walk",
  "why-sqrt-t": "/random-walk/why-sqrt-t",
  clt: "/random-walk/clt",
  "wiener-process": "/brownian-motion/wiener-process",
  increments: "/brownian-motion/increments",
  covariance: "/brownian-motion/covariance",
  "running-max": "/brownian-motion/running-max",
  reflection: "/brownian-motion/reflection",
  "first-passage": "/brownian-motion/first-passage",
  hitting: "/brownian-motion/hitting",
};

/// In-app redirects for the retired studio; `vercel.json` mirrors them for the host.
export const stochasticRedirects = () =>
  Object.entries(STUDIO_MOVES).map(([id, to]) => ({ from: id ? `/stochastic-models/${id}` : "/stochastic-models", to }));
