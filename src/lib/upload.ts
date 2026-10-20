export async function uploadFileToR2(file: File): Promise<string> {
  // 1. Get presigned upload URL from API route
  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || "Failed to request upload signature");
  }

  const { uploadUrl, publicUrl } = await res.json();

  // 2. Direct upload to R2 via S3 presigned URL
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error("Failed to upload image directly to R2 bucket");
  }

  return publicUrl;
}
