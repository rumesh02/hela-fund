import { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, X, ChevronDown } from 'lucide-react';
import { exportToExcel, exportToPDF } from '../../utils/exportUsers';

const UserDownloadButton = ({ users }) => {
  const [open, setOpen] = useState(false);
  const [exporting, setExporting] = useState(null); // 'excel' | 'pdf'
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handle = async (type) => {
    setExporting(type);
    setOpen(false);
    await new Promise((r) => setTimeout(r, 50)); // let the UI update
    try {
      if (type === 'excel') exportToExcel(users);
      else exportToPDF(users);
    } catch (e) {
      alert('Export failed: ' + e.message);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={!!exporting || users.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 font-medium text-sm"
      >
        {exporting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Exporting…
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Export as</p>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => handle('excel')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">Excel (.xlsx)</p>
              <p className="text-xs text-gray-400">Spreadsheet format</p>
            </div>
          </button>

          <button
            onClick={() => handle('pdf')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors group border-t border-gray-50"
          >
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <FileText className="w-4 h-4 text-red-700" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-800">PDF Report</p>
              <p className="text-xs text-gray-400">Formatted report with stats</p>
            </div>
          </button>

          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">{users.length} user{users.length !== 1 ? 's' : ''} will be exported</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDownloadButton;
