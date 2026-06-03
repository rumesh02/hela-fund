import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  BarChart3, Users, FileText, Banknote, TrendingUp,
  Download, RefreshCw, Award, Target, Activity,
  UserCheck, PieChart, Layers, CreditCard, Building2,
  CheckCircle, AlertCircle,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const pct = (n, total) => (total > 0 ? Math.round((n / total) * 100) : 0);

// ── Shared UI pieces ──────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-5">
    <div className={`p-4 rounded-xl ${color} flex-shrink-0`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const SectionHead = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="bg-purple-100 p-2.5 rounded-xl">
      <Icon className="w-5 h-5 text-purple-600" />
    </div>
    <div>
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  </div>
);

const HBar = ({ label, count, total, barColor, labelColor }) => {
  const p = pct(count, total);
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-sm font-semibold ${labelColor}`}>{label}</span>
        <span className="text-sm text-gray-500">
          <span className="font-bold text-gray-800">{(count || 0).toLocaleString()}</span>
          <span className="text-gray-400 ml-1">({p}%)</span>
        </span>
      </div>
      <div className="bg-gray-100 rounded-full h-3">
        <div
          className={`${barColor} h-3 rounded-full transition-all duration-700`}
          style={{ width: `${p}%` }}
        />
      </div>
    </div>
  );
};

// ── PDF generation ────────────────────────────────────────────────────────────

const buildPDF = (data) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const PURPLE     = [88, 28, 135];
  const PURPLE_LT  = [237, 233, 254];
  const DARK       = [30, 41, 59];
  const GRAY_LT    = [248, 246, 255];
  const w          = doc.internal.pageSize.getWidth();
  const m          = 15;
  const now        = new Date(data.generatedAt);

  // Header band
  doc.setFillColor(...PURPLE);
  doc.rect(0, 0, w, 44, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('HELA FUND', m, 17);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Analytics & Reports', m, 26);
  doc.setFontSize(8);
  doc.text(`Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, m, 35);
  doc.text('Authorized Admin Report — Confidential', w - m, 35, { align: 'right' });

  let y = 54;

  const addSection = (title) => {
    if (y > 255) { doc.addPage(); y = 15; }
    doc.setFillColor(...PURPLE_LT);
    doc.roundedRect(m, y - 5, w - m * 2, 10, 2, 2, 'F');
    doc.setTextColor(...PURPLE);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(title, m + 3, y + 2);
    doc.setTextColor(...DARK);
    y += 10;
  };

  const addTable = (head, body) => {
    autoTable(doc, {
      startY: y,
      margin: { left: m, right: m },
      head: [head],
      body,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3, textColor: DARK, lineColor: [220, 215, 240], lineWidth: 0.15 },
      headStyles: { fillColor: PURPLE, textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: GRAY_LT },
    });
    y = doc.lastAutoTable.finalY + 8;
  };

  // Platform overview
  addSection('Platform Overview');
  addTable(
    ['Metric', 'Value', 'Notes'],
    [
      ['Total Users',       data.users.total.toString(),                       `${data.users.requesters} requesters, ${data.users.supporters} supporters`],
      ['Verified Users',    `${data.users.verified} (${pct(data.users.verified, data.users.total)}%)`, 'Accounts approved by admin'],
      ['Total Requests',    data.requests.total.toString(),                    `${data.requests.active} active, ${data.requests.completed} completed`],
      ['Verified Requests', `${data.requests.verified} (${pct(data.requests.verified, data.requests.total)}%)`, 'Admin-verified requests'],
      ['Total Funds Raised',`Rs. ${data.microFunding.totalRaised.toLocaleString()}`, `of Rs. ${data.microFunding.totalGoal.toLocaleString()} goal`],
      ['Total Contributions', data.contributions.total.toString(),             `${data.contributions.completed} completed`],
      ['Total Page Views',  data.totalViews.toLocaleString(),                  'Across all requests'],
    ]
  );

  // User analytics
  addSection('User Analytics');
  addTable(
    ['Role / Status', 'Count', 'Percentage'],
    [
      ['Requesters',     data.users.requesters.toString(),  `${pct(data.users.requesters, data.users.total)}%`],
      ['Supporters',     data.users.supporters.toString(),  `${pct(data.users.supporters, data.users.total)}%`],
      ['Verified',       data.users.verified.toString(),    `${pct(data.users.verified,   data.users.total)}%`],
      ['Unverified',     data.users.unverified.toString(),  `${pct(data.users.unverified, data.users.total)}%`],
    ]
  );

  if (data.topUniversities.length > 0) {
    addSection('Top Universities (Requesters)');
    addTable(
      ['Rank', 'University', 'Students'],
      data.topUniversities.map((u, i) => [(i + 1).toString(), u.name, u.count.toString()])
    );
  }

  // Request analytics
  addSection('Request Analytics — Category & Status');
  addTable(
    ['Dimension', 'Value', 'Count', 'Percentage'],
    [
      ...Object.entries(data.categories).map(([cat, cnt]) => ['Category', cat, cnt.toString(), `${pct(cnt, data.requests.total)}%`]),
      ...['active','completed','draft','inactive','cancelled','expired'].filter(s => data.requests[s] > 0).map(s =>
        ['Status', s.charAt(0).toUpperCase() + s.slice(1), data.requests[s].toString(), `${pct(data.requests[s], data.requests.total)}%`]
      ),
      ...['High','Medium','Low'].filter(u => data.urgency[u]).map(u =>
        ['Urgency', u, (data.urgency[u] || 0).toString(), `${pct(data.urgency[u] || 0, data.requests.total)}%`]
      ),
    ]
  );

  // Micro-funding
  addSection('Micro-Funding Analytics');
  addTable(
    ['Metric', 'Value'],
    [
      ['Total Campaigns',        data.microFunding.total.toString()],
      ['Total Goal',             `Rs. ${data.microFunding.totalGoal.toLocaleString()}`],
      ['Total Raised',           `Rs. ${data.microFunding.totalRaised.toLocaleString()}`],
      ['Overall Funding Rate',   `${data.microFunding.fundingRate}%`],
      ['Fully Funded Campaigns', `${data.microFunding.fullyFunded} (${data.microFunding.successRate}% success rate)`],
    ]
  );

  if (data.topFunded.length > 0) {
    addSection('Top Funded Campaigns');
    addTable(
      ['Campaign', 'Raised (LKR)', 'Goal (LKR)', 'Progress'],
      data.topFunded.map(r => {
        const p = r.amount > 0 ? Math.round((r.currentAmount / r.amount) * 100) : 0;
        return [
          r.title.length > 40 ? r.title.slice(0, 38) + '…' : r.title,
          `Rs. ${(r.currentAmount || 0).toLocaleString()}`,
          `Rs. ${(r.amount || 0).toLocaleString()}`,
          `${p}%`,
        ];
      })
    );
  }

  // Contributions
  addSection('Contribution Analytics');
  addTable(
    ['Metric', 'Value'],
    [
      ['Total Contributions', data.contributions.total.toString()],
      ['Completed',  `${data.contributions.completed} (${pct(data.contributions.completed, data.contributions.total)}%)`],
      ['Pending',    `${data.contributions.pending}  (${pct(data.contributions.pending,  data.contributions.total)}%)`],
      ['Failed',     `${data.contributions.failed}   (${pct(data.contributions.failed,   data.contributions.total)}%)`],
      ['Refunded',   `${data.contributions.refunded} (${pct(data.contributions.refunded, data.contributions.total)}%)`],
      ['Avg. Contribution', `Rs. ${(data.contributions.avgAmount || 0).toLocaleString()}`],
    ]
  );

  if (Object.keys(data.paymentMethods).length > 0) {
    addSection('Payment Methods');
    addTable(
      ['Method', 'Count', 'Percentage'],
      Object.entries(data.paymentMethods).map(([method, cnt]) => [
        method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        cnt.toString(),
        `${pct(cnt, data.contributions.total)}%`,
      ])
    );
  }

  // Monthly trend
  addSection('Monthly Growth Trend (Last 6 Months)');
  addTable(
    ['Month', 'New Users', 'New Requests'],
    data.monthlyTrend.map(m => [m.label, m.users.toString(), m.requests.toString()])
  );

  // Page footers
  const pages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    const h = doc.internal.pageSize.getHeight();
    doc.text(`Hela Fund — Confidential`, m, h - 6);
    doc.text(`Page ${p} of ${pages}`, w - m, h - 6, { align: 'right' });
  }

  doc.save(`hela-fund-report-${now.toISOString().slice(0, 10)}.pdf`);
};

// ── Main component ────────────────────────────────────────────────────────────

const catConfig = {
  'Micro-Funding': { bar: 'bg-purple-500', text: 'text-purple-600' },
  'Lost Item':     { bar: 'bg-blue-500',   text: 'text-blue-600'   },
  'Community Help':{ bar: 'bg-teal-500',   text: 'text-teal-600'   },
};

const urgencyConfig = {
  High:   { bar: 'bg-rose-500',    text: 'text-rose-600'    },
  Medium: { bar: 'bg-amber-500',   text: 'text-amber-600'   },
  Low:    { bar: 'bg-emerald-500', text: 'text-emerald-600' },
};

const statusConfig = {
  active:    { bar: 'bg-emerald-500', text: 'text-emerald-600' },
  completed: { bar: 'bg-blue-500',    text: 'text-blue-600'    },
  draft:     { bar: 'bg-gray-400',    text: 'text-gray-600'    },
  inactive:  { bar: 'bg-amber-400',   text: 'text-amber-600'   },
  cancelled: { bar: 'bg-rose-400',    text: 'text-rose-600'    },
  expired:   { bar: 'bg-orange-400',  text: 'text-orange-600'  },
};

const methodConfig = {
  card:          { bar: 'bg-blue-500',    text: 'text-blue-700'    },
  bank_transfer: { bar: 'bg-emerald-500', text: 'text-emerald-700' },
  mobile_money:  { bar: 'bg-teal-500',    text: 'text-teal-700'    },
  crypto:        { bar: 'bg-amber-500',   text: 'text-amber-700'   },
  other:         { bar: 'bg-gray-400',    text: 'text-gray-700'    },
};

const Reports = () => {
  const { adminUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (adminUser?.token) fetchReports();
  }, [adminUser]);

  const fetchReports = async () => {
    setLoading(true);
    setError(false);
    try {
      const res  = await fetch(`${API_URL}/admin/reports`, {
        headers: { Authorization: `Bearer ${adminUser.token}` },
      });
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!data || generating) return;
    setGenerating(true);
    try { buildPDF(data); } finally { setGenerating(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Generating report data…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <p className="text-gray-700 font-medium mb-3">Failed to load report data.</p>
          <button
            onClick={fetchReports}
            className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { users, requests, categories, urgency, microFunding, contributions,
          paymentMethods, monthlyTrend, topFunded, topUniversities, totalViews } = data;

  const trendMax = Math.max(...monthlyTrend.map(m => Math.max(m.users, m.requests)), 1);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Page header ─────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              Analytics &amp; Reports
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Data snapshot as of {new Date(data.generatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchReports}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleDownload}
              disabled={generating}
              className="flex items-center gap-2 px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              {generating ? 'Generating…' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* ── Platform overview KPIs ───────────────────── */}
        <section>
          <SectionHead icon={Activity} title="Platform Overview" subtitle="Key metrics across the Hela Fund platform" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              icon={Users} label="Total Users" color="bg-blue-500"
              value={users.total}
              sub={`${users.requesters} requesters · ${users.supporters} supporters`}
            />
            <StatCard
              icon={FileText} label="Total Requests" color="bg-teal-500"
              value={requests.total}
              sub={`${requests.active} active · ${requests.completed} completed`}
            />
            <StatCard
              icon={Banknote} label="Funds Raised" color="bg-purple-500"
              value={`Rs. ${microFunding.totalRaised.toLocaleString()}`}
              sub={`of Rs. ${microFunding.totalGoal.toLocaleString()} goal`}
            />
            <StatCard
              icon={TrendingUp} label="Contributions" color="bg-emerald-500"
              value={contributions.total}
              sub={`${contributions.completed} completed`}
            />
          </div>
        </section>

        {/* ── User analytics + Request categories ─────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Users */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <SectionHead icon={Users} title="User Analytics" subtitle="Breakdown by role and verification status" />
            <div className="space-y-5">
              <HBar label="Requesters" count={users.requesters} total={users.total} barColor="bg-blue-500"    labelColor="text-blue-700"    />
              <HBar label="Supporters" count={users.supporters} total={users.total} barColor="bg-teal-500"    labelColor="text-teal-700"    />
              <div className="border-t border-gray-100 pt-5 space-y-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Verification</p>
                <HBar label="Verified"   count={users.verified}   total={users.total} barColor="bg-emerald-500" labelColor="text-emerald-700" />
                <HBar label="Unverified" count={users.unverified} total={users.total} barColor="bg-amber-400"   labelColor="text-amber-700"   />
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Verification Rate</p>
                  <p className="text-2xl font-bold text-emerald-700">{pct(users.verified, users.total)}%</p>
                </div>
                <div className="bg-emerald-100 rounded-full p-3">
                  <UserCheck className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <SectionHead icon={PieChart} title="Request Categories" subtitle="Distribution of request types" />
            <div className="space-y-5">
              {Object.entries(categories).map(([cat, cnt]) => {
                const c = catConfig[cat] || { bar: 'bg-gray-400', text: 'text-gray-600' };
                return <HBar key={cat} label={cat} count={cnt} total={requests.total} barColor={c.bar} labelColor={c.text} />;
              })}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-purple-700">{requests.verified}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Verified Requests</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-700">{requests.unverified}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Pending Review</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Status + Urgency ─────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <SectionHead icon={Layers} title="Request Status" subtitle="Breakdown by current status" />
            <div className="space-y-4">
              {Object.entries(statusConfig).filter(([key]) => requests[key] > 0).map(([key, c]) => (
                <HBar
                  key={key}
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                  count={requests[key]}
                  total={requests.total}
                  barColor={c.bar}
                  labelColor={c.text}
                />
              ))}
            </div>
          </div>

          {/* Urgency */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <SectionHead icon={AlertCircle} title="Request Urgency" subtitle="Distribution by urgency level" />
            <div className="space-y-4">
              {['High', 'Medium', 'Low'].map(u => {
                const c = urgencyConfig[u];
                return <HBar key={u} label={u} count={urgency[u] || 0} total={requests.total} barColor={c.bar} labelColor={c.text} />;
              })}
            </div>
            <div className="mt-6 bg-gray-50 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Page Views</p>
                <p className="text-2xl font-bold text-gray-800">{totalViews.toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-gray-300" />
            </div>
          </div>
        </div>

        {/* ── Micro-Funding analytics ──────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <SectionHead icon={Target} title="Micro-Funding Analytics" subtitle="Fundraising campaign performance" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Campaigns', value: microFunding.total,                        color: 'bg-purple-50', text: 'text-purple-700' },
              { label: 'Total Raised',    value: `Rs. ${microFunding.totalRaised.toLocaleString()}`, color: 'bg-emerald-50', text: 'text-emerald-700' },
              { label: 'Total Goal',      value: `Rs. ${microFunding.totalGoal.toLocaleString()}`,   color: 'bg-blue-50',    text: 'text-blue-700'    },
              { label: 'Fully Funded',    value: microFunding.fullyFunded,                  color: 'bg-amber-50',   text: 'text-amber-700'  },
            ].map(({ label, value, color, text }) => (
              <div key={label} className={`${color} rounded-xl p-5 text-center`}>
                <p className={`text-2xl font-bold ${text}`}>{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {/* Overall funding progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">Overall Funding Progress</span>
              <span className="text-sm font-bold text-purple-600">{microFunding.fundingRate}%</span>
            </div>
            <div className="bg-gray-100 rounded-full h-5">
              <div
                className="bg-gradient-to-r from-purple-500 to-purple-700 h-5 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                style={{ width: `${Math.min(microFunding.fundingRate, 100)}%` }}
              >
                {microFunding.fundingRate >= 10 && (
                  <span className="text-white text-xs font-bold">{microFunding.fundingRate}%</span>
                )}
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1.5">
              <span>Rs. 0</span>
              <span>Rs. {microFunding.totalGoal.toLocaleString()}</span>
            </div>
          </div>

          {/* Top funded table */}
          {topFunded.length > 0 && (
            <>
              <p className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Top Funded Campaigns
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Campaign</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Raised</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Goal</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-500 text-xs uppercase">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {topFunded.map((req) => {
                      const prog = req.amount > 0 ? Math.round((req.currentAmount / req.amount) * 100) : 0;
                      return (
                        <tr key={req._id} className="hover:bg-purple-50 transition-colors">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-gray-800 truncate max-w-xs">{req.title}</p>
                            <p className="text-xs text-gray-400">{req.requester?.university || '—'}</p>
                          </td>
                          <td className="px-4 py-3 text-right font-bold text-emerald-600">
                            Rs. {(req.currentAmount || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right text-gray-500">
                            Rs. {(req.amount || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`font-bold ${prog >= 100 ? 'text-emerald-600' : 'text-purple-600'}`}>
                              {prog}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {/* ── Monthly growth trend ─────────────────────── */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <SectionHead icon={TrendingUp} title="Monthly Growth Trend" subtitle="New users and requests over the last 6 months" />
          <div className="flex items-end gap-4 mt-2" style={{ height: '160px' }}>
            {monthlyTrend.map((m) => (
              <div key={m.key} className="flex-1 flex flex-col items-center gap-1 h-full">
                <div className="w-full flex gap-1 items-end flex-1">
                  <div
                    className="flex-1 bg-blue-400 rounded-t transition-all duration-700 min-h-[2px]"
                    style={{ height: `${trendMax > 0 ? (m.users / trendMax) * 100 : 0}%` }}
                    title={`New users: ${m.users}`}
                  />
                  <div
                    className="flex-1 bg-teal-400 rounded-t transition-all duration-700 min-h-[2px]"
                    style={{ height: `${trendMax > 0 ? (m.requests / trendMax) * 100 : 0}%` }}
                    title={`New requests: ${m.requests}`}
                  />
                </div>
                <p className="text-xs text-gray-500">{m.label}</p>
                <div className="flex gap-1">
                  <span className="text-xs text-blue-500 font-semibold">{m.users}</span>
                  <span className="text-xs text-gray-300">/</span>
                  <span className="text-xs text-teal-500 font-semibold">{m.requests}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-5 mt-5 justify-center">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-blue-400 rounded-sm" />
              <span className="text-xs text-gray-600 font-medium">New Users</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-teal-400 rounded-sm" />
              <span className="text-xs text-gray-600 font-medium">New Requests</span>
            </div>
          </div>
        </section>

        {/* ── Contributions + Universities ─────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Contributions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <SectionHead icon={CreditCard} title="Contribution Analytics" subtitle="Payment breakdown and status distribution" />

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-700">{contributions.completed}</p>
                <p className="text-xs text-gray-500 mt-0.5">Completed</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-700">{contributions.pending}</p>
                <p className="text-xs text-gray-500 mt-0.5">Pending</p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium">Avg. Contribution</p>
                <p className="text-2xl font-bold text-purple-700">
                  Rs. {(contributions.avgAmount || 0).toLocaleString()}
                </p>
              </div>
              <Banknote className="w-8 h-8 text-purple-300" />
            </div>

            {Object.keys(paymentMethods).length > 0 ? (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Payment Methods</p>
                <div className="space-y-3">
                  {Object.entries(paymentMethods).map(([method, cnt]) => {
                    const c = methodConfig[method] || { bar: 'bg-gray-400', text: 'text-gray-700' };
                    const label = method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    return (
                      <HBar key={method} label={label} count={cnt} total={contributions.total} barColor={c.bar} labelColor={c.text} />
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No contribution data yet.</p>
              </div>
            )}
          </div>

          {/* Top Universities */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <SectionHead icon={Building2} title="Top Universities" subtitle="Institutions with most registered requesters" />

            {topUniversities.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No university data available.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {topUniversities.map((u, i) => {
                  const rankColors = ['bg-amber-500', 'bg-gray-400', 'bg-orange-400'];
                  const rankBg = rankColors[i] || 'bg-purple-200';
                  const rankText = i < 3 ? 'text-white' : 'text-purple-700';
                  const relPct = topUniversities[0].count > 0
                    ? Math.round((u.count / topUniversities[0].count) * 100)
                    : 0;
                  return (
                    <div key={u.name} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${rankBg} ${rankText}`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{u.name}</p>
                        <div className="bg-gray-100 rounded-full h-1.5 mt-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full transition-all duration-700" style={{ width: `${relPct}%` }} />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-800">{u.count}</p>
                        <p className="text-xs text-gray-400">students</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xl font-bold text-gray-800">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-gray-400">Total Views</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{requests.verified}</p>
                <p className="text-xs text-gray-400">Verified Req.</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{microFunding.successRate}%</p>
                <p className="text-xs text-gray-400">Fund. Success</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          Hela Fund Analytics Report &mdash; Authorized personnel only
        </p>
      </div>
    </div>
  );
};

export default Reports;
