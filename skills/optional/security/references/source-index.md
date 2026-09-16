# Security source index

This index is a routing and evidence guide for the security skill. It records what each authoritative source supports and what it must not be used to claim. Verify the linked release page when a task depends on a newer edition.

## NIST SP 800-218, SSDF Version 1.1

- **Source:** [NIST SP 800-218 final publication](https://csrc.nist.gov/pubs/sp/800/218/final); [NIST SSDF publications and status](https://csrc.nist.gov/projects/ssdf/publications)
- **Status:** Final SSDF Version 1.1, published February 2022. NIST lists SSDF Version 1.2 as a December 2025 draft; do not treat that draft as the stable baseline unless the task explicitly asks for draft material.
- **Supports:** Secure-development lifecycle work organized as Prepare the Organization (PO), Protect the Software (PS), Produce Well-Secured Software (PW), and Respond to Vulnerabilities (RV). It is useful for role/ownership, protecting source and artifacts, secure design/coding/testing, provenance and release integrity, vulnerability intake/confirmation/remediation, and post-release learning.
- **Use it for:** Lifecycle tasks, release/supply-chain evidence, vulnerability-response process, and a common vocabulary between producers, acquirers, and consumers.
- **Do not use it for:** A fixed sequence, a universal control baseline, a guarantee that software is vulnerability-free, or proof that a named implementation example is mandatory. NIST states that the practices are a subset, examples are not required, and organizations must define context-specific terms and environments.

## OWASP Application Security Verification Standard (ASVS) 5.0.0

- **Source:** [OWASP ASVS project page](https://owasp.org/projects/asvs); [ASVS v5.0.0 stable branch and requirements](https://github.com/OWASP/ASVS/tree/v5.0.0)
- **Status:** Current stable release is v5.0.0, dated May 2025. The repository’s main branch may be bleeding edge; use the tagged v5.0.0 branch for durable citations and record identifiers as `v5.0.0-<chapter>.<section>.<requirement>`.
- **Supports:** Testable, implementation-oriented security requirements for web applications and services, including documented security decisions, input/encoding, authentication, sessions, authorization, tokens, cryptography, communications, configuration, data protection, secure architecture, logging/error handling, and other ASVS chapters. Its levels are priority-based assurance levels, not a universal legal classification.
- **Use it for:** Turning a web application/service threat into a versioned requirement and pass/fail verification target; selecting an assurance level based on application risk and required rigor; identifying what is in the application’s technical control boundary.
- **Do not use it for:** General SDLC governance, a claim about hosting/DNS/backups owned by another function, a complete threat model, or “ASVS compliant” language without named version, level, scope, and evidence. ASVS requirements define security outcomes and deliberately do not prescribe one technology or verification method.

## OWASP Top 10:2025

- **Source:** [OWASP Top 10:2025](https://top10.owasp.org/2025/); [Introduction and 2025 changes](https://top10.owasp.org/2025/0x00_2025-Introduction/); [Using Top 10 in an application-security program](https://top10.owasp.org/2025/0x03_2025-Establishing_a_Modern_Application_Security_Program/)
- **Status:** 2025 awareness release. The current categories are Broken Access Control, Security Misconfiguration, Software Supply Chain Failures, Cryptographic Failures, Injection, Insecure Design, Authentication Failures, Software or Data Integrity Failures, Security Logging and Alerting Failures, and Mishandling of Exceptional Conditions.
- **Supports:** Risk vocabulary, awareness, training prompts, initial review questions, and communication about common web application risk categories. The 2025 guidance explicitly directs teams to ASVS for comprehensive, verifiable requirements.
- **Use it for:** Framing an issue or explaining why a threat deserves attention, then trace the issue to a concrete control and test.
- **Do not use it for:** An exhaustive vulnerability list, a complete security review, a coding standard beyond a bare minimum, or a tool claim of full coverage. Categories such as insecure design and effective logging/alerting require design and operational evidence that many tools cannot establish.

## NIST SP 800-154, Guide to Data-Centric System Threat Modeling

- **Source:** [NIST SP 800-154 initial public draft](https://csrc.nist.gov/pubs/sp/800/154/ipd); [draft PDF](https://csrc.nist.gov/files/pubs/sp/800/154/ipd/docs/sp800_154_draft.pdf)
- **Status:** Initial public draft published March 2016. NIST’s publication page carries a January 2025 planning note that it intends to finalize the publication; it is not a final NIST standard.
- **Supports:** Treating threat modeling as risk assessment of attack and defense aspects of a logical entity, with a data-centric focus; identifying what data needs protection and using limited security resources according to risk. It provides fundamental principles intended to complement, not replace, an existing methodology.
- **Use it for:** Structuring assets, data flows, threat/defense reasoning, impact and likelihood discussion, and prioritization of mitigations in the skill’s threat-model record.
- **Do not use it for:** A mandated notation, a complete software threat-modeling method, a current threat catalogue, or universal control requirements. Mark conclusions derived from this draft as draft-guided and corroborate application controls with current, scoped requirements such as ASVS where applicable.
