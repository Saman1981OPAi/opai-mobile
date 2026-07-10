# Public Submission Risk Register

| Risk | Likelihood | Impact | Mitigation | Response plan |
| --- | --- | --- | --- | --- |
| Police positioning appears official | Medium | High | Repeat non-affiliation language; use generic branding | Provide clarification and replace disputed assets/copy |
| AI or translation claims overpromise | Medium | High | Label workflows mock/testing and describe verification duty | Correct metadata/screenshots and reviewer notes |
| PTSD content appears medical | Medium | High | Keep educational disclaimer visible | Clarify no diagnosis, treatment, therapy, or crisis service |
| Privacy declaration is inaccurate | Medium | High | Inspect uploaded binary and SDKs; apply Apple's definitions | Correct App Privacy answers before resubmission |
| Short public URLs fail | Low | High | Static aliases deployed; re-check before submission | Use canonical URL temporarily and repair hosting |
| Screenshot dimensions or crop fail | Medium | Medium | Validate exact App Store Connect slots | Resize from source and re-upload without distortion |
| Testing language makes app appear incomplete | Medium | High | Explain coherent local prototype purpose and working paths | Adjust metadata or defer public submission until production scope |
| Build `21` differs from reviewed source | Medium | High | Record commit SHA and EAS build metadata | Reject binary and generate a replacement build |
| No physical-device certification | High | High | Complete TestFlight matrix on iPhone and iPad | Maintain NO-GO until signed evidence exists |
| Asset provenance is incomplete | Medium | High | Obtain ownership/license confirmation | Replace any asset without reliable provenance |
| Local user content is mistaken for developer collection | Low | Medium | Document on-device-only behavior accurately | Reconcile App Privacy answers with Apple guidance |

The release owner reviews this register at go/no-go and records accepted risks before submission.
