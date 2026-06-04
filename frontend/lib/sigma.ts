const SIGMA_API = "http://localhost:8050";

export async function getAlerts() {
  const res = await fetch(`${SIGMA_API}/alerts`);
  return res.json();
}

export async function getLogs() {
  const res = await fetch(`${SIGMA_API}/logs`);
  return res.json();
}

export async function getRules() {
  const res = await fetch(`${SIGMA_API}/rules`);
  return res.json();
}
