# Sprint 022 Accessibility Fixes

## Findings and Fixes

- Increased interactive category, prompt, and step chips from 38 to 44 points minimum height.
- Gave the auth-flow text button a 44-point minimum target and explicit accessibility label.
- Preserved existing accessible roles, selected/disabled states, form labels, text error messages,
  destructive confirmations, and bottom-navigation labels.
- Added keyboard inset/dismiss behavior so lower form controls remain easier to reach on iPhone.

## Remaining Physical Checks

- VoiceOver order and spoken labels on iPhone/iPad
- Dynamic Type at larger accessibility sizes
- Contrast under actual display brightness/settings
- Switch Control and external keyboard focus
- Touch target spacing on the processed TestFlight build

No claim of physical-device accessibility verification is made in Sprint 022.
