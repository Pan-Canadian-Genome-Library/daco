# DAC Authorizations Sync with PCGL AuthZ

## Summary

When a DAC chair approves an application, the DACO API grants the applicant and the application's collaborators access to the requested studies by creating `dac_authorizations` in the PCGL AuthZ service. When an application is revoked, those `dac_authorizations` are removed.

On **approve**, the application state is committed first and AuthZ is updated afterwards. There is no rollback: if AuthZ cannot be updated, the application stays approved and the failure is logged for manual follow-up. On **revoke**, AuthZ is updated before the state is committed, so a failure keeps the application `APPROVED` and the user can try again.

## AuthZ endpoints

Both calls are made once per requested study, using the access token of the user performing the action.

| Action | Request | Body |
| --- | --- | --- |
| Grant | `POST /study/{studyId}/dac_authorizations` | `application_id`, `applicant_email`, `collaborator_emails`, `start_date`, `end_date` |
| Remove | `DELETE /study/{studyId}/dac_authorizations` | `application_id`, `collaborator_emails` |

- The grant is idempotent: repeating it for the same application is safe.
- `end_date` is `start_date` plus `APPROVED_PERMISSION_EXPIRES_IN_DAYS`, an environment variable. If it is not set, the default is `365` days.
- `collaborator_emails` must be the application's actual collaborator list on both calls. AuthZ uses it to remove the collaborators' access.
- AuthZ returns `404` on DELETE when the `dac_authorizations` were already removed. The DACO API treats this as success, which makes removal safe to repeat.
- Failed requests are retried by the AuthZ client (`AUTHZ_FETCH_RETRIES`, `AUTHZ_FETCH_RETRY_DELAY_MS`) before being reported as a failure.

## Approve flow

```
DAC chair approves
  1. Check the transition DAC_REVIEW -> APPROVED is allowed
  2. Load application contents (requested studies, applicant email) and collaborators
  3. Commit state DAC_REVIEW -> APPROVED (and set approved_at, in the same transaction)
       commit fails?     -> return error, state stays DAC_REVIEW
  4. POST dac_authorizations for every requested study
       any study fails?  -> log for manual follow-up (see below), return error, state stays APPROVED
  5. Send approval emails to the applicant and collaborators, listing only the studies that were granted
       no study was granted? -> no emails are sent
```

The approval emails are only sent after AuthZ has been updated, and only for the studies that were granted.

### AuthZ failure after approval

If AuthZ fails for any study, the API logs an error that starts with `Application: <id> was approved but its dac_authorizations are out of sync with AuthZ. Manual action required.` It lists the studies that were granted and the studies that failed, followed by the AuthZ error messages. If at least one study was granted, the approval emails are still sent for the granted studies only; if none was granted, no email is sent. The client receives a `500 SYSTEM_ERROR` naming the failed studies and asking the user to contact an administrator.

The application cannot be approved again, because it is already `APPROVED`. The missing `dac_authorizations` have to be granted manually.

### Preconditions

Approve fails with a `SYSTEM_ERROR`, without calling AuthZ, when:

- the application contents cannot be loaded
- no studies were requested
- the applicant has no institutional email

If the collaborators cannot be loaded, only the applicant is authorized and the failure is logged.

## Revoke flow

```
Application is revoked (by the DAC chair or the applicant)
  1. Check the transition APPROVED -> REVOKED is allowed (nothing is committed yet)
  2. Load application contents and collaborators
       collaborators cannot be loaded? -> return error, state stays APPROVED
  3. DELETE dac_authorizations for every requested study
       any study fails?  -> return error, state stays APPROVED
  4. Commit state APPROVED -> REVOKED
  5. Send the revoke email to the applicant
```

There is no rollback for revoke. Re-granting access that the DAC decided to remove would be the unsafe direction, so a failed revoke leaves the application `APPROVED` and the user retries. Because DELETE is idempotent, studies that were already removed on an earlier attempt do not cause the retry to fail.

If the application has no requested studies, there is nothing to remove in AuthZ: this is logged and the state is still committed.

## Error handling

| Situation | Application state | Response |
| --- | --- | --- |
| Approve, state commit fails | Stays `DAC_REVIEW` | `500 SYSTEM_ERROR` |
| Approve, a study fails in AuthZ | Is `APPROVED`, no rollback | `500 SYSTEM_ERROR`, message lists the failed studies, logged for manual follow-up |
| Revoke, a study fails in AuthZ | Stays `APPROVED` | `500 SYSTEM_ERROR`, message lists the failed studies |
| Revoke, collaborators cannot be loaded | Stays `APPROVED` | `500 SYSTEM_ERROR` |
| Transition not allowed for the current state | Unchanged | `400 INVALID_REQUEST`, no AuthZ calls |

The UI shows its existing failure notification for any non-2xx response and the user can repeat the action.
