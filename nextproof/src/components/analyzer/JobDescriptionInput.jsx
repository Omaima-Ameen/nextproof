
export default function JobDescriptionInput({
  jobDescription,
  onJobDescriptionChange,
  jobFile,
  onJobFileChange,
}) {
  return (
    <div className="mt-6">
      <label
        htmlFor="jobDescription"
        className="mb-3 block text-sm font-semibold"
      >
        Job description
      </label>

      <textarea
        id="jobDescription"
        rows={6}
        value={jobDescription}
        onChange={(event) => onJobDescriptionChange(event.target.value)}
        placeholder="Paste the job description here..."
        className="w-full resize-y rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <label
          htmlFor="jobFile"
          className="cursor-pointer text-sm font-medium text-violet-700 hover:text-violet-900"
        >
        
        </label>

        <input
          id="jobFile"
          type="file"
          accept=".txt,.pdf,.docx"
          className="sr-only"
          onChange={(event) =>
            onJobFileChange(event.target.files?.[0] || null)
          }
        />

        <span className="shrink-0 text-xs text-gray-400">
          {jobDescription.length} chars
        </span>
      </div>
    </div>
  );
}
