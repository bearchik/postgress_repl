export async function getStandards() {
  const response = await fetch('/api/standards');
  const json = await response.json();
  return json.data;
}

export async function getStandard(id) {
  const response = await fetch(`/api/standards/${id}`);
  const json = await response.json();
  return json.data;
}

export async function postStandard(standard) {
  const response = await fetch('/api/standards', {method: 'post', body: JSON.stringify(standard)});
  const json = await response.json();
  return json.data;
}

export async function updateStandard(standard) {
  const response = await fetch(`/api/standards/${standard.id}`, {method: 'put', body: JSON.stringify(standard)});
  const json = await response.json();
  return json.data;
}
