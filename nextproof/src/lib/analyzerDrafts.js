
const DB_NAME = "nextproof-drafts";
const STORE_NAME = "files";
const DRAFT_KEY = "analyze-draft";

function openDraftDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveAnalyzeDraft({
  resume,
  jobDescription,
  jobFile,
}) {
  const db = await openDraftDB();

  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    if (resume) store.put(resume, "resume");
    else store.delete("resume");

    if (jobFile) store.put(jobFile, "jobFile");
    else store.delete("jobFile");

    tx.oncomplete = resolve;
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });

  sessionStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({ jobDescription })
  );

  db.close();
}

export async function loadAnalyzeDraft() {
  const metadata = sessionStorage.getItem(DRAFT_KEY);

  if (!metadata) return null;

  const draft = JSON.parse(metadata);
  const db = await openDraftDB();

  const files = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const resumeRequest = store.get("resume");
    const jobFileRequest = store.get("jobFile");

    tx.oncomplete = () => {
      resolve({
        resume: resumeRequest.result || null,
        jobFile: jobFileRequest.result || null,
      });
    };

    tx.onerror = () => reject(tx.error);
  });

  db.close();

  return { ...draft, ...files };
}

export function clearAnalyzeDraft() {
  sessionStorage.removeItem(DRAFT_KEY);

  return openDraftDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).clear();
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
      })
  );
}
