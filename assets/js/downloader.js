/**
 * Downloader API Service Module
 */

// Replace the old URL with your PythonAnywhere domain:
const API_URL = "https://abdulmanan12345.pythonanywhere.com/api/download";

async function fetchReelData(reelUrl) {
  try {
    const response = await fetch(API_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: reelUrl })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Unable to fetch video data from API.');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
