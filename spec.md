# Specification

## Summary
**Goal:** Remove the invite code field and its validation from the teacher registration flow so any teacher can register with just a Display Name, Username, and Password.

**Planned changes:**
- Remove the "Registration/Invite Code" input field from the teacher registration form on the login page
- Remove invite code validation logic from `AuthContext.tsx` and `LoginPage.tsx`
- Ensure teacher registration works with only Display Name, Username, and Password

**User-visible outcome:** Teachers can register a new account without entering an invite code. The registration form only shows Display Name, Username, and Password fields, and existing accounts continue to work as before.
