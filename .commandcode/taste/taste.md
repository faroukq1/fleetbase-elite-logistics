# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# docker
- For Docker operations (builds, container management), provide the commands instead of executing them directly. Confidence: 0.55

# dotenv
- Avoid spaces in .env file values; bare strings with spaces (e.g., MAIL_FROM_NAME="Elite Logistics") cause dotenv parsing failures. Use no-space alternatives or ensure proper environment-variable-style quoting. Confidence: 0.70

# api
- Do not use ipapi.co or similar third-party IP geolocation APIs that require CORS; handle geolocation server-side to avoid CORS blocking. Confidence: 0.70
