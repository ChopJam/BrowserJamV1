import { defineStore } from 'pinia';

export const useUploaderStore = defineStore('uploader', () => {
  const { $toast } = useNuxtApp();

  const files = ref<{ name: string; file: File; status: string }[]>([]);
  const username = ref<string>('');

  /**
   * Sets the username for the upload.
   * @param value - The username to set.
   */
  const setUsername = (value: string) => {
    username.value = value;
  };

  /**
   * Adds a file to the queue.
   * @param file - The file to add.
   */
  const addFileToQueue = (file: File) => {
    files.value.push({ name: file.name, file, status: 'Queued' });
  };

  /**
   * Processes the file upload queue.
   */
  const processQueue = async () => {
    if (files.value.length === 0) {
      $toast.error('No files in the queue to process.', {
        toastStyle: {
          background: 'black',
          color: 'white',
        }
      });
      return;
    }

    for (const item of files.value) {
      await sendRequest(item.file);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  };

  /**
   * Removes a file from the queue.
   * @param index - The index of the file to remove.
   */
  const removeFile = (index: number) => {
    files.value.splice(index, 1);
  };

  /**
   * Sends the upload request to the API.
   * @param file - The file to upload.
   */
  const sendRequest = async (file: File) => {
    /**
     * Form data for the upload request.
     */
    const formData = new FormData();
    formData.append('masterpiece', file);
    formData.append('username', username.value);

    const response = await fetch('https://api.jam.exposed/v1/masterpiece/create', {
      method: 'POST',
      body: formData,
    });

    const index = files.value.findIndex(f => f.file === file);
    if (index !== -1) files.value[index].status = response.ok ? 'Completed' : 'Failed';

    if (!response.ok) {
      $toast.error('Error uploading file.', {
        toastStyle: {
          background: 'black',
          color: 'white',
        }
      });
      return;
    }

    /**
     * Ugly to download the file.
     */
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `masterpiece-${Date.now()}.ajart`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(downloadUrl);
  };

  return {
    files,
    username,
    setUsername,
    addFileToQueue,
    processQueue,
    removeFile,
  };
});