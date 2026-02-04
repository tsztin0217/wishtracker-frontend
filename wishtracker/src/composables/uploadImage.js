const VITE_API_URL = import.meta.env.VITE_API_URL;
export async function uploadImage(file) {
  if (!file) return { public_url: '', gcs_path: '' };
  const storedId = localStorage.getItem('user_id');

  // get signed upload URL from backend
  const urlResponse = await fetch(`${VITE_API_URL}/api/images/upload-url`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-User-ID': storedId || ''},
    body: JSON.stringify({ 
      filename: file.name, 
      content_type: file.type 
    }),
    credentials: 'include'
  });

  if (!urlResponse.ok) {
    const errorData = await urlResponse.json();
    throw new Error(errorData.error || 'Failed to get upload authorization');
  }

  const { upload_url, public_url, gcs_path } = await urlResponse.json();

  // upload the file directly to GCS
  const gcsResponse = await fetch(upload_url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  });

  if (!gcsResponse.ok) {
    throw new Error('Upload to Google Cloud Storage failed');
  }

  // return the public URL and GCS path
  return { public_url, gcs_path };
}
