import React from "react";
import { AuthProvider } from "./AuthContext";
import { HotelProvider } from "./HotelContext";
import { SidebarProvider } from "./SidebarContext";
import { ReservationTypeProvider } from "./ReservationTypeContext";
import { InvoiceProvider } from "./InvoiceContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <AuthProvider>
      <HotelProvider>
        <InvoiceProvider>
          <ReservationTypeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ReservationTypeProvider>
        </InvoiceProvider>
      </HotelProvider>
    </AuthProvider>
  );
};
