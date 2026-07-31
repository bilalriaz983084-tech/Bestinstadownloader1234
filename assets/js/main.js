document.addEventListener('DOMContentLoaded', () => {
  const downloadForm = document.getElementById('download-form');
  const reelInput = document.getElementById('reel-url');
  const submitBtn = document.getElementById('submit-btn');
  const errorMessage = document.getElementById('error-message');

  // Result Section Elements
  const resultSection = document.getElementById('result-section');
  const resultThumbnail = document.getElementById('result-thumbnail');
  const resultAuthor = document.getElementById('result-author');
  const resultCaption = document.getElementById('result-caption');
  const resultDuration = document.getElementById('result-duration');
  const downloadMp4Btn = document.getElementById('download-mp4-hd');
  const copyLinkBtn = document.getElementById('copy-link-btn');

  let currentDownloadUrl = '';

  // Handle Form Submission
  downloadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = reelInput.value.trim();

    if (!url) return;

    // Reset UI states
    errorMessage.style.display = 'none';
    errorMessage.innerText = '';
    submitBtn.innerText = 'Fetching Reel...';
    submitBtn.disabled = true;

    try {
      // Call Backend API function from downloader.js
      const data = await fetchReelData(url);

      if (data && data.success) {
        // Populate Result Card with real/API data
        resultThumbnail.src = data.thumbnail;
        resultAuthor.innerText = data.author;
        resultCaption.innerText = data.caption;
        resultDuration.innerText = data.duration;
        
        // Direct Download Link
        currentDownloadUrl = data.videoUrl;
        downloadMp4Btn.href = data.videoUrl;
        downloadMp4Btn.setAttribute('download', 'reel_video.mp4');

        // Reveal the hidden result card
        resultSection.classList.add('show');

        // Smooth scroll to results
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        throw new Error('Could not find video details for this link.');
      }
    } catch (err) {
      errorMessage.innerText = err.message || 'Something went wrong. Please check the link and try again.';
      errorMessage.style.display = 'block';
    } finally {
      submitBtn.innerText = 'Download';
      submitBtn.disabled = false;
    }
  });

  // Copy to Clipboard Feature
  copyLinkBtn.addEventListener('click', async () => {
    if (!currentDownloadUrl) return;

    try {
      await navigator.clipboard.writeText(currentDownloadUrl);
      const originalText = copyLinkBtn.innerHTML;
      
      // Feedback confirmation
      copyLinkBtn.innerHTML = '<span>✅ Link Copied!</span>';
      
      setTimeout(() => {
        copyLinkBtn.innerHTML = originalText;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  });
});