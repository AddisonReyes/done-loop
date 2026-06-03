import { fireEvent, render, screen } from "@testing-library/react";

import PrivacyPage from "./page";

describe("PrivacyPage", () => {
  it("renders privacy content and navigation", () => {
    render(<PrivacyPage />);

    expect(screen.getByRole("link", { name: "Back to Done Loop" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Last updated: June 2, 2026")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Privacy Policy" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Data collection" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Local app data" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Internet access" })).toBeInTheDocument();
    expect(screen.getByText(/does not collect, transmit, sell, or share personal data/i)).toBeInTheDocument();
    expect(screen.getByText(/does not operate a backend server for storing user app data/i)).toBeInTheDocument();
    expect(screen.getByText(/completion history, app settings, and customization preferences/i)).toBeInTheDocument();
    expect(screen.getByText(/not sent to the developer or to any server controlled by Done Loop/i)).toBeInTheDocument();
    expect(screen.getByText(/does not require an internet connection for its core/i)).toBeInTheDocument();
    expect(screen.getByText(/Google Play may process downloads, reviews, device information/i)).toBeInTheDocument();
    expect(screen.getByText(/https:\/\/done-loop\.com\/privacy/i)).toBeInTheDocument();
    expect(screen.getAllByText(/addison\.amin@gmail\.com/i)).toHaveLength(2);
    expect(screen.queryByText(/When the Android app is available/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Terms of Service" })).toHaveAttribute("href", "/terms");
  });

  it("switches privacy content to Spanish", () => {
    render(<PrivacyPage />);

    fireEvent.change(screen.getByLabelText("Language"), { target: { value: "es" } });

    expect(screen.getByRole("link", { name: "Volver a Done Loop" })).toHaveAttribute("href", "/");
    expect(screen.getByText("Última actualización: 2 de junio de 2026")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Política de Privacidad" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Recolección de datos" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Acceso a internet" })).toBeInTheDocument();
    expect(screen.getByText(/Google Play puede procesar descargas, reseñas, información del dispositivo/i)).toBeInTheDocument();
    expect(screen.getByText(/Done Loop no recolecta, transmite, vende ni comparte datos personales/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cuando la app de Android esté disponible/i)).not.toBeInTheDocument();
  });
});
