import React, { useState, useMemo } from 'react';
import { usePartsInventory } from '../../context/PartsInventoryContext';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  Search,
  Bike,
  Wrench,
  Package,
  Layers,
  ShieldAlert,
  ArrowDownRight,
  ArrowUpRight,
  SlidersHorizontal,
  Clock,
  User,
  CheckCircle2,
} from 'lucide-react';

export type ReportType =
  | 'parts_used'
  | 'bike_wise'
  | 'date_wise'
  | 'mechanic_wise'
  | 'stock_movement'
  | 'low_stock'
  | 'audit_report';

export const ReportsViewer: React.FC = () => {
  const { parts, installations, stockMovements, auditLogs, exportToCsv } = usePartsInventory();

  const [activeReport, setActiveReport] = useState<ReportType>('parts_used');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filterQuery, setFilterQuery] = useState<string>('');

  // 1. Parts Used Report
  const partsUsedData = useMemo(() => {
    let filtered = [...installations];
    if (startDate) filtered = filtered.filter((i) => i.installationDate >= startDate);
    if (endDate) filtered = filtered.filter((i) => i.installationDate <= endDate);
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.partName.toLowerCase().includes(q) ||
          i.partNumber.toLowerCase().includes(q) ||
          i.bikeModel.toLowerCase().includes(q)
      );
    }

    const summaryMap: Record<string, { partName: string; partNumber: string; count: number; totalQty: number; bikesCount: Set<string> }> = {};
    filtered.forEach((inst) => {
      const key = inst.partNumber;
      if (!summaryMap[key]) {
        summaryMap[key] = {
          partName: inst.partName,
          partNumber: inst.partNumber,
          count: 0,
          totalQty: 0,
          bikesCount: new Set(),
        };
      }
      summaryMap[key].count += 1;
      summaryMap[key].totalQty += (inst.quantity || 1);
      summaryMap[key].bikesCount.add(inst.registrationNumber);
    });

    return Object.values(summaryMap).sort((a, b) => b.totalQty - a.totalQty);
  }, [installations, startDate, endDate, filterQuery]);

  // 2. Bike-Wise Report
  const bikeWiseData = useMemo(() => {
    let filtered = [...installations];
    if (startDate) filtered = filtered.filter((i) => i.installationDate >= startDate);
    if (endDate) filtered = filtered.filter((i) => i.installationDate <= endDate);
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase().replace(/\s+/g, '');
      filtered = filtered.filter(
        (i) =>
          i.registrationNumber.toLowerCase().replace(/\s+/g, '').includes(q) ||
          (i.chassisNumber && i.chassisNumber.toLowerCase().includes(q)) ||
          (i.engineNumber && i.engineNumber.toLowerCase().includes(q)) ||
          i.customerName.toLowerCase().includes(q) ||
          i.customerMobile.includes(q)
      );
    }

    const bikeMap: Record<string, {
      regNo: string;
      bikeModel: string;
      customerName: string;
      customerMobile: string;
      totalPartsInstalled: number;
      distinctPartsCount: number;
      lastServiceDate: string;
      jobCards: Set<string>;
    }> = {};

    filtered.forEach((i) => {
      const reg = i.registrationNumber;
      if (!bikeMap[reg]) {
        bikeMap[reg] = {
          regNo: reg,
          bikeModel: i.bikeModel,
          customerName: i.customerName,
          customerMobile: i.customerMobile,
          totalPartsInstalled: 0,
          distinctPartsCount: 0,
          lastServiceDate: i.installationDate,
          jobCards: new Set(),
        };
      }
      bikeMap[reg].totalPartsInstalled += (i.quantity || 1);
      bikeMap[reg].jobCards.add(i.jobCardNumber);
      if (i.installationDate > bikeMap[reg].lastServiceDate) {
        bikeMap[reg].lastServiceDate = i.installationDate;
      }
    });

    return Object.values(bikeMap).sort((a, b) => b.totalPartsInstalled - a.totalPartsInstalled);
  }, [installations, startDate, endDate, filterQuery]);

  // 3. Date-Wise Installations Report
  const dateWiseData = useMemo(() => {
    let filtered = [...installations];
    if (startDate) filtered = filtered.filter((i) => i.installationDate >= startDate);
    if (endDate) filtered = filtered.filter((i) => i.installationDate <= endDate);
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.partName.toLowerCase().includes(q) ||
          i.registrationNumber.toLowerCase().includes(q) ||
          i.mechanicName.toLowerCase().includes(q)
      );
    }

    const dateMap: Record<string, { date: string; totalInstalls: number; totalQuantity: number; uniqueBikes: Set<string> }> = {};
    filtered.forEach((i) => {
      const d = i.installationDate;
      if (!dateMap[d]) {
        dateMap[d] = { date: d, totalInstalls: 0, totalQuantity: 0, uniqueBikes: new Set() };
      }
      dateMap[d].totalInstalls += 1;
      dateMap[d].totalQuantity += (i.quantity || 1);
      dateMap[d].uniqueBikes.add(i.registrationNumber);
    });

    return Object.values(dateMap).sort((a, b) => b.date.localeCompare(a.date));
  }, [installations, startDate, endDate, filterQuery]);

  // 4. Mechanic-Wise Report
  const mechanicWiseData = useMemo(() => {
    let filtered = [...installations];
    if (startDate) filtered = filtered.filter((i) => i.installationDate >= startDate);
    if (endDate) filtered = filtered.filter((i) => i.installationDate <= endDate);
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      filtered = filtered.filter((i) => i.mechanicName.toLowerCase().includes(q));
    }

    const mechMap: Record<string, { mechanicName: string; totalJobs: number; partsInstalledQty: number; uniqueBikes: Set<string> }> = {};
    filtered.forEach((i) => {
      const m = i.mechanicName || 'Unassigned';
      if (!mechMap[m]) {
        mechMap[m] = { mechanicName: m, totalJobs: 0, partsInstalledQty: 0, uniqueBikes: new Set() };
      }
      mechMap[m].totalJobs += 1;
      mechMap[m].partsInstalledQty += (i.quantity || 1);
      mechMap[m].uniqueBikes.add(i.registrationNumber);
    });

    return Object.values(mechMap).sort((a, b) => b.partsInstalledQty - a.partsInstalledQty);
  }, [installations, startDate, endDate, filterQuery]);

  // 5. Stock Movement Ledger Report
  const stockMovementData = useMemo(() => {
    let filtered = [...stockMovements];
    if (startDate) filtered = filtered.filter((m) => m.createdAt >= startDate);
    if (endDate) filtered = filtered.filter((m) => m.createdAt <= `${endDate}T23:59:59`);
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.partName.toLowerCase().includes(q) ||
          m.partNumber.toLowerCase().includes(q) ||
          m.movementType.toLowerCase().includes(q) ||
          (m.bikeRegistration && m.bikeRegistration.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [stockMovements, startDate, endDate, filterQuery]);

  // 6. Low Stock Report
  const lowStockData = useMemo(() => {
    let filtered = parts.filter((p) => !p.isArchived && p.currentStock <= p.minStockLevel);
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.partName.toLowerCase().includes(q) ||
          p.partNumber.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => a.currentStock - b.currentStock);
  }, [parts, filterQuery]);

  // 7. Audit Report
  const auditReportData = useMemo(() => {
    let filtered = [...auditLogs];
    if (startDate) filtered = filtered.filter((l) => l.timestamp >= startDate);
    if (endDate) filtered = filtered.filter((l) => l.timestamp <= `${endDate}T23:59:59`);
    if (filterQuery.trim()) {
      const q = filterQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q) ||
          l.username.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [auditLogs, startDate, endDate, filterQuery]);

  // Export CSV Handler
  const handleExportCsv = () => {
    const today = new Date().toISOString().split('T')[0];
    switch (activeReport) {
      case 'parts_used': {
        const rows = partsUsedData.map((d) => ({
          'Part Number': d.partNumber,
          'Part Name': d.partName,
          'Total Quantity Used': d.totalQty,
          'Number of Installations': d.count,
          'Bikes Serviced Count': d.bikesCount.size,
        }));
        exportToCsv(rows, `Parts_Used_Report_${today}`);
        break;
      }
      case 'bike_wise': {
        const rows = bikeWiseData.map((b) => ({
          'Registration Number': b.regNo,
          'Bike Model': b.bikeModel,
          'Customer Name': b.customerName,
          'Customer Mobile': b.customerMobile,
          'Total Parts Installed': b.totalPartsInstalled,
          'Job Cards Count': b.jobCards.size,
          'Last Service Date': b.lastServiceDate,
        }));
        exportToCsv(rows, `Bike_Wise_Parts_Report_${today}`);
        break;
      }
      case 'date_wise': {
        const rows = dateWiseData.map((d) => ({
          'Date': d.date,
          'Total Installations': d.totalInstalls,
          'Total Parts Quantity': d.totalQuantity,
          'Unique Bikes Serviced': d.uniqueBikes.size,
        }));
        exportToCsv(rows, `Date_Wise_Installations_Report_${today}`);
        break;
      }
      case 'mechanic_wise': {
        const rows = mechanicWiseData.map((m) => ({
          'Mechanic Name': m.mechanicName,
          'Jobs Completed': m.totalJobs,
          'Total Parts Quantity Installed': m.partsInstalledQty,
          'Bikes Handled': m.uniqueBikes.size,
        }));
        exportToCsv(rows, `Mechanic_Wise_Parts_Report_${today}`);
        break;
      }
      case 'stock_movement': {
        const rows = stockMovementData.map((m) => ({
          'Date/Time': m.createdAt,
          'Part Number': m.partNumber,
          'Part Name': m.partName,
          'Movement Type': m.movementType,
          'Quantity Change': m.quantityChange,
          'Previous Stock': m.previousStock,
          'New Stock': m.newStock,
          'Bike Reg': m.bikeRegistration || '--',
          'Job Card': m.jobCardNumber || '--',
          'Mechanic': m.mechanicName || '--',
          'Reason': m.reason,
          'Performed By': m.performedByName,
        }));
        exportToCsv(rows, `Stock_Movement_Ledger_${today}`);
        break;
      }
      case 'low_stock': {
        const rows = lowStockData.map((p) => ({
          'Part Number': p.partNumber,
          'Part Name': p.partName,
          'Category': p.category,
          'Current Stock': p.currentStock,
          'Minimum Level': p.minStockLevel,
          'Deficit': Math.max(0, p.minStockLevel - p.currentStock),
          'Shelf Location': p.shelfNumber || p.rackNumber || '--',
          'Supplier': p.supplier || '--',
        }));
        exportToCsv(rows, `Low_Stock_Warning_Report_${today}`);
        break;
      }
      case 'audit_report': {
        const rows = auditReportData.map((a) => ({
          'Timestamp': a.timestamp,
          'Action': a.action,
          'User': a.username,
          'Role': a.userRole,
          'Details': a.details,
          'IP Address': a.ip || '--',
        }));
        exportToCsv(rows, `Security_Audit_Report_${today}`);
        break;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Report Selector */}
      <div className="p-5 bg-[#141414] border border-white/10 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
              Dealership Inventory & Anti-Theft Reports
            </h3>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Audit-safe reports with customizable date ranges and 1-click CSV export
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Current Report (CSV)</span>
        </button>
      </div>

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        <button
          onClick={() => setActiveReport('parts_used')}
          className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeReport === 'parts_used'
              ? 'bg-[#D6181F] border-[#D6181F] text-white shadow-md'
              : 'bg-[#181818] border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Parts Used</span>
        </button>

        <button
          onClick={() => setActiveReport('bike_wise')}
          className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeReport === 'bike_wise'
              ? 'bg-[#D6181F] border-[#D6181F] text-white shadow-md'
              : 'bg-[#181818] border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bike className="w-4 h-4" />
          <span>Bike-Wise</span>
        </button>

        <button
          onClick={() => setActiveReport('date_wise')}
          className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeReport === 'date_wise'
              ? 'bg-[#D6181F] border-[#D6181F] text-white shadow-md'
              : 'bg-[#181818] border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Date-Wise</span>
        </button>

        <button
          onClick={() => setActiveReport('mechanic_wise')}
          className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeReport === 'mechanic_wise'
              ? 'bg-[#D6181F] border-[#D6181F] text-white shadow-md'
              : 'bg-[#181818] border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Mechanic-Wise</span>
        </button>

        <button
          onClick={() => setActiveReport('stock_movement')}
          className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeReport === 'stock_movement'
              ? 'bg-[#D6181F] border-[#D6181F] text-white shadow-md'
              : 'bg-[#181818] border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Movements</span>
        </button>

        <button
          onClick={() => setActiveReport('low_stock')}
          className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeReport === 'low_stock'
              ? 'bg-[#D6181F] border-[#D6181F] text-white shadow-md'
              : 'bg-[#181818] border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ArrowDownRight className="w-4 h-4 text-amber-400" />
          <span>Low Stock</span>
        </button>

        <button
          onClick={() => setActiveReport('audit_report')}
          className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            activeReport === 'audit_report'
              ? 'bg-[#D6181F] border-[#D6181F] text-white shadow-md'
              : 'bg-[#181818] border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span>Audit Log</span>
        </button>
      </div>

      {/* Date Range & Global Search Filter */}
      <div className="p-4 bg-[#181818] border border-white/10 rounded-2xl flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="font-bold uppercase tracking-wider">Date Range:</span>
        </div>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-[#141414] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
          placeholder="Start Date"
        />

        <span className="text-gray-500 text-xs">to</span>

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-[#141414] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
          placeholder="End Date"
        />

        {(startDate || endDate) && (
          <button
            onClick={() => {
              setStartDate('');
              setEndDate('');
            }}
            className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
          >
            Clear Dates
          </button>
        )}

        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search report by part, bike, job card, mechanic..."
            className="w-full bg-[#141414] border border-white/15 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#D6181F]"
          />
        </div>
      </div>

      {/* Table Data View */}
      <div className="bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        {/* REPORT 1: PARTS USED */}
        {activeReport === 'parts_used' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Part Number</th>
                  <th className="py-3 px-4">Part Name</th>
                  <th className="py-3 px-4 text-center">Total Quantity Used</th>
                  <th className="py-3 px-4 text-center">Installation Count</th>
                  <th className="py-3 px-4 text-center">Bikes Serviced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {partsUsedData.map((d) => (
                  <tr key={d.partNumber} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono font-bold text-white">{d.partNumber}</td>
                    <td className="py-3 px-4 text-gray-200">{d.partName}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-blue-400">{d.totalQty}</td>
                    <td className="py-3 px-4 text-center font-mono text-gray-300">{d.count}</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400">{d.bikesCount.size}</td>
                  </tr>
                ))}
                {partsUsedData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No part installations found matching current criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 2: BIKE-WISE */}
        {activeReport === 'bike_wise' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Registration No</th>
                  <th className="py-3 px-4">Bike Model</th>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4 text-center">Total Parts Used</th>
                  <th className="py-3 px-4 text-center">Job Cards</th>
                  <th className="py-3 px-4">Last Service Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bikeWiseData.map((b) => (
                  <tr key={b.regNo} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono font-bold text-white bg-white/5 px-2 py-0.5 rounded">
                      {b.regNo}
                    </td>
                    <td className="py-3 px-4 text-gray-200">{b.bikeModel}</td>
                    <td className="py-3 px-4 text-gray-300">{b.customerName}</td>
                    <td className="py-3 px-4 font-mono text-gray-400">{b.customerMobile}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-blue-400">{b.totalPartsInstalled}</td>
                    <td className="py-3 px-4 text-center font-mono text-amber-400">{b.jobCards.size}</td>
                    <td className="py-3 px-4 font-mono text-gray-400">{b.lastServiceDate}</td>
                  </tr>
                ))}
                {bikeWiseData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      No bike records found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 3: DATE-WISE */}
        {activeReport === 'date_wise' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Service Date</th>
                  <th className="py-3 px-4 text-center">Total Installations</th>
                  <th className="py-3 px-4 text-center">Total Parts Dispensed</th>
                  <th className="py-3 px-4 text-center">Unique Bikes Serviced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dateWiseData.map((d) => (
                  <tr key={d.date} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono font-bold text-white">{d.date}</td>
                    <td className="py-3 px-4 text-center font-mono text-gray-300">{d.totalInstalls}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-blue-400">{d.totalQuantity}</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400">{d.uniqueBikes.size}</td>
                  </tr>
                ))}
                {dateWiseData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No date records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 4: MECHANIC-WISE */}
        {activeReport === 'mechanic_wise' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Technician / Mechanic</th>
                  <th className="py-3 px-4 text-center">Total Jobs Handled</th>
                  <th className="py-3 px-4 text-center">Total Parts Installed</th>
                  <th className="py-3 px-4 text-center">Unique Bikes Handled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mechanicWiseData.map((m) => (
                  <tr key={m.mechanicName} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <Wrench className="w-3.5 h-3.5 text-[#D6181F]" />
                      <span>{m.mechanicName}</span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-gray-300">{m.totalJobs}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-blue-400">{m.partsInstalledQty}</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400">{m.uniqueBikes.size}</td>
                  </tr>
                ))}
                {mechanicWiseData.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">
                      No mechanic installations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 5: STOCK MOVEMENT */}
        {activeReport === 'stock_movement' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Date / Time</th>
                  <th className="py-3 px-4">Part</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-center">Change</th>
                  <th className="py-3 px-4">Prev → New</th>
                  <th className="py-3 px-4">Bike / Job</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stockMovementData.map((m) => (
                  <tr key={m.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-400">
                      {m.createdAt.slice(0, 10)} {m.createdAt.slice(11, 16)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-white">{m.partNumber}</div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[140px]">{m.partName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-gray-200 border border-white/10">
                        {m.movementType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      {m.quantityChange > 0 ? (
                        <span className="text-emerald-400">+{m.quantityChange}</span>
                      ) : (
                        <span className="text-[#D6181F]">{m.quantityChange}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-400 text-[11px]">
                      {m.previousStock} → <span className="text-white font-bold">{m.newStock}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-300 text-[11px]">
                      {m.bikeRegistration || '--'}
                      {m.jobCardNumber && <div className="text-[10px] text-amber-400">{m.jobCardNumber}</div>}
                    </td>
                    <td className="py-3 px-4 text-gray-300 max-w-xs truncate text-[11px]">
                      {m.reason}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-[11px]">
                      {m.performedByName}
                    </td>
                  </tr>
                ))}
                {stockMovementData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No stock movement records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 6: LOW STOCK */}
        {activeReport === 'low_stock' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Part Number</th>
                  <th className="py-3 px-4">Part Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Current Stock</th>
                  <th className="py-3 px-4 text-center">Min Threshold</th>
                  <th className="py-3 px-4 text-center">Deficit</th>
                  <th className="py-3 px-4">Rack & Shelf</th>
                  <th className="py-3 px-4">Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {lowStockData.map((p) => {
                  const deficit = Math.max(0, p.minStockLevel - p.currentStock);
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-mono font-bold text-white">{p.partNumber}</td>
                      <td className="py-3 px-4 text-gray-200">{p.partName}</td>
                      <td className="py-3 px-4 text-gray-400">{p.category}</td>
                      <td className="py-3 px-4 text-center font-mono font-black text-amber-400">
                        {p.currentStock} {p.unit}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-gray-300">
                        {p.minStockLevel} {p.unit}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-red-400">
                        -{deficit}
                      </td>
                      <td className="py-3 px-4 text-gray-300 font-mono text-[11px]">
                        {p.rackNumber} / {p.shelfNumber}
                      </td>
                      <td className="py-3 px-4 text-gray-400 truncate max-w-xs">{p.supplier || '--'}</td>
                    </tr>
                  );
                })}
                {lowStockData.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-emerald-400">
                      ✓ All parts are currently healthy and above minimum safety thresholds!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* REPORT 7: AUDIT REPORT */}
        {activeReport === 'audit_report' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] text-gray-400 uppercase text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Details & Audit Trail</th>
                  <th className="py-3 px-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {auditReportData.map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 font-mono text-gray-400 text-[11px] whitespace-nowrap">
                      {l.timestamp ? new Date(l.timestamp).toLocaleString() : '--'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-gray-200 border border-white/10">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">{l.username}</td>
                    <td className="py-3 px-4 font-mono text-gray-400 text-[11px]">{l.userRole}</td>
                    <td className="py-3 px-4 text-gray-300 max-w-md truncate">{l.details}</td>
                    <td className="py-3 px-4 font-mono text-gray-500 text-right">{l.ip || '--'}</td>
                  </tr>
                ))}
                {auditReportData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No audit records found matching criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
