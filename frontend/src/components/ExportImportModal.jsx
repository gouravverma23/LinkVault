import { useState } from 'react';
import { Download, Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import { bookmarkService } from '../services/bookmarkService';
import Modal from './Modal';
import toast from 'react-hot-toast';

const ExportImportModal = ({ isOpen, onClose }) => {
  const [importing, setImporting] = useState(false);

  const handleExportJSON = async () => {
    try {
      const data = await bookmarkService.exportBookmarks('json');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bookmarks.json';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Bookmarks exported as JSON!');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleExportCSV = async () => {
    try {
      const data = await bookmarkService.exportBookmarks('csv');
      const blob = new Blob([data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bookmarks.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Bookmarks exported as CSV!');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const text = await file.text();
      const bookmarks = JSON.parse(text);
      const arr = Array.isArray(bookmarks) ? bookmarks : [bookmarks];
      const result = await bookmarkService.importBookmarks(arr);
      toast.success(result.message);
      onClose();
    } catch {
      toast.error('Import failed. Please check the JSON format.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export & Import">
      <div className="space-y-6">
        {/* Export */}
        <div>
          <h4 className="text-sm font-semibold text-dark-700 dark:text-dark-200 mb-3 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Bookmarks
          </h4>
          <div className="flex gap-3">
            <button onClick={handleExportJSON} className="btn-secondary text-sm flex items-center gap-2 flex-1">
              <FileJson className="w-4 h-4" /> JSON
            </button>
            <button onClick={handleExportCSV} className="btn-secondary text-sm flex items-center gap-2 flex-1">
              <FileSpreadsheet className="w-4 h-4" /> CSV
            </button>
          </div>
        </div>

        <hr className="border-dark-100 dark:border-dark-700" />

        {/* Import */}
        <div>
          <h4 className="text-sm font-semibold text-dark-700 dark:text-dark-200 mb-3 flex items-center gap-2">
            <Upload className="w-4 h-4" /> Import Bookmarks
          </h4>
          <p className="text-xs text-dark-400 dark:text-dark-500 mb-3">
            Upload a JSON file containing an array of bookmarks. Each bookmark should have at least a <code className="text-primary-500">url</code> field.
          </p>
          <label className="btn-secondary text-sm cursor-pointer inline-flex items-center gap-2">
            <Upload className="w-4 h-4" />
            {importing ? 'Importing...' : 'Choose JSON File'}
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              disabled={importing}
            />
          </label>
        </div>
      </div>
    </Modal>
  );
};

export default ExportImportModal;
