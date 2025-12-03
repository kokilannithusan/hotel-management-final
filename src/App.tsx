import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProviders } from "./context";
import { useAuth } from "./hooks/useAuth";
import { Layout } from "./components/layout/Layout";
import { Login } from "./pages/auth/Login";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { Dashboard } from "./pages/dashboard/Dashboard";
import { RoomCalenderOverview } from "./pages/dashboard/RoomCalenderOverview";

// Reservations
import { ReserveRoom } from "./pages/reservations/ReserveRoom";
import { ReservationsHistory } from "./pages/reservations/History";

// Customers
import { ManageCustomer } from "./pages/customers/ManageCustomer";

// Invoicing
import { Bill } from "./pages/invoicing/Bill";
import { InvoiceList } from "./pages/invoicing/InvoiceList";
import { InvoiceView } from "./pages/invoicing/InvoiceView";
import { CreateInvoice } from "./pages/invoicing/CreateInvoice";
import { ReceiptsList } from "./pages/invoicing/ReceiptsList";
import { ViewReceipt } from "./pages/invoicing/ViewReceipt";
import { CreateReceipt } from "./pages/invoicing/CreateReceipt";
import { RefundsNew } from "./pages/invoicing/RefundsList";
import { ViewRefund } from "./pages/invoicing/ViewRefund";
import { CreateRefund } from "./pages/invoicing/CreateRefund";
import { CreditNotesList } from "./pages/invoicing/CreditNotesList";
import { ViewCreditNote } from "./pages/invoicing/ViewCreditNote";
import { CreateCreditNote } from "./pages/invoicing/CreateCreditNote";

// Rooms
import { RoomsOverview } from "./pages/rooms/Overview";
import { AllRooms } from "./pages/rooms/AllRooms";
import { ViewType } from "./pages/rooms/ViewType";
import { Amenities } from "./pages/rooms/Amenities";
import { RoomAreas } from "./pages/rooms/RoomAreas";
import { RoomTypes } from "./pages/rooms/RoomTypes";
import { MealPlan } from "./pages/rooms/MealPlan";

// Room Status
import { Housekeeping } from "./pages/houseKeeping/Housekeeping";
import { CleaningTaskList } from "./pages/houseKeeping/CleaningTaskList";

// Channels
import { ChannelsWrapper } from "./pages/channels/ChannelsWrapper";
import { ReservationTypeManager } from "./pages/channels/ReservationTypeManager";
import { Seasonal } from "./pages/channels/Seasonal";
import { ChannelPricingGrid } from "./pages/channels/ChannelPricingGrid";
import { SeasonalType } from "./pages/channels/SeasonalType";
import { StayTypes } from "./pages/rooms/StayTypes";

// Other
import { Tax } from "./pages/tax/Tax";
import { Policies } from "./pages/policies/Policies";
import { ChildPolicies } from "./pages/policies/ChildPolicies";
import { CancellationPolicies } from "./pages/policies/CancellationPolicies";
import { CurrencyRate } from "./pages/currency/CurrencyRate";
import { HotelSettings } from "./pages/settings/HotelSettings";
import { RoleSettings } from "./pages/settings/RoleSettings";
import { HotelPrivilegesSettings } from "./pages/settings/HotelPrivilegesSettings";
import { HotelRolePrivilegesSettings } from "./pages/settings/HotelRolePrivilegesSettings";
import { UserPrivilegesSettings } from "./pages/settings/UserPrivilegesSettings";
import { UserSettings } from "./pages/settings/UserSettings";
import { EmailConfigSettings } from "./pages/settings/EmailConfigSettings";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { isAuthenticated, isLoading } = useAuth();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
    return (
        <AppProviders>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route
                        path="/*"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Routes>
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        <Route
                                            path="/dashboard/room-calendar"
                                            element={<RoomCalenderOverview />}
                                        />
                                        <Route
                                            path="/reservations/reserve"
                                            element={<ReserveRoom />}
                                        />
                                        <Route
                                            path="/reservations/history"
                                            element={<ReservationsHistory />}
                                        />
                                        <Route path="/customers" element={<ManageCustomer />} />
                                        <Route
                                            path="/invoicing/invoices"
                                            element={<InvoiceList />}
                                        />
                                        <Route
                                            path="/invoicing/invoices/create"
                                            element={<CreateInvoice />}
                                        />
                                        <Route
                                            path="/invoicing/invoices/:id"
                                            element={<InvoiceView />}
                                        />
                                        <Route
                                            path="/invoicing/receipts"
                                            element={<ReceiptsList />}
                                        />
                                        <Route
                                            path="/invoicing/receipts/create"
                                            element={<CreateReceipt />}
                                        />
                                        <Route
                                            path="/invoicing/receipts/:id"
                                            element={<ViewReceipt />}
                                        />
                                        <Route path="/invoicing/refunds" element={<RefundsNew />} />
                                        <Route
                                            path="/invoicing/refunds/create"
                                            element={<CreateRefund />}
                                        />
                                        <Route
                                            path="/invoicing/refunds/:id"
                                            element={<ViewRefund />}
                                        />
                                        <Route
                                            path="/invoicing/credit-notes"
                                            element={<CreditNotesList />}
                                        />
                                        <Route
                                            path="/invoicing/credit-notes/create"
                                            element={<CreateCreditNote />}
                                        />
                                        <Route
                                            path="/invoicing/credit-notes/:id"
                                            element={<ViewCreditNote />}
                                        />
                                        <Route path="/invoicing/bill" element={<Bill />} />
                                        <Route path="/rooms/overview" element={<RoomsOverview />} />
                                        <Route path="/rooms/all" element={<AllRooms />} />
                                        <Route path="/rooms/view-type" element={<ViewType />} />
                                        <Route path="/rooms/amenities" element={<Amenities />} />
                                        <Route path="/rooms/areas" element={<RoomAreas />} />
                                        <Route path="/rooms/types" element={<RoomTypes />} />
                                        <Route path="/rooms/stay-types" element={<StayTypes />} />
                                        <Route path="/rooms/meal-plan" element={<MealPlan />} />
                                        <Route
                                            path="/housekeeping/manager"
                                            element={<Housekeeping key="manager" mode="manager" />}
                                        />
                                        <Route
                                            path="/housekeeping/housekeeper"
                                            element={
                                                <Housekeeping key="housekeeper" mode="housekeeper" />
                                            }
                                        />
                                        <Route
                                            path="/housekeeping/cleaning-task-list"
                                            element={<CleaningTaskList />}
                                        />
                                        <Route
                                            path="/housekeeping"
                                            element={<Navigate to="/housekeeping/manager" replace />}
                                        />
                                        {/* Legacy route for backward compatibility */}
                                        <Route
                                            path="/room-status"
                                            element={<Housekeeping key="legacy" mode="housekeeper" />}
                                        />
                                        <Route
                                            path="/channels/channels"
                                            element={<ChannelsWrapper />}
                                        />
                                        <Route
                                            path="/channels/registration"
                                            element={<ReservationTypeManager />}
                                        />
                                        <Route path="/channels/seasonal" element={<Seasonal />} />
                                        <Route
                                            path="/channels/seasonal-type"
                                            element={<SeasonalType />}
                                        />
                                        <Route path="/channels/stay-type" element={<StayTypes />} />
                                        <Route
                                            path="/channels/price-grid"
                                            element={<ChannelPricingGrid />}
                                        />
                                        <Route path="/tax" element={<Tax />} />
                                        <Route path="/policies" element={<Policies />} />
                                        <Route path="/policies/child" element={<ChildPolicies />} />
                                        <Route
                                            path="/policies/cancellation"
                                            element={<CancellationPolicies />}
                                        />
                                        <Route path="/currency" element={<CurrencyRate />} />
                                        {/* Settings Routes */}
                                        <Route path="/settings/hotels" element={<HotelSettings />} />
                                        <Route path="/settings/roles" element={<RoleSettings />} />
                                        <Route
                                            path="/settings/hotel-privileges"
                                            element={<HotelPrivilegesSettings />}
                                        />
                                        <Route
                                            path="/settings/hotel-role-privileges"
                                            element={<HotelRolePrivilegesSettings />}
                                        />
                                        <Route
                                            path="/settings/user-privileges"
                                            element={<UserPrivilegesSettings />}
                                        />
                                        <Route path="/settings/users" element={<UserSettings />} />
                                        <Route
                                            path="/settings/email-config"
                                            element={<EmailConfigSettings />}
                                        />
                                        <Route
                                            path="/settings"
                                            element={<Navigate to="/settings/hotels" replace />}
                                        />
                                        <Route
                                            path="/"
                                            element={<Navigate to="/login" replace />}
                                        />
                                    </Routes>
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AppProviders>
    );
}

export default App;
