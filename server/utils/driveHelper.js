/**
 * Converts a Google Drive share link into preview and download links.
 * Example Input: https://drive.google.com/file/d/1X2Y3Z.../view?usp=sharing
 */
export const convertDriveLink = (url) => {
  let previewUrl = url;
  let downloadUrl = url;

  if (!url || !url.includes('drive.google.com')) {
    return { previewUrl, downloadUrl };
  }

  // Extract the file ID using regex
  const regex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);

  let fileId = null;

  if (match && match[1]) {
    fileId = match[1];
  } else {
    // Check if it's in the id= format
    try {
      const urlObj = new URL(url);
      fileId = urlObj.searchParams.get('id');
    } catch (e) {
      // invalid URL
    }
  }

  if (fileId) {
    previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
  }

  return { previewUrl, downloadUrl };
};

export const convertDriveImageLink = (url) => {
  if (!url || !url.includes('drive.google.com')) return url;

  const regex = /\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);

  let fileId = null;
  if (match && match[1]) {
    fileId = match[1];
  } else {
    try {
      const urlObj = new URL(url);
      fileId = urlObj.searchParams.get('id');
    } catch (e) {}
  }

  if (fileId) {
    return `https://lh3.googleusercontent.com/d/${fileId}=w800`;
  }
  
  return url;
};
