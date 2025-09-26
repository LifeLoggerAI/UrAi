# Email Compliance Snippets

Use these modular snippets to meet regional requirements. Insert the relevant language variant into the `{{compliance_footer}}` placeholder of each template.

## Placeholders
- `{{unsubscribe_link}}`: Personalized unsubscribe or preferences URL.
- `{{physical_address}}`: Verified mailing address for UrAi.
- `{{privacy_policy_link}}`: Link to the latest privacy policy.
- `{{support_email}}`: General support inbox.

## Unsubscribe Footer

### English (EN)
```
You receive this email because you joined the UrAi community. Update preferences or unsubscribe anytime: {{unsubscribe_link}}.
UrAi • {{physical_address}} • Need help? {{support_email}}
```

### Spanish (ES)
```
Recibes este correo por formar parte de la comunidad UrAi. Actualiza tus preferencias o cancela la suscripción aquí: {{unsubscribe_link}}.
UrAi • {{physical_address}} • ¿Necesitas ayuda? {{support_email}}
```

### Portuguese (PT)
```
Você está recebendo este e-mail por participar da comunidade UrAi. Atualize preferências ou cancele a assinatura aqui: {{unsubscribe_link}}.
UrAi • {{physical_address}} • Precisa de ajuda? {{support_email}}
```

### French (FR)
```
Vous recevez cet e-mail car vous faites partie de la communauté UrAi. Gérez vos préférences ou désinscrivez-vous ici : {{unsubscribe_link}}.
UrAi • {{physical_address}} • Besoin d’aide ? {{support_email}}
```

### Hindi (HI)
```
आपको यह ईमेल इसलिए मिला है क्योंकि आप UrAi समुदाय का हिस्सा हैं। अपनी प्राथमिकताएँ अपडेट करें या सदस्यता समाप्त करें: {{unsubscribe_link}}।
UrAi • {{physical_address}} • सहायता चाहिए? {{support_email}}
```

### Simplified Chinese (ZH)
```
你收到此邮件是因为你加入了 UrAi 社区。管理偏好或取消订阅：{{unsubscribe_link}}。
UrAi • {{physical_address}} • 需要帮助？{{support_email}}
```

## Physical Address Statement

### English (EN)
```
Official correspondence address: {{physical_address}}.
```

### Spanish (ES)
```
Dirección oficial para correspondencia: {{physical_address}}.
```

### Portuguese (PT)
```
Endereço oficial para correspondências: {{physical_address}}.
```

### French (FR)
```
Adresse officielle de correspondance : {{physical_address}}.
```

### Hindi (HI)
```
आधिकारिक डाक पता: {{physical_address}}।
```

### Simplified Chinese (ZH)
```
官方联系地址：{{physical_address}}。
```

## Privacy Disclaimer

### English (EN)
```
We protect your data according to our Privacy Policy: {{privacy_policy_link}}.
```

### Spanish (ES)
```
Protegemos tus datos conforme a nuestra Política de Privacidad: {{privacy_policy_link}}.
```

### Portuguese (PT)
```
Protegemos seus dados conforme nossa Política de Privacidade: {{privacy_policy_link}}.
```

### French (FR)
```
Nous protégeons vos données conformément à notre Politique de confidentialité : {{privacy_policy_link}}.
```

### Hindi (HI)
```
हम आपके डेटा की सुरक्षा अपनी गोपनीयता नीति के अनुसार करते हैं: {{privacy_policy_link}}।
```

### Simplified Chinese (ZH)
```
我们按照隐私政策保护你的数据：{{privacy_policy_link}}。
```

## Usage Notes
- Combine the Unsubscribe Footer with the Privacy Disclaimer in a single block for most regions.
- Include the Physical Address Statement when local laws require a standalone address line (e.g., CAN-SPAM, GDPR).
- Localize the order of elements if your ESP enforces specific compliance formats.
- For SMS fallbacks, shorten the unsubscribe text but retain a clear opt-out instruction in the local language.
