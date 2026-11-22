/** Google Identity Services (the "Continue as …" button), as used by GoogleButton. */

export interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

export interface GoogleIdentityApi {
  initialize(config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    nonce: string;
    ux_mode: "popup";
    use_fedcm_for_button: boolean;
    button_auto_select: boolean;
    context?: "signin" | "signup" | "use";
  }): void;
  renderButton(
    parent: HTMLElement,
    options: {
      type: "standard";
      theme: "outline" | "filled_blue";
      size: "large";
      text: "signin_with" | "signup_with" | "continue_with";
      shape: "rectangular" | "pill";
      logo_alignment: "left" | "center";
      width: number;
    },
  ): void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdentityApi } };
  }
}

const hex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");

/** A random nonce for Supabase and its SHA-256 hash for Google, so the ID token can't be replayed. */
export async function createGoogleNonce() {
  const nonce = hex(crypto.getRandomValues(new Uint8Array(32)));
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(nonce));
  return { nonce, hashedNonce: hex(new Uint8Array(digest)) };
}
