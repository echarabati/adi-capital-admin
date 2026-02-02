# Email Deliverability Guide

> Best practices para email deliverability en el TimeKast Starter Kit.

---

## Overview

Esta guía cubre lo que **controlas tú** en el código de la aplicación vs lo que requiere **DNS/provider configuration**.

---

## Template-Level Best Practices

Implementadas en `lib/email/templates/layout.ts`:

| Practice                | Implementación                                           |
| ----------------------- | -------------------------------------------------------- |
| **Preheader**           | Hidden preview text con proper hiding styles             |
| **Plain text fallback** | `generateTextFallback()` helper que elimina HTML         |
| **Clear links**         | Texto descriptivo, no "click here"                       |
| **Solid backgrounds**   | `bgcolor` explícito en todas las tables (dark mode safe) |
| **Readable fonts**      | System font stack con fallbacks                          |
| **Max width 600px**     | Standard email width para todos los clients              |

### Anti-Spam Guidelines

- Evitar subjects en ALL CAPS
- No usar spam trigger words ("FREE!!!", "URGENT", "Act now!")
- Mantener text-to-image ratio razonable (más texto que imágenes)
- Incluir unsubscribe link solo para marketing emails (no transactional)

---

## Sending Layer Headers

Implementados en `resend.ts` y `smtp.ts`:

```typescript
headers: {
  'Auto-Submitted': 'auto-generated',  // RFC 3834
  'X-Auto-Response-Suppress': 'All',   // Previene auto-replies de Outlook
}
```

**Nota:** `List-Unsubscribe` NO está incluido para transactional emails (auth, invites). Solo agregar para marketing/newsletters.

---

## DNS Configuration (Provider-Side)

> [!IMPORTANT]
> Estos records se configuran en el **DNS de tu dominio**, no en código.
> Consulta tu email provider (Resend, SendGrid, etc.) para instrucciones de setup.

### SPF (Sender Policy Framework)

Autoriza qué servers pueden enviar email por tu dominio.

```
v=spf1 include:_spf.resend.com ~all
```

### DKIM (DomainKeys Identified Mail)

Cryptographic signature que prueba que el email no fue modificado en tránsito.

Tu provider genera una public key para agregar como DNS TXT record.

### DMARC (Domain-based Message Authentication)

Policy para manejar emails que fallan SPF/DKIM.

```
v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com
```

---

## Provider Setup Links

| Provider | Documentación                                                                                                                                                          |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Resend   | [resend.com/docs/send-with-custom-domain](https://resend.com/docs/send-with-custom-domain)                                                                             |
| SendGrid | [docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication](https://docs.sendgrid.com/ui/account-and-settings/how-to-set-up-domain-authentication) |
| AWS SES  | [docs.aws.amazon.com/ses/latest/dg/creating-identities.html](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html)                                       |

---

## Environment Variables

```bash
# Required para email sending
EMAIL_PROVIDER="resend"  # o "smtp"
EMAIL_FROM="noreply@yourdomain.com"

# Para Reply-To header (recomendado)
SUPPORT_EMAIL="support@yourdomain.com"

# Opcional: Logo override para emails
EMAIL_LOGO_URL="https://yourdomain.com/email-logo.png"
```

---

## Testing Deliverability

### Quick Check

1. Enviar test email vía `/api/email/test` (dev mode o super_admin)
2. Revisar Spam folder
3. Ver email headers para authentication results

### Advanced Tools

- [mail-tester.com](https://mail-tester.com) — Free deliverability score
- [mxtoolbox.com/SuperTool](https://mxtoolbox.com/SuperTool.aspx) — DNS record checker

---

_TimeKast Starter Kit — Email Deliverability Guide_
