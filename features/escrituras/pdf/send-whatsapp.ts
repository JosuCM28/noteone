"use server";

import { generatePDFBase64, type TipoPDF } from "./generate-pdf";

export type SendWhatsAppResult =
  | { success: true }
  | { success: false; error: string };

/**
 * Normaliza un número telefónico al formato que requiere apiEvolution:
 * solo dígitos, con código de país. Ej: "521234567890"
 * Si ya tiene 10 dígitos (México sin código) le agrega "52".
 */
function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `52${digits}`;
  return digits;
}

export async function sendReciboWhatsApp(
  deedId: string,
  tipo: TipoPDF,
  phone: string,
  recipientName: string,
  folio: string,
  role: string = "Cliente"
): Promise<SendWhatsAppResult> {
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE;

  if (!apiUrl || !apiKey || !instance) {
    return {
      success: false,
      error:
        "Las variables de entorno de apiEvolution no están configuradas (EVOLUTION_API_URL, EVOLUTION_API_KEY, EVOLUTION_INSTANCE).",
    };
  }

  let base64: string;
  try {
    base64 = await generatePDFBase64(deedId, tipo);
  } catch (err) {
    return {
      success: false,
      error: `Error al generar el PDF: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  const normalizedPhone = normalizePhone(phone);
  const roleSlug = role.toLowerCase().replace(/\s+/g, "-");
  const fileName = `recibo-${roleSlug}-${folio}.pdf`;
  const caption = `Estimado/a ${recipientName}, adjuntamos su comprobante de pago como ${role} correspondiente a la escritura con folio ${folio}. Sistema Notarial.`;

  const url = `${apiUrl}/message/sendMedia/${instance}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: apiKey,
      },
      body: JSON.stringify({
        number: normalizedPhone,
        mediatype: "document",
        mimetype: "application/pdf",
        media: base64,
        fileName,
        caption,
      }),
    });
  } catch (err) {
    return {
      success: false,
      error: `No se pudo conectar con apiEvolution: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return {
      success: false,
      error: `apiEvolution respondió con error ${res.status}: ${body || res.statusText}`,
    };
  }

  return { success: true };
}

export async function sendStatusWhatsApp(params: {
  phone: string;
  recipientName: string;
  role: string;
  folio: string;
  deedNumber: string | null;
  typeLabel: string;
  statusLabel: string;
}): Promise<SendWhatsAppResult> {
  const apiUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE;

  if (!apiUrl || !apiKey || !instance) {
    return {
      success: false,
      error: "Las variables de entorno de apiEvolution no están configuradas.",
    };
  }

  const { phone, recipientName, role, folio, deedNumber, typeLabel, statusLabel } = params;
  const normalizedPhone = normalizePhone(phone);

  const text =
    `Hola ${recipientName}, este es el status de tu escritura:\n\n` +
    `📋 Folio: ${folio}\n` +
    `📝 No. Escritura: ${deedNumber ?? "En proceso"}\n` +
    `🏷 Tipo: ${typeLabel}\n` +
    `👤 Rol: ${role}\n` +
    `📌 Estatus: ${statusLabel}\n\n` +
    `Cualquier duda o pregunta contáctanos.`;

  let res: Response;
  try {
    res = await fetch(`${apiUrl}/message/sendText/${instance}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: apiKey },
      body: JSON.stringify({ number: normalizedPhone, text }),
    });
  } catch (err) {
    return {
      success: false,
      error: `No se pudo conectar con apiEvolution: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return {
      success: false,
      error: `apiEvolution respondió con error ${res.status}: ${body || res.statusText}`,
    };
  }

  return { success: true };
}
