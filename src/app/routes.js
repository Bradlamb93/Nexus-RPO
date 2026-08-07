import { AgencyDocuments } from "../features/agencies/AgencyDocuments.jsx";
import { AgencyInvoices } from "../features/agencies/AgencyInvoices.jsx";
import { AgencyManagement } from "../features/agencies/AgencyManagement.jsx";
import { AgencyWorkers } from "../features/agencies/AgencyWorkers.jsx";
import { Analytics } from "../features/analytics/Analytics.jsx";
import { CareHomeGroupAnalytics } from "../features/analytics/CareHomeGroupAnalytics.jsx";
import { CustomReports } from "../features/analytics/CustomReports.jsx";
import { DemandForecast } from "../features/analytics/DemandForecast.jsx";
import { BankAvailability } from "../features/bank/BankAvailability.jsx";
import { BankAvailableShifts } from "../features/bank/BankAvailableShifts.jsx";
import { BankEarnings } from "../features/bank/BankEarnings.jsx";
import { BankMyShifts } from "../features/bank/BankMyShifts.jsx";
import { BankProfile } from "../features/bank/BankProfile.jsx";
import { ClientAdminLocations } from "../features/clients/ClientAdminLocations.jsx";
import { ClientsAndPricing } from "../features/clients/ClientsAndPricing.jsx";
import { AgencyRightToWork } from "../features/compliance/AgencyRightToWork.jsx";
import { CQCReadinessReport } from "../features/compliance/CQCReadinessReport.jsx";
import { CareHomeCompliance } from "../features/compliance/CareHomeCompliance.jsx";
import { ComplianceTracker } from "../features/compliance/ComplianceTracker.jsx";
import { DocumentVault } from "../features/compliance/DocumentVault.jsx";
import { ExpiryCalendar } from "../features/compliance/ExpiryCalendar.jsx";
import { RtwMonitoringReport } from "../features/compliance/RtwMonitoringReport.jsx";
import { AdminDashboard } from "../features/dashboards/AdminDashboard.jsx";
import { AgencyDashboard } from "../features/dashboards/AgencyDashboard.jsx";
import { BankDashboard } from "../features/dashboards/BankDashboard.jsx";
import { CareHomeDashboard } from "../features/dashboards/CareHomeDashboard.jsx";
import { ClientAdminDashboard } from "../features/dashboards/ClientAdminDashboard.jsx";
import { AdminBudgets } from "../features/finance/AdminBudgets.jsx";
import { CareHomeInvoices } from "../features/finance/CareHomeInvoices.jsx";
import { ClientAdminBudgets } from "../features/finance/ClientAdminBudgets.jsx";
import { CreditNoteManager } from "../features/finance/CreditNoteManager.jsx";
import { InvoiceManager } from "../features/finance/InvoiceManager.jsx";
import { BankRateCards } from "../features/rates/BankRateCards.jsx";
import { RateUpliftManager } from "../features/rates/RateUpliftManager.jsx";
import { AvailableShifts } from "../features/shifts/AvailableShifts.jsx";
import { CareHomeCalendar } from "../features/shifts/CareHomeCalendar.jsx";
import { CareHomeMyShifts } from "../features/shifts/CareHomeMyShifts.jsx";
import { ClientAdminShifts } from "../features/shifts/ClientAdminShifts.jsx";
import { RecurringShifts } from "../features/shifts/RecurringShifts.jsx";
import { RequestShift } from "../features/shifts/RequestShift.jsx";
import { Scheduler } from "../features/shifts/Scheduler.jsx";
import { ShiftBoard } from "../features/shifts/ShiftBoard.jsx";
import { AdminTimesheets } from "../features/timesheets/AdminTimesheets.jsx";
import { AgencyTimesheets } from "../features/timesheets/AgencyTimesheets.jsx";
import { CareHomeTimesheets } from "../features/timesheets/CareHomeTimesheets.jsx";
import { AgencyUsersAndPermissions } from "../features/users/AgencyUsersAndPermissions.jsx";
import { CareHomeUsersAndPermissions } from "../features/users/CareHomeUsersAndPermissions.jsx";
import { UsersAndPermissions } from "../features/users/UsersAndPermissions.jsx";
import { BankStaffManagement } from "../features/workers/BankStaffManagement.jsx";
import { CareHomeWorkers } from "../features/workers/CareHomeWorkers.jsx";
import { WorkerDirectory } from "../features/workers/WorkerDirectory.jsx";
import { WorkerOnboarding } from "../features/workers/WorkerOnboarding.jsx";
import { WorkerPreferences } from "../features/workers/WorkerPreferences.jsx";

export const VIEWS = {
  admin:       {
    dashboard:AdminDashboard,shifts:ShiftBoard,schedule:Scheduler,agencies:AgencyManagement,
    clients:ClientsAndPricing,bankstaff:BankStaffManagement,workers:WorkerDirectory,
    compliance:ComplianceTracker,expirycal:ExpiryCalendar,cqcreport:CQCReadinessReport,
    documents:DocumentVault,
    invoices:InvoiceManager,creditnotes:CreditNoteManager,timesheets:AdminTimesheets,
    budgets:AdminBudgets,analytics:Analytics,forecast:DemandForecast,reports:CustomReports,
    users:UsersAndPermissions,
  },
  clientadmin: {
    dashboard:ClientAdminDashboard,analytics:CareHomeGroupAnalytics,forecast:DemandForecast,
    locations:ClientAdminLocations,
    shifts:ClientAdminShifts,
    timesheets:CareHomeTimesheets,invoices:CareHomeInvoices,budgets:ClientAdminBudgets,bankrates:BankRateCards,compliance:CareHomeCompliance,
    expirycal:ExpiryCalendar,rtw:RtwMonitoringReport,cqcreport:CQCReadinessReport,
    reports:CustomReports,workers:CareHomeWorkers,
    users:CareHomeUsersAndPermissions,
  },
  carehome:    {
    dashboard:CareHomeDashboard,request:RequestShift,
    myshifts:CareHomeMyShifts,
    calendar:CareHomeCalendar,compliance:CareHomeCompliance,expirycal:ExpiryCalendar,
    rtw:RtwMonitoringReport,cqcreport:CQCReadinessReport,invoices:CareHomeInvoices,
    timesheets:CareHomeTimesheets,workers:CareHomeWorkers,
    recurring:RecurringShifts,workerprefs:WorkerPreferences,
  },
  agency:      {
    dashboard:AgencyDashboard,available:AvailableShifts,workers:AgencyWorkers,
    timesheets:AgencyTimesheets,onboard:WorkerOnboarding,rtw:AgencyRightToWork,
    rateuplifts:RateUpliftManager,documents:AgencyDocuments,invoices:AgencyInvoices,
    users:AgencyUsersAndPermissions,
  },
  bank:        {
    dashboard:BankDashboard,available:BankAvailableShifts,myshifts:BankMyShifts,
    availability:BankAvailability,earnings:BankEarnings,
    profile:BankProfile,
  },
};
