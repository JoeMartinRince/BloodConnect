# Blood Connect Now

Build a production-quality, mobile-first web application prototype for a hackathon project called:

"BloodConnect"

Tagline:

"Find the right donor. When every minute matters."

PROJECT PURPOSE:

BloodConnect is a district-level blood donor matching platform. It connects people/hospitals requesting blood with nearby available and compatible blood donors.

The application should make it easy to:

1. Register as a blood donor

2. Find nearby compatible donors

3. Create an urgent blood request

4. Match blood requests with available donors

5. View donor availability and distance

6. Receive notifications for blood requests

7. View nearby blood banks/hospitals

8. Track active and previous blood requests

IMPORTANT:

This is a hackathon prototype. Focus on an extremely polished UI and realistic working interactions. Use realistic mock data initially. Do NOT build a generic dashboard-looking website.

==================================================

DESIGN REFERENCE

==================================================

Use the uploaded RedFlow blood donation mobile UI as the visual inspiration.

The reference has:

- Soft pink background

- Strong red/pink primary color

- White cards

- Rounded corners

- Clean medical aesthetic

- Large readable typography

- Bottom navigation

- Donor cards

- Blood-drop icons

- Map screens

- Blood bank cards

- Request forms

- Notification screens

- Profile screens

- Simple onboarding

DO NOT literally copy the RedFlow branding or logo.

Create our own identity:

Brand name: BloodConnect

Use a modern red/pink healthcare visual language.

==================================================

DESIGN SYSTEM

==================================================

Primary:

Deep Red: #E90046

Secondary:

Pink: #FF4F7B

Background:

Very light pink: #FFF5F7

Cards:

#FFFFFF

Text:

Dark charcoal: #171717

Secondary text:

#777777

Success:

Green

Warning:

Amber

Critical:

Red

Use gradients sparingly.

The application should feel:

- trustworthy

- modern

- friendly

- urgent when necessary

- simple enough for a person under stress to use

Use:

- rounded 18–24px cards

- soft shadows

- large touch targets

- clean icons

- subtle animations

- smooth page transitions

- plenty of whitespace

Use Lucide icons or another clean icon library.

Typography:

Use a modern sans-serif such as Inter.

==================================================

RESPONSIVE BEHAVIOR

==================================================

Mobile-first is extremely important.

Primary design target:

390px × 844px mobile screen.

The application must also work properly on:

- 375px

- 412px

- tablet

- desktop

On desktop, create a centered application layout with a maximum width and appropriate responsive navigation.

Do NOT simply stretch the mobile UI across desktop.

==================================================

APP STRUCTURE

==================================================

Create these main sections:

1. Splash / onboarding

2. Authentication

3. Home

4. Find Donors

5. Blood Request

6. Request Matching

7. Donor Dashboard

8. Blood Banks

9. Notifications

10. Messages

11. Profile

12. Hospital/Admin Dashboard

Use client-side routing.

==================================================

1. SPLASH SCREEN

==================================================

Create a beautiful splash screen.

Center:

BloodConnect logo using a simple blood drop + heart concept.

Text:

BloodConnect

Subtitle:

"Connecting lives, one donation at a time."

Use a subtle heartbeat animation.

After a short delay, navigate to onboarding.

==================================================

2. ONBOARDING

==================================================

Create 3 onboarding screens inspired by the reference.

Screen 1:

"Find Blood. Faster."

Description:

"Connect with compatible blood donors in your district when you need them."

Screen 2:

"Know Who's Available"

Description:

"See nearby eligible donor availability and send requests instantly."

Screen 3:

"Every Minute Matters"

Description:

"Get emergency blood requests to the right donors at the right time."

Include:

- illustration area

- Skip

- progress indicator

- Next button

Final onboarding screen:

"Welcome to BloodConnect"

Buttons:

"Create Account"

"Sign In"

==================================================

3. AUTHENTICATION

==================================================

Create polished mobile authentication screens.

Sign Up fields:

- Full Name

- Email

- Phone

- Password

- Blood Group

- District

- Date of Birth

- Gender

Checkbox:

"I agree to the Terms and Privacy Policy"

Button:

"Create Account"

Sign In:

- Email / Phone

- Password

- Remember me

- Forgot password

- Sign in

Also include:

"Continue with Google"

For prototype purposes, authentication can use mock/local state.

Structure the code so Supabase authentication can be connected later.

==================================================

4. HOME SCREEN

==================================================

This is the main screen after login.

Top:

"Good morning, Alex 👋"

Location:

📍 Pathanamthitta, Kerala

Emergency card:

🚨 EMERGENCY BLOOD REQUEST

"O− blood needed"

"2 units • 3.2 km away"

Button:

"View Request"

Then quick actions:

[ 🩸 Need Blood ]

[ ❤️ Donate Blood ]

Then:

"Nearby Donors"

Display horizontal donor cards.

Example:

Liam Elijah

O+

2.1 km away

🟢 Available

Button:

"Request"

Then:

"Nearby Blood Banks"

Show small cards with:

- Blood bank name

- distance

- rating

- open/closed status

Then:

"Your Activity"

Show recent donation/request.

Bottom navigation:

Home

Find

Request

Alerts

Profile

==================================================

5. FIND DONORS SCREEN

==================================================

Create a donor discovery screen similar to the reference.

Top:

"Find a Donor"

Search bar:

"Search by location or donor"

Filters:

Blood Group

Distance

Availability

Urgency

Create a map section.

Use a realistic-looking map placeholder initially.

Show donor markers.

Below map:

"17 compatible donors nearby"

Donor cards:

Profile avatar

Name

Blood group badge

Distance

Availability indicator

Last active

Request button

Example:

Benjamin Jack

O+

🟢 Available

2.4 km away

[Request Donor]

Do NOT expose sensitive donor information unnecessarily.

==================================================

6. BLOOD REQUEST SCREEN

==================================================

Create a polished form titled:

"Request Blood"

Step indicator:

1. Blood

2. Location

3. Details

4. Confirm

Step 1:

"Which blood group do you need?"

Large selectable blood group buttons:

A+

A-

B+

B-

AB+

AB-

O+

O-

Then:

"Units required"

[-] 2 [+]

Step 2:

"Where is blood needed?"

District dropdown

Location

Hospital / Blood Bank

Step 3:

"How urgent is this?"

Normal

Urgent

Critical

Critical should visually stand out.

Patient/request details.

Step 4:

Confirmation summary.

Primary CTA:

"Find Compatible Donors"

==================================================

7. MATCHING SCREEN

==================================================

This is one of the MOST IMPORTANT screens in the entire application.

After creating a request:

Show an animated matching state:

"Finding compatible donors..."

"Searching nearby donor network"

Then show:

"17 Compatible Donors Found"

Emergency request card:

O+

2 Units

Pathanamthitta

Critical

Then donor ranking cards.

Example:

--------------------------------

🟢 HIGH MATCH

Donor #D102

O+

📍 2.1 km away

🟢 Available now

Match factors:

✓ Compatible blood group

✓ Nearby

✓ Currently available

MATCH PRIORITY

96

[Send Request]

--------------------------------

Another donor:

Donor #D087

O+

4.7 km away

Available now

MATCH PRIORITY

91

IMPORTANT:

The "match priority" is a prototype prioritization score based on compatibility, distance and availability. Do not present it as a medical score.

Include sorting:

- Closest

- Available now

- Priority

==================================================

8. DONOR DASHBOARD

==================================================

Donor sees:

"Hello, Benjamin 👋"

Status card:

DONOR STATUS

🟢 AVAILABLE

"You're currently visible to nearby blood requests."

Toggle:

Available / Unavailable

Blood group:

O+

District:

Pathanamthitta

Then:

"Emergency Requests Near You"

Request card:

🚨 O+ NEEDED

2 units

3.2 km away

Critical

Buttons:

"Accept"

"Decline"

If accepted:

Success screen:

"Request Accepted ❤️"

"Hospital/requester has been notified."

==================================================

9. BLOOD BANK SCREEN

==================================================

Title:

"Nearby Blood Banks"

Search bar.

Map.

Blood bank cards:

District Blood Centre

📍 2.8 km

🟢 Open

Available blood groups:

A+ B+ O+ O-

[View Details]

Details page:

- name

- address

- phone

- opening status

- available blood groups

- directions button

Use realistic mock data.

==================================================

10. NOTIFICATIONS

==================================================

Create notification center.

Categories:

All

Emergency

Requests

Updates

Examples:

🚨 Emergency Blood Request

"O+ blood is urgently needed 3.2 km from you."

❤️ Donation Accepted

"Your donor request was accepted."

🩸 Donation Reminder

"You may be eligible to donate again."

Use unread indicators.

==================================================

11. MESSAGES

==================================================

Create a simple messaging interface.

List of conversations.

Conversation screen should use chat bubbles.

For privacy, don't display unnecessary personal information.

==================================================

12. PROFILE

==================================================

Profile screen inspired by the reference.

Avatar

Benjamin Jack

O+

Pathanamthitta, Kerala

Statistics:

05

Donations

03

Requests

06

Months active

Menu:

❤️ Donor Status

✏️ Edit Profile

🩸 Donation History

🔔 Notifications

⚙️ Settings

🔒 Privacy

ℹ️ About BloodConnect

Sign Out

==================================================

13. HOSPITAL / ADMIN DASHBOARD

==================================================

Create a separate dashboard for hospital/blood-bank users.

Header:

"District Blood Control Center"

Stats:

Active Requests

36

Critical

4

Available Donors

128

Successful Matches

24

Create a request table/list:

REQUEST #1042

O+

2 units

Pathanamthitta

Critical

17 compatible donors

5 available

3 notified

1 accepted

Buttons:

"View Matches"

Create a district map showing:

- Blood requests

- Donors

- Blood banks

Also include simple charts for blood demand.

==================================================

MATCHING LOGIC

==================================================

For the prototype, implement a transparent client-side matching algorithm using mock donor data.

Factors:

1. Blood group compatibility

2. Distance

3. Availability

4. Request urgency

Use a helper function such as:

calculateMatchPriority(request, donor)

The UI should be able to explain why a donor appears near the top:

"Compatible"

"2.1 km away"

"Available now"

Do not use AI-generated medical compatibility rules.

Keep compatibility rules configurable so they can later be replaced/validated with authoritative medical guidance.

==================================================

MOCK DATA

==================================================

Create at least:

30 donors

10 blood requests

5 blood banks

3 hospitals

Use Indian/Kerala-style names and locations.

Example districts:

Pathanamthitta

Thiruvananthapuram

Kollam

Alappuzha

Kottayam

Ernakulam

Example donors:

Arun Kumar

Anjali S

Rahul Raj

Akhil Joseph

Meera Thomas

Nikhil P

etc.

Use realistic but fictional data.

==================================================

IMPORTANT DEMO FEATURE

==================================================

Create a "Demo Emergency" button on the developer/demo version.

When clicked:

1. Create an O+ emergency request

2. Show "Finding compatible donors..."

3. Animate matching

4. Display nearby compatible donors

5. Show donor priority

6. Allow clicking "Send Request"

7. Change donor status to "Request Sent"

8. Simulate donor acceptance

9. Show:

   "DONOR CONFIRMED ❤️"

This should be a smooth 30–60 second hackathon demonstration.

==================================================

TECHNICAL REQUIREMENTS

==================================================

Use:

React

TypeScript

Tailwind CSS

Lucide icons

Use clean component architecture.

Suggested structure:

src/

  components/

  pages/

  data/

  services/

  utils/

  types/

  hooks/

Create reusable components:

Button

Card

BloodGroupBadge

DonorCard

RequestCard

BottomNavigation

Header

StatusBadge

MapPlaceholder

NotificationItem

HospitalCard

Keep mock data separate from UI components.

Use TypeScript interfaces for:

Donor

BloodRequest

BloodBank

Hospital

Match

Notification

==================================================

BACKEND PREPARATION

==================================================

For the first prototype, use mock/local data.

However, structure the application so Supabase can be integrated later.

Do not hardcode data directly inside components.

Create service functions such as:

getDonors()

getBloodRequests()

getBloodBanks()

createBloodRequest()

findCompatibleDonors()

sendDonorRequest()

==================================================

MAP

==================================================

For the initial prototype, create a polished map placeholder if no map API is configured.

Do NOT require a paid API just to run the prototype.

The map should visually communicate:

- donor locations

- blood request locations

- blood banks

==================================================

UX REQUIREMENTS

==================================================

Every screen must have:

- loading state

- empty state where appropriate

- error state where appropriate

Use smooth transitions.

Buttons should provide feedback.

Critical requests should use clear visual urgency without making the whole application look alarming.

Forms must validate input.

Blood group selection should be highly visual.

The application should feel like a real startup product, not a college project.

==================================================

PRIVACY & SAFETY

==================================================

Do not expose donor phone numbers publicly.

Do not expose unnecessary personal information.

Clearly distinguish:

- donor availability

- blood compatibility

- request status

Include a small disclaimer in appropriate places:

"BloodConnect helps connect donors and requests. Blood eligibility, compatibility, screening and transfusion decisions must be confirmed by qualified medical professionals."

==================================================

FINAL REQUIREMENT

==================================================

Build the application now.

Start with the complete frontend prototype using mock data.

Make the UI highly polished and visually consistent across every screen.

Prioritize the following flow above everything else:

HOME

→ NEED BLOOD

→ BLOOD REQUEST

→ FINDING DONORS

→ MATCH RESULTS

→ SEND REQUEST

→ DONOR ACCEPTS

→ DONOR CONFIRMED

This flow must work end-to-end in the prototype.

Do not stop after creating static screens.

The main emergency blood matching flow must be interactive and demonstrable.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d9a12a5c-42af-4fc7-b86c-48da36320a64).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
