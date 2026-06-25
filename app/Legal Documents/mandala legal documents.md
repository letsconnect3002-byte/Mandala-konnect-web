# Mandala — Legal Documents

Jurisdiction: Republic of India
Governing Laws: Information Technology Act, 2000 ("IT Act") · IT (Reasonable Security Practices and Sensitive Personal Data or Information) Rules, 2011 ("SPDI Rules") · Digital Personal Data Protection Act, 2023 ("DPDP Act")

## Document 1 — Privacy Policy

Last Updated: 06/25/2026
Version: 1.0

---

### 1. About This Policy

This Privacy Policy explains how Mandala ("we," "us," or "our"), the operator of the Mandala mobile application ("App"), collects, uses, stores, shares, and protects your personal data.

It is issued under:
- Rule 4 of the SPDI Rules, 2011 (mandatory privacy policy publication)
- Section 5 of the DPDP Act, 2023 (notice to Data Principals before processing)

By creating an account or using the App, you acknowledge that you have read and understood this Policy.

---

### 2. Who This Policy Applies To

This Policy applies to all registered users ("you" or "Data Principal") of the Mandala App, including visitors who interact with the App for the purpose of creating an account.

---

### 3. Personal Data We Collect

We collect the following categories of personal data directly from you:

#### 3.1 Account Data (collected at registration)
| Data | Purpose | Mandatory? |
|---|---|---|
| Email address | Account creation, authentication, OTP verification | Yes |
| Password (hashed by Supabase Auth) | Authentication | Yes |
| Gender | Profile creation | Yes |

#### 3.2 Profile Data (provided by you when setting up or editing your profile)
| Data | Purpose | Mandatory? |
|---|---|---|
| Full name | Displayed on your profile cards | Yes |
| Profession | Displayed on your profile cards | Yes |
| Company | Displayed on your profile cards | No |
| Personal bio | Displayed on your casual card | No |
| Professional bio | Displayed on your professional card | No |
| Profile photo (avatar) | Displayed on your profile | No |
| Personal phone number | Shared with connections per your access settings | No |
| Professional phone number | Shared with connections per your access settings | No |
| Professional email address | Shared with connections per your access settings | No |
| Instagram handle | Shared with connections per your access settings | No |
| LinkedIn handle | Shared with connections per your access settings | No |
| Twitter/X handle | Shared with connections per your access settings | No |
| Spotify profile | Shared with connections per your access settings | No |
| Custom links (name + URL) | Shared with connections per your access settings | No |

#### 3.3 Connection and Activity Data (generated through your use of the App)
- Your connection graph (who you are connected to, connection timestamps)
- QR invite codes you generate or redeem
- Which card type (casual / professional) was shared with each connection
- Chat messages sent and received through the App
- Read/delivery status of messages
- Monk Mode settings: active state, duration, and blocked connection IDs
- Profile visibility preference (`show_profile_to_connections` flag)

#### 3.4 Device and Technical Data (collected automatically)
- Firebase Cloud Messaging (FCM) device token — used solely to deliver push notifications to your device
- Basic app usage metadata required for the functioning of Supabase Realtime (such as connection status for live typing indicators)

We do not collect:
- Financial or payment information
- Precise or background GPS location
- Call logs or SMS content
- Contacts from your device's address book
- Browsing history outside the App

---

### 4. Sensitive Personal Data or Information (SPDI)

Under Rule 3 of the SPDI Rules, 2011, the following data we collect qualifies as Sensitive Personal Data or Information (SPDI):

- Password — collected at sign-up; stored exclusively in hashed form by Supabase Auth; never stored in plaintext by us.
- Gender — collected at sign-up; stored as a profile field.

SPDI is processed only with your free, specific, informed, and unambiguous consent, and is subject to the security practices described in Section 9 of this Policy.

---

### 5. How We Use Your Data

We use your personal data only for the purposes for which it was collected:

| Purpose | Legal Basis (DPDP Act) | Legal Basis (IT Act / SPDI Rules) |
|---|---|---|
| Creating and managing your account | Consent (Section 6) | Rule 5(3) |
| Displaying your profile to connections you approve | Consent (Section 6) | Rule 5(3) |
| Facilitating direct messaging between connected users | Consent / Contractual necessity | Rule 5(3) |
| Sending push notifications for new messages | Consent (Section 6) | Rule 5(3) |
| Enforcing Monk Mode (blocking/hiding selected connections) | Consent (Section 6) | Rule 5(3) |
| Enabling QR-based and invite-code-based connections | Consent (Section 6) | Rule 5(3) |
| Security, fraud prevention, and technical debugging | Legitimate use (Section 7) | Rule 8 |
| Complying with legal obligations | Legitimate use (Section 7) | Section 67C, IT Act |

We do not sell your personal data. We do not use your data for advertising, profiling for commercial recommendations, or automated decision-making that produces legal or similarly significant effects.

---

### 6. Data Sharing and Disclosure

#### 6.1 With Other Users
Profile data you share with a connection is disclosed only to that specific connection, and only at the card access level (casual or professional) that you configure. Connections cannot see fields you have not assigned to the card type you shared with them.

Chat messages are visible only to the sender and the intended recipient.

#### 6.2 With Third-Party Data Processors
We engage the following sub-processors who process your data solely on our behalf and under our instructions:

| Processor | Data Processed | Purpose | Privacy Reference |
|---|---|---|---|
| Supabase, Inc. (USA) | Account credentials, profile data, messages, connection data | Database, authentication, real-time communication | [supabase.com/privacy](https://supabase.com/privacy) |
| Google LLC / Firebase (USA) | FCM device token | Push notification delivery | [policies.google.com/privacy](https://policies.google.com/privacy) |
| Google LLC (USA) | Google account details (only when you use Google Sign-In) | OAuth-based authentication | [policies.google.com/privacy](https://policies.google.com/privacy) |

These processors are bound by agreements requiring them to process your data only for the purposes above and to maintain appropriate security standards. Data may be transferred outside India to the servers of these processors. Such transfers are made in reliance on the contractual safeguards these processors maintain and, when applicable, any adequacy determinations or standard contractual clauses.

#### 6.3 Legal Disclosure
We may disclose your personal data to a government authority or law enforcement agency if required by a valid court order, applicable law (including Sections 69 and 69B of the IT Act), or to protect the safety of any person.

We will not otherwise disclose your personal data to any third party.

---

### 7. Local Storage on Your Device

The App stores a local SQLite database (`connect_chat.db`) on your device containing:
- Chat messages (sent and received), including message content, sender ID, room ID, timestamps, and reply context
- Monk Mode settings (enabled state, deactivation time, blocked connection IDs)

This data is stored on your device to enable offline access and faster loading. It is not accessible to third parties through the App. If you uninstall the App or clear App data, this local database is deleted from your device.

---

### 8. Data Retention

| Data Category | Retention Period |
|---|---|
| Account and profile data | Until you delete your account, plus 30 days for backup recovery purposes |
| Chat messages (server copy) | Until you delete the message or your account |
| Chat messages (local device copy) | Until you clear app data or uninstall the App |
| FCM push token | Refreshed automatically by Firebase; deleted from our servers when your account is deleted |
| Invite codes (redeemed) | 30 days after redemption |
| Connection data | Until you disconnect from the other user or delete your account |
| Monk Mode settings (server) | Until you disable Monk Mode or delete your account |

When an account is deleted, we will delete or anonymize all associated personal data within 30 working days, except where retention is required by applicable law.

---

### 9. Data Security

We implement the following reasonable security practices as required under Rule 8 of the SPDI Rules and Section 8 of the DPDP Act:

- Passwords are never stored in plaintext; they are hashed by Supabase Auth using industry-standard algorithms.
- All data in transit between the App and our servers is encrypted using TLS.
- Supabase Row Level Security (RLS) policies restrict access to each user's own data.
- Access to the production database is limited to authorized personnel.
- We do not log message content in application logs.

Despite these measures, no system is completely secure. You are responsible for maintaining the confidentiality of your account credentials.

---

### 10. Children's Data

The App is not intended for use by individuals under the age of 18 years. We do not knowingly collect personal data from children.

Under Section 9 of the DPDP Act, processing the personal data of a child requires verifiable parental consent. If you are under 18, please do not register or use the App.

If we become aware that we have inadvertently collected personal data from a child, we will delete it promptly. To report such a case, contact our Grievance Officer (Section 13 below).

---

### 11. Your Rights as a Data Principal

Under the DPDP Act, 2023, and the SPDI Rules, 2011, you have the following rights:

#### 11.1 Right to Access (Section 11, DPDP Act)
You may request a summary of the personal data we hold about you and the purposes for which it is being processed.

#### 11.2 Right to Correction, Completion, and Updating (Section 12, DPDP Act)
You may correct or update inaccurate or incomplete profile data directly within the App. For data you cannot edit in-app, submit a written request to our Grievance Officer.

#### 11.3 Right to Erasure (Section 12, DPDP Act; Rule 5(6), SPDI Rules)
You may delete your account at any time from within the App. Deleting your account initiates deletion of your profile, connection data, and server-stored messages. Data retained for legal compliance will be clearly identified.

#### 11.4 Right to Withdraw Consent (Section 6(4), DPDP Act)
You may withdraw consent for specific processing activities (e.g., push notifications) through your device settings. Withdrawing consent does not affect the lawfulness of processing that occurred before withdrawal. Note that withdrawing consent for core processing (authentication, profile storage) will result in you being unable to use the App and may require account deletion.

#### 11.5 Right to Grievance Redressal (Section 13, DPDP Act; Rule 9, SPDI Rules)
You may file a complaint with our Grievance Officer (Section 13 below). If your grievance is not resolved within the prescribed period, you may approach the Data Protection Board of India under Section 16 of the DPDP Act once it is constituted.

To exercise any of the above rights, contact the Grievance Officer with your registered email address and a clear description of your request.

---

### 12. Third-Party Links

Your profile may contain custom links to external websites (e.g., personal portfolios). We are not responsible for the privacy practices or content of those external sites. Access them at your own discretion.

---

### 13. Grievance Officer

As required under Rule 9 of the SPDI Rules, 2011, and Section 13 of the DPDP Act, 2023, we have appointed a Grievance Officer:

Name: Santosh patil
Designation: founder
Organisation: Mandala App
Email: santoshpatil@joinmandala.in
Address: Bangalore, Karnataka, India
Response Time: We will acknowledge your grievance within 24 hours and resolve it within 30 days of receipt, as required under the SPDI Rules.

---

### 14. Changes to This Policy

We may update this Privacy Policy to reflect changes in the App, our practices, or applicable law. When we make material changes, we will notify you through an in-app notice before the change takes effect. Continued use of the App after the effective date constitutes acceptance of the updated Policy.

---

### 15. Contact

For any privacy-related questions that do not constitute a formal grievance, you may reach us at:

Email: santoshpatil@joinmandala.in
Address: Bangalore, Karnataka, India

---

---

## Document 2 — Terms of Service

Last Updated: 06/25/2026
Version: 1.0

---

### 1. Agreement to Terms

These Terms of Service ("Terms") constitute a legally binding agreement between you and Mandala ("we," "us," or "our"), governing your access to and use of the Mandala mobile application ("App").

By creating an account, you confirm that you are at least 18 years old, that you have read and understood these Terms, and that you agree to be bound by them. If you do not agree, do not use the App.

---

### 2. Description of the App

Mandala is a private networking application that enables users to build intentional, QR-based connections and communicate through direct messaging. Core features include:
- Profile creation with configurable casual and professional cards
- QR code and invite-code based connection flow
- Direct encrypted messaging between connections
- Monk Mode (a focus mode that temporarily hides selected connections)
- Push notifications for new messages

---

### 3. Eligibility

You must be at least 18 years old to use the App. By using the App, you represent and warrant that you meet this requirement. We reserve the right to suspend or delete accounts found to belong to individuals under 18.

---

### 4. Account Registration

You agree to:
- Provide accurate, complete, and current information at registration and in your profile.
- Maintain the confidentiality of your account credentials. You are solely responsible for all activity that occurs under your account.
- Notify us immediately at santoshpatil@joinmandala.in if you suspect any unauthorized use of your account.

One person may maintain one primary account. Creating multiple accounts to circumvent a suspension or ban is prohibited.

---

### 5. Acceptable Use

You agree not to:
1. Use the App for any purpose that is unlawful under any applicable law, including the IT Act, the Indian Penal Code, or the DPDP Act.
2. Post, transmit, or share content that is defamatory, obscene, harassing, threatening, or that constitutes hate speech, as defined under Sections 66A (to the extent applicable), 67, 67A, or 67B of the IT Act.
3. Impersonate any person or entity, or falsely state your affiliation with any person or entity.
4. Use the App to solicit, collect, or harvest personal data of other users without their consent.
5. Attempt to gain unauthorized access to any part of the App, other users' accounts, or the underlying infrastructure.
6. Transmit malware, viruses, or any code intended to disrupt, damage, or interfere with the App or its users' devices.
7. Scrape, crawl, or use automated means to access the App or its content.
8. Use the App for commercial solicitation (spam, unsolicited advertising) without our prior written consent.

---

### 6. User-Generated Content

#### 6.1 Ownership
You retain ownership of all content you create in the App, including your profile information, messages, and custom links.

#### 6.2 License to Us
By providing content to the App, you grant us a limited, non-exclusive, royalty-free licence to store and transmit that content solely for the purpose of operating and providing the App to you and your connections. We claim no ownership over your content.

#### 6.3 Accuracy
You are solely responsible for the accuracy of the information you provide in your profile. We do not verify user-provided data.

#### 6.4 Message Content
Messages sent between users are stored on our servers (Supabase) and cached locally on devices for delivery purposes. We do not monitor message content except where required by law or to investigate a specific complaint of a legal violation.

---

### 7. Connections and Sharing

The connection and data-sharing features of the App are designed to operate under your explicit control. You initiate every connection by scanning a QR code or redeeming an invite code, and you control what data each connection can see through your card access settings.

You agree not to scan another user's QR code without that user's knowledge and consent.

---

### 8. Monk Mode

Monk Mode is a focus feature that allows you to temporarily hide selected connections. When Monk Mode is active, hidden connections will not be able to message you and you will not receive notifications from them for the duration. This feature is stored locally on your device and synced with our servers. You are responsible for the settings you configure in Monk Mode.

---

### 9. Intellectual Property

All intellectual property rights in the App, including the Mandala brand, its design, code, and all materials we create, are owned by or licensed to us. Nothing in these Terms transfers any intellectual property rights to you.

You may not copy, modify, reverse engineer, disassemble, or create derivative works of the App.

---

### 10. Suspension and Termination

#### 10.1 By You
You may delete your account at any time from within the App settings. Upon deletion, your profile, connections, and server-side messages will be removed in accordance with our Privacy Policy.

#### 10.2 By Us
We may suspend or terminate your account, with or without notice, if:
- You breach these Terms or our Privacy Policy.
- You engage in conduct that we reasonably determine to be harmful to other users, the App, or us.
- We are required to do so by a court order or competent authority.
- We cease to operate the App.

Upon termination, your right to use the App ends immediately.

---

### 11. Disclaimers

The App is provided "as is" and "as available." To the fullest extent permitted by law:
- We make no warranty that the App will be error-free, uninterrupted, or free from security vulnerabilities.
- We are not responsible for the accuracy of any profile information provided by other users.
- We are not a party to any communication, dispute, or transaction between users. We do not mediate disputes between users.

---

### 12. Limitation of Liability

To the maximum extent permitted under the IT Act and applicable Indian law, our aggregate liability to you for any claim arising out of or relating to the App or these Terms shall not exceed INR 500 or the amount you paid us in the preceding 12 months, whichever is lower.

We shall not be liable for any indirect, incidental, consequential, or punitive damages, including loss of data, loss of revenue, or reputational harm, even if we have been advised of the possibility of such damages.

Nothing in this clause limits our liability for death or personal injury caused by our negligence, fraud, or any liability that cannot be excluded by law.

---

### 13. Indemnification

You agree to indemnify and hold harmless Mandala and its founders, officers, and employees from any claims, losses, damages, liabilities, and expenses (including legal fees) arising out of your use of the App, your violation of these Terms, or your violation of any applicable law or third-party rights.

---

### 14. Governing Law and Dispute Resolution

These Terms are governed by the laws of the Republic of India, including the IT Act, 2000, and the DPDP Act, 2023. The courts of Bangalore, India shall have exclusive jurisdiction over any dispute arising out of or in connection with these Terms.

Before initiating any legal proceeding, you agree to notify us in writing at santoshpatil@joinmandala.in and allow 30 days for us to attempt to resolve the dispute amicably.

---

### 15. Changes to These Terms

We may modify these Terms at any time. When we make material changes, we will provide in-app notice at least 1 days before the changes take effect. Continued use of the App after the effective date constitutes your acceptance of the modified Terms.

---

### 16. Contact

Mandala
Bangalore, India
Email: santoshpatil@joinmandala.in

---

---

## Document 3 — Consent Notice

Purpose: This notice is to be presented to users at the point of registration (before they submit the sign-up form) under Section 5 and Section 6 of the DPDP Act, 2023.

> Implementation note. Display this notice as a modal or scrollable text block before the user taps "Create Account." Require an explicit checkbox tap (the checkbox must be unchecked by default) accompanied by the declaration text below. Do not pre-tick the checkbox. Link to the full Privacy Policy and Terms of Service from within this notice.

---

### Consent Notice — Mandala

Before you create your account, please read the following:

By creating a Mandala account, you give Mandala your free, specific, informed, and unambiguous consent to collect and process the following personal data for the purposes stated:

| Data | Purpose |
|---|---|
| Email address | To create and authenticate your account |
| Password | To secure your account (stored in hashed form; never visible to us) |
| Gender | To create your profile |
| Name, profession, and optional profile details | To display on the profile cards you choose to share with connections |
| Profile photo | To display on your profile |
| Chat messages | To deliver messages to your connections |
| Device push token | To send you notifications about new messages |
| Connection data | To display and manage your list of connections |

Your data is processed by:
- Supabase, Inc. (database and authentication — servers outside India)
- Google LLC / Firebase (push notifications — servers outside India)

Your rights: You may access, correct, or delete your data at any time through the App settings. You may withdraw this consent at any time, though doing so for core data will prevent you from using the App. You may also contact our Grievance Officer at santoshpatil@joinmandala.in.

This notice is issued under Section 5 of the Digital Personal Data Protection Act, 2023.

For full details, read our [Privacy Policy](#) and [Terms of Service](#).

---

Declaration (checkbox — unchecked by default):

> ☐ I am at least 18 years old. I have read and understood the Consent Notice, Privacy Policy, and Terms of Service. I give my free, informed, and unambiguous consent to the collection and processing of my personal data as described above.

---

---

## Appendix — Placeholder Reference

Fill each placeholder before publishing:

| Placeholder | What to enter |
|---|---|
| `Mandala` | Your registered company or LLP name (e.g., XYZ Technologies Private Limited) |
| `25 June 2026` | The date you publish the document (DD Month YYYY) |
| `santosh patil` | Full name of the designated Grievance Officer |
| `Founder and CEO` | Their role (e.g., Founder, Co-Founder, Chief Privacy Officer) |
| `santoshpatil@joinmandala.in` | A monitored email for privacy complaints (e.g., privacy@yourdomain.com) |
| `santoshpatil@joinmandala.in` | General contact email |
| `Bangalore` | Your GSTIN-registered or ROC-registered address |
| `Bangalore` | City with exclusive jurisdiction for disputes |
| `500` | Your liability cap in INR (typically INR 500 or equivalent to subscription paid) |
| `30 days` (retention grace period) | How many days post-deletion before data is fully purged (typical: 30 days) |
| `30 days` (invite code retention) | How long you keep redeemed invite codes (typical: 30 days) |
| `7 days` (Terms change notice) | Notice period before new Terms take effect (typical: 7–14 days) |

---

## Appendix — Legal Reference Index

| Reference | What It Requires for This App |
|---|---|
| IT Act, 2000 — Section 43A | Maintain reasonable security for SPDI (password, gender) |
| IT Act, 2000 — Section 72A | Prohibition on unauthorized disclosure of personal information |
| SPDI Rules, 2011 — Rule 4 | Publish a Privacy Policy (this document) |
| SPDI Rules, 2011 — Rule 5 | Inform users of what is collected and why; obtain written consent for SPDI |
| SPDI Rules, 2011 — Rule 6 | Do not disclose SPDI to third parties without consent (except sub-processors under contract) |
| SPDI Rules, 2011 — Rule 7 | Ensure any international data transfer maintains equivalent protection |
| SPDI Rules, 2011 — Rule 8 | Implement IS/ISO/IEC 27001 or equivalent security practices |
| SPDI Rules, 2011 — Rule 9 | Designate and publish Grievance Officer details |
| DPDP Act, 2023 — Section 5 | Provide a consent notice before collecting personal data |
| DPDP Act, 2023 — Section 6 | Obtain free, specific, informed, unconditional, and unambiguous consent |
| DPDP Act, 2023 — Section 8 | Ensure data accuracy, storage limitation, and security safeguards |
| DPDP Act, 2023 — Section 9 | Do not process personal data of children under 18 without verifiable parental consent |
| DPDP Act, 2023 — Sections 11–13 | Honour rights to access, correction, erasure, and grievance redressal |
| DPDP Act, 2023 — Section 16 | Users may escalate unresolved complaints to the Data Protection Board |