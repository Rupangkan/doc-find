export interface UploadProgress {
	loaded: number;
	total: number;
	percentage: number;
}

export interface UploadResponse {
	success: boolean;
	message?: string;
	data?: unknown;
}

export async function uploadDocuments(
	files: File[],
	onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadResponse> {
	const formData = new FormData();
	files.forEach((file) => formData.append("files[]", file));

	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();

		if (onProgress) {
			xhr.upload.addEventListener("progress", (event) => {
				if (event.lengthComputable) {
					const percentComplete = (event.loaded / event.total) * 100;
					// Track overall progress - you could enhance this to track per-file
					onProgress(0, {
						loaded: event.loaded,
						total: event.total,
						percentage: percentComplete,
					});
				}
			});
		}

		xhr.addEventListener("load", () => {
			if (xhr.status >= 200 && xhr.status < 300) {
				try {
					const response = JSON.parse(xhr.responseText);
					resolve({
						success: true,
						data: response,
					});
				} catch {
					resolve({
						success: true,
						data: xhr.responseText,
					});
				}
			} else {
				reject({
					success: false,
					message: `Upload failed with status ${xhr.status}`,
				});
			}
		});

		xhr.addEventListener("error", () => {
			reject({
				success: false,
				message: "Network error during upload",
			});
		});

		xhr.addEventListener("abort", () => {
			reject({
				success: false,
				message: "Upload was cancelled",
			});
		});

		xhr.open("POST", "/api/documents/upload");
		xhr.send(formData);
	});
}
