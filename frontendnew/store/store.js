import {create} from 'zustand';

const useTokenStore = create((set) => {
  let initialToken = null;
  let initialUserInfo = null;
  let initialFolders = [];
  let initialFiles = [];

  // Check if localStorage is available (client-side) before accessing
  if (typeof window !== 'undefined') {
    initialToken = localStorage.getItem('token') || null;
    initialUserInfo = JSON.parse(localStorage.getItem('userInfo')) || null;
  }

  return {
    token: initialToken,
    userInfo: initialUserInfo,
    folders: initialFolders,
    files: initialFiles,
    setToken: (newToken) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', newToken);
      }
      set({ token: newToken });
    },
    setUserInfo: (newUserInfo) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
      }
      set({ userInfo: newUserInfo });
    },
    clearToken: () => {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('token');
      set({ token: null, userInfo: null });
    },
    setFolders: (foldersData) => {
      set({ folders: foldersData });
    },
    setFiles: (filesData) => {
      set({ files: filesData });
    },
    clearFilesFolders: () => {
      set({ folders: [] });
      set({ files: [] });
    },
    // Add a method to fetch data if not already loaded
    fetchDataIfEmpty: async () => {
      if (initialToken) {
        try {
          const response = await fetch(`${process.env.SEVER_HOST}api/userContent`, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${initialToken}`,
            },
          });
          const data = await response.json();
          set({ folders: data.folders, files: data.files });
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    },
  };
});

export default useTokenStore;
