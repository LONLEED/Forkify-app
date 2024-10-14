import { TIMEOUT_FETCH } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData) {
  try {
    let fetchPro = uploadData
      ? fetch(url, {
          method: 'POSt',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);
    let res = await Promise.race([fetchPro, timeout(TIMEOUT_FETCH)]);
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    let data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
