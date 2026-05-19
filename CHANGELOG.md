# Changelog

All notable changes to this project will be documented in this file.

This project follows the spirit of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and uses semantic versioning once public releases begin.

## [Unreleased]

### Added

- Open-source documentation, contribution, security, support, and issue templates.
- Environment example for local backend configuration.
- Documentation for the backend authentication, submission, image verification, and task polling routes used by the mobile client.

### Changed

- Backend API URL is configured through `EXPO_PUBLIC_API_URL` instead of a hard-coded tunnel URL.
- `EXPO_PUBLIC_API_URL` is required outside tests instead of silently falling back to `localhost`.
- Open-source documentation now reflects the backend-integrated text, URL, and image verification flows.

### Removed

- Tracked local `.env` configuration.
- Generated coverage reports from source control.
