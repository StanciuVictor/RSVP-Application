# RSVP-Application
## Simple Fornt-End App that creates a list with invitees names.

Just remember to change the <code><script src="..."></script></code> tag in the .html file based on the .js file you want to use.

### app.js
The user has the option to add invitees to the list, check them as confirmed attendees, or remove them.

### app_refactored.js
Besides the code being refactored:
* The user cannot insert an empty string or a duplicate name to the invitees list.
* Confirmation process more concise. Text says "Confirmed" only after the atendance has been confirmed.
* List of invited people is now stored in browser's local storage.
* The app keeps track of the invitation's status (confirmed / not confirmed) and displays invitees accordingly.