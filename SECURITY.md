
# Security Policy

Thank you for taking the time to help improve the security of **BestPortfolio**.

The security of this project and its users is important. We appreciate responsible disclosure of security vulnerabilities and will work with you to resolve legitimate issues as quickly as possible.

---

## 🛡️ Supported Versions

Only the latest version of the project is actively maintained and receives security updates.

| Version | Supported |
|----------|:---------:|
| Latest (`main`) | ✅ |
| Older versions | ❌ |
| Forks | ❌ |

---

## 📢 Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub Issues.**

Instead, use one of the following methods:

### Preferred

Open a **Private GitHub Security Advisory** if the repository has GitHub's private vulnerability reporting enabled.

### Alternative

Email the maintainer with the following information:

- Detailed description of the vulnerability
- Steps to reproduce
- Expected vs actual behavior
- Potential impact
- Proof of Concept (if available)
- Suggested remediation (optional)

---

## 📋 What to Include

A good vulnerability report should include:

- Affected component(s)
- Severity assessment
- Reproduction steps
- Screenshots (if applicable)
- Example requests/responses
- Environment information
- Any relevant logs

The more information you provide, the faster we can investigate.

---

## ⏱️ Response Timeline

We aim to meet the following response targets:

| Action | Target Time |
|---------|-------------|
| Initial acknowledgment | Within 48 hours |
| Initial assessment | Within 7 days |
| Progress updates | Every 7 days |
| Fix release | Depending on severity |

Please note that complex vulnerabilities may require additional investigation.

---

## 🤝 Responsible Disclosure Guidelines

Please:

- Give us reasonable time to investigate and fix the issue.
- Keep vulnerability details private until a patch is released.
- Avoid accessing, modifying, or deleting user data.
- Avoid actions that could negatively impact service availability.
- Only perform testing necessary to demonstrate the vulnerability.

Please do **not**:

- Perform denial-of-service attacks.
- Spam or brute-force the application.
- Access accounts or data without permission.
- Publicly disclose vulnerabilities before they are fixed.

---

## 🎯 Security Scope

This policy covers:

- Frontend application
- Backend APIs
- Authentication & Authorization
- Database interactions
- AI integrations
- File uploads
- Deployment configuration
- Infrastructure configuration
- Environment variable handling

Third-party services should be reported directly to their respective vendors.

---

## ❌ Out of Scope

The following are generally considered out of scope unless they demonstrate a real security impact:

- Missing security headers
- Missing HTTP security best practices without exploitability
- Self-XSS
- Clickjacking on non-sensitive pages
- Version disclosure
- Missing best-practice configurations
- Social engineering attacks
- Phishing attacks
- Denial-of-service attacks
- Vulnerabilities in third-party services

---

## 🔒 Security Best Practices

BestPortfolio follows modern security practices including:

- HTTPS-only production deployment
- Environment variables for secrets
- Secure authentication mechanisms
- Server-side validation
- Input sanitization
- Dependency vulnerability monitoring
- Principle of least privilege
- Regular package updates
- Security-focused code reviews

No application can guarantee complete security, but security improvements are continuously implemented.

---

## 🏆 Recognition

Responsible security researchers who report valid vulnerabilities may be acknowledged in future release notes or project documentation (with permission).

---

## 📄 Disclosure Policy

After a vulnerability has been fixed:

1. The issue is verified.
2. A patch is released.
3. A security advisory may be published.
4. Credit is given to the reporter (if desired).

---

## 📦 Security Updates

Security fixes are released through normal project updates.

Users should always deploy the latest stable version to receive security patches.

---

## 📜 License

Submitting a vulnerability report does not grant permission to:

- Access data without authorization
- Modify user information
- Interrupt service
- Perform destructive testing

All testing must comply with applicable laws and this policy.

